'use client';

import { useState, useEffect } from 'react';
import { MediaContent } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { GifPositioner } from '../GifPositioner';

interface MediaCardProps {
  cardId: string;
  content: MediaContent;
}

export function MediaCard({ cardId, content }: MediaCardProps) {
  const { updateCardContent } = useBentoStore();
  const [showPositioner, setShowPositioner] = useState(false);

  // Listen for reposition event from BentoCard's size-selector button
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.cardId === cardId) {
        setShowPositioner(true);
      }
    };
    document.addEventListener('reposition-media', handler);
    return () => document.removeEventListener('reposition-media', handler);
  }, [cardId]);

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

  // GIF ou Image
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
