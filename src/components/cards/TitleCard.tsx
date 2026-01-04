'use client';

import { useRef, useEffect } from 'react';
import { TitleContent } from '@/lib/types';
import { useBentoStore } from '@/lib/store';

interface TitleCardProps {
  id: string;
  content: TitleContent;
}

export function TitleCard({ id, content }: TitleCardProps) {
  const { updateCardContent } = useBentoStore();
  const textRef = useRef<HTMLSpanElement>(null);

  // Sync content on mount
  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = content.text;
    }
  }, []);

  const handleBlur = () => {
    if (textRef.current) {
      const newText = textRef.current.textContent || '';
      if (newText !== content.text) {
        updateCardContent(id, {
          type: 'title',
          data: { text: newText },
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent drag when editing
    e.stopPropagation();
    // Submit on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      textRef.current?.blur();
    }
  };

  return (
    <div className="title-widget" onClick={(e) => e.stopPropagation()}>
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-placeholder="Section title..."
        className="widget-text"
      />
    </div>
  );
}
