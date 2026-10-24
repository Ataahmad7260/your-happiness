import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import type { MoodType } from '../../types';


interface AmbientSoundBarProps {
  currentMood: MoodType | 'secret' | 'gate' | null;
}

export const AmbientSoundBar: React.FC<AmbientSoundBarProps> = ({ currentMood }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [volume, setVolume] = useState(soundEngine.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    setIsMuted(soundEngine.getIsMuted());
  }, []);

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted && currentMood) {
      soundEngine.playMood(currentMood);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted && val > 0) {
      soundEngine.setMuted(false);
      setIsMuted(false);
    }
  };

  // Human-readable mood ambience description
  const getAmbienceLabel = () => {
    switch (currentMood) {
      case 'happy':
        return 'Meadow Breeze & Chimes';
      case 'sad':
        return 'Rain on Window';
      case 'tired':
        return 'Warm Felt Piano';
      case 'overthinking':
        return 'Lavender Celestial Drone';
      case 'dont-know':
        return 'Quiet Twilight Lake';
      case 'secret':
        return 'Enchanted Firefly Night';
      case 'gate':
        return 'Starlit Stillness';
      default:
        return 'Peaceful Ambience';
    }
  };

  return (
    <div
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/60 backdrop-blur-md border border-stone-700/50 text-stone-200 text-xs shadow-md transition-all duration-300"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <button
        type="button"
        id="audio-toggle-button"
        onClick={handleToggleMute}
        className="flex items-center gap-1.5 hover:text-amber-200 transition-colors cursor-pointer"
        title={isMuted ? 'Turn on gentle ambient sound' : 'Mute ambient sound'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-stone-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
        )}
        <span className="hidden sm:inline-block font-sans text-[11px] text-stone-300">
          {isMuted ? 'Sound Off' : getAmbienceLabel()}
        </span>
      </button>

      {/* Floating Volume Slider on Hover */}
      {showVolumeSlider && !isMuted && (
        <div className="flex items-center gap-1.5 pl-2 border-l border-stone-700/60 transition-all duration-300">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-amber-300 cursor-pointer bg-stone-700 rounded-lg appearance-none"
            title="Ambient volume"
          />
        </div>
      )}
    </div>
  );
};
