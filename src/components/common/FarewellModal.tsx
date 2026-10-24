import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';


interface FarewellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitAnotherWorld: () => void;
}

export const FarewellModal: React.FC<FarewellModalProps> = ({
  isOpen,
  onClose,
  onVisitAnotherWorld,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 2200);
    const t3 = setTimeout(() => setStep(3), 4000);
    const t4 = setTimeout(() => setStep(4), 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#080913]/95 via-[#0e1224]/95 to-[#161a30]/95 backdrop-blur-lg">
        {/* Close Button */}
        <button
          type="button"
          id="close-farewell-modal"
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900/60 border border-stone-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl text-center px-4 py-8 flex flex-col items-center"
        >
          {/* Subtle Moon or Star Icon */}
          <div className="w-14 h-14 rounded-full bg-amber-200/10 border border-amber-200/30 flex items-center justify-center text-amber-200 mb-6 shadow-[0_0_25px_rgba(253,230,138,0.2)] animate-pulse-glow">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>

          {/* Heading */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-editorial text-3xl sm:text-4xl text-amber-50 font-light tracking-wide mb-6"
              >
                Before you go...
              </motion.h2>
            )}
          </AnimatePresence>

          {/* Lines */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4 }}
                className="space-y-4 font-serif italic text-base sm:text-lg text-stone-200/90 font-light max-w-md leading-relaxed mb-6"
              >
                <p>I don't know what kind of day tomorrow will bring you.</p>
                <p>But I hope there's something in it that makes you smile.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4 }}
                className="space-y-3 font-serif italic text-base sm:text-lg text-amber-100/90 font-light max-w-md leading-relaxed mb-8"
              >
                <p>And whenever the world feels a little too loud,</p>
                <p className="text-stone-100 font-normal">this little place will be here.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signoff */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center"
              >
                <p className="font-handwriting text-2xl text-amber-200/80 mb-8">
                  Made with a little thought, especially for you.{' '}
                  <span className="text-rose-400">♡</span>
                </p>

                {/* Two Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button
                    type="button"
                    id="farewell-visit-another-button"
                    onClick={() => {
                      soundEngine.playSoftBell();
                      onVisitAnotherWorld();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-200/20 hover:bg-amber-200/30 border border-amber-300/40 text-amber-100 text-sm font-editorial tracking-wide transition-all duration-300 shadow-md cursor-pointer hover:shadow-[0_0_25px_rgba(253,230,138,0.2)]"
                  >
                    <span>Visit Another Little World</span>
                  </button>

                  <button
                    type="button"
                    id="farewell-stay-awhile-button"
                    onClick={() => {
                      soundEngine.playSoftBell();
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-700/60 text-stone-300 hover:text-white text-sm font-sans tracking-wide transition-all cursor-pointer"
                  >
                    <span>Stay Here Awhile</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
