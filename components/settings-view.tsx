'use client';

import * as React from 'react';
import { PsyOSSettings, Theme } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { 
  Sliders, 
  Shield, 
  Moon, 
  Sun, 
  User, 
  Database, 
  Sparkles, 
  SlidersHorizontal, 
  RefreshCw, 
  Eye 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  settings: PsyOSSettings;
  onUpdateSettings: (settings: PsyOSSettings) => void;
  onWipeData: () => void;
  onExportData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onWipeData,
  onExportData,
}) => {
  const [userName, setUserName] = React.useState(settings.cognitive.userName);
  const [theme, setTheme] = React.useState<Theme>(settings.cognitive.theme);
  const [offlineFirst, setOfflineFirst] = React.useState(settings.cognitive.offlineFirst);
  const [sensoryCalm, setSensoryCalm] = React.useState(settings.cognitive.sensoryCalm);

  // AI states
  const [aiEnabled, setAiEnabled] = React.useState(settings.ai.enabled);
  const [autoCategorize, setAutoCategorize] = React.useState(settings.ai.autoCategorize);
  const [cognitiveSynthesis, setCognitiveSynthesis] = React.useState(settings.ai.cognitiveSynthesis);
  const [temperature, setTemperature] = React.useState(settings.ai.temperature);

  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      cognitive: {
        userName,
        theme,
        offlineFirst,
        sensoryCalm,
      },
      ai: {
        enabled: aiEnabled,
        autoCategorize,
        cognitiveSynthesis,
        temperature,
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* CABEÇALHO */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
          <Sliders className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          Ajustes de Sintonia
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
          Refine a vibração do sistema, paleta sensorial, privacidade e sinergia de inteligência sutil do seu PsyOS.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        
        {/* SEÇÃO 1: IDENTIDADE COGNITIVA & ESTÉTICA */}
        <Card className="p-6 border border-zinc-200/60 dark:border-zinc-900 bg-white/40 dark:bg-[#070707]/10">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-5">
            <User className="h-4 w-4 text-zinc-400" />
            Identidade e Estética Sensorial
          </h3>

          <div className="flex flex-col gap-5">
            {/* Nome de usuário */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 font-sans">Sua Identidade (Nome)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Como o PsyOS deve se dirigir a você?"
                className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700"
              />
            </div>

            {/* Seletor de Tema Clássico */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-zinc-100/50 dark:border-zinc-900/30 pb-5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Paleta Sensorial</span>
                <span className="text-xs text-zinc-400 mt-0.5 max-w-sm">
                  Equilibre o contraste visual entre luz de estúdio e escuridão de foco profundo.
                </span>
              </div>
              <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/40 dark:border-zinc-850 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setTheme(Theme.LIGHT)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    theme === Theme.LIGHT
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/40'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Claro (Presença)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme(Theme.DARK)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    theme === Theme.DARK
                      ? 'bg-zinc-800 text-zinc-50 shadow-xs border border-zinc-700/50 dark:bg-zinc-950 dark:border-zinc-850'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Escuro (Subconsciente)
                </button>
              </div>
            </div>

            {/* Calma Sensorial */}
            <Toggle
              checked={sensoryCalm}
              onChange={setSensoryCalm}
              label="Calma Sensorial"
              description="Suaviza micro-animações, contrastes severos e pulsações para um estado mental de calmaria e foco."
            />
          </div>
        </Card>

        {/* SEÇÃO 2: MÓDULO DE INTELIGÊNCIA ARTIFICIAL */}
        <Card className="p-6 border border-zinc-200/60 dark:border-zinc-900 bg-white/40 dark:bg-[#070707]/10">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-5">
            <Sparkles className="h-4 w-4 text-zinc-400" />
            Sinergia Sutil (Módulo de IA)
          </h3>

          <div className="flex flex-col gap-4">
            <Toggle
              checked={aiEnabled}
              onChange={setAiEnabled}
              label="Sintonizar Parceria Sutil (Gemini)"
              description="Permite que o PsyOS estruture diálogos socráticos e crie desafios de Recall Ativo sobre suas ideias."
            />

            {aiEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden"
              >
                <Toggle
                  checked={autoCategorize}
                  onChange={setAutoCategorize}
                  label="Conexão Inteligente Assistida"
                  description="A IA sugere âncoras e sinapses apropriadas de forma silenciosa ao cultivar novos pensamentos."
                />

                <Toggle
                  checked={cognitiveSynthesis}
                  onChange={setCognitiveSynthesis}
                  label="Síntese de Diálogo Socrático"
                  description="Gera questionamentos para expandir e testar a solidez de suas lembranças e conceitos."
                />

                {/* Slider Temperatura */}
                <div className="flex flex-col gap-2 py-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-zinc-500 flex items-center gap-1.5 font-sans">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Amplitude Criativa (Temperatura)
                    </span>
                    <span className="font-mono text-zinc-400">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-200"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Foco Rígido (0.1)</span>
                    <span>Associação Livre (1.0)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/30 dark:border-zinc-900">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Nota de Segurança</span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                    Sua credencial <strong>GEMINI_API_KEY</strong> é armazenada secretamente no servidor em nuvem. O navegador do cliente nunca tem acesso a ela.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* SEÇÃO 3: PRIVACIDADE & ARMAZENAMENTO */}
        <Card className="p-6 border border-zinc-200/60 dark:border-zinc-900 bg-white/40 dark:bg-[#070707]/10">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-5">
            <Database className="h-4 w-4 text-zinc-400" />
            Privacidade de Dados (Offline-First)
          </h3>

          <div className="flex flex-col gap-4">
            <Toggle
              checked={offlineFirst}
              onChange={setOfflineFirst}
              disabled
              label="Precedência de Armazenamento Local"
              description="Todos os pensamentos e ritmos são preservados localmente no seu dispositivo, sob sua inteira guarda."
            />

            <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <Button type="button" variant="outline" onClick={onExportData} className="text-xs h-9 px-4.5 rounded-xl">
                Exportar Cérebro (JSON)
              </Button>
              <Button type="button" variant="danger" onClick={onWipeData} className="text-xs h-9 px-4.5 rounded-xl">
                Apagar Registro Local
              </Button>
            </div>
          </div>
        </Card>

        {/* BARRA DE SALVAMENTO */}
        <div className="flex items-center justify-between gap-4 mt-2">
          {saveSuccess ? (
            <span className="text-xs font-semibold text-emerald-500 font-mono flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              SINTONIA GRAVADA
            </span>
          ) : (
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
              ESTADO: AJUSTE LIVRE
            </span>
          )}

          <Button type="submit" variant="primary" className="h-11 px-8 rounded-xl shadow-xs">
            Consolidar Ajustes
          </Button>
        </div>
      </form>
    </div>
  );
};
