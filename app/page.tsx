'use client';

import * as React from 'react';
import { Theme, PsyOSSettings, BrainNode, LabExperiment } from '@/lib/types';
import { StorageService } from '@/lib/services/storage';
import { BrainView } from '@/components/brain-view';
import { LabView } from '@/components/lab-view';
import { SettingsView } from '@/components/settings-view';
import { Brain, Beaker, Settings, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Page() {
  const [activeTab, setActiveTab] = React.useState<'cerebro' | 'laboratorio' | 'configuracoes'>('cerebro');
  
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<PsyOSSettings | null>(null);
  const [nodes, setNodes] = React.useState<BrainNode[]>([]);
  const [experiments, setExperiments] = React.useState<LabExperiment[]>([]);

  const applyThemeClass = (currentTheme: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (currentTheme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // 1. Initial State Load
  React.useEffect(() => {
    const loadedSettings = StorageService.getSettings();
    const loadedNodes = StorageService.getNodes();
    const loadedExps = StorageService.getExperiments();

    const timer = setTimeout(() => {
      setSettings(loadedSettings);
      setNodes(loadedNodes);
      setExperiments(loadedExps);
      applyThemeClass(loadedSettings.cognitive.theme);
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Handle Settings Updates
  const handleUpdateSettings = (newSettings: PsyOSSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    applyThemeClass(newSettings.cognitive.theme);
  };

  // 3. Handle Nodes CRUD (Offline-First)
  const handleAddNode = (newNodeData: Omit<BrainNode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const freshNode: BrainNode = {
      ...newNodeData,
      id: `node-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedNodes = [freshNode, ...nodes];
    setNodes(updatedNodes);
    StorageService.saveNodes(updatedNodes);
  };

  const handleUpdateNode = (updatedNode: BrainNode) => {
    const updated = nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node));
    setNodes(updated);
    StorageService.saveNodes(updated);
  };

  // 4. Data Operations (Purge / Export)
  const handleWipeData = () => {
    if (typeof window === 'undefined') return;
    const confirmWipe = window.confirm(
      'Tem certeza de que deseja wipar todos os dados locais do PsyOS? Esta ação redefinirá suas configurações e notas cognitivas para o estado padrão.'
    );
    if (confirmWipe) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const dataStr = JSON.stringify({ settings, nodes }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `psyos-brain-export-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
          <span className="text-xs tracking-widest font-mono text-zinc-400">INICIALIZANDO PSYOS...</span>
        </div>
      </div>
    );
  }

  // Sensory calm config mapping
  const transitionProps = settings.cognitive.sensoryCalm
    ? { duration: 0 }
    : { duration: 0.35, ease: 'easeInOut' as const };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf9f6] text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* SIDEBAR DE NAVEGAÇÃO — DESKTOP */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-zinc-200/60 bg-white/40 backdrop-blur-md dark:border-zinc-900 dark:bg-[#0a0a0a]/30 p-6 select-none shrink-0 h-screen sticky top-0">
        <div className="flex flex-col gap-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-950 font-bold text-lg shadow-sm">
              Ψ
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight">PsyOS</span>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">FOUNDATION v0.1.0</span>
            </div>
          </div>

          {/* Menus */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('cerebro')}
              className={`flex items-center gap-3 px-4 h-11 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'cerebro'
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/30'
              }`}
            >
              <Brain className="h-4.5 w-4.5 shrink-0" />
              <span>Cérebro</span>
            </button>

            <button
              onClick={() => setActiveTab('laboratorio')}
              className={`flex items-center gap-3 px-4 h-11 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'laboratorio'
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/30'
              }`}
            >
              <Beaker className="h-4.5 w-4.5 shrink-0" />
              <span>Laboratório</span>
            </button>

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`flex items-center gap-3 px-4 h-11 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'configuracoes'
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/30'
              }`}
            >
              <Settings className="h-4.5 w-4.5 shrink-0" />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        {/* Rodapé Usuário Simples */}
        <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-4">
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold uppercase">
            {settings.cognitive.userName.slice(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200">
              {settings.cognitive.userName}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Mente Sincronizada
            </span>
          </div>
        </div>
      </aside>

      {/* HEADER COLO PARTE SUPERIOR — MOBILE */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 border-b border-zinc-200/60 bg-white/50 backdrop-blur-md dark:border-zinc-900 dark:bg-[#0a0a0a]/50 select-none z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-950 font-bold">
            Ψ
          </div>
          <span className="font-display font-bold text-sm tracking-tight">PsyOS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
            {settings.cognitive.userName}
          </span>
        </div>
      </header>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto pb-24 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transitionProps}
              className="h-full"
            >
              {activeTab === 'cerebro' && (
                <BrainView
                  nodes={nodes}
                  onAddNode={handleAddNode}
                  onUpdateNode={handleUpdateNode}
                  aiEnabled={settings.ai.enabled}
                />
              )}

              {activeTab === 'laboratorio' && (
                <LabView experiments={experiments} />
              )}

              {activeTab === 'configuracoes' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onWipeData={handleWipeData}
                  onExportData={handleExportData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* BARRA DE NAVEGAÇÃO INFERIOR — MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-200/60 bg-white/70 backdrop-blur-md dark:border-zinc-900 dark:bg-[#0a0a0a]/70 flex items-center justify-around px-6 pb-safe z-10">
        <button
          onClick={() => setActiveTab('cerebro')}
          className={`flex flex-col items-center gap-1 text-zinc-400 ${
            activeTab === 'cerebro' ? 'text-zinc-900 dark:text-zinc-100' : ''
          }`}
        >
          <Brain className="h-5 w-5" />
          <span className="text-[10px] font-medium font-sans">Cérebro</span>
        </button>

        <button
          onClick={() => setActiveTab('laboratorio')}
          className={`flex flex-col items-center gap-1 text-zinc-400 ${
            activeTab === 'laboratorio' ? 'text-zinc-900 dark:text-zinc-100' : ''
          }`}
        >
          <Beaker className="h-5 w-5" />
          <span className="text-[10px] font-medium font-sans">Laboratório</span>
        </button>

        <button
          onClick={() => setActiveTab('configuracoes')}
          className={`flex flex-col items-center gap-1 text-zinc-400 ${
            activeTab === 'configuracoes' ? 'text-zinc-900 dark:text-zinc-100' : ''
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium font-sans">Configurações</span>
        </button>
      </nav>
    </div>
  );
}
