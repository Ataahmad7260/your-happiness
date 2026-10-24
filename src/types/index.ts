export type MoodType = 'happy' | 'sad' | 'tired' | 'overthinking' | 'dont-know';

export interface MoodConfig {
  id: MoodType;
  name: string;
  subtitle: string;
  emoji: string;
  themeColor: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string;
    cardBorder: string;
  };
  openingMessage: string;
  soundName: string;
}

export type NoteCategory = 'poem' | 'compliment' | 'reminder' | 'joke' | 'thought' | 'surprise';

export interface HappinessNote {
  id: string;
  category: NoteCategory;
  categoryLabel: string;
  text: string;
  subtext?: string;
  accentColor: string;
  paperColor: string;
}

export interface SavedThought {
  id: string;
  text: string;
  createdAt: string;
  theme?: string;
}

export interface SecretItem {
  id: number;
  name: string;
  x: number; // percentage
  y: number; // percentage
  discovered: boolean;
  message: string;
  reflection: string;
  flowerType: 'bellflower' | 'moonflower' | 'dandelion' | 'waterlily' | 'nightblossom';
}

export interface AudioTrackInfo {
  mood: MoodType | 'secret' | 'gate' | null;
  label: string;
  description: string;
}
