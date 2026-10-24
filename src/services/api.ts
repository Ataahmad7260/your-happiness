// Data layer service abstraction ready for MongoDB + Express integration
import type { SavedThought } from '../types';


const API_BASE_URL = import.meta.env.VITE_API_URL || null;

export const apiService = {
  // --- Favorites & Keepsakes ---
  async getFavorites(): Promise<string[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/favorites`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to local storage', err);
      }
    }
    const raw = localStorage.getItem('keepsake_favorites');
    return raw ? JSON.parse(raw) : [];
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    localStorage.setItem('keepsake_favorites', JSON.stringify(favorites));
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites }),
        });
      } catch (err) {
        console.warn('Backend sync failed', err);
      }
    }
  },

  // --- Private Thoughts (Stored locally by default for privacy) ---
  async getSavedThoughts(): Promise<SavedThought[]> {
    const raw = localStorage.getItem('private_journal_thoughts');
    return raw ? JSON.parse(raw) : [];
  },

  async saveThought(thought: SavedThought): Promise<void> {
    const raw = localStorage.getItem('private_journal_thoughts');
    const list: SavedThought[] = raw ? JSON.parse(raw) : [];
    const updated = [thought, ...list];
    localStorage.setItem('private_journal_thoughts', JSON.stringify(updated));
  },

  async deleteThought(id: string): Promise<void> {
    const raw = localStorage.getItem('private_journal_thoughts');
    if (!raw) return;
    const list: SavedThought[] = JSON.parse(raw);
    const updated = list.filter((t) => t.id !== id);
    localStorage.setItem('private_journal_thoughts', JSON.stringify(updated));
  },

  // --- Secret Garden Discoveries ---
  async getDiscoveredSecrets(): Promise<number[]> {
    const raw = localStorage.getItem('secret_garden_discovered');
    return raw ? JSON.parse(raw) : [];
  },

  async saveDiscoveredSecrets(ids: number[]): Promise<void> {
    localStorage.setItem('secret_garden_discovered', JSON.stringify(ids));
  },
};
