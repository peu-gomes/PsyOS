/**
 * PsyOS - Core Type Definitions
 * Foundation Sprint (PRD-001)
 */

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface AISettings {
  enabled: boolean;
  autoCategorize: boolean;
  cognitiveSynthesis: boolean;
  temperature: number;
}

export interface CognitiveSettings {
  userName: string;
  theme: Theme;
  offlineFirst: boolean;
  sensoryCalm: boolean; // Limits animations and high-contrast visuals if enabled
}

export interface PsyOSSettings {
  cognitive: CognitiveSettings;
  ai: AISettings;
}

/**
 * Node structure prepared for future Brain / Mind Map and Knowledge Center integrations.
 */
export enum NodeType {
  CONCEPT = 'concept',
  MEMORY = 'memory',
  EXPERIMENT = 'experiment',
  KNOWLEDGE = 'knowledge',
}

export interface BrainNode {
  id: string;
  title: string;
  summary: string;
  content: string;
  type: NodeType;
  createdAt: number;
  updatedAt: number;
  connections: string[]; // List of other Node IDs
  tags: string[];
}

/**
 * Experiment structures prepared for the future Laboratory.
 */
export enum ExperimentStatus {
  LOCKED = 'locked',
  READY = 'ready',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ExperimentStatus;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: string; // e.g. "10 min"
  cognitiveLoad: number; // 1-10
}
