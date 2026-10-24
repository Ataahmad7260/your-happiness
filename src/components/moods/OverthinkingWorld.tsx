import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, ArrowLeft, Send, Lock, Sparkles, Check } from 'lucide-react';
import type { SavedThought } from '../../types';
import { soundEngine } from '../../audio/soundEngine';

interface OverthinkingWorldProps {
  onBack: () => void;
  onSaveThought: (thought: SavedThought) => void;
}

export const OverthinkingWorld: React.FC<OverthinkingWorldProps> = ({
  onBack,
  onSaveThought,
}) => {

  const [inputText, setInputText] = useState('');
  const [floatingThought, setFloatingThought] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [activeGroundingStep, setActiveGroundingStep] = useState<number>(0);

  const groundingSteps = [
    {
      count: '5',
      label: 'Things you can see',
      prompt: 'Notice the gentle lavender colors here, your screen, your hands, a shadow on the wall, the ceiling above you.',
    },
    {
      count: '4',
      label: 'Things you can feel',
      prompt: 'Feel the chair beneath you, the fabric of your clothes, the temperature of your skin, your feet touching the floor.',
    },
    {
      count: '3',
      label: 'Things you can hear',
      prompt: 'Listen to the quiet ambient music, the cadence of your own breathing, the soft distant hum of the world.',
    },
    {
      count: '2',
      label: 'Things you appreciate',
      prompt: 'Think of the taste of fresh water or tea, or the warmth of your favorite sweater.',
    },
    {
      count: '1',
      label: 'Thing about yourself',
      prompt: 'Remember one kind thing you did, or simply thank yourself for getting through today.',
    },
  ];

  const handleFloatAway = () => {
    if (!inputText.trim()) return;
    soundEngine.playSoftBell();
    setFloatingThought(inputText);
    setInputText('');

    setTimeout(() => {
      setFloatingThought(null);
    }, 4500);
  };

  const handleSavePrivately = () => {
    if (!inputText.trim()) return;
    soundEngine.playSoftBell();
    const newThought: SavedThought = {
      id: `thought-${Date.now()}`,
      text: inputText.trim(),
      createdAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    };
    onSaveThought(newThought);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#181226] via-[#241a3b] to-[#1c162e] text-stone-200 overflow-hidden select-none">
      {/* Floating Dissolving Thought Cloud Animation */}
      <AnimatePresence>
        {floatingThought && (
          <motion.div
            initial={{ opacity: 0, y: '50vh', scale: 0.8 }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              y: '-20vh',
              scale: [0.8, 1.05, 1.15, 1.3],
            }}
            transition={{ duration: 4.5, ease: 'easeOut' }}
            className="fixed inset-x-0 z-50 flex items-center justify-center pointer-events-none px-4"
          >
            <div className="relative max-w-md p-6 rounded-3xl bg-white/20 backdrop-blur-md border border-purple-200/50 shadow-[0_0_40px_rgba(216,180,254,0.4)] text-center">
              <span className="text-xs uppercase tracking-widest text-purple-200 font-sans block mb-1">
                Dissolving into the sky...
              </span>
              <p className="font-editorial text-xl sm:text-2xl text-purple-100 font-light italic">
                "{floatingThought}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          type="button"
          id="back-from-overthinking"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-purple-900/60 text-purple-200 text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose another mood
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-200 text-xs font-serif backdrop-blur-md">
          <Cloud className="w-3.5 h-3.5 text-purple-300" />
          <span>Lavender Sky Above the Clouds</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-center py-6 px-4">
        {/* Opening Poetic Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-xl mb-8"
        >
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-stone-100 font-light tracking-wide leading-tight mb-3">
            "Your mind has been travelling a lot,{' '}
            <span className="font-serif italic text-purple-200/90 block sm:inline">
              hasn't it?
            </span>"
          </h2>
          <p className="text-sm sm:text-base text-purple-200/70 font-light max-w-md mx-auto">
            Not every thought deserves a conclusion. Some are just passing clouds.
          </p>
        </motion.div>

        {/* Private Thought Journal Card */}
        <div className="w-full max-w-xl bg-purple-950/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-purple-800/40 shadow-xl flex flex-col items-center mb-8">
          <div className="w-full mb-3 flex items-center justify-between text-xs text-purple-300/80 font-sans">
            <span className="font-editorial uppercase tracking-wider">Private Journal</span>
            <span className="flex items-center gap-1 text-[11px] text-purple-300/60">
              <Lock className="w-3 h-3" />
              Kept only on your browser
            </span>
          </div>

          <textarea
            id="thought-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Write whatever is spinning in your head right now... let it out, no rush."
            className="w-full p-4 rounded-2xl bg-stone-900/60 border border-purple-700/40 text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 font-editorial text-base sm:text-lg resize-none leading-relaxed"
          />

          {/* Action Buttons */}
          <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              id="save-privately-button"
              onClick={handleSavePrivately}
              disabled={!inputText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-stone-900/60 hover:bg-stone-800 border border-purple-700/40 text-purple-200 text-xs font-sans tracking-wide transition-all disabled:opacity-40 cursor-pointer"
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved Privately</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-purple-300" />
                  <span>Save Privately</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="float-away-button"
              onClick={handleFloatAway}
              disabled={!inputText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-editorial text-sm tracking-wide shadow-md transition-all duration-300 disabled:opacity-40 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Let This Thought Float Away ☁️</span>
            </button>
          </div>
        </div>

        {/* 5-4-3-2-1 Sensory Grounding Section */}
        <div className="w-full max-w-xl bg-purple-950/20 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-purple-800/30 shadow-lg text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-editorial uppercase tracking-wider text-purple-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>5-4-3-2-1 Sensory Grounding</span>
          </div>

          <p className="text-xs text-purple-200/60 mb-4 font-light">
            When thoughts spin too fast, gently bring your attention back to your senses.
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            {groundingSteps.map((step, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveGroundingStep(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif transition-all cursor-pointer ${
                  activeGroundingStep === idx
                    ? 'bg-purple-400 text-purple-950 font-bold scale-110 shadow-md'
                    : 'bg-stone-900/60 border border-purple-800/40 text-purple-300 hover:bg-purple-900/40'
                }`}
              >
                {step.count}
              </button>
            ))}
          </div>

          <div className="min-h-[70px] flex flex-col justify-center px-4">
            <h4 className="font-editorial text-lg text-purple-100 font-medium mb-1">
              {groundingSteps[activeGroundingStep].count} — {groundingSteps[activeGroundingStep].label}
            </h4>
            <p className="font-serif italic text-sm text-purple-200/80 leading-relaxed font-light">
              "{groundingSteps[activeGroundingStep].prompt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
