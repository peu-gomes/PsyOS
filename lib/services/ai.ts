import { PsyOSSettings } from '../types';

/**
 * PsyOS AI Service Layer Architecture (PRD-001 Preparedness)
 * 
 * Under instructions: Do not implement live AI in this sprint.
 * This is a highly modular, type-safe architecture prepared to use the 
 * @google/genai TypeScript SDK on the server-side as soon as Sprints permit.
 * 
 * Model Selection Guide (from gemini-api Skill):
 * - Basic Text / Summarization / Cognitive Synthesis: 'gemini-3.5-flash'
 * - Complex Reasoning / Socratic Dialogue / Tests: 'gemini-3.1-pro-preview'
 */

export interface AISynthesisRequest {
  nodeContent: string;
  contextNodes?: string[];
  systemInstruction?: string;
}

export interface AISynthesisResponse {
  success: boolean;
  synthesizedText: string;
  cognitiveLeaps: string[]; // Key insights identified
  suggestedConnections: string[]; // Related Node titles or IDs
  suggestedQuestions: string[]; // Metacognitive questions to ask the user
}

export const AIService = {
  /**
   * Helper to verify if AI features can be executed based on the current settings.
   */
  isAIEnabled(settings: PsyOSSettings): boolean {
    return settings.ai.enabled;
  },

  /**
   * Stub method prepared for the future Socratic AI Dialogue synthesis.
   * Demonstrates how the prompt flow will work, integrating user inputs.
   */
  async synthesizeNode(
    request: AISynthesisRequest,
    settings: PsyOSSettings
  ): Promise<AISynthesisResponse> {
    if (!this.isAIEnabled(settings)) {
      throw new Error(
        'O Módulo de Inteligência Artificial está desativado nas Configurações do PsyOS.'
      );
    }

    // This is the prepared request structure for the backend API route /api/gemini
    // To be implemented in the next sprint using:
    // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Returning a high-fidelity architectural simulation matching what the Gemini SDK will return
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          synthesizedText: `[Simulação Cognitiva] Síntese ativa gerada a partir do nó: "${request.nodeContent.substring(0, 30)}..."`,
          cognitiveLeaps: [
            'Conexão identificada entre a atenção focada e a retenção de memória de longo prazo.',
            'Oposição teórica entre repetição passiva e engajamento sináptico ativo.',
          ],
          suggestedConnections: ['aprendizado-ativo', 'recapitulacao-espacada'],
          suggestedQuestions: [
            'Como você pode reescrever este conceito em suas próprias palavras para forçar a recuperação ativa?',
            'Que analogia do mundo real melhor descreve essa dinâmica cognitiva?',
          ],
        });
      }, 1000);
    });
  },

  /**
   * Prepares the system prompt used to guide the Gemini model into acting as a 
   * premium cognitive coach rather than a generic text generator.
   */
  getSystemInstruction(): string {
    return `
      Você é a Alma do PsyOS, um sistema operacional de conhecimento baseado em psicologia cognitiva e neurociência da aprendizagem.
      Seu tom é calmo, socrático, minimalista e profundamente intelectual.
      Seu objetivo NÃO é dar respostas prontas ou escrever as notas pelo usuário.
      Seu objetivo é desafiar o usuário, apontar contradições no conhecimento atual dele, sugerir conexões neurais ocultas e propor questionamentos metacognitivos.
      Mantenha as respostas extremamente limpas, organizadas e focadas em incentivar a recuperação ativa (Active Recall).
    `.trim();
  }
};
