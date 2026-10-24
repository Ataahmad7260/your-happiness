import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, ArrowLeft, Wind, Coffee, Sparkles, X, Sun } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface SadWorldProps {
  onBack: () => void;
}

export const SadWorld: React.FC<SadWorldProps> = ({ onBack }) => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [rainPassed, setRainPassed] = useState(false);

  // Guided breathing timer
  useEffect(() => {
    if (!isBreathingActive) return;

    let currentPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
    setBreathPhase('Inhale');

    const interval = setInterval(() => {
      if (currentPhase === 'Inhale') {
        currentPhase = 'Hold';
        setBreathPhase('Hold');
      } else if (currentPhase === 'Hold') {
        currentPhase = 'Exhale';
        setBreathPhase('Exhale');
      } else {
        currentPhase = 'Inhale';
        setBreathPhase('Inhale');
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleOpenHeavyLetter = () => {
    soundEngine.playPaperRustle();
    setIsLetterOpen(true);
  };

  const handleLetRainPass = () => {
    soundEngine.playSoftBell();
    setRainPassed(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#111927] via-[#1a2333] to-[#141b24] text-stone-200 overflow-hidden select-none">
      {/* Warm Table Lamp Ambient Glow in the Corner */}
      <div className="absolute top-12 right-12 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Sunbeam Breakthrough if Rain Passed */}
      <AnimatePresence>
        {rainPassed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-rose-300/10 to-transparent pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          type="button"
          id="back-from-sad"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-700/60 text-stone-300 text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose another mood
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-800/40 text-sky-200 text-xs font-serif backdrop-blur-md">
          <CloudRain className="w-3.5 h-3.5 text-sky-300" />
          <span>Cozy Rainy Room</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-center py-6 px-4">
        {/* Opening Poetic Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-2xl mb-8"
        >
          <span className="font-editorial text-xs uppercase tracking-widest text-sky-300/80 mb-2 block font-medium">
            Take a gentle breath
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-stone-100 font-light tracking-wide leading-tight mb-3">
            "Hey, it's okay.{' '}
            <span className="font-serif italic text-amber-200/90 block sm:inline">
              You don't have to be sunshine every day.
            </span>"
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-light max-w-md mx-auto">
            The clouds came today. That is all. You are safe here to be quiet, unhurried, and human.
          </p>
        </motion.div>

        {/* Interactive Features Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl">
          {/* Card 1: Envelope "Open When Things Feel Heavy" */}
          <div className="bg-stone-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col items-center justify-between text-center group hover:border-amber-400/40 transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Coffee className="w-6 h-6 text-amber-200" />
              </div>
              <h3 className="font-editorial text-2xl text-stone-100 font-normal mb-1">
                Open When Things Feel Heavy
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 font-light mb-6">
                A quiet letter written for the days that ask too much of you.
              </p>
            </div>

            <button
              type="button"
              id="open-heavy-letter-button"
              onClick={handleOpenHeavyLetter}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-100/10 hover:bg-amber-100/20 border border-amber-300/40 text-amber-100 font-editorial text-sm tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>Unfold the Letter</span>
              <span className="text-amber-300">✉</span>
            </button>
          </div>

          {/* Card 2: Guided Breathing & Steaming Cup */}
          <div className="bg-stone-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col items-center justify-between text-center">
            <div>
              {/* Steaming Ceramic Mug Illustration */}
              <div className="relative w-16 h-16 mx-auto mb-3 flex flex-col items-center justify-end">
                {/* Animated Rising Steam */}
                <div className="flex gap-1.5 mb-1">
                  <div className="w-1.5 h-5 bg-stone-300/40 rounded-full animate-steam" />
                  <div
                    className="w-1.5 h-6 bg-stone-300/40 rounded-full animate-steam"
                    style={{ animationDelay: '0.8s' }}
                  />
                  <div
                    className="w-1.5 h-5 bg-stone-300/40 rounded-full animate-steam"
                    style={{ animationDelay: '1.6s' }}
                  />
                </div>
                {/* Ceramic Mug */}
                <div className="w-10 h-8 rounded-b-lg bg-[#b45309]/80 border-2 border-amber-200/40 shadow-sm relative">
                  {/* Mug Handle */}
                  <div className="absolute top-1 -right-2 w-3.5 h-5 rounded-r-md border-2 border-amber-200/40" />
                </div>
              </div>

              <h3 className="font-editorial text-2xl text-stone-100 font-normal mb-1">
                {isBreathingActive ? breathPhase : 'Guided Breathing'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 font-light mb-4">
                {isBreathingActive
                  ? 'Breathe in with the rain, hold, let it wash away...'
                  : 'A 4-second gentle cadence to reset your nervous system.'}
              </p>
            </div>

            {/* Breathing Visualizer Circle if active */}
            {isBreathingActive && (
              <div className="my-2 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: breathPhase === 'Inhale' ? 1.4 : breathPhase === 'Hold' ? 1.4 : 0.85,
                    opacity: breathPhase === 'Hold' ? 1 : 0.7,
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-sky-400/20 border-2 border-sky-300/60 flex items-center justify-center text-xs text-sky-200 font-editorial"
                >
                  {breathPhase}
                </motion.div>
              </div>
            )}

            <button
              type="button"
              id="toggle-breathing-button"
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-950/50 hover:bg-sky-900/60 border border-sky-700/50 text-sky-200 text-xs font-sans tracking-wide transition-all duration-300 cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5" />
              {isBreathingActive ? 'Stop Breathing Exercise' : 'Start Gentle Breathing'}
            </button>
          </div>
        </div>

        {/* "Let the Rain Pass" Button */}
        <div className="mt-8">
          <button
            type="button"
            id="let-rain-pass-button"
            onClick={handleLetRainPass}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-800/80 hover:bg-amber-950/50 border border-stone-600/60 hover:border-amber-400/60 text-stone-300 hover:text-amber-200 text-xs sm:text-sm font-editorial tracking-wide transition-all duration-500 shadow-md cursor-pointer"
          >
            {rainPassed ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '15s' }} />
                <span>The sunbeam is resting here with you</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300/80" />
                <span>Let the Rain Pass</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* COMFORTING LETTER MODAL ("When Things Feel Heavy") */}
      <AnimatePresence>
        {isLetterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsLetterOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-lg bg-parchment text-stone-800 rounded-2xl p-7 sm:p-10 shadow-2xl border border-stone-300/80 my-auto"
            >
              <button
                type="button"
                id="close-heavy-letter"
                onClick={() => setIsLetterOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1.5 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
                aria-label="Close letter"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="font-editorial text-xs uppercase tracking-widest text-stone-500">
                  Comforting Note
                </span>
                <h4 className="font-serif italic text-xl text-stone-900 mt-1">
                  For when things feel heavy
                </h4>
              </div>

              <div className="font-editorial text-base sm:text-lg leading-relaxed text-stone-800 space-y-4 pt-2 border-t border-stone-200">
                <p>Some days arrive without asking whether we're ready for them.</p>
                <p>
                  And if today has been one of those days, I hope you know that you don't have to
                  turn it into something beautiful.
                </p>
                <p className="font-serif italic text-stone-900 font-medium">
                  You can simply let it pass.
                </p>
                <p>Take your time. The world can wait a little.</p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  id="close-heavy-letter-btn"
                  onClick={() => setIsLetterOpen(false)}
                  className="px-5 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-stone-100 text-xs font-sans tracking-wide transition-colors cursor-pointer"
                >
                  Close &amp; Breathe
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
