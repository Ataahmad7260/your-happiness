import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MoodType, SavedThought } from './types';
import { soundEngine } from './audio/soundEngine';
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import { BackgroundCanvas } from './components/common/BackgroundCanvas';
import { TopNavbar } from './components/navigation/TopNavbar';
import { OpeningGate } from './components/opening/OpeningGate';
import { MoodSelector } from './components/moods/MoodSelector';
import { HappyWorld } from './components/moods/HappyWorld';
import { SadWorld } from './components/moods/SadWorld';
import { TiredWorld } from './components/moods/TiredWorld';
import { OverthinkingWorld } from './components/moods/OverthinkingWorld';
import { DontKnowWorld } from './components/moods/DontKnowWorld';
import { SecretGarden } from './components/special/SecretGarden';
import { HappinessJar } from './components/special/HappinessJar';
import { LetterModal } from './components/common/LetterModal';
import { KeepsakesModal } from './components/common/KeepsakesModal';
import { FarewellModal } from './components/common/FarewellModal';
import { X } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<
    'gate' | 'selector' | MoodType | 'secret'
  >('gate');

  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isJarModalOpen, setIsJarModalOpen] = useState(false);
  const [isKeepsakesOpen, setIsKeepsakesOpen] = useState(false);
  const [isFarewellOpen, setIsFarewellOpen] = useState(false);

  // Persistent user state
  const [favorites, setFavorites] = useLocalStorage<string[]>('keepsake_favorites', []);
  const [savedThoughts, setSavedThoughts] = useLocalStorage<SavedThought[]>(
    'private_journal_thoughts',
    []
  );
  const [discoveredSecrets, setDiscoveredSecrets] = useLocalStorage<number[]>(
    'secret_garden_discovered',
    []
  );

  // Update sound engine on view changes
  useEffect(() => {
    if (currentView === 'gate') {
      soundEngine.playMood('gate');
    } else if (currentView === 'secret') {
      soundEngine.playMood('secret');
    } else if (
      currentView === 'happy' ||
      currentView === 'sad' ||
      currentView === 'tired' ||
      currentView === 'overthinking' ||
      currentView === 'dont-know'
    ) {
      soundEngine.playMood(currentView);
    } else {
      soundEngine.playMood('gate');
    }
  }, [currentView]);

  const handleEnterFromGate = () => {
    setCurrentView('selector');
  };

  const handleSelectMood = (mood: MoodType) => {
    setCurrentView(mood);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveThought = (thought: SavedThought) => {
    setSavedThoughts((prev) => [thought, ...prev]);
  };

  const handleDeleteThought = (id: string) => {
    setSavedThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDiscoverSecret = (id: number) => {
    setDiscoveredSecrets((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Determine background canvas mood
  const canvasMood =
    currentView === 'gate'
      ? 'gate'
      : currentView === 'secret'
      ? 'secret'
      : currentView === 'selector'
      ? null
      : currentView;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#0b0c14] text-[#f2efe9] select-none">
      {/* Background canvas for atmospheric effects */}
      <BackgroundCanvas
        mood={canvasMood}
        interactiveRipples={currentView === 'dont-know'}
      />

      {/* Global Top Navigation Bar */}
      <TopNavbar
        currentMood={
          currentView === 'gate'
            ? 'gate'
            : currentView === 'secret'
            ? 'secret'
            : currentView === 'selector'
            ? null
            : currentView
        }
        onGoHome={() => setCurrentView('selector')}
        onOpenJar={() => setIsJarModalOpen(true)}
        onOpenLetter={() => setIsLetterOpen(true)}
        onOpenSecret={() => setCurrentView('secret')}
        onOpenKeepsakes={() => setIsKeepsakesOpen(true)}
        favoritesCount={favorites.length + savedThoughts.length}
        inGate={currentView === 'gate'}
      />

      {/* Main View Router with Framer Motion transitions */}
      <main className="relative flex-1 w-full flex flex-col z-10">
        <AnimatePresence mode="wait">
          {currentView === 'gate' && (
            <motion.div
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              className="w-full flex-1 flex flex-col"
            >
              <OpeningGate onEnter={handleEnterFromGate} />
            </motion.div>
          )}

          {currentView === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <MoodSelector
                onSelectMood={handleSelectMood}
                onOpenJar={() => setIsJarModalOpen(true)}
                onOpenLetter={() => setIsLetterOpen(true)}
                onOpenSecret={() => setCurrentView('secret')}
                onOpenFarewell={() => setIsFarewellOpen(true)}
                onOpenKeepsakes={() => setIsKeepsakesOpen(true)}
                favoritesCount={favorites.length}
              />
            </motion.div>
          )}

          {currentView === 'happy' && (
            <motion.div
              key="happy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <HappyWorld
                onBack={() => setCurrentView('selector')}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenLetter={() => setIsLetterOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'sad' && (
            <motion.div
              key="sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <SadWorld onBack={() => setCurrentView('selector')} />
            </motion.div>
          )}

          {currentView === 'tired' && (
            <motion.div
              key="tired"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <TiredWorld onBack={() => setCurrentView('selector')} />
            </motion.div>
          )}

          {currentView === 'overthinking' && (
            <motion.div
              key="overthinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <OverthinkingWorld
                onBack={() => setCurrentView('selector')}
                onSaveThought={handleSaveThought}
              />
            </motion.div>
          )}

          {currentView === 'dont-know' && (
            <motion.div
              key="dont-know"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col"
            >
              <DontKnowWorld onBack={() => setCurrentView('selector')} />
            </motion.div>
          )}

          {currentView === 'secret' && (
            <motion.div
              key="secret"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full flex-1 flex flex-col"
            >
              <SecretGarden
                onBack={() => setCurrentView('selector')}
                discoveredIds={discoveredSecrets}
                onDiscover={handleDiscoverSecret}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Modal: The Happiness Jar (when opened from navigation) */}
      <AnimatePresence>
        {isJarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsJarModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 w-full max-w-lg bg-[#141624] border border-amber-300/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-stone-200"
            >
              <button
                type="button"
                id="close-jar-modal"
                onClick={() => setIsJarModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900/60 border border-stone-800 transition-colors cursor-pointer"
                aria-label="Close jar"
              >
                <X className="w-5 h-5" />
              </button>

              <HappinessJar
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: A Letter For You */}
      <LetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />

      {/* Modal: My Keepsakes */}
      <KeepsakesModal
        isOpen={isKeepsakesOpen}
        onClose={() => setIsKeepsakesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        savedThoughts={savedThoughts}
        onDeleteThought={handleDeleteThought}
      />

      {/* Modal: Before You Go Farewell */}
      <FarewellModal
        isOpen={isFarewellOpen}
        onClose={() => setIsFarewellOpen(false)}
        onVisitAnotherWorld={() => {
          setIsFarewellOpen(false);
          setCurrentView('selector');
        }}
      />
    </div>
  );
}

export default App;
