'use client';

import * as React from 'react';
import { LabExperiment, ExperimentStatus } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Beaker, Timer, Play, Pause, RotateCcw, AlertCircle, Wind, Brain, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define helper functions outside the React functional component to maintain render purity
const getRandomPos = () => Math.floor(Math.random() * 9);
const getRandomLetter = () => {
  const letters = ['A', 'B', 'H', 'K', 'O', 'T', 'X'];
  return letters[Math.floor(Math.random() * letters.length)];
};

interface LabViewProps {
  experiments: LabExperiment[];
}

export const LabView: React.FC<LabViewProps> = ({ experiments }) => {
  const [selectedExpId, setSelectedExpId] = React.useState<string | null>('focus-timer');

  // Focus Timer States
  const [timeRemaining, setTimeRemaining] = React.useState(25 * 60);
  const [timerActive, setTimerActive] = React.useState(false);
  const [preset, setPreset] = React.useState<number>(25);
  const [breathGuideActive, setBreathGuideActive] = React.useState(false);

  // Focus Timer Interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(preset * 60);
  };

  const handleSelectPreset = (minutes: number) => {
    setPreset(minutes);
    setTimerActive(false);
    setTimeRemaining(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedExp = experiments.find((e) => e.id === selectedExpId);

  // Dual N-Back State Sim
  const [dualNBackScore, setDualNBackScore] = React.useState<number | null>(null);
  const [dualNBackActive, setDualNBackActive] = React.useState(false);
  const [dualNBackRound, setDualNBackRound] = React.useState(0);
  const [currentGridPos, setCurrentGridPos] = React.useState<number | null>(null);
  const [currentAudioLetter, setCurrentAudioLetter] = React.useState<string | null>(null);

  const startDualNBack = () => {
    setDualNBackActive(true);
    setDualNBackRound(1);
    setDualNBackScore(null);
    runDualNBackCycle(1);
  };

  const runDualNBackCycle = (round: number) => {
    if (round > 8) {
      setDualNBackActive(false);
      setCurrentGridPos(null);
      setCurrentAudioLetter(null);
      setDualNBackScore(85); // simulated success score
      return;
    }
    const randomPos = getRandomPos();
    const randomLetter = getRandomLetter();
    
    setCurrentGridPos(randomPos);
    setCurrentAudioLetter(randomLetter);

    setTimeout(() => {
      setDualNBackRound(round + 1);
      runDualNBackCycle(round + 1);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
      {/* Coluna Esquerda: Lista de Experimentos (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5 h-full">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Beaker className="h-6 w-6 text-zinc-500" />
            Laboratório
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Treinos ativos de engajamento cognitivo.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {experiments.map((exp) => {
            const isSelected = selectedExpId === exp.id;
            return (
              <Card
                key={exp.id}
                animate={false}
                onClick={() => setSelectedExpId(exp.id)}
                className={`p-4 border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-md'
                    : 'bg-white/50 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950/40 dark:border-zinc-850 dark:hover:border-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-250 dark:text-zinc-850'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}>
                    {exp.category}
                  </span>
                  <span className={`text-[10px] font-mono ${
                    isSelected ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {exp.expectedDuration}
                  </span>
                </div>

                <h3 className="font-display font-medium text-sm tracking-tight mb-1">
                  {exp.title}
                </h3>

                <p className={`text-xs line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'
                }`}>
                  {exp.description}
                </p>

                <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-zinc-200/20 dark:border-zinc-750/30">
                  <span className={`text-[10px] font-sans ${
                    isSelected ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500'
                  }`}>
                    Carga Cognitiva: <strong>{exp.cognitiveLoad}/10</strong>
                  </span>
                  <span className={`text-[10px] font-mono uppercase font-semibold ${
                    exp.status === ExperimentStatus.READY ? 'text-emerald-500' : 'text-zinc-400'
                  }`}>
                    {exp.status === ExperimentStatus.READY ? 'Disponível' : 'Preparo (IA)'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Coluna Direita: Área de Execução de Experimento (8 cols) */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {selectedExpId === 'focus-timer' ? (
            /* EXPERIMENTO 1: FOCUS TIMER (POMODORO DINÂMICO) */
            <motion.div
              key="focus-timer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-8 border border-zinc-200/80 dark:border-zinc-850 text-center flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400">
                  Atenção Sustentada
                </span>
                
                <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                  Ciclo de Foco Dinâmico
                </h2>
                <p className="text-xs text-zinc-500 max-w-md mt-1 mb-8">
                  Reduza a entropia mental. Ajuste o tempo de foco e sincronize sua respiração para entrar em fluxo máximo.
                </p>

                {/* Bloco de Tempo Principal */}
                <div className="relative flex items-center justify-center my-6 h-60 w-60 rounded-full border border-zinc-100 dark:border-zinc-900 shadow-xs">
                  {/* Diaphragmatic Breath Pulse Animation */}
                  {breathGuideActive && timerActive && (
                    <motion.div
                      animate={{
                        scale: [1, 1.35, 1.35, 1],
                      }}
                      transition={{
                        duration: 16, // 4s inhale, 4s hold, 4s exhale, 4s hold
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-zinc-500/5 dark:bg-zinc-400/5 rounded-full pointer-events-none"
                    />
                  )}

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl font-mono tracking-tight font-semibold text-zinc-900 dark:text-zinc-50 select-none">
                      {formatTime(timeRemaining)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-2 flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {timerActive ? 'Focando' : 'Pausado'}
                    </span>
                  </div>
                </div>

                {/* Presets */}
                <div className="flex gap-2 mb-6">
                  {[15, 25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSelectPreset(mins)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        preset === mins
                          ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-zinc-700'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>

                {/* Controles de Play/Pause */}
                <div className="flex items-center gap-3 mb-6">
                  <Button
                    variant="primary"
                    onClick={() => setTimerActive(!timerActive)}
                    className="flex items-center gap-2 h-11 px-6 rounded-xl"
                  >
                    {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {timerActive ? 'Pausar' : 'Iniciar Foco'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetTimer}
                    className="h-11 w-11 p-0 flex items-center justify-center rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Guia Respiratório Toggle */}
                <div className="border-t border-zinc-100 dark:border-zinc-900 w-full pt-6 flex flex-col items-center">
                  <button
                    onClick={() => setBreathGuideActive(!breathGuideActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-sans font-medium transition-all cursor-pointer ${
                      breathGuideActive
                        ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    <Wind className="h-4 w-4" />
                    Guia de Respiração Diafragmática {breathGuideActive ? 'Ativo' : 'Inativo'}
                  </button>

                  {breathGuideActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm flex items-center gap-2 bg-emerald-50/10 dark:bg-emerald-950/5 p-3 rounded-lg border border-emerald-100/50 dark:border-emerald-900/10"
                    >
                      <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>
                        Sincronize a respiração com a onda de expansão radial de fundo: <strong>Inale</strong> na expansão (4s), <strong>retenha</strong>, <strong>exale</strong> na contração (4s).
                      </span>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : selectedExpId === 'dual-n-back' ? (
            /* EXPERIMENTO 2: DUAL N-BACK WORKSPACE */
            <motion.div
              key="dual-n-back"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-8 border border-zinc-200/80 dark:border-zinc-850 flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400">
                  Memória de Trabalho
                </span>

                <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                  Exercitador Dual N-Back
                </h2>
                <p className="text-xs text-zinc-500 max-w-md text-center mt-1 mb-8">
                  Consolide sua habilidade de atenção dividida e capacidade de processamento imediato identificando correspondências de som e posição espacial.
                </p>

                {/* Simulador de Grid */}
                <div className="grid grid-cols-3 gap-3 w-56 h-56 mb-6 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const isActive = currentGridPos === index;
                    return (
                      <div
                        key={index}
                        className={`rounded-lg transition-all duration-150 border ${
                          isActive
                            ? 'bg-zinc-900 border-zinc-900 scale-102 dark:bg-zinc-100 dark:border-zinc-100 shadow-md'
                            : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Informação do Audio Simulada */}
                {dualNBackActive && (
                  <div className="mb-4 text-center">
                    <span className="text-[11px] font-mono uppercase text-zinc-400">Letra de Áudio (Simulada):</span>
                    <span className="ml-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100 tracking-wider">
                      &ldquo;{currentAudioLetter}&rdquo;
                    </span>
                  </div>
                )}

                {/* Resultados */}
                {dualNBackScore !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-3 rounded-xl bg-emerald-50/20 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-100 dark:border-emerald-900/20 text-center max-w-sm"
                  >
                    Treino finalizado com sucesso! Precisão simulada obtida: <strong>{dualNBackScore}%</strong> (Memória estável).
                  </motion.div>
                )}

                {/* Controles do Dual N-Back */}
                {!dualNBackActive ? (
                  <Button variant="primary" onClick={startDualNBack} className="h-11 px-8 rounded-xl">
                    Iniciar Treino Ativo (10 Rodadas)
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" className="h-11 px-6 rounded-xl flex items-center gap-1 text-xs">
                      Corresponde Posição
                    </Button>
                    <Button variant="outline" className="h-11 px-6 rounded-xl flex items-center gap-1 text-xs">
                      Corresponde Som
                    </Button>
                  </div>
                )}

                {dualNBackActive && (
                  <span className="text-[10px] font-mono text-zinc-400 mt-4 uppercase">
                    Rodada: {dualNBackRound} / 8
                  </span>
                )}
              </Card>
            </motion.div>
          ) : (
            /* EXPERIMENTO 3: QUALQUER OUTRO BLOQUEADO OU BASE IA */
            <motion.div
              key="locked-exp"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-8 border border-zinc-200/80 dark:border-zinc-850 flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-zinc-300 mb-4" />
                <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400">
                  {selectedExp?.category || 'Módulo Cognitivo'}
                </span>

                <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-3">
                  {selectedExp?.title}
                </h2>
                
                <p className="text-xs text-zinc-500 max-w-md mt-2 mb-6 leading-relaxed">
                  {selectedExp?.description}
                </p>

                <div className="max-w-md p-5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850 text-left">
                  <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1.5">
                    <Brain className="h-3.5 w-3.5" />
                    Fundamentação Científica
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Este experimento foi desenhado sobre estudos de retenção sináptica de longo prazo e socrática. Ele depende de fluxos neurais de autoavaliação contínuos alimentados por IA.
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-3">
                    *Para liberar este experimento, configure uma chave do Gemini e ative o modulo de Inteligência Artificial nas Configurações.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
