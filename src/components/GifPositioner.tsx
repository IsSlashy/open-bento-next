'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, RotateCcw } from 'lucide-react';

interface GifPositionerProps {
  gifSrc: string;
  initialPosition?: { x: number; y: number };
  initialScale?: number;
  onApply: (position: { x: number; y: number }, scale: number) => void;
  onCancel: () => void;
}

export function GifPositioner({
  gifSrc,
  initialPosition = { x: 0, y: 0 },
  initialScale = 100,
  onApply,
  onCancel,
}: GifPositionerProps) {
  const [position, setPosition] = useState(initialPosition);
  const [scale, setScale] = useState(initialScale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setScale(100);
  };

  const handleApply = () => {
    onApply(position, scale);
  };

  // Calculate the transform style for the preview
  const previewStyle = {
    transform: `scale(${scale / 100}) translate(${position.x}%, ${position.y}%)`,
    transformOrigin: 'center center',
  };

  if (!mounted) return null;

  return createPortal(
    <div className="gif-positioner-overlay">
      <div className="gif-positioner-modal">
        <div className="gif-positioner-header">
          <h3>Repositionner l'image</h3>
          <button className="gif-positioner-close" onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="gif-positioner-preview-container">
          <div className="gif-positioner-preview">
            <img
              src={gifSrc}
              alt="Preview"
              style={previewStyle}
            />
          </div>
        </div>

        <div className="gif-positioner-controls">
          <div className="gif-positioner-control">
            <label>
              <span>Zoom</span>
              <span className="gif-positioner-value">{scale}%</span>
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>

          <div className="gif-positioner-control">
            <label>
              <span>Position horizontale</span>
              <span className="gif-positioner-value">{position.x}%</span>
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={position.x}
              onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
            />
          </div>

          <div className="gif-positioner-control">
            <label>
              <span>Position verticale</span>
              <span className="gif-positioner-value">{position.y}%</span>
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={position.y}
              onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="gif-positioner-actions">
          <button className="gif-positioner-btn reset" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <div className="gif-positioner-actions-right">
            <button className="gif-positioner-btn cancel" onClick={onCancel}>
              Annuler
            </button>
            <button className="gif-positioner-btn apply" onClick={handleApply}>
              <Check className="w-4 h-4" />
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
