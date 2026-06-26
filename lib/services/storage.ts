import { Theme, PsyOSSettings, BrainNode, NodeType, LabExperiment, ExperimentStatus } from '../types';

const SETTINGS_KEY = 'psyos_settings';
const NODES_KEY = 'psyos_nodes';

export const DEFAULT_SETTINGS: PsyOSSettings = {
  cognitive: {
    userName: 'Explorador',
    theme: Theme.DARK,
    offlineFirst: true,
    sensoryCalm: false,
  },
  ai: {
    enabled: false, // Default is false, user can enable in Settings
    autoCategorize: true,
    cognitiveSynthesis: true,
    temperature: 0.7,
  }
};

export const INITIAL_BRAIN_NODES: BrainNode[] = [
  {
    id: 'psyos-core',
    title: 'PsyOS: Sistema Operacional da Mente',
    summary: 'A fundação de um novo paradigma de processamento de conhecimento humano.',
    content: 'O PsyOS foi projetado sob a premissa de que o conhecimento não deve ser apenas guardado, mas sim assimilado. Em vez de imitar pastas e arquivos (arquitetura de desktop tradicional baseada em escritório), o PsyOS adota um fluxo de nós interconectados, espelhando os caminhos sinápticos do próprio cérebro.',
    type: NodeType.CONCEPT,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    connections: ['aprendizado-ativo', 'sintese-ia'],
    tags: ['Arquitetura', 'Cognição', 'Filosofia'],
  },
  {
    id: 'aprendizado-ativo',
    title: 'Aprendizado Ativo & Recall',
    summary: 'Estudo sobre por que a re-leitura passiva é ineficiente.',
    content: 'A ciência cognitiva comprova que o cérebro fortalece conexões neurais quando é forçado a recuperar a informação (Recall Ativo), e não quando apenas lê ou assiste a algo passivamente. O PsyOS integra isso no núcleo de seu sistema através de experimentos de laboratório e caminhos de autoteste.',
    type: NodeType.KNOWLEDGE,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    connections: ['psyos-core', 'recapitulacao-espacada'],
    tags: ['Ciência da Aprendizagem', 'Metacognição'],
  },
  {
    id: 'recapitulacao-espacada',
    title: 'Recapitulação Espaçada (Spaced Repetition)',
    summary: 'A Curva do Esquecimento e como combatê-la.',
    content: 'A curva do esquecimento de Ebbinghaus demonstra como novas memórias decaem exponencialmente se não forem revisitadas. Intervalos calculados matematicamente para recall restauram a força da memória com eficiência máxima. O módulo correspondente será integrado no Laboratório.',
    type: NodeType.KNOWLEDGE,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    connections: ['aprendizado-ativo'],
    tags: ['Memória', 'Ebbinghaus'],
  },
  {
    id: 'sintese-ia',
    title: 'Arquitetura de Síntese Cognitiva por IA',
    summary: 'Como a Inteligência Artificial serve de amplificadora, não de substituta do pensamento.',
    content: 'A IA no PsyOS não escreve notas para você. Ela atua como um parceiro de diálogo socrático: identificando vieses cognitivos em seu raciocínio, apontando conexões ausentes entre seus conceitos e gerando testes desafiadores para consolidar sua retenção de longo prazo.',
    type: NodeType.CONCEPT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    connections: ['psyos-core'],
    tags: ['IA', 'Arquitetura', 'Parceria Socrática'],
  }
];

export const INITIAL_LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'focus-timer',
    title: 'Foco Dinâmico (Ciclos de Atenção)',
    description: 'Experimente a atenção focada sustentada por meio de temporizadores táteis e feedback sensorial calmo. Minimiza distrações digitais.',
    category: 'Atenção',
    status: ExperimentStatus.READY,
    difficulty: 'easy',
    expectedDuration: '25 min',
    cognitiveLoad: 4,
  },
  {
    id: 'active-recall-test',
    title: 'Simulador de Autoteste Socrático',
    description: 'Força a recuperação ativa de conceitos do seu Cérebro gerando perguntas abertas de alto nível. (Requer Módulo de IA ativo).',
    category: 'Memória',
    status: ExperimentStatus.LOCKED,
    difficulty: 'hard',
    expectedDuration: '15 min',
    cognitiveLoad: 8,
  },
  {
    id: 'dual-n-back',
    title: 'Treino Dual N-Back',
    description: 'O clássico exercício de memória de trabalho auditivo e espacial projetado para expandir temporariamente sua capacidade de atenção sustentada.',
    category: 'Memória de Trabalho',
    status: ExperimentStatus.READY,
    difficulty: 'hard',
    expectedDuration: '10 min',
    cognitiveLoad: 9,
  }
];

/**
 * Storage Helper to guarantee safe SSR rendering
 */
export const StorageService = {
  getSettings(): PsyOSSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: PsyOSSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  },

  getNodes(): BrainNode[] {
    if (typeof window === 'undefined') return INITIAL_BRAIN_NODES;
    try {
      const stored = localStorage.getItem(NODES_KEY);
      if (stored) {
        return JSON.parse(stored);
      } else {
        this.saveNodes(INITIAL_BRAIN_NODES);
        return INITIAL_BRAIN_NODES;
      }
    } catch (e) {
      console.error('Error reading nodes from localStorage', e);
    }
    return INITIAL_BRAIN_NODES;
  },

  saveNodes(nodes: BrainNode[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(NODES_KEY, JSON.stringify(nodes));
    } catch (e) {
      console.error('Error saving nodes to localStorage', e);
    }
  },

  getExperiments(): LabExperiment[] {
    // Statics for PRD-001 setup
    return INITIAL_LAB_EXPERIMENTS;
  }
};
