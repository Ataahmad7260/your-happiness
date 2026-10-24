import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = () => {
    soundEngine.playPaperRustle();
    setIsOpened(true);
  };

  const handleClose = () => {
    setIsOpened(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        {/* Background Click to dismiss */}
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl my-auto"
        >
          {/* Close button in corner */}
          <button
            type="button"
            id="close-letter-modal"
            onClick={handleClose}
            className="absolute -top-12 right-0 sm:-right-4 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900/60 border border-stone-700/50 transition-colors cursor-pointer"
            aria-label="Close letter"
          >
            <X className="w-5 h-5" />
          </button>

          {!isOpened ? (
            /* CLOSED VINTAGE ENVELOPE */
            <div
              onClick={handleOpenEnvelope}
              className="group relative cursor-pointer mx-auto max-w-md bg-[#e8decb] hover:bg-[#ede5d6] text-stone-800 rounded-xl p-8 sm:p-12 shadow-2xl border border-[#d3c3a7] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Envelope flap aesthetic styling */}
              <div className="absolute top-0 left-0 right-0 h-28 border-b border-[#c8b79b] bg-gradient-to-b from-[#dfd3bd] to-[#e4d8c2] rounded-t-xl [clip-path:polygon(0_0,50%_100%,100%_0)]" />

              {/* Envelope string / border detail */}
              <div className="border border-dashed border-[#b8a789] rounded-lg p-6 sm:p-8 text-center flex flex-col items-center relative z-10 mt-8">
                <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-600 mb-2 font-medium">
                  Personal &amp; Confidential
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-stone-900 tracking-wide mb-1">
                  A Letter For You
                </h3>
                <p className="font-handwriting text-xl text-stone-600 mb-8">
                  For quiet moments...
                </p>

                {/* Wax Seal Button */}
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#991b1b] shadow-lg flex items-center justify-center border-2 border-[#7f1d1d] text-rose-100">
                    <Heart className="w-6 h-6 fill-rose-200/40 text-rose-100" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-md -z-10 animate-pulse-glow" />
                </div>

                <p className="font-sans text-xs text-stone-500 mt-6 tracking-wider">
                  Tap to unfold the letter
                </p>
              </div>
            </div>
          ) : (
            /* UNFOLDED HANDWRITTEN LETTER */
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-parchment text-stone-800 rounded-2xl p-7 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#e2d5c3] relative max-h-[85vh] overflow-y-auto"
            >
              {/* Delicate stamp & header watermark */}
              <div className="flex justify-between items-start mb-6 border-b border-[#e5d8c6] pb-4">
                <div>
                  <span className="font-editorial text-xs tracking-widest uppercase text-stone-400">
                    Handwritten Note
                  </span>
                  <p className="font-handwriting text-lg text-amber-800/70">
                    A little corner of peace
                  </p>
                </div>
                <div className="w-10 h-10 border border-stone-300/80 rounded-sm flex items-center justify-center text-xs font-serif text-stone-400 rotate-3">
                  POST
                </div>
              </div>

              {/* Letter Content */}
              <div className="font-editorial text-stone-800 text-base sm:text-lg leading-relaxed space-y-4 font-normal">
                <p className="font-serif italic text-stone-900 font-medium">Hey,</p>

                <p>I don't really know how to make extraordinary things.</p>

                <p>But I know how to put a little thought into ordinary ones.</p>

                <p>So I made this small place.</p>

                <p>
                  A place where you can smile when you're happy, rest when you're tired, and find a
                  little quiet when the world feels loud.
                </p>

                <p>You don't have to be a certain version of yourself here.</p>

                <p className="font-serif italic text-stone-900 font-medium">Just be you.</p>

                <p>
                  I hope this little corner of the internet makes an ordinary day feel a little
                  nicer.
                </p>

                <p>
                  And if it makes you smile, even for a moment, I think that would be enough.
                </p>
                <p> one more thing i just want to say you that i don't know how can i forgot your name but i really wanted to know your name, Every day i want to ask you that what is your name.
                </p>
                <p>
                  i love you bella, i really fall in love with you.
                </p>

                <div className="pt-6 border-t border-[#e5d8c6] flex flex-col items-end">
                  <p className="font-handwriting text-2xl text-stone-700">
                    from ahmed-                    <span className="text-rose-500">♡</span>
                  </p>
                </div>
              </div>

              {/* Action to close or re-fold */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  id="refold-letter-button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-full border border-stone-400 text-stone-700 hover:bg-stone-200/50 text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer"
                >
                  Keep this close &amp; close letter
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
