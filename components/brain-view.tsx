'use client';

import * as React from 'react';
import { BrainNode, NodeType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  Search, 
  Plus, 
  Tag, 
  ArrowRight, 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Compass, 
  List, 
  Network, 
  GitCommit, 
  Fingerprint, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrainViewProps {
  nodes: BrainNode[];
  onAddNode: (node: Omit<BrainNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNode: (node: BrainNode) => void;
  aiEnabled: boolean;
}

// Maps NodeTypes to beautiful human terms
const TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.CONCEPT]: 'Conceito Central',
  [NodeType.KNOWLEDGE]: 'Entendimento',
  [NodeType.MEMORY]: 'Lembrança',
  [NodeType.EXPERIMENT]: 'Prática',
};

// Maps NodeTypes to visual styling
const TYPE_COLORS: Record<NodeType, string> = {
  [NodeType.CONCEPT]: 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30',
  [NodeType.KNOWLEDGE]: 'bg-sky-500/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300 border-sky-200/50 dark:border-sky-900/30',
  [NodeType.MEMORY]: 'bg-purple-500/10 text-purple-700 dark:bg-purple-400/10 dark:text-purple-300 border-purple-200/50 dark:border-purple-900/30',
  [NodeType.EXPERIMENT]: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/30',
};

export const BrainView: React.FC<BrainViewProps> = ({ nodes, onAddNode, onUpdateNode, aiEnabled }) => {
  const [viewMode, setViewMode] = React.useState<'canvas' | 'list'>('canvas');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = React.useState<NodeType | null>(null);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(nodes[0]?.id || null);
  const [isCreating, setIsCreating] = React.useState(false);

  // New Thought Form State
  const [newTitle, setNewTitle] = React.useState('');
  const [newSummary, setNewSummary] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newType, setNewType] = React.useState<NodeType>(NodeType.CONCEPT);
  const [newTagsStr, setNewTagsStr] = React.useState('');
  const [newConnections, setNewConnections] = React.useState<string[]>([]);

  // AI Synthesis Sim
  const [aiSynthesizing, setAiSynthesizing] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<{
    summary: string;
    insights: string[];
    questions: string[];
  } | null>(null);

  const activeNodeId = React.useMemo(() => {
    if (selectedNodeId && nodes.some(n => n.id === selectedNodeId)) {
      return selectedNodeId;
    }
    return nodes[0]?.id || null;
  }, [nodes, selectedNodeId]);

  const selectedNode = nodes.find((n) => n.id === activeNodeId);

  // Extract unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    nodes.forEach((node) => node.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [nodes]);

  // Filter thoughts
  const filteredNodes = React.useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || node.tags.includes(selectedTag);
      const matchesType = !selectedNodeType || node.type === selectedNodeType;
      return matchesSearch && matchesTag && matchesType;
    });
  }, [nodes, searchQuery, selectedTag, selectedNodeType]);

  // Dynamic focus layout positioning logic
  const nodePositions = React.useMemo(() => {
    const positions = new Map<string, { x: number; y: number; role: 'center' | 'connected' | 'other' }>();
    if (nodes.length === 0) return positions;

    const currentId = activeNodeId;
    if (!currentId) return positions;

    // 1. Center focused node
    positions.set(currentId, { x: 50, y: 50, role: 'center' });

    const activeNode = nodes.find(n => n.id === currentId);
    const connections = activeNode?.connections || [];

    // 2. Direct Synapses (middle ring)
    const connectedNodes = nodes.filter(n => connections.includes(n.id) && n.id !== currentId);
    connectedNodes.forEach((node, idx) => {
      const angle = (idx / (connectedNodes.length || 1)) * 2 * Math.PI;
      // Fluid radius based on connection density to prevent crowding
      const radius = 22 + Math.min(connectedNodes.length * 1.5, 6);
      positions.set(node.id, {
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        role: 'connected'
      });
    });

    // 3. Spreading thoughts (outer ring)
    const otherNodes = nodes.filter(n => n.id !== currentId && !connections.includes(n.id));
    otherNodes.forEach((node, idx) => {
      const angle = (idx / (otherNodes.length || 1)) * 2 * Math.PI + (Math.PI / 5);
      const radius = 41 + Math.min(otherNodes.length * 0.8, 4);
      positions.set(node.id, {
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        role: 'other'
      });
    });

    return positions;
  }, [nodes, activeNodeId]);

  // SVG connection lines
  const svgLines = React.useMemo(() => {
    const lines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number; isActive: boolean }> = [];
    if (nodes.length === 0) return lines;

    const currentId = activeNodeId;
    const drawnPairs = new Set<string>();

    nodes.forEach(node => {
      const pos1 = nodePositions.get(node.id);
      if (!pos1) return;

      const connections = node.connections || [];
      connections.forEach(connId => {
        const pos2 = nodePositions.get(connId);
        if (!pos2) return;

        const pairKey = [node.id, connId].sort().join('-');
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        const isActive = node.id === currentId || connId === currentId;

        lines.push({
          id: pairKey,
          x1: pos1.x,
          y1: pos1.y,
          x2: pos2.x,
          y2: pos2.y,
          isActive
        });
      });
    });

    return lines;
  }, [nodes, nodePositions, activeNodeId]);

  const handleSubmitNewNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tags = newTagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddNode({
      title: newTitle,
      summary: newSummary,
      content: newContent,
      type: newType,
      tags,
      connections: newConnections,
    });

    // Reset Form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewType(NodeType.CONCEPT);
    setNewTagsStr('');
    setNewConnections([]);
    setIsCreating(false);
  };

  const handleSimulateAI = () => {
    if (!selectedNode) return;
    setAiSynthesizing(true);
    setAiResult(null);

    setTimeout(() => {
      setAiSynthesizing(false);
      setAiResult({
        summary: `Síntese Socrática de "${selectedNode.title}"`,
        insights: [
          'Este raciocínio atua como um nodo central de clareza conceitual em seu ecossistema cognitivo.',
          'Há um elo intuitivo entre esta perspectiva e a retenção ativa demonstrada nos seus ritmos de presença.'
        ],
        questions: [
          'Como este entendimento se desdobrará na sua próxima tomada de decisão pragmática?',
          'Há alguma contradição ou viés oculto no limiar deste pensamento?'
        ]
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* BARRA SUPERIOR COGNITIVA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-900/60 pb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Brain className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
            Espaço Mental
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            O mapa de suas percepções. Onde pensamentos se integram e o conhecimento é assimilado, livre de poluição informativa.
          </p>
        </div>

        {/* CONTROLES E AÇÃO */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {/* Seletor de Modo de Visualização */}
          <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-900/80 rounded-xl border border-zinc-200/40 dark:border-zinc-800">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'canvas'
                  ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs border border-zinc-200/40 dark:border-zinc-700/30'
                  : 'text-zinc-500 hover:text-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Visualizar como Mapa de Sinapses"
            >
              <Network className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mapa de Sinapses</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs border border-zinc-200/40 dark:border-zinc-700/30'
                  : 'text-zinc-500 hover:text-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Visualizar como Fluxo Temporal"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fluxo de Ideias</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 h-9 rounded-xl shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Cultivar Pensamento
          </Button>
        </div>
      </div>

      {/* ÁREA DE TRABALHO DUAL (CANVAS OU LISTA + DETALHES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
        
        {/* COLUNA ESQUERDA: MAPA OU FLUXO */}
        <div className="lg:col-span-7 flex flex-col gap-5 h-full">
          <AnimatePresence mode="wait">
            
            {viewMode === 'canvas' ? (
              /* MODO CANVAS: MAPA SINÁPTICO INTERATIVO */
              <motion.div
                key="canvas-view"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-[500px] rounded-2xl border border-zinc-200/65 bg-[#fbfbfa] dark:border-zinc-900 dark:bg-[#070707] shadow-xs overflow-hidden flex flex-col justify-between p-4 group select-none"
              >
                {/* Malha de Grid Orgânico no Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] dark:bg-[radial-gradient(#1c1c1a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#faf9f6)] dark:from-transparent dark:to-[#0a0a0a] pointer-events-none opacity-45" />

                {/* SVG das Sinapses / Conexões */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Linhas Inativas */}
                  {svgLines.filter(l => !l.isActive).map((line) => (
                    <line
                      key={line.id}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      className="stroke-zinc-200 dark:stroke-zinc-900 transition-all duration-500"
                      strokeWidth="0.45"
                    />
                  ))}

                  {/* Linhas Ativas Pulsantes */}
                  {svgLines.filter(l => l.isActive).map((line) => (
                    <g key={line.id}>
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        className="stroke-zinc-400 dark:stroke-zinc-700 transition-all duration-500"
                        strokeWidth="0.9"
                      />
                      {/* Efeito de sinal sináptico correndo pelas linhas */}
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        className="stroke-zinc-900/40 dark:stroke-zinc-200/40 transition-all duration-500"
                        strokeWidth="1.2"
                        strokeDasharray="3 15"
                        style={{
                          animation: 'synaptic-pulse 6s linear infinite'
                        }}
                      />
                    </g>
                  ))}
                </svg>

                {/* Legenda do Mapa */}
                <div className="z-10 flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-200 animate-pulse" />
                  MAPA COGNITIVO ATIVO
                </div>

                {/* Renderização de Nós / Pensamentos Flutuantes */}
                <div className="absolute inset-0 pointer-events-auto">
                  {nodes.map((node) => {
                    const pos = nodePositions.get(node.id);
                    if (!pos) return null;

                    const isSelected = activeNodeId === node.id;
                    const isDirectlyConnected = pos.role === 'connected';

                    return (
                      <motion.button
                        key={node.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setAiResult(null);
                        }}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                        }}
                        className={`absolute translate-x-[-50%] translate-y-[-50%] z-10 p-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer max-w-[130px] sm:max-w-[150px] ${
                          isSelected
                            ? 'bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50 shadow-md scale-105'
                            : isDirectlyConnected
                            ? 'bg-white border-zinc-300 text-zinc-800 hover:border-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-250 shadow-xs'
                            : 'bg-white/70 border-zinc-200/60 text-zinc-450 hover:text-zinc-700 dark:bg-zinc-900/35 dark:border-zinc-900 dark:text-zinc-500 hover:bg-white dark:hover:bg-zinc-900/80'
                        }`}
                        whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                        layoutId={`map-node-${node.id}`}
                      >
                        {/* Ícone sutil por tipo de pensamento */}
                        <div className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            node.type === NodeType.CONCEPT ? 'bg-amber-400' :
                            node.type === NodeType.KNOWLEDGE ? 'bg-sky-400' :
                            node.type === NodeType.MEMORY ? 'bg-purple-400' : 'bg-emerald-400'
                          }`} />
                          <span className="text-[9px] font-mono uppercase tracking-wider scale-90 opacity-60">
                            {TYPE_LABELS[node.type]}
                          </span>
                        </div>
                        <span className="text-xs font-display font-medium text-center truncate w-full mt-1.5 leading-tight px-1 select-none">
                          {node.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Ajuda de Interação Sutil no rodapé do canvas */}
                <div className="z-10 text-[10px] text-zinc-450 dark:text-zinc-550 font-mono self-end bg-zinc-100/40 dark:bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-200/20">
                  Pressione um pensamento para centralizar e focar.
                </div>
              </motion.div>
            ) : (
              /* MODO LISTA: FLUXO DE IDEIAS CRONOLÓGICO */
              <motion.div
                key="list-view"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5 max-h-[70vh]"
              >
                {/* Barra de Pesquisa e Filtros */}
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Buscar reflexões ou conexões silenciadas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-850 font-sans"
                    />
                  </div>

                  {/* Filtro de Tipo de Pensamento */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedNodeType(null)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                        selectedNodeType === null
                          ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-medium'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-350 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-900'
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedNodeType(key as NodeType)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                          selectedNodeType === key
                            ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-medium'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-350 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Filtros de Tags */}
                  {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center bg-zinc-50/50 dark:bg-zinc-900/10 p-2 rounded-xl border border-zinc-150 dark:border-zinc-900">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider mr-2 flex items-center gap-1 font-mono">
                        <Tag className="h-3 w-3" /> Âncoras:
                      </span>
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className={`px-2 py-0.5 text-[11px] rounded-md border transition-all cursor-pointer ${
                            selectedTag === tag
                              ? 'bg-zinc-200 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-150 dark:border-zinc-700 font-medium'
                              : 'bg-transparent text-zinc-500 border-zinc-150 dark:border-zinc-900 hover:border-zinc-300'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lista de Pensamentos */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map((node) => (
                        <motion.div
                          key={node.id}
                          layout
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div
                            onClick={() => {
                              setSelectedNodeId(node.id);
                              setAiResult(null);
                            }}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              activeNodeId === node.id
                                ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-xs scale-[1.01]'
                                : 'bg-white border-zinc-200/70 hover:border-zinc-350 dark:bg-zinc-950/20 dark:border-zinc-900 dark:hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                                activeNodeId === node.id
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 dark:bg-zinc-200 dark:border-zinc-300 dark:text-zinc-800'
                                  : TYPE_COLORS[node.type]
                              }`}>
                                {TYPE_LABELS[node.type]}
                              </span>
                              <span className={`text-[10px] font-mono ${
                                activeNodeId === node.id ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'
                              }`}>
                                {new Date(node.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-display font-medium text-sm tracking-tight mb-1">
                              {node.title}
                            </h3>
                            <p className={`text-xs line-clamp-2 leading-relaxed ${
                              activeNodeId === node.id ? 'text-zinc-300 dark:text-zinc-650' : 'text-zinc-500 dark:text-zinc-450'
                            }`}>
                              {node.summary}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl">
                        <Brain className="h-8 w-8 text-zinc-300 dark:text-zinc-800 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum pensamento sintonizado nesta busca.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* COLUNA DIREITA: CULTIVO OU EXPLORADOR DETALHADO */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            
            {isCreating ? (
              /* FORMULÁRIO DE CULTIVO DE CONSCIÊNCIA */
              <motion.div
                key="cultivar-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="p-6 relative border border-zinc-250 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/10">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>

                  <h3 className="font-display text-base font-semibold mb-1 text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-zinc-500" />
                    Cultivar Novo Pensamento
                  </h3>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-5 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                    Integre uma nova percepção ao seu cérebro, estabelecendo suas sinapses iniciais.
                  </p>

                  <form onSubmit={handleSubmitNewNode} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500 font-sans">Essência do Pensamento (Título)</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex: Curva de Retenção Ativa"
                        className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-500">Sintonia (Tipo)</label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as NodeType)}
                          className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                        >
                          {Object.entries(TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-500">Âncoras (Tags separadas por vírgula)</label>
                        <input
                          type="text"
                          value={newTagsStr}
                          onChange={(e) => setNewTagsStr(e.target.value)}
                          placeholder="Ex: foco, cognição"
                          className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500">Resumo de Retenção</label>
                      <input
                        type="text"
                        value={newSummary}
                        onChange={(e) => setNewSummary(e.target.value)}
                        placeholder="A síntese central deste pensamento em uma única frase"
                        className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500">Exploração Profunda</label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={4}
                        placeholder="Desenvolva o raciocínio livremente. Como esta ideia funciona?"
                        className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 resize-none font-sans leading-relaxed"
                      />
                    </div>

                    {nodes.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-500">Criar Conexões (Teia de Sinapses)</label>
                        <div className="flex flex-wrap gap-1.5 mt-1 max-h-24 overflow-y-auto border border-zinc-150 dark:border-zinc-900 p-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
                          {nodes.map((n) => {
                            const isConnected = newConnections.includes(n.id);
                            return (
                              <button
                                type="button"
                                key={n.id}
                                onClick={() => {
                                  if (isConnected) {
                                    setNewConnections(newConnections.filter((id) => id !== n.id));
                                  } else {
                                    setNewConnections([...newConnections, n.id]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                                  isConnected
                                    ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-semibold'
                                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-350 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-900'
                                }`}
                              >
                                {n.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 justify-end mt-2 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                      <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="primary" className="shadow-xs rounded-xl px-5">
                        Consolidar no Cérebro
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            ) : selectedNode ? (
              /* DETALHAMENTO DO PENSAMENTO SELECIONADO */
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-6"
              >
                <Card className="p-6 border border-zinc-200/80 dark:border-zinc-900 bg-white/40 dark:bg-[#070707]/10">
                  {/* Cabeçalho */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border w-fit ${TYPE_COLORS[selectedNode.type]}`}>
                        {TYPE_LABELS[selectedNode.type]}
                      </span>
                      <h1 className="font-display text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1.5 leading-tight">
                        {selectedNode.title}
                      </h1>
                    </div>
                    <div className="text-right flex flex-col items-end text-[10px] text-zinc-400 font-mono">
                      <span>Consolidação: {new Date(selectedNode.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Resumo de Retenção */}
                  <div className="my-4 bg-zinc-50/50 dark:bg-zinc-900/10 border-l-2 border-zinc-400 dark:border-zinc-700 p-3.5 rounded-r-lg">
                    <p className="text-xs text-zinc-600 dark:text-zinc-350 italic font-sans leading-relaxed">
                      &ldquo;{selectedNode.summary}&rdquo;
                    </p>
                  </div>

                  {/* Exploração de Conteúdo */}
                  <div className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed text-sm whitespace-pre-wrap py-2 border-b border-zinc-100 dark:border-zinc-900 pb-5">
                    {selectedNode.content}
                  </div>

                  {/* Sinapses / Conexões Ativas */}
                  <div className="pt-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5 flex items-center gap-1.5">
                      <Layers className="h-3 w-3" />
                      Sinapses Ativas (Ideias Conectadas)
                    </h4>
                    {selectedNode.connections && selectedNode.connections.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.connections.map((connId) => {
                          const targetNode = nodes.find((n) => n.id === connId);
                          if (!targetNode) return null;
                          return (
                            <button
                              key={connId}
                              onClick={() => {
                                setSelectedNodeId(connId);
                                setAiResult(null);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border border-zinc-200 hover:border-zinc-350 bg-zinc-50/40 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-950/40 transition-all font-sans text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            >
                              <span>{targetNode.title}</span>
                              <ArrowRight className="h-3 w-3 text-zinc-450" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 italic font-sans">Sem conexões com outras percepções no momento.</p>
                    )}
                  </div>

                  {/* Âncoras / Tags */}
                  {selectedNode.tags && selectedNode.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-900">
                      {selectedNode.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] text-zinc-450 bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-450 rounded-md font-sans"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Síntese Socrática baseada na IA sutil */}
                <Card className="p-5 border border-zinc-200/60 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-950/10">
                  <div className="flex items-start justify-between mb-3.5">
                    <div>
                      <h3 className="font-display text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-zinc-450" />
                        Síntese Socrática
                      </h3>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Desafie seu próprio ponto de vista e retenção através do diálogo filosófico.
                      </p>
                    </div>
                    {!aiEnabled && (
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-sm">
                        MÓDULO IA INATIVO
                      </span>
                    )}
                  </div>

                  {!aiEnabled ? (
                    <div className="p-3.5 rounded-lg bg-white/50 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-900 text-center">
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                        Ative o <strong>Módulo de IA</strong> sintonizado nas <strong>Configurações</strong> para que o PsyOS gere dilemas cognitivos e desafios de Recall Ativo.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {!aiResult && !aiSynthesizing && (
                        <Button
                          variant="outline"
                          onClick={handleSimulateAI}
                          className="w-full flex items-center justify-center gap-2 text-xs h-9 border-dashed rounded-xl"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                          Desafiar Pensamento (Ativar Diálogo Socrático)
                        </Button>
                      )}

                      {aiSynthesizing && (
                        <div className="py-5 flex flex-col items-center justify-center gap-2.5">
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
                          <span className="text-[10px] text-zinc-450 font-mono tracking-wide">Tecendo conexões socráticas via Gemini...</span>
                        </div>
                      )}

                      {aiResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-3.5 bg-white/70 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-900"
                        >
                          <div>
                            <h4 className="text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1 font-mono uppercase tracking-wider">
                              <GitCommit className="h-3.5 w-3.5 text-zinc-400" />
                              Dilemas Cognitivos
                            </h4>
                            <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-400 flex flex-col gap-1 leading-relaxed">
                              {aiResult.insights.map((insight, idx) => (
                                <li key={idx}>{insight}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3">
                            <h4 className="text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1.5 font-mono uppercase tracking-wider">
                              <Fingerprint className="h-3.5 w-3.5 text-zinc-400" />
                              Desafio de Recall Ativo
                            </h4>
                            <div className="flex flex-col gap-2">
                              {aiResult.questions.map((question, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/30 text-xs text-zinc-700 dark:text-zinc-300 italic border-l-2 border-zinc-300 dark:border-zinc-650"
                                >
                                  {question}
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAiResult(null)}
                            className="self-end text-xs h-7 px-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          >
                            Recolher Diálogo
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center border border-dashed border-zinc-200/60 dark:border-zinc-900 rounded-2xl">
                <div>
                  <Brain className="h-10 w-10 text-zinc-300 dark:text-zinc-850 mx-auto mb-2" />
                  <h3 className="font-display text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nenhum pensamento focado</h3>
                  <p className="text-xs text-zinc-450 mt-1 max-w-xs mx-auto">
                    Selecione uma ideia do mapa ou fluxo para expandir sua consciência.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Estilos específicos de pulsação sináptica */}
      <style jsx global>{`
        @keyframes synaptic-pulse {
          from {
            stroke-dashoffset: 120;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
