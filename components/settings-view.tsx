'use client';

import * as React from 'react';
import { PsyOSSettings, Theme } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Settings, Shield, Moon, Sun, User, Database, Sparkles, Sliders, RefreshCw } from 'lucide-react';
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
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Settings className="h-6 w-6 text-zinc-500" />
          Configurações do Sistema
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Gerencie suas preferências de privacidade, sintonia estética e módulos de processamento.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        {/* SEÇÃO 1: IDENTIDADE COGNITIVA & ESTÉTICA */}
        <Card className="p-6 border border-zinc-200/85 dark:border-zinc-850">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
            <User className="h-4 w-4 text-zinc-400" />
            Sintonia Estética e Identidade
          </h3>

          <div className="flex flex-col gap-5">
            {/* Nome de usuário */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">Nome do Explorador</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Como o PsyOS deve se referir a você?"
                className="h-10 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              />
            </div>

            {/* Seletor de Tema Clássico */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-100/50 dark:border-zinc-900/40 pb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Paleta do Sistema</span>
                <span className="text-xs text-zinc-400 mt-0.5">
                  Alterne entre claridade calmo ou imersão noite escura.
                </span>
              </div>
              <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setTheme(Theme.LIGHT)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === Theme.LIGHT
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Claro (Estúdio)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme(Theme.DARK)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === Theme.DARK
                      ? 'bg-zinc-800 text-zinc-50 shadow-xs border border-zinc-700/50 dark:bg-zinc-950 dark:border-zinc-850'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Escuro (Mente)
                </button>
              </div>
            </div>

            {/* Calma Sensorial */}
            <Toggle
              checked={sensoryCalm}
              onChange={setSensoryCalm}
              label="Calma Sensorial"
              description="Minimiza micro-animações, contrastes severos e pulsações visuais para maior foco cognitivo."
            />
          </div>
        </Card>

        {/* SEÇÃO 2: MÓDULO DE INTELIGÊNCIA ARTIFICIAL */}
        <Card className="p-6 border border-zinc-200/85 dark:border-zinc-850">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
            <Sparkles className="h-4 w-4 text-zinc-400" />
            Sinergia de IA (Módulo Gemini)
          </h3>

          <div className="flex flex-col gap-4">
            <Toggle
              checked={aiEnabled}
              onChange={setAiEnabled}
              label="Habilitar Parceria de IA"
              description="Permite que o PsyOS estruture questionamentos e identifique contradições cognitivas (Simulação de Sprint)."
            />

            {aiEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden"
              >
                <Toggle
                  checked={autoCategorize}
                  onChange={setAutoCategorize}
                  label="Auto-categorização Inteligente"
                  description="A IA sugere conexões neurais e tags apropriadas ao salvar novos pensamentos."
                />

                <Toggle
                  checked={cognitiveSynthesis}
                  onChange={setCognitiveSynthesis}
                  label="Síntese de Aprendizado"
                  description="Desafia o conhecimento consolidado gerando questionários dinâmicos de Recall Ativo."
                />

                {/* Slider Temperatura */}
                <div className="flex flex-col gap-2 py-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Sliders className="h-3 w-3" />
                      Criatividade do Modelo (Temperatura)
                    </span>
                    <span className="font-mono text-zinc-500">{temperature.toFixed(1)}</span>
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
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Foco Rígido (0.1)</span>
                    <span>Exploração Livre (1.0)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-850">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Nota de Segurança</span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Sua chave <strong>GEMINI_API_KEY</strong> é armazenada de forma segura no servidor. O cliente nunca tem acesso à sua credencial.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* SEÇÃO 3: PRIVACIDADE & ARMAZENAMENTO */}
        <Card className="p-6 border border-zinc-200/85 dark:border-zinc-850">
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
            <Database className="h-4 w-4 text-zinc-400" />
            Privacidade e Armazenamento (Offline-First)
          </h3>

          <div className="flex flex-col gap-4">
            <Toggle
              checked={offlineFirst}
              onChange={setOfflineFirst}
              disabled
              label="Precedência Offline-First"
              description="Todos os dados são persistidos localmente no navegador (localStorage) e permanecem 100% sob o controle do usuário."
            />

            <div className="flex flex-wrap gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <Button type="button" variant="outline" onClick={onExportData} className="text-xs h-9 px-4">
                Exportar Cérebro (JSON)
              </Button>
              <Button type="button" variant="danger" onClick={onWipeData} className="text-xs h-9 px-4">
                Wipar Dados de Navegador
              </Button>
            </div>
          </div>
        </Card>

        {/* AÇÕES FINAIS */}
        <div className="flex items-center justify-between gap-4 mt-2">
          {saveSuccess ? (
            <span className="text-sm font-medium text-emerald-500 font-sans flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Sincronizado com Sucesso
            </span>
          ) : (
            <span className="text-xs text-zinc-400 font-mono">
              Status: Pronto para salvar
            </span>
          )}

          <Button type="submit" variant="primary" className="h-11 px-8 rounded-xl shadow-md">
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
};
