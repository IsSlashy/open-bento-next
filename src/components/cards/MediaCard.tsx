'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MediaContent, CropArea } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { InlineCropTool } from '../InlineCropTool';
import { X } from 'lucide-react';

interface MediaCardProps {
  cardId: string;
  content: MediaContent;
  isDragging?: boolean;
}

export function MediaCard({ cardId, content, isDragging }: MediaCardProps) {
  const { updateCardContent } = useBentoStore();
  const [isCropping, setIsCropping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);

  // Listen for reposition event from BentoCard's size-selector button
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.cardId === cardId) {
        setIsCropping(true);
        document.dispatchEvent(new CustomEvent('crop-mode-start', { detail: { cardId } }));
      }
    };
    document.addEventListener('reposition-media', handler);
    return () => document.removeEventListener('reposition-media', handler);
  }, [cardId]);

  // Observe container size for crop rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }, []);

  // Fallback for cached images that may not fire onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0 && !naturalSize) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  });

  // Detect GIF
  const isGif = content.type === 'gif' ||
    content.url?.includes('.gif') ||
    content.url?.startsWith('data:image/gif');

  const isVideo = content.type === 'video';

  // Handle crop apply
  const handleCropApply = (cropArea: CropArea) => {
    updateCardContent(cardId, {
      type: 'media',
      data: {
        ...content,
        cropArea,
        // Clear legacy positioning when using new crop
        objectPosition: undefined,
        objectScale: undefined,
      },
    });
    setIsCropping(false);
    document.dispatchEvent(new CustomEvent('crop-mode-end', { detail: { cardId } }));
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    document.dispatchEvent(new CustomEvent('crop-mode-end', { detail: { cardId } }));
  };

  // No URL — show empty placeholder (card was stripped due to oversized data)
  if (!content.url) {
    return (
      <div className="media-card" ref={containerRef}>
        <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/40 text-xs">
          Media unavailable
        </div>
      </div>
    );
  }

  // Video — no crop, click to open lightbox with sound
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video during drag to avoid stutter
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isDragging) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [isDragging]);

  if (isVideo) {
    return (
      <div className="media-card" ref={containerRef}>
        <video
          ref={videoRef}
          src={content.url}
          className="w-full h-full object-cover cursor-pointer"
          autoPlay
          muted
          loop
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            setVideoOpen(true);
          }}
        />
        {videoOpen && <VideoLightbox url={content.url} onClose={() => setVideoOpen(false)} />}
      </div>
    );
  }

  // Compute crop image style
  const getCropStyle = (): React.CSSProperties | null => {
    const crop = content.cropArea;
    if (!crop || !naturalSize || !containerSize) return null;
    const { w: natW, h: natH } = naturalSize;
    const { w: ctrW, h: ctrH } = containerSize;

    const cropPxW = crop.width * natW;
    const cropPxH = crop.height * natH;
    const cropPxX = crop.x * natW;
    const cropPxY = crop.y * natH;

    // Scale so the crop area fills the container (cover behavior)
    const scale = Math.max(ctrW / cropPxW, ctrH / cropPxH);

    const scaledW = natW * scale;
    const scaledH = natH * scale;

    // Offset to position crop area center at container center
    const cropCenterX = (cropPxX + cropPxW / 2) * scale;
    const cropCenterY = (cropPxY + cropPxH / 2) * scale;

    return {
      position: 'absolute' as const,
      width: scaledW,
      height: scaledH,
      left: ctrW / 2 - cropCenterX,
      top: ctrH / 2 - cropCenterY,
      maxWidth: 'none',
      objectFit: 'fill' as const,
    };
  };

  // Legacy style (objectPosition/objectScale)
  const getLegacyStyle = (): React.CSSProperties => {
    const objectPosition = content.objectPosition || { x: 0, y: 0 };
    const objectScale = content.objectScale || 100;
    return {
      transform: `scale(${objectScale / 100}) translate(${objectPosition.x}%, ${objectPosition.y}%)`,
      transformOrigin: 'center center',
    };
  };

  const hasCrop = !!content.cropArea;
  const hasLegacy = !!(content.objectPosition || content.objectScale);
  const cropStyle = hasCrop ? getCropStyle() : null;
  // Hide the image while crop data exists but sizes are still loading,
  // to avoid a flash of uncropped image.
  const cropPending = hasCrop && !cropStyle;

  // Build the image style for all cases
  const getImageStyle = (): React.CSSProperties | undefined => {
    if (cropPending) return { position: 'absolute', opacity: 0 };
    if (cropStyle) return cropStyle;
    if (hasLegacy) return getLegacyStyle();
    return undefined;
  };

  // Use a single <img> element to avoid remounting (which resets load state)
  const imgClass = hasCrop
    ? (isGif ? 'media-gif' : '')
    : `w-full h-full object-cover ${isGif ? 'media-gif' : ''}`;

  return (
    <div className="media-card" ref={containerRef}>
      {isCropping ? (
        <InlineCropTool
          imageUrl={content.url}
          currentCrop={content.cropArea}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      ) : (
        <img
          ref={imgRef}
          src={content.url}
          alt={content.alt || ''}
          className={imgClass}
          style={getImageStyle()}
          onLoad={handleImageLoad}
          loading={isGif ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}

// --- Video lightbox (portal) ---
function VideoLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="video-lightbox-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <button className="video-lightbox-close" onClick={onClose} aria-label="Close">
        <X className="w-5 h-5" />
      </button>
      <video
        src={url}
        className="video-lightbox-player"
        autoPlay
        loop
        playsInline
        controls
      />
    </div>,
    document.body,
  );
}
