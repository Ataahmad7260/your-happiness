import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookmarkCheck, Trash2, Lock } from 'lucide-react';
import { HAPPINESS_NOTES } from '../../data/happinessNotes';
import type { SavedThought } from '../../types';


interface KeepsakesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onRemoveFavorite: (id: string) => void;
  savedThoughts: SavedThought[];
  onDeleteThought: (id: string) => void;
}

export const KeepsakesModal: React.FC<KeepsakesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  savedThoughts,
  onDeleteThought,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'thoughts'>('notes');

  if (!isOpen) return null;

  const favoriteNotesList = HAPPINESS_NOTES.filter((n) => favorites.includes(n.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl bg-parchment text-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/80 max-h-[85vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-300">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-500 font-editorial">
                <BookmarkCheck className="w-4 h-4 text-rose-500" />
                <span>Personal Keepsakes</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-light text-stone-900 mt-0.5">
                Things You've Saved ♡
              </h3>
            </div>

            <button
              type="button"
              id="close-keepsakes-modal"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Close keepsakes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 my-4">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-editorial tracking-wide transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-stone-900 text-amber-50 shadow-sm'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Saved Notes ({favoriteNotesList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('thoughts')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-editorial tracking-wide transition-all cursor-pointer ${
                activeTab === 'thoughts'
                  ? 'bg-stone-900 text-amber-50 shadow-sm'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Private Journal Thoughts ({savedThoughts.length})
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activeTab === 'notes' ? (
              favoriteNotesList.length === 0 ? (
                <div className="text-center py-12 text-stone-500 font-light">
                  <p className="font-editorial text-lg mb-1">Your jar pocket is empty right now.</p>
                  <p className="text-xs">
                    When you draw a note from the Happiness Jar, tap "Keep" to save it here.
                  </p>
                </div>
              ) : (
                favoriteNotesList.map((note) => (
                  <div
                    key={note.id}
                    style={{ backgroundColor: note.paperColor }}
                    className="p-5 rounded-2xl border border-stone-300/70 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{ color: note.accentColor, borderColor: note.accentColor }}
                        className="text-[11px] font-editorial uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/70 font-medium"
                      >
                        {note.categoryLabel}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemoveFavorite(note.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-full transition-colors cursor-pointer"
                        title="Remove from keepsakes"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-editorial text-base sm:text-lg text-stone-900 leading-relaxed whitespace-pre-line my-1">
                      "{note.text}"
                    </p>

                    {note.subtext && (
                      <p className="font-handwriting text-base text-stone-600 mt-2">
                        — {note.subtext}
                      </p>
                    )}
                  </div>
                ))
              )
            ) : savedThoughts.length === 0 ? (
              <div className="text-center py-12 text-stone-500 font-light">
                <p className="font-editorial text-lg mb-1">No private thoughts saved yet.</p>
                <p className="text-xs">
                  In the Overthinking world, you can write thoughts and choose "Save Privately".
                </p>
              </div>
            ) : (
              savedThoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="p-5 rounded-2xl bg-[#f0e8db] border border-stone-300 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-sans text-stone-500 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-stone-400" />
                      Saved on {thought.createdAt} (local only)
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteThought(thought.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-full transition-colors cursor-pointer"
                      title="Delete saved thought"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-editorial text-base text-stone-900 leading-relaxed italic">
                    "{thought.text}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-stone-300 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-stone-900 text-stone-100 text-xs font-sans tracking-wide hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Close Keepsakes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
