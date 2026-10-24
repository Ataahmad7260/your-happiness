import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, ArrowLeft, Sparkles, Eye } from 'lucide-react';

import { soundEngine } from '../../audio/soundEngine';

interface DontKnowWorldProps {
  onBack: () => void;
}

export const DontKnowWorld: React.FC<DontKnowWorldProps> = ({ onBack }) => {
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeAffirmationIdx, setActiveAffirmationIdx] = useState(0);

  const lakeAffirmations = [
    'You don\'t need a neat reason for feeling foggy.',
    'Feelings are like weather — they arrive, they shift, they drift away without your permission.',
    'You don\'t owe anyone a clean explanation of your heart today.',
    'Existing quietly is plenty.',
    'It is okay to sit in the twilight and simply be here.',
  ];

  const handleNextAffirmation = () => {
    soundEngine.playWaterRippleSound();
    setActiveAffirmationIdx((prev) => (prev + 1) % lakeAffirmations.length);
  };

  const handleStayHere = () => {
    soundEngine.playWaterRippleSound();
    setIsZenMode(!isZenMode);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#0e1626] via-[#1a233a] to-[#122238] text-stone-200 overflow-hidden select-none">
      {/* Twilight Glow on Water */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[700px] h-[350px] bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div
        className={`relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2 transition-opacity duration-700 ${
          isZenMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          id="back-from-dont-know"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-cyan-800/50 text-cyan-200 text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose another mood
        </button>

        <button
          type="button"
          id="toggle-zen-mode"
          onClick={handleStayHere}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-700/50 text-cyan-200 text-xs font-serif backdrop-blur-md transition-all cursor-pointer hover:border-cyan-400/60"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-300" />
          <span>{isZenMode ? 'Show Controls' : 'Just Stay Here Awhile'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`relative z-10 max-w-3xl mx-auto w-full my-auto flex flex-col items-center py-6 px-4 text-center transition-all duration-1000 ${
          isZenMode ? 'opacity-30 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Mood Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-700/40 text-cyan-200 text-xs uppercase tracking-widest font-serif mb-4">
          <Waves className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          Twilight Lake
        </div>

        {/* Opening Poetic Message */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-editorial text-3xl sm:text-4xl md:text-5xl text-stone-100 font-light tracking-wide leading-tight mb-4 max-w-2xl"
        >
          "That's alright.{' '}
          <span className="font-serif italic text-cyan-200/90 block sm:inline">
            You don't always need a name for what you're feeling.
          </span>"
        </motion.h2>

        <p className="text-sm sm:text-base text-cyan-200/70 font-light max-w-md mx-auto mb-8">
          Tap anywhere to make gentle ripples across the water. There is no checklist here, no goal to accomplish.
        </p>

        {/* Drifting Lake Lantern / Affirmation Card */}
        <div
          onClick={handleNextAffirmation}
          className="group relative cursor-pointer w-full max-w-md bg-stone-900/60 hover:bg-stone-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-cyan-800/40 shadow-xl transition-all duration-300 hover:border-cyan-400/50"
          role="button"
          tabIndex={0}
          aria-label="Click to reveal another floating affirmation"
        >
          {/* Floating Lantern Light Glow */}
          <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-4 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>

          <span className="text-[11px] font-editorial uppercase tracking-widest text-cyan-300/70 block mb-2">
            A Floating Reflection (tap to change)
          </span>

          <AnimatePresence mode="wait">
            <motion.p
              key={activeAffirmationIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="font-serif italic text-stone-100 text-lg sm:text-xl leading-relaxed font-light min-h-[60px] flex items-center justify-center"
            >
              "{lakeAffirmations[activeAffirmationIdx]}"
            </motion.p>
          </AnimatePresence>

          <span className="text-xs text-stone-500 font-sans mt-4 block">
            Tap the card for another gentle thought
          </span>
        </div>

        {/* Just Stay Here Awhile Button */}
        <div className="mt-8">
          <button
            type="button"
            id="stay-awhile-button"
            onClick={handleStayHere}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/50 text-cyan-100 text-sm font-editorial tracking-wide transition-all duration-300 shadow-md cursor-pointer hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]"
          >
            <span>Just Stay Here Awhile</span>
            <span className="font-handwriting text-cyan-300 text-lg">♡</span>
          </button>
        </div>
      </div>

      {/* Zen Mode Gentle Note in Corner */}
      {isZenMode && (
        <div className="fixed bottom-8 inset-x-0 flex justify-center z-30 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsZenMode(false)}
            className="px-5 py-2 rounded-full bg-stone-900/80 border border-cyan-700 text-cyan-200 text-xs font-sans tracking-wide hover:bg-stone-800 transition-colors shadow-lg cursor-pointer"
          >
            Tap anywhere or click here to return
          </button>
        </div>
      )}

      {/* Twilight Lake Horizon Silhouette */}
      <div className="w-full relative pointer-events-none mt-auto">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-16 text-[#09111c]"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,50 C360,20 720,70 1080,30 1440,60 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </div>
  );
};
