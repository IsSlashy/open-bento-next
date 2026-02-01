'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BentoCard as BentoCardType, Size } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { SocialCard } from './cards/SocialCard';
import { GithubCard } from './cards/GithubCard';
import { LinkCard } from './cards/LinkCard';
import { TextCard } from './cards/TextCard';
import { MediaCard } from './cards/MediaCard';
import { MapCard } from './cards/MapCard';
import { TitleCard } from './cards/TitleCard';
import { cn } from '@/lib/utils';
import { Trash2, Crop } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BentoCardProps {
  card: BentoCardType;
  isDragging?: boolean;
}

const sizeOptions: Array<{ label: string; size: Size; shapeClass: string }> = [
  { label: '2x2', size: { width: 2, height: 2 }, shapeClass: 'shape-1x1' },
  { label: '4x2', size: { width: 4, height: 2 }, shapeClass: 'shape-2x1' },
  { label: '4x4', size: { width: 4, height: 4 }, shapeClass: 'shape-2x2' },
  { label: '2x4', size: { width: 2, height: 4 }, shapeClass: 'shape-1x2' },
];

// Card content renderer
function CardContent({ card }: { card: BentoCardType }) {
  switch (card.content.type) {
    case 'social':
      return <SocialCard content={card.content.data} style={card.style} />;
    case 'github':
      return <GithubCard content={card.content.data} />;
    case 'link':
      return <LinkCard content={card.content.data} style={card.style} />;
    case 'text':
      return <TextCard id={card.id} content={card.content.data} isEditing={false} />;
    case 'media':
      return <MediaCard cardId={card.id} content={card.content.data} />;
    case 'map':
      return <MapCard content={card.content.data} />;
    case 'title':
      return <TitleCard id={card.id} content={card.content.data} />;
    default:
      return null;
  }
}

// Main sortable card
export function BentoCard({ card, isDragging }: BentoCardProps) {
  const { updateCardSize, removeCard } = useBentoStore();
  const isTitle = card.type === 'title';
  const [cropActive, setCropActive] = useState(false);

  // Listen for crop-mode events
  useEffect(() => {
    const onStart = (e: Event) => {
      if ((e as CustomEvent).detail?.cardId === card.id) setCropActive(true);
    };
    const onEnd = (e: Event) => {
      if ((e as CustomEvent).detail?.cardId === card.id) setCropActive(false);
    };
    document.addEventListener('crop-mode-start', onStart);
    document.addEventListener('crop-mode-end', onEnd);
    return () => {
      document.removeEventListener('crop-mode-start', onStart);
      document.removeEventListener('crop-mode-end', onEnd);
    };
  }, [card.id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const getSizeLabel = () => {
    const { width, height } = card.size;
    return `${width}x${height}`;
  };

  // Position card explicitly on the CSS grid
  const style = {
    gridColumn: `${card.position.x + 1} / span ${card.size.width}`,
    gridRow: `${card.position.y + 1} / span ${card.size.height}`,
    transform: isDragging
      ? 'none'
      : CSS.Transform.toString(transform ? {
          ...transform,
          scaleX: 1,
          scaleY: 1,
        } : null),
    transition: isDragging
      ? 'none'
      : (transition || 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 0 : 1,
  };

  const handleSizeChange = (e: React.MouseEvent, newSize: Size) => {
    e.stopPropagation();
    updateCardSize(card.id, newSize);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCard(card.id);
  };

  const handleReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.dispatchEvent(new CustomEvent('reposition-media', { detail: { cardId: card.id } }));
  };

  const isMedia = card.content.type === 'media';

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-size={getSizeLabel()}
      data-card-id={card.id}
      data-is-dragging={isDragging ? 'true' : undefined}
      data-crop-active={cropActive ? 'true' : undefined}
      className={cn(
        'bento-card',
        isTitle && 'title-widget-card'
      )}
      {...attributes}
      {...(cropActive ? {} : listeners)}
    >
      {/* Delete Button - OUTSIDE top left */}
      <button
        className="delete-btn"
        onClick={handleDelete}
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Content - wrapper avec border-radius pour clipper le contenu */}
      <div className="card-content-wrapper">
        <CardContent card={card} />
      </div>

      {/* Size Selector - OUTSIDE bottom center (not for title cards) */}
      {!isTitle && (
        <div className="size-selector">
          {sizeOptions.map(({ label, size, shapeClass }) => (
            <button
              key={label}
              onClick={(e) => handleSizeChange(e, size)}
              className={cn(
                'size-btn',
                card.size.width === size.width && card.size.height === size.height && 'active'
              )}
              title={label}
            >
              <span className={cn('shape', shapeClass)} />
            </button>
          ))}
          {isMedia && (
            <>
              <span className="size-selector-divider" />
              <button
                className="size-btn reposition-btn"
                onClick={handleReposition}
                title="Crop"
              >
                <Crop className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// DragOverlay card
export function DragOverlayCard({ card, width, height }: { card: BentoCardType; width: number; height: number }) {
  const getSizeLabel = () => {
    const { width: w, height: h } = card.size;
    return `${w}x${h}`;
  };

  return (
    <div
      data-size={getSizeLabel()}
      className="bento-card dragging-card"
      style={{
        width: width > 0 ? width : undefined,
        height: height > 0 ? height : undefined,
      }}
    >
      <CardContent card={card} />
    </div>
  );
}
