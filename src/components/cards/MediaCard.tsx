'use client';

import { useState } from 'react';
import { MediaContent } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { GifPositioner } from '../GifPositioner';
import { Move } from 'lucide-react';

interface MediaCardProps {
  cardId: string;
  content: MediaContent;
}

export function MediaCard({ cardId, content }: MediaCardProps) {
  const { updateCardContent } = useBentoStore();
  const [showPositioner, setShowPositioner] = useState(false);

  // Détecter si c'est un GIF (par type ou URL)
  const isGif = content.type === 'gif' ||
    content.url?.includes('.gif') ||
    content.url?.startsWith('data:image/gif');

  const isVideo = content.type === 'video';

  // Get current position and scale
  const objectPosition = content.objectPosition || { x: 0, y: 0 };
  const objectScale = content.objectScale || 100;

  // Calculate transform style
  const imageStyle = {
    transform: `scale(${objectScale / 100}) translate(${objectPosition.x}%, ${objectPosition.y}%)`,
    transformOrigin: 'center center',
  };

  // Handle position update
  const handlePositionApply = (position: { x: number; y: number }, scale: number) => {
    updateCardContent(cardId, {
      type: 'media',
      data: {
        ...content,
        objectPosition: position,
        objectScale: scale,
      },
    });
    setShowPositioner(false);
  };

  const handlePositionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPositioner(true);
  };

  // Vidéo - pas de positionnement pour les vidéos
  if (isVideo) {
    return (
      <div className="media-card">
        <video
          src={content.url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  // GIF ou Image - avec bouton de positionnement
  return (
    <div className="media-card">
      <img
        src={content.url}
        alt={content.alt || ''}
        className={`w-full h-full object-cover ${isGif ? 'media-gif' : ''}`}
        style={imageStyle}
        loading={isGif ? 'eager' : 'lazy'}
        decoding="async"
      />

      {/* Bouton de repositionnement */}
      <button
        className="media-position-btn"
        onClick={handlePositionClick}
        title="Repositionner"
      >
        <Move className="w-4 h-4" />
      </button>

      {/* Positionner Modal */}
      {showPositioner && (
        <GifPositioner
          gifSrc={content.url}
          initialPosition={objectPosition}
          initialScale={objectScale}
          onApply={handlePositionApply}
          onCancel={() => setShowPositioner(false)}
        />
      )}
    </div>
  );
}
