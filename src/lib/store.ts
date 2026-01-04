import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BentoCard, Size, Position, CardContent, CardStyle, CardType } from './types';

interface Profile {
  avatar: string;
  name: string;
  title: string;
  tags: string[];
  bio: string;
}

interface BentoStore {
  // State
  cards: BentoCard[];
  profile: Profile;
  selectedCardId: string | null;
  isEditing: boolean;
  showEditPanel: boolean;
  isDragging: boolean;

  // Card actions
  addCard: (card: Omit<BentoCard, 'id'>) => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, updates: Partial<BentoCard>) => void;
  updateCardPosition: (id: string, position: Position) => void;
  updateCardSize: (id: string, size: Size) => void;
  updateCardContent: (id: string, content: CardContent) => void;
  updateCardStyle: (id: string, style: CardStyle) => void;
  duplicateCard: (id: string) => void;
  reorderCards: (activeId: string, overId: string) => void;

  // Selection
  selectCard: (id: string | null) => void;

  // Profile
  updateProfile: (updates: Partial<Profile>) => void;

  // UI state
  setEditing: (editing: boolean) => void;
  toggleEditing: () => void;
  setShowEditPanel: (show: boolean) => void;
  setIsDragging: (dragging: boolean) => void;

  // Reset
  resetCards: () => void;
}

const defaultProfile: Profile = {
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  name: 'Your Name',
  title: 'Your Title | Your Role',
  tags: ['Tag 1', 'Tag 2', 'Tag 3'],
  bio: 'Write something about yourself...',
};

const defaultCards: BentoCard[] = [
  // Title: My Links
  {
    id: 'title-links',
    type: 'title',
    position: { x: 0, y: 0 },
    size: { width: 4, height: 1 },
    content: {
      type: 'title',
      data: {
        text: 'My Links',
      },
    },
  },
  {
    id: 'social-1',
    type: 'social',
    position: { x: 0, y: 1 },
    size: { width: 1, height: 1 },
    content: {
      type: 'social',
      data: {
        platform: 'twitter',
        username: '@username',
        url: 'https://x.com/',
        icon: 'twitter',
      },
    },
  },
  {
    id: 'social-2',
    type: 'social',
    position: { x: 1, y: 1 },
    size: { width: 1, height: 1 },
    content: {
      type: 'social',
      data: {
        platform: 'instagram',
        username: '@username',
        url: 'https://instagram.com/',
        icon: 'instagram',
      },
    },
  },
  {
    id: 'social-3',
    type: 'social',
    position: { x: 2, y: 1 },
    size: { width: 1, height: 1 },
    content: {
      type: 'social',
      data: {
        platform: 'youtube',
        username: '@channel',
        url: 'https://youtube.com/',
        icon: 'youtube',
      },
    },
  },
  {
    id: 'social-4',
    type: 'social',
    position: { x: 3, y: 1 },
    size: { width: 1, height: 1 },
    content: {
      type: 'social',
      data: {
        platform: 'tiktok',
        username: '@username',
        url: 'https://tiktok.com/',
        icon: 'tiktok',
      },
    },
  },
  // Title: About
  {
    id: 'title-about',
    type: 'title',
    position: { x: 0, y: 2 },
    size: { width: 4, height: 1 },
    content: {
      type: 'title',
      data: {
        text: 'About',
      },
    },
  },
  {
    id: 'text-about',
    type: 'text',
    position: { x: 0, y: 3 },
    size: { width: 2, height: 1 },
    content: {
      type: 'text',
      data: {
        title: 'About Me',
        body: 'Add a description about yourself here. Click to edit!',
      },
    },
  },
  {
    id: 'map-1',
    type: 'map',
    position: { x: 2, y: 3 },
    size: { width: 2, height: 1 },
    content: {
      type: 'map',
      data: {
        lat: 48.8566,
        lng: 2.3522,
        zoom: 12,
        style: 'light',
      },
    },
  },
];

export const useBentoStore = create<BentoStore>()(
  persist(
    (set, get) => ({
      cards: defaultCards,
      profile: defaultProfile,
      selectedCardId: null,
      isEditing: false,
      showEditPanel: false,
      isDragging: false,

      addCard: (card) => {
        const id = `card-${Date.now()}`;
        set((state) => ({
          cards: [...state.cards, { ...card, id }],
        }));
      },

      removeCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
          selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
        }));
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      updateCardPosition: (id, position) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, position } : c)),
        }));
      },

      updateCardSize: (id, size) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, size } : c)),
        }));
      },

      updateCardContent: (id, content) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, content } : c)),
        }));
      },

      updateCardStyle: (id, style) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, style: { ...c.style, ...style } } : c)),
        }));
      },

      duplicateCard: (id) => {
        const card = get().cards.find((c) => c.id === id);
        if (card) {
          const newId = `card-${Date.now()}`;
          set((state) => ({
            cards: [
              ...state.cards,
              {
                ...card,
                id: newId,
                position: { x: card.position.x + 1, y: card.position.y },
              },
            ],
          }));
        }
      },

      reorderCards: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.cards.findIndex((c) => c.id === activeId);
          const newIndex = state.cards.findIndex((c) => c.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const cards = [...state.cards];
          const [removed] = cards.splice(oldIndex, 1);
          cards.splice(newIndex, 0, removed);

          return { cards };
        });
      },

      selectCard: (id) => {
        set({ selectedCardId: id, showEditPanel: id !== null });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      setEditing: (editing) => set({ isEditing: editing }),
      toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
      setShowEditPanel: (show) => set({ showEditPanel: show }),
      setIsDragging: (dragging) => set({ isDragging: dragging }),

      resetCards: () => set({ cards: defaultCards, profile: defaultProfile }),
    }),
    {
      name: 'open-bento-storage',
    }
  )
);
