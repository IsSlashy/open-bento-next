import { create } from 'zustand';
import { BentoCard, Size, Position, CardContent, CardStyle } from './types';

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
  isSaving: boolean;
  lastSaved: Date | null;
  isHydrated: boolean;

  // Hydration from server data
  hydrate: (profile: Profile, cards: BentoCard[]) => void;

  // Card actions (optimistic updates with API sync)
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
  name: '',
  title: '',
  tags: ['', '', ''],
  bio: '',
};

const defaultCards: BentoCard[] = [
  {
    id: 'title-links',
    type: 'title',
    position: { x: 0, y: 0 },
    size: { width: 4, height: 1 },
    content: { type: 'title', data: { text: 'My Links' } },
  },
  {
    id: 'social-1',
    type: 'social',
    position: { x: 0, y: 1 },
    size: { width: 1, height: 1 },
    content: { type: 'social', data: { platform: 'twitter', username: '@username', url: 'https://x.com/', icon: 'twitter' } },
  },
  {
    id: 'social-2',
    type: 'social',
    position: { x: 1, y: 1 },
    size: { width: 1, height: 1 },
    content: { type: 'social', data: { platform: 'instagram', username: '@username', url: 'https://instagram.com/', icon: 'instagram' } },
  },
  {
    id: 'social-3',
    type: 'social',
    position: { x: 2, y: 1 },
    size: { width: 1, height: 1 },
    content: { type: 'social', data: { platform: 'youtube', username: '@channel', url: 'https://youtube.com/', icon: 'youtube' } },
  },
  {
    id: 'social-4',
    type: 'social',
    position: { x: 3, y: 1 },
    size: { width: 1, height: 1 },
    content: { type: 'social', data: { platform: 'tiktok', username: '@username', url: 'https://tiktok.com/', icon: 'tiktok' } },
  },
  {
    id: 'title-about',
    type: 'title',
    position: { x: 0, y: 2 },
    size: { width: 4, height: 1 },
    content: { type: 'title', data: { text: 'About' } },
  },
  {
    id: 'text-about',
    type: 'text',
    position: { x: 0, y: 3 },
    size: { width: 2, height: 1 },
    content: { type: 'text', data: { title: 'About Me', body: 'Add a description about yourself here. Click to edit!' } },
  },
  {
    id: 'map-1',
    type: 'map',
    position: { x: 2, y: 3 },
    size: { width: 2, height: 1 },
    content: { type: 'map', data: { lat: 48.8566, lng: 2.3522, zoom: 12, style: 'light' } },
  },
];

const GRID_COLS = 4;

// Find the first available grid position that fits a card of the given size
function findNextAvailablePosition(cards: BentoCard[], size: Size): Position {
  const occupied = new Set<string>();
  for (const card of cards) {
    for (let dx = 0; dx < card.size.width; dx++) {
      for (let dy = 0; dy < card.size.height; dy++) {
        occupied.add(`${card.position.x + dx},${card.position.y + dy}`);
      }
    }
  }

  for (let y = 0; y < 100; y++) {
    for (let x = 0; x <= GRID_COLS - size.width; x++) {
      let fits = true;
      for (let dx = 0; dx < size.width && fits; dx++) {
        for (let dy = 0; dy < size.height && fits; dy++) {
          if (occupied.has(`${x + dx},${y + dy}`)) fits = false;
        }
      }
      if (fits) return { x, y };
    }
  }

  return { x: 0, y: 0 };
}

// Auto-assign positions when cards have overlapping positions (e.g. all at 0,0)
function autoAssignPositions(cards: BentoCard[]): BentoCard[] {
  if (cards.length === 0) return cards;

  // Check if positions overlap
  const cellSet = new Set<string>();
  let hasOverlap = false;
  for (const card of cards) {
    for (let dx = 0; dx < card.size.width && !hasOverlap; dx++) {
      for (let dy = 0; dy < card.size.height && !hasOverlap; dy++) {
        const key = `${card.position.x + dx},${card.position.y + dy}`;
        if (cellSet.has(key)) hasOverlap = true;
        cellSet.add(key);
      }
    }
  }

  if (!hasOverlap) return cards;

  // Reassign positions sequentially
  const result: BentoCard[] = [];
  for (const card of cards) {
    const pos = findNextAvailablePosition(result, card.size);
    result.push({ ...card, position: pos });
  }
  return result;
}

// Debounce helper
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedSave(fn: () => void, delay = 1000) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(fn, delay);
}

// API helper
async function apiCall(url: string, method: string, body?: unknown) {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API call failed: ${method} ${url}`, error);
    throw error;
  }
}

export const useBentoStore = create<BentoStore>()(
  (set, get) => ({
    cards: [],
    profile: defaultProfile,
    selectedCardId: null,
    isEditing: false,
    showEditPanel: false,
    isDragging: false,
    isSaving: false,
    lastSaved: null,
    isHydrated: false,

    hydrate: (profile, cards) => {
      set({
        profile,
        cards: autoAssignPositions(cards),
        isHydrated: true,
      });
    },

    addCard: (card) => {
      const tempId = `temp-${Date.now()}`;
      // Find next available grid position
      const position = findNextAvailablePosition(get().cards, card.size);
      const newCard = { ...card, id: tempId, position };

      // Optimistic update
      set((state) => ({
        cards: [...state.cards, newCard],
      }));

      // Sync with API
      apiCall('/api/cards', 'POST', {
        type: card.type,
        positionX: position.x,
        positionY: position.y,
        sizeWidth: card.size.width,
        sizeHeight: card.size.height,
        content: card.content,
        style: card.style || null,
        zIndex: card.zIndex || 0,
        sortOrder: get().cards.length,
      })
        .then((data) => {
          // Replace temp ID with real ID
          set((state) => ({
            cards: state.cards.map((c) =>
              c.id === tempId ? { ...c, id: data.id } : c
            ),
            isSaving: false,
            lastSaved: new Date(),
          }));
        })
        .catch(() => {
          // Rollback
          set((state) => ({
            cards: state.cards.filter((c) => c.id !== tempId),
            isSaving: false,
          }));
        });
    },

    removeCard: (id) => {
      const removedCard = get().cards.find((c) => c.id === id);
      const removedIndex = get().cards.findIndex((c) => c.id === id);

      // Optimistic update
      set((state) => ({
        cards: state.cards.filter((c) => c.id !== id),
        selectedCardId: state.selectedCardId === id ? null : state.selectedCardId,
      }));

      // Don't call API for temp cards
      if (id.startsWith('temp-')) return;

      // Sync with API
      apiCall(`/api/cards/${id}`, 'DELETE').catch(() => {
        // Rollback
        if (removedCard) {
          set((state) => {
            const cards = [...state.cards];
            cards.splice(removedIndex, 0, removedCard);
            return { cards };
          });
        }
      });
    },

    updateCard: (id, updates) => {
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));

      if (id.startsWith('temp-')) return;

      debouncedSave(() => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;
        apiCall(`/api/cards/${id}`, 'PUT', {
          positionX: card.position.x,
          positionY: card.position.y,
          sizeWidth: card.size.width,
          sizeHeight: card.size.height,
          content: card.content,
          style: card.style || null,
          zIndex: card.zIndex || 0,
        }).then(() => set({ lastSaved: new Date() }));
      });
    },

    updateCardPosition: (id, position) => {
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, position } : c)),
      }));

      if (id.startsWith('temp-')) return;

      debouncedSave(() => {
        apiCall(`/api/cards/${id}`, 'PUT', {
          positionX: position.x,
          positionY: position.y,
        }).then(() => set({ lastSaved: new Date() }));
      }, 500);
    },

    updateCardSize: (id, size) => {
      set((state) => {
        const card = state.cards.find((c) => c.id === id);
        if (!card) return state;

        // Clamp position so card stays within grid
        let { x, y } = card.position;
        if (x + size.width > GRID_COLS) {
          x = Math.max(0, GRID_COLS - size.width);
        }
        const position = { x, y };

        return {
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, size, position } : c
          ),
        };
      });

      if (id.startsWith('temp-')) return;

      const card = get().cards.find((c) => c.id === id);
      if (!card) return;
      apiCall(`/api/cards/${id}`, 'PUT', {
        sizeWidth: size.width,
        sizeHeight: size.height,
        positionX: card.position.x,
        positionY: card.position.y,
      }).then(() => set({ lastSaved: new Date() }));
    },

    updateCardContent: (id, content) => {
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, content } : c)),
      }));

      if (id.startsWith('temp-')) return;

      debouncedSave(() => {
        apiCall(`/api/cards/${id}`, 'PUT', { content }).then(() =>
          set({ lastSaved: new Date() })
        );
      });
    },

    updateCardStyle: (id, style) => {
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, style: { ...c.style, ...style } } : c)),
      }));

      if (id.startsWith('temp-')) return;

      debouncedSave(() => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;
        apiCall(`/api/cards/${id}`, 'PUT', { style: card.style }).then(() =>
          set({ lastSaved: new Date() })
        );
      });
    },

    duplicateCard: (id) => {
      const card = get().cards.find((c) => c.id === id);
      if (card) {
        get().addCard({
          ...card,
          position: { x: card.position.x + 1, y: card.position.y },
        });
      }
    },

    reorderCards: (activeId, overId) => {
      // Swap positions of the two cards
      set((state) => {
        const activeCard = state.cards.find((c) => c.id === activeId);
        const overCard = state.cards.find((c) => c.id === overId);
        if (!activeCard || !overCard) return state;

        return {
          cards: state.cards.map((c) => {
            if (c.id === activeId) return { ...c, position: { ...overCard.position } };
            if (c.id === overId) return { ...c, position: { ...activeCard.position } };
            return c;
          }),
        };
      });

      // Sync both cards' positions with API
      debouncedSave(() => {
        const cards = get().cards;
        const active = cards.find((c) => c.id === activeId);
        const over = cards.find((c) => c.id === overId);
        const updates: Promise<unknown>[] = [];

        if (active && !active.id.startsWith('temp-')) {
          updates.push(apiCall(`/api/cards/${active.id}`, 'PUT', {
            positionX: active.position.x,
            positionY: active.position.y,
          }));
        }
        if (over && !over.id.startsWith('temp-')) {
          updates.push(apiCall(`/api/cards/${over.id}`, 'PUT', {
            positionX: over.position.x,
            positionY: over.position.y,
          }));
        }

        Promise.all(updates).then(() => set({ lastSaved: new Date() }));
      }, 500);
    },

    selectCard: (id) => {
      set({ selectedCardId: id, showEditPanel: id !== null });
    },

    updateProfile: (updates) => {
      set((state) => ({
        profile: { ...state.profile, ...updates },
      }));

      debouncedSave(() => {
        const profile = get().profile;
        apiCall('/api/profile', 'PUT', {
          displayName: profile.name,
          title: profile.title,
          bio: profile.bio,
          avatarUrl: profile.avatar,
          tags: profile.tags,
        }).then(() => set({ lastSaved: new Date() }));
      });
    },

    setEditing: (editing) => set({ isEditing: editing }),
    toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
    setShowEditPanel: (show) => set({ showEditPanel: show }),
    setIsDragging: (dragging) => set({ isDragging: dragging }),

    resetCards: () => set({ cards: [], profile: defaultProfile }),
  })
);
