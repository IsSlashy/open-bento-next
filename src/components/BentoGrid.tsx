'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { CollisionDetection } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useBentoStore } from '@/lib/store';
import { BentoCard, DragOverlayCard } from './BentoCard';
import { BentoCard as CardType } from '@/lib/types';
import { Upload } from 'lucide-react';
import { compressImage } from '@/lib/utils';

// Pointer-first collision: intuitive for mixed-size cards
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return closestCorners(args);
};

export function BentoGrid() {
  const { cards, reorderCards, moveCardToPosition, addCard } = useBentoStore();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // Capturer la taille exacte de la carte au début du drag
  const [draggedCardSize, setDraggedCardSize] = useState({ width: 0, height: 0 });
  // Drag counter to handle nested elements
  const dragCounterRef = useRef(0);
  // Track internal dnd-kit drag to ignore native file drop events
  const isDraggingInternalRef = useRef(false);

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
    isDraggingInternalRef.current = true;
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
    const { active, delta } = event;

    if (delta && (delta.x !== 0 || delta.y !== 0) && gridRef.current) {
      const card = gridCards.find((c) => c.id === active.id);
      if (card) {
        // Calculate grid cell size from the grid element
        const gridEl = gridRef.current;
        const gridRect = gridEl.getBoundingClientRect();
        const gridStyles = window.getComputedStyle(gridEl);
        const gap = parseFloat(gridStyles.gap || '12');
        const padding = parseFloat(gridStyles.paddingLeft || '16');
        const gridWidth = gridRect.width - padding * 2;
        const colWidth = (gridWidth - gap * 7) / 8; // 8 columns, 7 gaps
        const rowHeight = colWidth; // rows ~= col width for square grid cells

        // Convert pixel delta to grid cell delta
        const deltaCol = Math.round(delta.x / (colWidth + gap));
        const deltaRow = Math.round(delta.y / (rowHeight + gap));

        if (deltaCol !== 0 || deltaRow !== 0) {
          const newX = card.position.x + deltaCol;
          const newY = card.position.y + deltaRow;
          moveCardToPosition(card.id, { x: newX, y: newY });
        }
      }
    }

    setActiveCard(null);
    setDraggedCardSize({ width: 0, height: 0 });
    isDraggingInternalRef.current = false;
  }, [gridCards, moveCardToPosition]);

  // File drop handler — only for external files, not internal card drags
  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset counter and hide overlay
    dragCounterRef.current = 0;
    setIsDragOver(false);

    // Ignore if this is an internal dnd-kit drag
    if (isDraggingInternalRef.current) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const isVideo = file.type.startsWith('video/');
        const isGif = file.type === 'image/gif';
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) continue;

        // Videos are too large to store as data-URLs and there is no
        // cloud storage configured — reject them with a user-visible alert.
        if (isVideo) {
          alert('Video uploads are not supported yet. Please upload images or GIFs instead.');
          continue;
        }

        // GIFs — read directly (no compression)
        if (isGif) {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            addCard({
              type: 'media',
              position: { x: 0, y: 0 },
              size: { width: 4, height: 4 },
              content: {
                type: 'media',
                data: {
                  type: 'gif',
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

  // Drag enter - increment counter (only for external files)
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDraggingInternalRef.current) return;

    dragCounterRef.current++;

    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  // Drag over - prevent default to allow file drop (only for external files)
  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    if (isDraggingInternalRef.current) return;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Drag leave - decrement counter (only for external files)
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDraggingInternalRef.current) return;

    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  return (
    <div
      onDrop={handleFileDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleFileDragOver}
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
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={gridCards.map((c) => c.id)}>
          {/* Single unified grid - titles are widgets like any other card */}
          <div className="bento-grid" ref={gridRef}>
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
              width={Math.min(draggedCardSize.width, 400)}
              height={draggedCardSize.width > 400
                ? draggedCardSize.height * (400 / draggedCardSize.width)
                : draggedCardSize.height}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
