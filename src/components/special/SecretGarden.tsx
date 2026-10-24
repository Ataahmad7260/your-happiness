import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { SECRET_GARDEN_ITEMS } from '../../data/secretMessages';
import type { SecretItem } from '../../types';
import { soundEngine } from '../../audio/soundEngine';


interface SecretGardenProps {
  onBack: () => void;
  discoveredIds: number[];
  onDiscover: (id: number) => void;
}

export const SecretGarden: React.FC<SecretGardenProps> = ({
  onBack,
  discoveredIds,
  onDiscover,
}) => {
  const [selectedItem, setSelectedItem] = useState<SecretItem | null>(null);

  const handleFlowerClick = (item: SecretItem) => {
    soundEngine.playBloomChime();
    onDiscover(item.id);
    setSelectedItem(item);
  };

  const allDiscovered = SECRET_GARDEN_ITEMS.every((item) =>
    discoveredIds.includes(item.id)
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#090b14] via-[#0f1424] to-[#121c2e] text-[#f0ede6] overflow-hidden select-none">
      {/* Garden Header */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          type="button"
          id="exit-secret-garden"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-700/60 text-stone-300 hover:text-white text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to the Little World
        </button>

        {/* Discovery Counter */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-editorial backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            Treasures Discovered: {discoveredIds.length} / {SECRET_GARDEN_ITEMS.length}
          </span>
        </div>
      </div>

      {/* Title & Whispered Instruction */}
      <div className="relative z-20 text-center max-w-lg mx-auto mt-4 px-4">
        <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-amber-50 font-light tracking-wide mb-2">
          The Secret Night Garden
        </h2>
        <p className="text-xs sm:text-sm text-stone-300/80 font-light font-sans">
          Fireflies guide your steps. Five quiet blossoms are resting in the dark, waiting for your touch.
        </p>
      </div>

      {/* All Discovered Celebration Banner */}
      <AnimatePresence>
        {allDiscovered && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-30 max-w-xl mx-auto w-full my-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-300/50 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.25)] text-center"
          >
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs uppercase tracking-widest font-sans mb-1 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All five blossoms found
            </div>
            <p className="font-handwriting text-2xl sm:text-3xl text-amber-100 font-normal">
              "See? Even the smallest things can hold something beautiful." ♡
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Garden Canvas Scenery */}
      <div className="relative w-full max-w-5xl mx-auto h-[480px] sm:h-[540px] my-auto rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#0a0d1a]/80 via-[#111728]/70 to-[#0e1624]/90 shadow-2xl overflow-hidden">
        {/* Night Garden Atmosphere & Illustrated Pond */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Moon Reflection in Pond */}
          <div className="absolute left-[30%] sm:left-[35%] bottom-16 w-52 sm:w-72 h-24 rounded-[100%] bg-gradient-to-r from-cyan-900/30 via-sky-800/20 to-cyan-900/30 border-t border-sky-400/20 shadow-[0_0_30px_rgba(56,189,248,0.15)] flex items-center justify-center">
            <div className="w-12 h-6 rounded-full bg-amber-100/20 blur-sm animate-pulse-glow" />
          </div>

          {/* Silhouette Grass Tuft lines */}
          <svg
            viewBox="0 0 1000 200"
            className="absolute bottom-0 w-full h-32 text-[#080d17]"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,200 L1000,200 L1000,100 C850,130 750,70 600,110 C450,150 300,80 150,120 C80,140 0,110 0,200 Z" />
          </svg>
        </div>

        {/* 5 Discoverable Flowers */}
        {SECRET_GARDEN_ITEMS.map((item) => {
          const isDiscovered = discoveredIds.includes(item.id);

          return (
            <div
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                type="button"
                id={`secret-flower-${item.id}`}
                onClick={() => handleFlowerClick(item)}
                className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                aria-label={`Inspect ${item.name}`}
              >
                {/* Glow ring */}
                <div
                  className={`absolute -inset-4 rounded-full transition-all duration-700 blur-md ${
                    isDiscovered
                      ? 'bg-amber-300/30 scale-125'
                      : 'bg-indigo-400/20 group-hover:bg-amber-300/40 group-hover:scale-125 animate-pulse-glow'
                  }`}
                />

                {/* Flower SVG based on type */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-500 transform ${
                    isDiscovered ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {item.flowerType === 'bellflower' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <path
                        d="M50 20 C30 20 25 50 20 70 C40 85 60 85 80 70 C75 50 70 20 50 20 Z"
                        fill={isDiscovered ? '#93c5fd' : '#60a5fa'}
                        stroke="#bfdbfe"
                        strokeWidth="2"
                      />
                      <circle cx="50" cy="55" r="5" fill="#fef08a" />
                    </svg>
                  )}

                  {item.flowerType === 'moonflower' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <circle cx="50" cy="50" r="28" fill={isDiscovered ? '#f8fafc' : '#e2e8f0'} />
                      <circle cx="50" cy="50" r="14" fill="#fef08a" />
                      <circle cx="50" cy="50" r="36" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                    </svg>
                  )}

                  {item.flowerType === 'dandelion' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <circle cx="50" cy="50" r="12" fill="#f59e0b" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={50 + 26 * Math.cos((i * Math.PI) / 6)}
                          y2={50 + 26 * Math.sin((i * Math.PI) / 6)}
                          stroke="#fde68a"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                  )}

                  {item.flowerType === 'waterlily' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <ellipse cx="50" cy="68" rx="38" ry="14" fill="#065f46" opacity="0.6" />
                      <path
                        d="M50 30 C40 45 35 60 50 68 C65 60 60 45 50 30 Z"
                        fill="#f472b6"
                      />
                      <path
                        d="M36 44 C30 54 36 64 50 68 C44 60 40 50 36 44 Z"
                        fill="#fbcfe8"
                      />
                      <path
                        d="M64 44 C70 54 64 64 50 68 C56 60 60 50 64 44 Z"
                        fill="#fbcfe8"
                      />
                      <circle cx="50" cy="58" r="4" fill="#fef08a" />
                    </svg>
                  )}

                  {item.flowerType === 'nightblossom' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      {[0, 72, 144, 216, 288].map((deg, i) => (
                        <circle
                          key={i}
                          cx={50 + 16 * Math.cos((deg * Math.PI) / 180)}
                          cy={50 + 16 * Math.sin((deg * Math.PI) / 180)}
                          r="12"
                          fill={isDiscovered ? '#e879f9' : '#c084fc'}
                          opacity="0.85"
                        />
                      ))}
                      <circle cx="50" cy="50" r="7" fill="#fef9c3" />
                    </svg>
                  )}
                </div>

                {/* Subtle Name Tag */}
                <span
                  className={`mt-1 font-editorial text-[11px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
                    isDiscovered
                      ? 'bg-amber-100/10 text-amber-200 border-amber-300/40'
                      : 'bg-black/40 text-stone-300 border-stone-700/50 group-hover:border-amber-300/50'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* DISCOVERED ITEM MODAL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedItem(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-lg bg-parchment text-stone-800 rounded-2xl p-7 sm:p-9 shadow-2xl border border-amber-200/80 my-auto"
            >
              <button
                type="button"
                id="close-flower-modal"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 p-1.5 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
                aria-label="Close message"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="font-editorial text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/60">
                  {selectedItem.name}
                </span>
                <span className="text-xs text-stone-400 font-sans">
                  Secret #{selectedItem.id}
                </span>
              </div>

              <h3 className="font-editorial text-xl sm:text-2xl text-stone-900 leading-snug font-normal mb-3">
                "{selectedItem.message}"
              </h3>

              <div className="pt-2 border-t border-stone-200 text-stone-700 text-sm sm:text-base leading-relaxed font-sans font-light">
                <p>{selectedItem.reflection}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  id="keep-wandering-button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-50 text-xs font-sans tracking-wide transition-colors cursor-pointer"
                >
                  Keep Wandering
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
