// Bento Card Types
export type CardType = 'profile' | 'social' | 'media' | 'map' | 'github' | 'text' | 'link' | 'title';

export type CardSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1' | '4x1' | '3x2' | '4x2';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;  // in grid units (1-4)
  height: number; // in grid units (1-2)
}

export interface OverlayConfig {
  type: 'gradient' | 'solid' | 'none';
  color?: string;
  opacity?: number;
  direction?: string;
}

export interface CardStyle {
  backgroundColor?: string;
  textColor?: string;
  overlay?: OverlayConfig;
  blur?: boolean;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

// Content types for different cards
export interface ProfileContent {
  avatar: string;
  name: string;
  role: string;
  bio: string;
  tags: string[];
}

export interface SocialContent {
  platform: string;
  username: string;
  url: string;
  followers?: string;
  icon: string;
}

export interface MediaContent {
  type: 'image' | 'video' | 'gif';
  url: string;
  alt?: string;
  overlayText?: string;
  // Position properties (for cropping/repositioning)
  objectPosition?: { x: number; y: number }; // -50 to 50, default 0
  objectScale?: number; // 100 to 200, default 100
}

export interface MapContent {
  lat: number;
  lng: number;
  zoom: number;
  style?: 'light' | 'dark' | 'satellite';
}

export interface GithubContent {
  username: string;
  showContributions: boolean;
  stats?: {
    repos: number;
    followers: number;
    contributions: number;
  };
}

export interface TextContent {
  title?: string;
  body: string;
  markdown?: boolean;
}

export interface LinkContent {
  url: string;
  title?: string;
  description?: string;
  favicon?: string;
  image?: string;
}

export interface TitleContent {
  text: string;
}

export type CardContent =
  | { type: 'profile'; data: ProfileContent }
  | { type: 'social'; data: SocialContent }
  | { type: 'media'; data: MediaContent }
  | { type: 'map'; data: MapContent }
  | { type: 'github'; data: GithubContent }
  | { type: 'text'; data: TextContent }
  | { type: 'link'; data: LinkContent }
  | { type: 'title'; data: TitleContent };

export interface BentoCard {
  id: string;
  type: CardType;
  position: Position;
  size: Size;
  content: CardContent;
  style?: CardStyle;
  zIndex?: number;
}

export interface BentoState {
  cards: BentoCard[];
  selectedCardId: string | null;
  isEditing: boolean;
  isDragging: boolean;
  showEditPanel: boolean;
}

// Predefined sizes
export const CARD_SIZES: Record<CardSize, Size> = {
  '1x1': { width: 1, height: 1 },
  '2x1': { width: 2, height: 1 },
  '3x1': { width: 3, height: 1 },
  '4x1': { width: 4, height: 1 },
  '1x2': { width: 1, height: 2 },
  '2x2': { width: 2, height: 2 },
  '3x2': { width: 3, height: 2 },
  '4x2': { width: 4, height: 2 },
};

export const GRID_CONFIG = {
  columns: 12,
  gap: 16,
  maxWidth: 1200,
  cardRadius: 24,
  minCardSize: { width: 1, height: 1 },
  maxCardSize: { width: 4, height: 2 },
};
