'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useBentoStore } from '@/lib/store';
import { BentoCard, DragOverlayCard } from './BentoCard';
import { BentoCard as CardType } from '@/lib/types';
import { Upload } from 'lucide-react';
import { compressImage } from '@/lib/utils';

export function BentoGrid() {
  const { cards, reorderCards, addCard } = useBentoStore();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // Capturer la taille exacte de la carte au début du drag
  const [draggedCardSize, setDraggedCardSize] = useState({ width: 0, height: 0 });
  // Drag counter to handle nested elements
  const dragCounterRef = useRef(0);

  // Filter out profile cards - profile is now in sidebar
  const gridCards = cards.filter((c) => c.type !== 'profile');

  // Sensors for natural drag feel
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const card = gridCards.find((c) => c.id === event.active.id);
    if (card) {
      setActiveCard(card);

      // Capturer la taille EXACTE de la carte
      const cardElement = document.querySelector(`[data-card-id="${event.active.id}"]`);
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        setDraggedCardSize({
          width: rect.width,
          height: rect.height
        });
      }
    }
  }, [gridCards]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderCards(active.id as string, over.id as string);
    }

    setActiveCard(null);
    setDraggedCardSize({ width: 0, height: 0 });
  }, [reorderCards]);

  // File drop handler
  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset counter and hide overlay
    dragCounterRef.current = 0;
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const isVideo = file.type.startsWith('video/');
        const isGif = file.type === 'image/gif';
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) continue;

        // Pour les vidéos et GIFs, lire directement (pas de compression)
        if (isVideo || isGif) {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            addCard({
              type: 'media',
              position: { x: 0, y: 0 },
              size: { width: 2, height: 2 },
              content: {
                type: 'media',
                data: {
                  type: isVideo ? 'video' : 'gif',
                  url: dataUrl,
                  alt: file.name,
                },
              },
            });
          };
          reader.onerror = (error) => {
            console.error('Error reading file:', error);
          };
          reader.readAsDataURL(file);
        } else {
          // Images classiques - compresser
          const compressed = await compressImage(file);
          addCard({
            type: 'media',
            position: { x: 0, y: 0 },
            size: { width: 2, height: 2 },
            content: {
              type: 'media',
              data: {
                type: 'image',
                url: compressed,
                alt: file.name,
              },
            },
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  }, [addCard]);

  // Drag enter - increment counter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current++;

    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  // Drag over - prevent default to allow drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Drag leave - decrement counter
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  return (
    <div
      onDrop={handleFileDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drop overlay for files */}
      {isDragOver && (
        <div className="drop-overlay">
          <div className="drop-message">
            <Upload className="w-12 h-12 text-blue-500" />
            <p>Drop images, GIFs or videos here</p>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={gridCards.map((c) => c.id)} strategy={rectSortingStrategy}>
          {/* Single unified grid - titles are widgets like any other card */}
          <div className="bento-grid">
            {gridCards.map((card) => (
              <BentoCard key={card.id} card={card} isDragging={activeCard?.id === card.id} />
            ))}
          </div>
        </SortableContext>

        {/* DragOverlay for the floating card that follows cursor */}
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            duration: 500,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // Smooth ease-out
            sideEffects: ({ active }) => {
              // Ajouter une classe pour l'animation de drop
              if (active.node) {
                active.node.classList.add('dropping');
                setTimeout(() => {
                  active.node.classList.remove('dropping');
                }, 500);
              }
            },
          }}
        >
          {activeCard ? (
            <DragOverlayCard
              card={activeCard}
              width={draggedCardSize.width}
              height={draggedCardSize.height}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
