'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MediaContent, CropArea } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { InlineCropTool } from '../InlineCropTool';

interface MediaCardProps {
  cardId: string;
  content: MediaContent;
}

export function MediaCard({ cardId, content }: MediaCardProps) {
  const { updateCardContent } = useBentoStore();
  const [isCropping, setIsCropping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Video — no crop support
  if (isVideo) {
    return (
      <div className="media-card" ref={containerRef}>
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
