import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../../audio/soundEngine';

interface OpeningGateProps {
  onEnter: () => void;
}

export const OpeningGate: React.FC<OpeningGateProps> = ({ onEnter }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Gentle cinematic reveal pacing
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2400);
    const t3 = setTimeout(() => setStep(3), 4200);
    const t4 = setTimeout(() => setStep(4), 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleEnterClick = () => {
    soundEngine.playSoftBell();
    onEnter();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-12 bg-gradient-to-b from-[#0a0b12] via-[#10121f] to-[#171a2e] text-[#f2efe9] overflow-hidden select-none">
      {/* Delicate illustrated Moon in the upper sky */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="relative mt-8 sm:mt-12 flex flex-col items-center"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          {/* Outer ethereal glow */}
          <div className="absolute inset-0 rounded-full bg-amber-100/20 blur-xl animate-pulse-glow" />
          {/* Illustrated Crescent Moon SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_20px_rgba(253,230,138,0.5)]"
            fill="none"
          >
            <path
              d="M 50 10 A 40 40 0 1 0 90 50 A 34 34 0 1 1 50 10 Z"
              fill="url(#moonGrad)"
            />
            <defs>
              <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="mt-3 text-xs tracking-[0.25em] text-amber-200/50 uppercase font-sans">
          A quiet corner
        </p>
      </motion.div>

      {/* Main Centered Poetic Reveal */}
      <div className="max-w-xl w-full text-center my-auto flex flex-col items-center z-10 px-4">
        {/* Line 1 */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-amber-50 drop-shadow-sm mb-6"
            >
              Hey, you. <span className="font-handwriting text-rose-300 font-normal">♡</span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Line 2 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="font-serif italic text-lg sm:text-xl md:text-2xl text-amber-100/90 leading-relaxed mb-6 font-light"
            >
              I made you a little place on the internet.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 3 */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="space-y-2 mb-10 max-w-md"
            >
              <p className="text-sm sm:text-base text-stone-300/80 leading-relaxed font-sans font-light">
                Not because today is special.
              </p>
              <p className="text-sm sm:text-base text-stone-300/80 leading-relaxed font-sans font-light">
                But because sometimes, people deserve something beautiful for no reason at all.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <button
                type="button"
                id="enter-button"
                onClick={handleEnterClick}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-100/10 via-amber-200/20 to-amber-100/10 hover:from-amber-100/20 hover:to-amber-200/30 border border-amber-200/40 hover:border-amber-200/70 text-amber-50 shadow-[0_0_25px_rgba(253,230,138,0.15)] hover:shadow-[0_0_35px_rgba(253,230,138,0.3)] transition-all duration-500 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="font-editorial text-base sm:text-lg tracking-wide">
                  Come Inside
                </span>
                <span className="font-handwriting text-rose-300 text-xl group-hover:scale-125 transition-transform duration-300">
                  ♡
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Illustrated Peaceful Landscape Silhouette */}
      <div className="w-full relative pointer-events-none mt-auto">
        <svg
          viewBox="0 0 1440 220"
          className="w-full h-auto text-[#08080f]/90"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          {/* Distant Hills */}
          <path
            opacity="0.5"
            d="M0,130 C320,60, 480,180, 800,100 C1100,20, 1300,140, 1440,90 L1440,220 L0,220 Z"
          />
          {/* Foreground Soft Hills */}
          <path d="M0,160 C240,110, 520,200, 780,140 C1080,80, 1280,170, 1440,130 L1440,220 L0,220 Z" />
        </svg>

        {/* Quiet tiny house with warm glowing window */}
        <div className="absolute right-[18%] sm:right-[24%] bottom-8 w-6 h-6 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-300/80 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse-glow" />
        </div>
      </div>
    </div>
  );
};
