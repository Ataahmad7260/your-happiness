import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Feather } from 'lucide-react';


interface TiredWorldProps {
  onBack: () => void;
}

export const TiredWorld: React.FC<TiredWorldProps> = ({ onBack }) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isMoonBreathing, setIsMoonBreathing] = useState(true);
  const [activeThoughtIdx, setActiveThoughtIdx] = useState(0);

  const bedtimeThoughts = [
    {
      title: 'The Day Is Over',
      thought: 'Everything that needed to happen today is finished. Everything else can wait for the sun.',
    },
    {
      title: 'Weight of the Stars',
      thought: 'Even the stars take their time to shine. You are allowed to turn off your light.',
    },
    {
      title: 'Quiet Pillow',
      thought: 'Let the muscles in your jaw loosen. Drop your shoulders. Uncurl your fingers. You are resting now.',
    },
    {
      title: 'Tomorrow\'s Horizon',
      thought: 'Whatever tomorrow asks of you, you don\'t have to answer it tonight. Sleep comes first.',
    },
  ];

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#080911] via-[#0d101d] to-[#121626] text-stone-200 overflow-hidden select-none transition-opacity duration-1000 ${
        isDimmed ? 'opacity-30' : 'opacity-100'
      }`}
    >
      {/* Warm Bedside Lamp Halo */}
      <div className="absolute bottom-6 left-6 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          type="button"
          id="back-from-tired"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 text-stone-300 text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose another mood
        </button>

        {/* Dim Interface Button */}
        <button
          type="button"
          id="toggle-dim-button"
          onClick={() => setIsDimmed(!isDimmed)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/60 border border-stone-700/50 text-stone-300 hover:text-amber-200 text-xs font-sans backdrop-blur-md transition-all cursor-pointer"
        >
          {isDimmed ? (
            <>
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Wake Interface</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-stone-400" />
              <span>Dim for Sleep</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-center py-6 px-4">
        {/* The Calming Breathing Moon */}
        <div className="relative mb-8 flex flex-col items-center">
          <motion.div
            animate={
              isMoonBreathing
                ? {
                    scale: [1, 1.14, 1.14, 1],
                    filter: [
                      'drop-shadow(0 0 15px rgba(253, 230, 138, 0.3))',
                      'drop-shadow(0 0 35px rgba(253, 230, 138, 0.7))',
                      'drop-shadow(0 0 35px rgba(253, 230, 138, 0.7))',
                      'drop-shadow(0 0 15px rgba(253, 230, 138, 0.3))',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMoonBreathing(!isMoonBreathing)}
            title="Click to pause or resume moon breathing rhythm"
          >
            {/* Illustrated Crescent Moon */}
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <path
                d="M 50 10 A 40 40 0 1 0 90 50 A 34 34 0 1 1 50 10 Z"
                fill="url(#tiredMoonGrad)"
              />
              <defs>
                <linearGradient id="tiredMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="50%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <p className="mt-2 text-xs text-amber-200/60 font-sans tracking-widest uppercase">
            {isMoonBreathing ? 'Inhale with the moon... Exhale into stillness' : 'Moon resting'}
          </p>
        </div>

        {/* Opening Poetic Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-xl mb-8"
        >
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-stone-100 font-light tracking-wide leading-tight mb-3">
            "You've done enough for today.{' '}
            <span className="font-serif italic text-amber-200/90 block sm:inline">
              Even the stars take their time to shine.
            </span>"
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-light max-w-md mx-auto">
            You don't need to carry any unfinished thoughts into sleep. Let your mind become heavy and quiet.
          </p>
        </motion.div>

        {/* Bedtime Thoughts Interactive Deck */}
        <div className="w-full max-w-md bg-stone-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-editorial uppercase tracking-wider mb-3">
            <Feather className="w-3.5 h-3.5 text-amber-400" />
            <span>Bedtime Whisper — {bedtimeThoughts[activeThoughtIdx].title}</span>
          </div>

          <div className="min-h-[90px] flex items-center justify-center my-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeThoughtIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-serif italic text-stone-200 text-base sm:text-lg leading-relaxed font-light"
              >
                "{bedtimeThoughts[activeThoughtIdx].thought}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-stone-800 w-full">
            {bedtimeThoughts.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveThoughtIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeThoughtIdx === i
                    ? 'w-6 bg-amber-300'
                    : 'w-2 bg-stone-700 hover:bg-stone-600'
                }`}
                aria-label={`Thought ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gentle Bedroom Silhouette Floor */}
      <div className="w-full relative pointer-events-none mt-auto">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-12 text-[#05060b]"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,40 L1440,20 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </div>
  );
};
