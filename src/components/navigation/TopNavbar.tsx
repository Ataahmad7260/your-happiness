import React from 'react';
import { Heart, Sparkles, Bookmark, BookOpen } from 'lucide-react';
import { AmbientSoundBar } from '../common/AmbientSoundBar';
import type { MoodType } from '../../types';


interface TopNavbarProps {
  currentMood: MoodType | 'secret' | 'gate' | null;
  onGoHome: () => void;
  onOpenJar: () => void;
  onOpenLetter: () => void;
  onOpenSecret: () => void;
  onOpenKeepsakes: () => void;
  favoritesCount: number;
  inGate: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentMood,
  onGoHome,
  onOpenJar,
  onOpenLetter,
  onOpenSecret,
  onOpenKeepsakes,
  favoritesCount,
  inGate,
}) => {
  if (inGate) return null;

  return (
    <header className="relative z-40 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5 bg-[#0e101a]/70 backdrop-blur-md select-none transition-all duration-300">
      {/* Brand / Home Link */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="nav-home-button"
          onClick={onGoHome}
          className="flex items-center gap-2 group text-stone-200 hover:text-amber-100 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-amber-200/10 border border-amber-200/20 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-rose-300/30" />
          </div>
          <div className="text-left">
            <span className="font-editorial text-sm sm:text-base tracking-wide font-normal block leading-tight">
              A Little Place
            </span>
            <span className="font-sans text-[10px] text-stone-400 block tracking-widest uppercase">
              for your feelings
            </span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ambient Sound Controller */}
        <AmbientSoundBar currentMood={currentMood} />

        {/* The Happiness Jar Icon button */}
        <button
          type="button"
          id="nav-jar-button"
          onClick={onOpenJar}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 text-stone-300 hover:text-amber-200 text-xs font-sans transition-all cursor-pointer"
          title="Open Happiness Jar"
        >
          <span>🍯</span>
          <span className="font-editorial">Jar</span>
        </button>

        {/* Letter For You */}
        <button
          type="button"
          id="nav-letter-button"
          onClick={onOpenLetter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 text-stone-300 hover:text-amber-200 text-xs font-sans transition-all cursor-pointer"
          title="Read the Letter For You"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-200/80" />
          <span className="font-editorial hidden sm:inline">Letter</span>
        </button>

        {/* Keepsakes with Bookmark badge */}
        <button
          type="button"
          id="nav-keepsakes-button"
          onClick={onOpenKeepsakes}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 text-stone-300 hover:text-amber-200 text-xs font-sans transition-all cursor-pointer"
          title="View your saved keepsakes"
        >
          <Bookmark className="w-3.5 h-3.5 text-rose-300/80" />
          <span className="font-editorial hidden sm:inline">Keepsakes</span>
          {favoritesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Secret Garden Whispered Link */}
        <button
          type="button"
          id="nav-secret-button"
          onClick={onOpenSecret}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/40 text-indigo-200 text-xs font-sans transition-all cursor-pointer"
          title="Discover the Secret Garden"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-handwriting text-sm hidden md:inline">Psst...</span>
        </button>
      </div>
    </header>
  );
};
