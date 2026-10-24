import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, Feather, ArrowLeft, Heart } from 'lucide-react';

import { HappinessJar } from '../special/HappinessJar';
import { soundEngine } from '../../audio/soundEngine';

interface HappyWorldProps {
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenLetter: () => void;
}

interface Butterfly {
  id: number;
  startX: number;
  startY: number;
  color: string;
  delay: number;
}

export const HappyWorld: React.FC<HappyWorldProps> = ({
  onBack,
  favorites,
  onToggleFavorite,
  onOpenLetter,
}) => {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [activePoemIdx, setActivePoemIdx] = useState(0);

  const upliftingPoems = [
    {
      title: 'Afternoon Sunbeam',
      lines: [
        'The sun sits warm upon your sleeve,',
        'a golden promise you believe,',
        'the afternoon without a sound,',
        'where little miracles are found.',
      ],
      author: 'For a golden day',
    },
    {
      title: 'Pocketful of Laughter',
      lines: [
        'Hold the good things like a shell,',
        'listen close and listen well,',
        'the ocean of your happy heart',
        'was singing from the very start.',
      ],
      author: 'A little verse',
    },
    {
      title: 'Meadow Light',
      lines: [
        'Wildflowers dance because they please,',
        'in conversation with the breeze,',
        'and you, with light upon your face,',
        'have brought some sunshine to this place.',
      ],
      author: 'Quiet joy',
    },
  ];

  const handleReleaseButterflies = () => {
    soundEngine.playSoftBell();
    const colors = ['#f472b6', '#fbbf24', '#a78bfa', '#38bdf8', '#fb7185'];
    const newButterflies: Butterfly[] = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i,
      startX: 15 + Math.random() * 70,
      startY: 80 + Math.random() * 15,
      color: colors[i % colors.length],
      delay: i * 0.15,
    }));
    setButterflies((prev) => [...prev, ...newButterflies]);

    // Clean up after animation finishes
    setTimeout(() => {
      setButterflies((prev) =>
        prev.filter((b) => !newButterflies.some((nb) => nb.id === b.id))
      );
    }, 7500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#fefce8] via-[#fef3c7] to-[#fed7aa] text-stone-800 overflow-hidden select-none">
      {/* Warm Golden Sunlight Rays / Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      {/* Fluttering Animated Butterflies Layer */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {butterflies.map((b) => (
          <motion.div
            key={b.id}
            initial={{
              x: `${b.startX}vw`,
              y: `${b.startY}vh`,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: [
                `${b.startX}vw`,
                `${b.startX + (Math.random() * 25 - 10)}vw`,
                `${b.startX + (Math.random() * 40 - 20)}vw`,
                `${b.startX + (Math.random() * 50 - 15)}vw`,
              ],
              y: [
                `${b.startY}vh`,
                `${b.startY - 30}vh`,
                `${b.startY - 60}vh`,
                `-10vh`,
              ],
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.6, 1, 1.1, 0.8],
            }}
            transition={{
              duration: 6.5,
              delay: b.delay,
              ease: 'easeOut',
            }}
            className="absolute"
          >
            {/* SVG Fluttering Butterfly */}
            <motion.div
              animate={{ rotateY: [0, 65, 0, 65, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                <path
                  d="M50 50 C20 10 0 30 10 60 C20 80 45 65 50 55 C55 65 80 80 90 60 C100 30 80 10 50 50 Z"
                  fill={b.color}
                  opacity="0.85"
                />
                <circle cx="50" cy="50" r="3" fill="#451a03" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          type="button"
          id="back-from-happy"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-sans tracking-wide transition-all duration-200 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose another mood
        </button>

        <button
          type="button"
          onClick={onOpenLetter}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100/90 hover:bg-rose-200 border border-rose-300 text-rose-900 text-xs sm:text-sm font-editorial transition-all cursor-pointer shadow-xs"
        >
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
          A Letter For You
        </button>
      </div>

      {/* Main Content Hero */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-center py-6 px-4">
        {/* Mood Sun Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200/70 border border-amber-300 text-amber-900 text-xs tracking-widest uppercase font-serif mb-4"
        >
          <Sun className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '20s' }} />
          Golden Afternoon
        </motion.div>

        {/* Opening Poetic Message */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="font-editorial text-3xl sm:text-4xl md:text-5xl text-amber-950 text-center font-normal tracking-wide max-w-2xl leading-tight mb-4"
        >
          "Oh, look at you.{' '}
          <span className="font-serif italic font-light block sm:inline">
            The world seems a little brighter today.
          </span>"
        </motion.h2>

        <p className="text-sm sm:text-base text-amber-900/80 text-center max-w-lg mb-8 font-light">
          I hope whatever made you smile today finds its way back to you tomorrow.
        </p>

        {/* Interactive Center: Release Butterflies & Happiness Jar */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-2">
          {/* Left Column: The Happiness Jar */}
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-amber-200/80 shadow-[0_10px_30px_rgba(251,191,36,0.1)] flex flex-col items-center">
            <HappinessJar
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          {/* Right Column: Butterfly Release + Uplifting Poetry */}
          <div className="flex flex-col gap-6">
            {/* Release Butterflies Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-[0_10px_30px_rgba(251,191,36,0.1)] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3 border border-amber-200">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-editorial text-2xl text-amber-950 font-normal mb-1">
                Release Butterflies
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light mb-5 max-w-xs">
                A flurry of colorful fluttering wings to share a little joy with the afternoon sky.
              </p>
              <button
                type="button"
                id="release-butterflies-button"
                onClick={handleReleaseButterflies}
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-editorial text-sm tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Release Joy</span>
                <span className="font-handwriting text-lg group-hover:rotate-12 transition-transform">
                  🦋
                </span>
              </button>
            </div>

            {/* Uplifting Poetry Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-[0_10px_30px_rgba(251,191,36,0.1)]">
              <div className="flex items-center justify-between mb-3 border-b border-amber-200/60 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-900 font-editorial uppercase tracking-wider">
                  <Feather className="w-3.5 h-3.5 text-amber-700" />
                  <span>{upliftingPoems[activePoemIdx].title}</span>
                </div>
                <div className="flex gap-1.5">
                  {upliftingPoems.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePoemIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activePoemIdx === idx
                          ? 'bg-amber-700 w-5'
                          : 'bg-amber-300 hover:bg-amber-400'
                      }`}
                      aria-label={`Poem ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="min-h-[96px] flex flex-col justify-center">
                {upliftingPoems[activePoemIdx].lines.map((line, i) => (
                  <p key={i} className="font-serif italic text-stone-800 text-sm sm:text-base leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              <p className="font-handwriting text-amber-800/80 text-base text-right mt-2">
                — {upliftingPoems[activePoemIdx].author}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Animated Meadow Foreground Silhouette */}
      <div className="w-full relative pointer-events-none mt-auto">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-16 sm:h-20 text-[#fde68a]/50"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C320,20, 640,90, 960,40 C1280,0, 1400,60, 1440,50 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};
