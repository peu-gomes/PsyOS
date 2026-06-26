'use client';

import * as React from 'react';
import { BrainNode, NodeType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Brain, Search, Plus, Tag, ArrowRight, X, Sparkles, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrainViewProps {
  nodes: BrainNode[];
  onAddNode: (node: Omit<BrainNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNode: (node: BrainNode) => void;
  aiEnabled: boolean;
}

export const BrainView: React.FC<BrainViewProps> = ({ nodes, onAddNode, onUpdateNode, aiEnabled }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = React.useState<NodeType | null>(null);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(nodes[0]?.id || null);
  const [isCreating, setIsCreating] = React.useState(false);

  // New Node Form State
  const [newTitle, setNewTitle] = React.useState('');
  const [newSummary, setNewSummary] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newType, setNewType] = React.useState<NodeType>(NodeType.CONCEPT);
  const [newTagsStr, setNewTagsStr] = React.useState('');
  const [newConnections, setNewConnections] = React.useState<string[]>([]);

  // Simulation state for AI Synthesis
  const [aiSynthesizing, setAiSynthesizing] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<{
    summary: string;
    insights: string[];
    questions: string[];
  } | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Extract all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    nodes.forEach((node) => node.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [nodes]);

  // Filter nodes
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
          'Este conceito serve como núcleo para a organização de ideias adjacentes.',
          'Existe uma ponte evidente entre este nó e a aprendizagem experimental ativa.',
        ],
        questions: [
          'Como você aplicaria este conhecimento em um cenário real nas próximas 24 horas?',
          'Quais são os limites práticos deste conceito quando escalado?'
        ]
      });
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
      {/* Coluna Esquerda: Listagem e Busca de Nós (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5 h-full max-h-[80vh]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Brain className="h-6 w-6 text-zinc-500" />
              Cérebro
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Navegue pelas suas sinapses e conceitos.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Novo Nó
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar pensamentos ou conexões..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 font-sans"
          />
        </div>

        {/* Filtros de Categoria (NodeTypes) */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedNodeType(null)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              selectedNodeType === null
                ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800'
            }`}
          >
            Todos
          </button>
          {Object.values(NodeType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedNodeType(type)}
              className={`px-3 py-1 text-xs rounded-full border transition-all capitalize ${
                selectedNodeType === type
                  ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800'
              }`}
            >
              {type === 'concept' ? 'Conceito' : type === 'memory' ? 'Memória' : type === 'experiment' ? 'Experimento' : 'Conhecimento'}
            </button>
          ))}
        </div>

        {/* Filtros de Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Tag className="h-3 w-3" /> Tags:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 text-[11px] rounded-md border transition-all ${
                  selectedTag === tag
                    ? 'bg-zinc-200 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                    : 'bg-transparent text-zinc-500 border-zinc-100 dark:border-zinc-900 hover:border-zinc-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Lista de Nós */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setAiResult(null);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-md'
                        : 'bg-white/50 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950/40 dark:border-zinc-850 dark:hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        selectedNodeId === node.id
                          ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-800'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                      }`}>
                        {node.type}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        selectedNodeId === node.id ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400'
                      }`}>
                        {new Date(node.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-display font-medium text-sm tracking-tight mb-1">
                      {node.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 ${
                      selectedNodeId === node.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {node.summary}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl">
                <Brain className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum nó cognitivo encontrado.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coluna Direita: Detalhamento ou Formulário de Criação (7 cols) */}
      <div className="lg:col-span-7 h-full">
        <AnimatePresence mode="wait">
          {isCreating ? (
            /* FORMULÁRIO DE CRIAÇÃO */
            <motion.div
              key="create-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 relative border border-zinc-300/80 dark:border-zinc-850">
                <button
                  onClick={() => setIsCreating(false)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="font-display text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                  Criar Conexão Cognitiva
                </h3>

                <form onSubmit={handleSubmitNewNode} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500">Título do Nó</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Carga Cognitiva no UX"
                      className="h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500">Tipo</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as NodeType)}
                        className="h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                      >
                        <option value={NodeType.CONCEPT}>Conceito</option>
                        <option value={NodeType.KNOWLEDGE}>Conhecimento</option>
                        <option value={NodeType.MEMORY}>Memória</option>
                        <option value={NodeType.EXPERIMENT}>Experimento</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500">Tags (separadas por vírgula)</label>
                      <input
                        type="text"
                        value={newTagsStr}
                        onChange={(e) => setNewTagsStr(e.target.value)}
                        placeholder="Ex: memória, atenção, foco"
                        className="h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500">Resumo Curto</label>
                    <input
                      type="text"
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      placeholder="Uma frase que resume a essência deste nó"
                      className="h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500">Exploração do Conteúdo</label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={5}
                      placeholder="Desenvolva o raciocínio aqui. Use linguagem profunda, calma e limpa..."
                      className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  {nodes.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500">Conectar Sinapse com Nó Existente</label>
                      <div className="flex flex-wrap gap-1.5 mt-1 max-h-24 overflow-y-auto border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg">
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
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                                isConnected
                                  ? 'bg-zinc-900 text-zinc-100 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900'
                                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
                              }`}
                            >
                              {n.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      Consolidar Sinapse
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          ) : selectedNode ? (
            /* EXPLORADOR DE NÓ DETALHADO */
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <Card className="p-7 border border-zinc-200/80 dark:border-zinc-850">
                {/* Cabeçalho */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full w-fit">
                      {selectedNode.type}
                    </span>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
                      {selectedNode.title}
                    </h1>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs text-zinc-400 font-mono">
                      Criação: {new Date(selectedNode.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Atualização: {new Date(selectedNode.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Resumo */}
                <div className="my-5 bg-zinc-50/50 dark:bg-zinc-900/30 border-l-2 border-zinc-400 dark:border-zinc-700 p-4 rounded-r-lg">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 italic font-sans leading-relaxed">
                    &ldquo;{selectedNode.summary}&rdquo;
                  </p>
                </div>

                {/* Conteúdo */}
                <div className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed text-sm whitespace-pre-wrap py-2 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                  {selectedNode.content}
                </div>

                {/* Sinapses / Conexões */}
                <div className="pt-5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Sinapses Ativas (Nós Conectados)
                  </h4>
                  {selectedNode.connections && selectedNode.connections.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
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
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 hover:border-zinc-400 bg-zinc-50/30 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-650 dark:bg-zinc-900/20 dark:hover:bg-zinc-900/60 transition-all font-sans font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
                          >
                            <span>{targetNode.title}</span>
                            <ArrowRight className="h-3 w-3 text-zinc-400" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">Nenhuma sinapse ativa configurada para este nó ainda.</p>
                  )}
                </div>

                {/* Tags */}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    {selectedNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-md font-sans"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Módulo Preparado de Integração IA (Sintetizador Socrático) */}
              <Card className="p-6 border border-zinc-200/80 dark:border-zinc-850/80 bg-zinc-50/20 dark:bg-zinc-950/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-zinc-400" />
                      Síntese Socrática (Preparação IA)
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Desafie este nó de conhecimento através de diálogo cognitivo assistido.
                    </p>
                  </div>
                  {!aiEnabled && (
                    <span className="text-[10px] font-mono text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-sm">
                      Desativado nas Configs
                    </span>
                  )}
                </div>

                {!aiEnabled ? (
                  <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-850 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Ative o <strong>Módulo de IA</strong> na aba de <strong>Configurações</strong> para simular os ciclos de perguntas cognitivas e desafios socráticos baseados no Gemini.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {!aiResult && !aiSynthesizing && (
                      <Button
                        variant="outline"
                        onClick={handleSimulateAI}
                        className="w-full flex items-center justify-center gap-2 text-xs h-10 border-dashed"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                        Gerar Síntese de Aprendizado Ativo (Simulado)
                      </Button>
                    )}

                    {aiSynthesizing && (
                      <div className="py-6 flex flex-col items-center justify-center gap-3">
                        <div className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin" />
                        <span className="text-xs text-zinc-500 font-mono">Processando sinapses socráticas via Gemini...</span>
                      </div>
                    )}

                    {aiResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4 bg-white/60 dark:bg-zinc-950/40 p-4 rounded-lg border border-zinc-200 dark:border-zinc-850"
                      >
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            Dilemas Cognitivos
                          </h4>
                          <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-400 flex flex-col gap-1 leading-relaxed">
                            {aiResult.insights.map((insight, idx) => (
                              <li key={idx}>{insight}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3">
                          <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            Desafio de Autoteste (Recall Ativo)
                          </h4>
                          <div className="flex flex-col gap-2">
                            {aiResult.questions.map((question, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-md bg-zinc-50/50 dark:bg-zinc-900/50 text-xs text-zinc-700 dark:text-zinc-300 italic border-l-2 border-zinc-300 dark:border-zinc-600"
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
                          className="self-end text-xs h-8 px-3"
                        >
                          Limpar Síntese
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl">
              <div>
                <Brain className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-display text-base font-semibold">Nenhum nó selecionado</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                  Crie um novo nó cognitivo ou selecione um existente para explorar suas conexões.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
