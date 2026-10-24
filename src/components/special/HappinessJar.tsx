import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bookmark, BookmarkCheck, RefreshCw } from 'lucide-react';
import { HAPPINESS_NOTES } from '../../data/happinessNotes';
import type { HappinessNote } from '../../types';
import { soundEngine } from '../../audio/soundEngine';

interface HappinessJarProps {
  isOpen?: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const HappinessJar: React.FC<HappinessJarProps> = ({
  isOpen = true,
  favorites,
  onToggleFavorite,
}) => {

  const [currentNote, setCurrentNote] = useState<HappinessNote | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawnIndex, setLastDrawnIndex] = useState<number>(-1);

  const drawNote = () => {
    setIsDrawing(true);
    soundEngine.playPaperRustle();

    setTimeout(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * HAPPINESS_NOTES.length);
      } while (nextIndex === lastDrawnIndex && HAPPINESS_NOTES.length > 1);

      setLastDrawnIndex(nextIndex);
      setCurrentNote(HAPPINESS_NOTES[nextIndex]);
      setIsDrawing(false);
    }, 450);
  };

  const handleToggleFav = (noteId: string) => {
    soundEngine.playSoftBell();
    onToggleFavorite(noteId);
  };

  if (!isOpen) return null;

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Jar Container / Illustration */}
      {!currentNote ? (
        <div className="flex flex-col items-center text-center p-6 sm:p-8">
          {/* Glass Jar Graphic */}
          <div
            onClick={drawNote}
            className="group relative cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-105"
            role="button"
            tabIndex={0}
            aria-label="Draw a folded note from the Happiness Jar"
          >
            {/* Ethereal Glow behind Jar */}
            <div className="absolute inset-0 bg-amber-300/15 rounded-full blur-2xl group-hover:bg-amber-300/25 transition-all duration-500 -z-10" />

            {/* Cork Lid */}
            <div className="w-24 sm:w-28 h-6 bg-[#b58855] rounded-t-md shadow-md border-b-2 border-[#8c5e31] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {/* String / Twine */}
              <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-28 sm:w-32 h-2.5 border-y border-[#785128] bg-[#9a6f3b] flex items-center justify-center">
                <span className="text-[9px] text-amber-100 font-serif uppercase tracking-widest">
                  Twine
                </span>
              </div>
            </div>

            {/* Glass Jar Body */}
            <div className="relative w-44 sm:w-52 h-56 sm:h-64 rounded-b-[40px] rounded-t-[10px] border-2 border-white/40 bg-gradient-to-b from-white/10 via-amber-100/5 to-white/15 backdrop-blur-sm shadow-[0_15px_35px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col justify-end p-4">
              {/* Glass Reflections */}
              <div className="absolute top-2 left-3 w-3 h-48 bg-white/20 rounded-full blur-[1px]" />
              <div className="absolute top-4 right-3 w-1.5 h-36 bg-white/15 rounded-full blur-[1px]" />

              {/* Inside: Tiny Folded Origami Notes */}
              <div className="relative w-full h-40 flex flex-wrap gap-2 items-end justify-center pb-2 select-none pointer-events-none">
                {[
                  { color: '#fef3c7', rot: '-12deg', label: 'note' },
                  { color: '#ecfdf5', rot: '18deg', label: 'note' },
                  { color: '#fdf2f8', rot: '-6deg', label: 'note' },
                  { color: '#eef2ff', rot: '24deg', label: 'note' },
                  { color: '#fff7ed', rot: '-18deg', label: 'note' },
                  { color: '#faf5ff', rot: '8deg', label: 'note' },
                  { color: '#f0fdfa', rot: '-15deg', label: 'note' },
                  { color: '#fff1f2', rot: '14deg', label: 'note' },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: n.color,
                      transform: `rotate(${n.rot})`,
                    }}
                    className="w-8 h-6 sm:w-9 sm:h-7 rounded-sm shadow-sm border border-black/10 flex items-center justify-center animate-pulse-glow"
                  >
                    <div className="w-5 h-[1px] bg-black/15" />
                  </div>
                ))}
              </div>

              {/* Jar Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-[#f9f5eb]/90 text-stone-800 rounded-md border border-[#d8cdb8] shadow-sm text-center w-32">
                <span className="font-editorial text-xs tracking-wider uppercase text-stone-600 block">
                  The Little
                </span>
                <span className="font-handwriting text-lg text-amber-900 font-bold block">
                  Happiness Jar
                </span>
              </div>
            </div>
          </div>

          {/* Description & Tap to Open */}
          <div className="mt-6 space-y-2">
            <h4 className="font-editorial text-xl sm:text-2xl text-amber-100 font-light">
              Filled with 35 folded paper notes
            </h4>
            <p className="text-sm text-stone-300 font-light max-w-sm mx-auto">
              Tiny poems, gentle reminders, silly jokes, and quiet compliments waiting for you.
            </p>
            <div className="pt-3">
              <button
                type="button"
                id="draw-note-button"
                onClick={drawNote}
                disabled={isDrawing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-200/20 hover:bg-amber-200/30 border border-amber-300/40 text-amber-100 text-sm font-editorial tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isDrawing ? 'Unfolding note...' : 'Draw a Note ♡'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* UNFOLDED NOTE DISPLAY */
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: currentNote.paperColor }}
          className="relative w-full max-w-md text-stone-800 rounded-2xl p-7 sm:p-9 shadow-2xl border border-stone-300/70 overflow-hidden my-4"
        >
          {/* Subtle paper fold line watermark */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-black/5 pointer-events-none" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/5 pointer-events-none" />

          {/* Header with Category Badge and Favorite Toggle */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <span
              style={{
                borderColor: currentNote.accentColor,
                color: currentNote.accentColor,
              }}
              className="font-editorial text-xs font-semibold px-3 py-1 rounded-full border tracking-wide uppercase bg-white/60"
            >
              {currentNote.categoryLabel}
            </span>

            <button
              type="button"
              id={`fav-note-${currentNote.id}`}
              onClick={() => handleToggleFav(currentNote.id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 text-xs font-sans transition-all duration-200 shadow-xs cursor-pointer"
              title={
                favorites.includes(currentNote.id)
                  ? 'Saved in your keepsakes'
                  : 'Save to keepsakes'
              }
            >
              {favorites.includes(currentNote.id) ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-rose-600 font-medium">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-stone-400" />
                  <span>Keep</span>
                </>
              )}
            </button>
          </div>

          {/* Note Main Text */}
          <div className="my-6 relative z-10 min-h-[110px] flex flex-col justify-center">
            <p className="font-editorial text-lg sm:text-xl text-stone-900 leading-relaxed font-normal whitespace-pre-line">
              "{currentNote.text}"
            </p>

            {currentNote.subtext && (
              <p className="font-handwriting text-lg text-stone-600 mt-4 leading-snug">
                — {currentNote.subtext}
              </p>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-black/10 relative z-10">
            <button
              type="button"
              id="put-note-back-button"
              onClick={() => setCurrentNote(null)}
              className="text-xs text-stone-500 hover:text-stone-800 font-sans tracking-wide transition-colors cursor-pointer"
            >
              Put back in jar
            </button>

            <button
              type="button"
              id="draw-another-note-button"
              onClick={drawNote}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 text-amber-50 hover:bg-stone-800 text-xs font-sans font-medium transition-all duration-200 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Draw Another Note
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
