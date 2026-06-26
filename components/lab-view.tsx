'use client';

import * as React from 'react';
import { LabExperiment, ExperimentStatus } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Beaker, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertCircle, 
  Wind, 
  Brain, 
  Activity, 
  Compass, 
  ActivitySquare, 
  Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Help functions outside of the component to remain pure
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
      setDualNBackScore(85); // Simulated scoring for user response validation
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
    <div className="flex flex-col gap-6 h-full">
      
      {/* CABEÇALHO SUTIL E COGNITIVO */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-900/60 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
          <ActivitySquare className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          Ritmos de Foco
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
          Sintonize sua atenção voluntária. Exercícios calibrados para blindar seu foco, expandir sua capacidade imediata de raciocínio e reduzir o cansaço mental.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
        
        {/* COLUNA ESQUERDA: LISTA DE PRÁTICAS DISPONÍVEIS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
            Práticas de Presença
          </span>

          <div className="flex flex-col gap-3">
            {experiments.map((exp) => {
              const isSelected = selectedExpId === exp.id;
              
              // Humanize categories
              const categoryLabel = exp.category === 'Atenção' ? 'Presença' :
                                    exp.category === 'Memória' ? 'Retenção Ativa' : 'Foco Dividido';

              return (
                <Card
                  key={exp.id}
                  animate={false}
                  onClick={() => {
                    setSelectedExpId(exp.id);
                    setDualNBackActive(false);
                    setTimerActive(false);
                  }}
                  className={`p-4 border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-xs'
                      : 'bg-white border-zinc-200/70 hover:border-zinc-300 dark:bg-zinc-950/20 dark:border-zinc-900 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-350 dark:bg-zinc-200 dark:border-zinc-300 dark:text-zinc-800'
                        : 'bg-zinc-50 text-zinc-500 border-zinc-150 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-900'
                    }`}>
                      {categoryLabel}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      isSelected ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {exp.expectedDuration}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-sm tracking-tight mb-1">
                    {exp.id === 'focus-timer' ? 'Ciclo de Presença e Respiração' :
                     exp.id === 'dual-n-back' ? 'Expansão de Atenção Dividida' : exp.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-zinc-300 dark:text-zinc-650' : 'text-zinc-500 dark:text-zinc-450'
                  }`}>
                    {exp.description}
                  </p>

                  <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-zinc-100/10 dark:border-zinc-900/40">
                    <span className={`text-[10px] font-sans ${
                      isSelected ? 'text-zinc-450 dark:text-zinc-500' : 'text-zinc-455'
                    }`}>
                      Esforço Mental: <strong>{exp.cognitiveLoad}/10</strong>
                    </span>
                    <span className={`text-[9px] font-mono uppercase font-semibold flex items-center gap-1 ${
                      exp.status === ExperimentStatus.READY ? 'text-emerald-500' : 'text-zinc-400'
                    }`}>
                      {exp.status === ExperimentStatus.READY ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                          Pronto
                        </>
                      ) : (
                        <>
                          <Lock className="h-2 w-2" />
                          Socrático (IA)
                        </>
                      )}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: ESPAÇO DE EXECUÇÃO SENSORIAL (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {selectedExpId === 'focus-timer' ? (
              /* CICLO DE PRESENÇA E RESPIRAÇÃO (FOCUS TIMER) */
              <motion.div
                key="focus-timer"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="p-8 border border-zinc-200/80 dark:border-zinc-900 text-center flex flex-col items-center bg-white/40 dark:bg-[#070707]/10">
                  <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-450 border border-zinc-200/20">
                    Sintonia de Foco Sustentado
                  </span>
                  
                  <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-3">
                    Ciclo de Presença e Respiração
                  </h2>
                  <p className="text-xs text-zinc-500 max-w-md mt-1 mb-6 leading-relaxed">
                    Sincronize seus sentidos com o compasso calmo. Reduza a velocidade de seu diálogo interno e canalize sua energia criativa.
                  </p>

                  {/* Diaphragmatic Breath Wave & Ring */}
                  <div className="relative flex items-center justify-center my-6 h-56 w-56 rounded-full border border-zinc-100/50 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/20 shadow-xs">
                    {/* Visual pulse representing lungs / respiratory cycle */}
                    {breathGuideActive && timerActive && (
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1.4, 1],
                          opacity: [0.08, 0.24, 0.24, 0.08],
                        }}
                        transition={{
                          duration: 16, // Inhale 4s, Hold 4s, Exhale 4s, Hold 4s
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 bg-emerald-500 rounded-full pointer-events-none"
                      />
                    )}

                    <div className="flex flex-col items-center justify-center z-10">
                      <span className="text-4xl font-mono tracking-tight font-semibold text-zinc-900 dark:text-zinc-50 select-none">
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${timerActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-350'}`} />
                        {timerActive ? 'Presença Ativa' : 'Pausado'}
                      </span>
                    </div>
                  </div>

                  {/* Presets de Tempo */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {[15, 25, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleSelectPreset(mins)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          preset === mins
                            ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-semibold shadow-xs'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/40 dark:border-zinc-900'
                        }`}
                      >
                        {mins} minutos
                      </button>
                    ))}
                  </div>

                  {/* Play/Pause Controls */}
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="primary"
                      onClick={() => setTimerActive(!timerActive)}
                      className="flex items-center gap-2 h-11 px-6 rounded-xl shadow-xs"
                    >
                      {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {timerActive ? 'Pausar Ritmo' : 'Iniciar Presença'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResetTimer}
                      className="h-11 w-11 p-0 flex items-center justify-center rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Guia Respiratório Integrador */}
                  <div className="border-t border-zinc-100 dark:border-zinc-900 w-full pt-6 flex flex-col items-center">
                    <button
                      onClick={() => setBreathGuideActive(!breathGuideActive)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-sans font-medium transition-all cursor-pointer ${
                        breathGuideActive
                          ? 'bg-emerald-50/70 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      <Wind className="h-4 w-4 text-emerald-500" />
                      Sintonia Respiratória (Diafragmática) {breathGuideActive ? 'Ativa' : 'Inativa'}
                    </button>

                    {breathGuideActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm flex items-start gap-2.5 bg-emerald-50/10 dark:bg-emerald-950/5 p-3.5 rounded-xl border border-emerald-100/40 dark:border-emerald-900/10 text-left leading-relaxed"
                      >
                        <Activity className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          Sincronize seus pulmões com a onda de pulsação suave em segundo plano: <strong>Inale</strong> na expansão verde (4s), <strong>retenha</strong> o ar nos pulmões (4s), <strong>exale</strong> na contração (4s) e <strong>sustente</strong> vazio (4s).
                        </span>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : selectedExpId === 'dual-n-back' ? (
              /* TREINO DUAL N-BACK DE ATENÇÃO DIVIDIDA */
              <motion.div
                key="dual-n-back"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="p-8 border border-zinc-200/80 dark:border-zinc-900 flex flex-col items-center bg-white/40 dark:bg-[#070707]/10">
                  <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-450 border border-zinc-200/20">
                    Treino de Capacidade Cognitiva
                  </span>

                  <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-3">
                    Sintonia de Atenção Dividida
                  </h2>
                  <p className="text-xs text-zinc-500 max-w-md text-center mt-1 mb-6 leading-relaxed">
                    Exercício clássico de expansão de atenção sintonizado. Identifique se a posição do quadrado ou o estímulo sonoro correspondem à etapa anterior.
                  </p>

                  {/* Grid de Atenção Espacial */}
                  <div className="grid grid-cols-3 gap-3 w-52 h-52 mb-6 p-2 rounded-2xl bg-zinc-100/50 dark:bg-zinc-950/30 border border-zinc-200/30 dark:border-zinc-900">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                      const isActive = currentGridPos === index;
                      return (
                        <div
                          key={index}
                          className={`rounded-xl transition-all duration-150 border ${
                            isActive
                              ? 'bg-zinc-900 border-zinc-950 dark:bg-zinc-100 dark:border-zinc-50 shadow-xs scale-[1.03]'
                              : 'bg-white dark:bg-[#0d0d0d] border-zinc-100 dark:border-zinc-900/60'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Simulação Auditiva Sutil */}
                  {dualNBackActive && (
                    <div className="mb-4 text-center">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">Letra Auditiva Simulada:</span>
                      <span className="ml-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 tracking-wider">
                        &ldquo;{currentAudioLetter}&rdquo;
                      </span>
                    </div>
                  )}

                  {/* Resultados Sintonizados */}
                  {dualNBackScore !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs border border-emerald-200/30 dark:border-emerald-900/20 text-center max-w-sm"
                    >
                      Treino concluído. Pontuação sináptica simulada obtida: <strong>{dualNBackScore}%</strong> (Sintonia estável).
                    </motion.div>
                  )}

                  {/* Controles de Prática */}
                  {!dualNBackActive ? (
                    <Button variant="primary" onClick={startDualNBack} className="h-11 px-8 rounded-xl shadow-xs">
                      Iniciar Ciclo de Prática (8 Passos)
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="outline" className="h-11 px-6 rounded-xl flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        Corresponde Posição
                      </Button>
                      <Button variant="outline" className="h-11 px-6 rounded-xl flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        Corresponde Som
                      </Button>
                    </div>
                  )}

                  {dualNBackActive && (
                    <span className="text-[10px] font-mono text-zinc-400 mt-4 uppercase tracking-wider">
                      Ritmo Corrente: {dualNBackRound} de 8
                    </span>
                  )}
                </Card>
              </motion.div>
            ) : (
              /* OUTRA PRÁTICA BLOQUEADA (MÓDULO IA REQUERIDO) */
              <motion.div
                key="locked-practice"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="p-8 border border-zinc-200/80 dark:border-zinc-900 flex flex-col items-center text-center bg-white/40 dark:bg-[#070707]/10">
                  <Lock className="h-10 w-10 text-zinc-300 dark:text-zinc-800 mb-4" />
                  
                  <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-450 border border-zinc-200/20">
                    Sintonia Ativa de Memória
                  </span>

                  <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-3">
                    {selectedExp?.title}
                  </h2>
                  
                  <p className="text-xs text-zinc-500 max-w-md mt-1 mb-6 leading-relaxed">
                    {selectedExp?.description}
                  </p>

                  <div className="max-w-md p-5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/30 dark:border-zinc-900 text-left">
                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1.5">
                      <Brain className="h-4 w-4 text-zinc-400" />
                      Fundamento Cognitivo
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                      Este ritmo estimula conexões sinápticas através do recall ativo das ideias cultivadas em seu cérebro. Para criar o diálogo, ele requer o Módulo de IA ativo.
                    </p>
                    <p className="text-[11px] text-zinc-450 dark:text-zinc-550 mt-3 italic">
                      *Para sintonizar, configure uma chave válida do Gemini e habilite a IA na aba de Ajustes.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
