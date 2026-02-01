'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { CropArea } from '@/lib/types';

interface InlineCropToolProps {
  imageUrl: string;
  currentCrop?: CropArea;
  onApply: (cropArea: CropArea) => void;
  onCancel: () => void;
}

type Ratio = '1:1' | '16:9' | '9:16' | 'free';
type HandleDir = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface ImageLayout {
  displayX: number;
  displayY: number;
  displayW: number;
  displayH: number;
}

function computeImageLayout(
  containerW: number,
  containerH: number,
  naturalW: number,
  naturalH: number,
): ImageLayout {
  const imgRatio = naturalW / naturalH;
  const ctrRatio = containerW / containerH;
  let displayW: number, displayH: number;
  if (imgRatio > ctrRatio) {
    displayW = containerW;
    displayH = containerW / imgRatio;
  } else {
    displayH = containerH;
    displayW = containerH * imgRatio;
  }
  return {
    displayX: (containerW - displayW) / 2,
    displayY: (containerH - displayH) / 2,
    displayW,
    displayH,
  };
}

function ratioValue(r: Ratio): number | null {
  if (r === '1:1') return 1;
  if (r === '16:9') return 16 / 9;
  if (r === '9:16') return 9 / 16;
  return null;
}

const MIN_SEL = 20;

export function InlineCropTool({ imageUrl, currentCrop, onApply, onCancel }: InlineCropToolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);
  const [ratio, setRatio] = useState<Ratio>('free');
  const [sel, setSel] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [interacting, setInteracting] = useState(false);

  // Track drag/resize state in refs so pointer handlers stay stable
  const dragRef = useRef<{
    type: 'move' | HandleDir;
    startX: number;
    startY: number;
    origSel: { x: number; y: number; w: number; h: number };
  } | null>(null);

  // Image load handler
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }, []);

  // Observe container size
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

  // Compute layout
  const layout =
    containerSize && naturalSize
      ? computeImageLayout(containerSize.w, containerSize.h, naturalSize.w, naturalSize.h)
      : null;

  // Initialize selection when layout + natural size are ready
  useEffect(() => {
    if (!layout || !naturalSize) return;
    if (sel !== null) return; // already initialized
    const { displayX, displayY, displayW, displayH } = layout;
    if (currentCrop) {
      setSel({
        x: displayX + currentCrop.x * displayW,
        y: displayY + currentCrop.y * displayH,
        w: currentCrop.width * displayW,
        h: currentCrop.height * displayH,
      });
    } else {
      const margin = 0.1;
      setSel({
        x: displayX + displayW * margin,
        y: displayY + displayH * margin,
        w: displayW * (1 - 2 * margin),
        h: displayH * (1 - 2 * margin),
      });
    }
  }, [layout, naturalSize, currentCrop, sel]);

  // Re-apply ratio when ratio changes (adjust height to match)
  useEffect(() => {
    if (!sel || !layout) return;
    const rv = ratioValue(ratio);
    if (!rv) return;
    const { displayX, displayY, displayW, displayH } = layout;
    let newW = sel.w;
    let newH = newW / rv;
    if (newH > displayH) {
      newH = displayH;
      newW = newH * rv;
    }
    if (newW > displayW) {
      newW = displayW;
      newH = newW / rv;
    }
    // Center the adjusted selection within the old selection center
    const cx = sel.x + sel.w / 2;
    const cy = sel.y + sel.h / 2;
    let nx = cx - newW / 2;
    let ny = cy - newH / 2;
    nx = Math.max(displayX, Math.min(nx, displayX + displayW - newW));
    ny = Math.max(displayY, Math.min(ny, displayY + displayH - newH));
    setSel({ x: nx, y: ny, w: newW, h: newH });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratio]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  // --- Pointer handlers ---
  const handlePointerDown = useCallback(
    (type: 'move' | HandleDir, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!sel) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        type,
        startX: e.clientX,
        startY: e.clientY,
        origSel: { ...sel },
      };
      setInteracting(true);
    },
    [sel],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !layout) return;
      e.preventDefault();
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const { displayX, displayY, displayW, displayH } = layout;
      const rv = ratioValue(ratio);
      const o = drag.origSel;

      if (drag.type === 'move') {
        let nx = o.x + dx;
        let ny = o.y + dy;
        nx = Math.max(displayX, Math.min(nx, displayX + displayW - o.w));
        ny = Math.max(displayY, Math.min(ny, displayY + displayH - o.h));
        setSel({ x: nx, y: ny, w: o.w, h: o.h });
        return;
      }

      // Resize
      let nx = o.x, ny = o.y, nw = o.w, nh = o.h;
      const dir = drag.type;

      // Horizontal component
      if (dir.includes('e')) {
        nw = Math.max(MIN_SEL, o.w + dx);
        nw = Math.min(nw, displayX + displayW - o.x);
      }
      if (dir.includes('w')) {
        const maxDx = o.w - MIN_SEL;
        const clampedDx = Math.max(-o.x + displayX, Math.min(dx, maxDx));
        nx = o.x + clampedDx;
        nw = o.w - clampedDx;
      }

      // Vertical component
      if (dir.includes('s')) {
        nh = Math.max(MIN_SEL, o.h + dy);
        nh = Math.min(nh, displayY + displayH - o.y);
      }
      if (dir.includes('n')) {
        const maxDy = o.h - MIN_SEL;
        const clampedDy = Math.max(-o.y + displayY, Math.min(dy, maxDy));
        ny = o.y + clampedDy;
        nh = o.h - clampedDy;
      }

      // Enforce ratio
      if (rv) {
        if (dir === 'n' || dir === 's') {
          nw = nh * rv;
          // Keep centered horizontally
          nx = o.x + (o.w - nw) / 2;
        } else if (dir === 'e' || dir === 'w') {
          nh = nw / rv;
          ny = o.y + (o.h - nh) / 2;
        } else {
          // Corner handles — width drives
          nh = nw / rv;
          if (dir.includes('n')) {
            ny = o.y + o.h - nh;
          }
        }
        // Clamp back inside image area
        if (nx < displayX) { nx = displayX; nw = Math.min(nw, displayW); nh = nw / rv; }
        if (ny < displayY) { ny = displayY; nh = Math.min(nh, displayH); nw = nh * rv; }
        if (nx + nw > displayX + displayW) { nw = displayX + displayW - nx; nh = nw / rv; }
        if (ny + nh > displayY + displayH) { nh = displayY + displayH - ny; nw = nh * rv; }
      }

      if (nw >= MIN_SEL && nh >= MIN_SEL) {
        setSel({ x: nx, y: ny, w: nw, h: nh });
      }
    },
    [layout, ratio],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setInteracting(false);
  }, []);

  // Apply crop
  const handleApply = useCallback(() => {
    if (!sel || !layout) return;
    const { displayX, displayY, displayW, displayH } = layout;
    const cropArea: CropArea = {
      x: (sel.x - displayX) / displayW,
      y: (sel.y - displayY) / displayH,
      width: sel.w / displayW,
      height: sel.h / displayH,
    };
    // Clamp to [0,1]
    cropArea.x = Math.max(0, Math.min(1, cropArea.x));
    cropArea.y = Math.max(0, Math.min(1, cropArea.y));
    cropArea.width = Math.max(0, Math.min(1 - cropArea.x, cropArea.width));
    cropArea.height = Math.max(0, Math.min(1 - cropArea.y, cropArea.height));
    onApply(cropArea);
  }, [sel, layout, onApply]);

  const handles: HandleDir[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  return (
    <div
      className="inline-crop-container"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Full image in contain mode */}
      <img
        src={imageUrl}
        alt=""
        className="inline-crop-image"
        onLoad={handleImageLoad}
        draggable={false}
      />

      {sel && layout && (
        <>
          {/* Dark overlay mask with cutout */}
          <svg className="inline-crop-mask" width="100%" height="100%">
            <defs>
              <mask id="crop-cutout">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={sel.x}
                  y={sel.y}
                  width={sel.w}
                  height={sel.h}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.6)"
              mask="url(#crop-cutout)"
            />
          </svg>

          {/* Selection rectangle */}
          <div
            className={`crop-selection ${interacting ? 'crop-selection--active' : ''}`}
            style={{
              left: sel.x,
              top: sel.y,
              width: sel.w,
              height: sel.h,
            }}
            onPointerDown={(e) => handlePointerDown('move', e)}
          >
            {/* Rule of thirds grid (visible during interaction) */}
            <div className="crop-grid" />

            {/* 8 resize handles */}
            {handles.map((dir) => (
              <div
                key={dir}
                className={`crop-handle crop-handle-${dir}`}
                onPointerDown={(e) => handlePointerDown(dir, e)}
              />
            ))}
          </div>

          {/* Toolbar */}
          <div className="crop-inline-toolbar">
            {(['1:1', '16:9', '9:16', 'free'] as Ratio[]).map((r) => (
              <button
                key={r}
                className={`crop-ratio-btn ${ratio === r ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setRatio(r); }}
              >
                {r === 'free' ? 'Free' : r}
              </button>
            ))}
            <span className="crop-toolbar-divider" />
            <button
              className="crop-apply-btn"
              onClick={(e) => { e.stopPropagation(); handleApply(); }}
              title="Apply"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              className="crop-cancel-btn"
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
