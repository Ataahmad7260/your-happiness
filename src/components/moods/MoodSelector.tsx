import React from 'react';
import { motion } from 'framer-motion';
import type { MoodType, MoodConfig } from '../../types';
import { Sparkles, Heart } from 'lucide-react';

import { soundEngine } from '../../audio/soundEngine';

interface MoodSelectorProps {
  onSelectMood: (mood: MoodType) => void;
  onOpenJar: () => void;
  onOpenLetter: () => void;
  onOpenSecret: () => void;
  onOpenFarewell: () => void;
  onOpenKeepsakes: () => void;
  favoritesCount: number;
}

const MOODS: MoodConfig[] = [
  {
    id: 'happy',
    name: 'Happy',
    subtitle: 'Golden afternoon & floating dandelions',
    emoji: '☀️',
    soundName: 'Meadow Breeze',
    themeColor: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      accent: '#d97706',
      bgGradient: 'from-amber-900/30 via-orange-950/20 to-stone-900/40',
      cardBorder: 'hover:border-amber-400/60',
    },
    openingMessage: 'Oh, look at you. The world seems a little brighter today.',
  },
  {
    id: 'sad',
    name: 'Sad',
    subtitle: 'A cozy room during a rainy evening',
    emoji: '🌧️',
    soundName: 'Rain on Window',
    themeColor: {
      primary: '#38bdf8',
      secondary: '#e0f2fe',
      accent: '#0284c7',
      bgGradient: 'from-sky-950/30 via-slate-900/30 to-stone-900/40',
      cardBorder: 'hover:border-sky-400/60',
    },
    openingMessage: "Hey, it's okay. You don't have to be sunshine every day.",
  },
  {
    id: 'tired',
    name: 'Tired',
    subtitle: 'A peaceful midnight bedroom & breathing moon',
    emoji: '🌙',
    soundName: 'Felt Piano',
    themeColor: {
      primary: '#a78bfa',
      secondary: '#f5f3ff',
      accent: '#7c3aed',
      bgGradient: 'from-indigo-950/30 via-slate-950/30 to-stone-900/40',
      cardBorder: 'hover:border-indigo-400/60',
    },
    openingMessage: "You've done enough for today. Even the stars take their time to shine.",
  },
  {
    id: 'overthinking',
    name: 'Overthinking',
    subtitle: 'Floating above the clouds in a lavender sky',
    emoji: '☁️',
    soundName: 'Celestial Drone',
    themeColor: {
      primary: '#c084fc',
      secondary: '#faf5ff',
      accent: '#9333ea',
      bgGradient: 'from-purple-950/30 via-fuchsia-950/20 to-stone-900/40',
      cardBorder: 'hover:border-purple-400/60',
    },
    openingMessage: "Your mind has been travelling a lot, hasn't it?",
  },
  {
    id: 'dont-know',
    name: "I Don't Know",
    subtitle: 'A quiet twilight lake with gentle ripples',
    emoji: '♡',
    soundName: 'Twilight Lake',
    themeColor: {
      primary: '#2dd4bf',
      secondary: '#f0fdfa',
      accent: '#0d9488',
      bgGradient: 'from-teal-950/30 via-cyan-950/20 to-stone-900/40',
      cardBorder: 'hover:border-teal-400/60',
    },
    openingMessage: "That's alright. You don't always need a name for what you're feeling.",
  },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  onSelectMood,
  onOpenJar,
  onOpenLetter,
  onOpenSecret,
  onOpenFarewell,
  onOpenKeepsakes,
  favoritesCount,
}) => {
  const handleCardClick = (mood: MoodType) => {
    soundEngine.playSoftBell();
    onSelectMood(mood);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#0c0d16] via-[#121422] to-[#181a2b] text-[#f2efe9] overflow-hidden select-none">
      {/* Background ambient color spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-900/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center py-6 px-2 sm:px-4">
        {/* Main Headings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-2xl mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs font-serif uppercase tracking-widest mb-4">
            <span>A Little Sanctuary</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-100 tracking-wide mb-3">
            How is your little world today?
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-stone-300/80 font-light max-w-md mx-auto leading-relaxed">
            You don't have to explain anything. Just pick whatever feels closest.
          </p>
        </motion.div>

        {/* 5 Illustrated Mood Choice Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
          {MOODS.map((mood, idx) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => handleCardClick(mood.id)}
              className={`group relative cursor-pointer rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${mood.themeColor.bgGradient} bg-stone-900/50 backdrop-blur-md border border-stone-800/80 ${mood.themeColor.cardBorder} shadow-lg transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
              role="button"
              tabIndex={0}
              id={`mood-card-${mood.id}`}
              aria-label={`Enter ${mood.name} world`}
            >
              {/* Subtle Card Background Glow */}
              <div
                style={{ backgroundColor: mood.themeColor.primary }}
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500"
              />

              {/* Card Header with Icon & Name */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-115 transition-transform duration-300">
                    {mood.emoji}
                  </span>
                  <span
                    style={{ color: mood.themeColor.primary }}
                    className="text-[11px] font-sans uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10"
                  >
                    {mood.name}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl font-normal text-stone-100 mb-1 group-hover:text-amber-100 transition-colors">
                  {mood.name}
                </h3>

                <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed mb-6">
                  {mood.subtitle}
                </p>
              </div>

              {/* Card Footer prompt */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-stone-400 group-hover:text-amber-200 transition-colors">
                <span className="font-editorial text-xs">Enter this world</span>
                <span className="font-handwriting text-base transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </motion.div>
          ))}

          {/* 6th Complementary Card: The Happiness Jar Quick Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={onOpenJar}
            className="group relative cursor-pointer rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-950/20 via-stone-900/50 to-stone-900/60 backdrop-blur-md border border-stone-800/80 hover:border-amber-400/50 shadow-lg transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            role="button"
            tabIndex={0}
            id="open-jar-card"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform duration-300">
                  🍯
                </span>
                <span className="text-[11px] font-sans uppercase tracking-widest text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-300/20">
                  35 Notes Inside
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-normal text-stone-100 mb-1 group-hover:text-amber-200 transition-colors">
                The Happiness Jar
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed mb-6">
                Folded origami notes with poems, quiet thoughts, compliments, and silly jokes.
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-stone-400 group-hover:text-amber-200 transition-colors">
              <span className="font-editorial text-xs">Draw a note</span>
              <span className="font-handwriting text-base transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Interactive Anchors */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
          {/* A Letter For You */}
          <button
            type="button"
            id="open-letter-button"
            onClick={onOpenLetter}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/70 hover:bg-stone-800 border border-stone-700/60 text-stone-200 hover:text-amber-100 transition-all cursor-pointer backdrop-blur-md shadow-xs"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
            <span>A Letter For You</span>
          </button>

          {/* Keepsakes */}
          <button
            type="button"
            id="open-keepsakes-button"
            onClick={onOpenKeepsakes}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/70 hover:bg-stone-800 border border-stone-700/60 text-stone-200 hover:text-amber-100 transition-all cursor-pointer backdrop-blur-md shadow-xs"
          >
            <span>My Keepsakes</span>
            {favoritesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 text-[11px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Secret Garden Invitation */}
          <button
            type="button"
            id="open-secret-garden-button"
            onClick={onOpenSecret}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-200 hover:text-amber-200 transition-all cursor-pointer backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
            <span className="font-handwriting text-base">Psst... there's something else</span>
          </button>

          {/* Farewell Screen */}
          <button
            type="button"
            id="open-farewell-button"
            onClick={onOpenFarewell}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/50 hover:bg-stone-800/60 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-all cursor-pointer"
          >
            <span>Before you go...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
