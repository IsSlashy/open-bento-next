'use client';

import { useRef, useEffect } from 'react';
import { TextContent } from '@/lib/types';
import { useBentoStore } from '@/lib/store';

interface TextCardProps {
  id: string;
  content: TextContent;
  isEditing?: boolean;
}

export function TextCard({ id, content }: TextCardProps) {
  const { updateCardContent } = useBentoStore();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  // Sync content on mount
  useEffect(() => {
    if (titleRef.current && content.title) {
      titleRef.current.textContent = content.title;
    }
    if (bodyRef.current) {
      bodyRef.current.textContent = content.body;
    }
  }, []);

  const handleTitleBlur = () => {
    if (titleRef.current) {
      const newTitle = titleRef.current.textContent || '';
      if (newTitle !== content.title) {
        updateCardContent(id, {
          type: 'text',
          data: { ...content, title: newTitle },
        });
      }
    }
  };

  const handleBodyBlur = () => {
    if (bodyRef.current) {
      const newBody = bodyRef.current.textContent || '';
      if (newBody !== content.body) {
        updateCardContent(id, {
          type: 'text',
          data: { ...content, body: newBody },
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent drag when editing
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-col h-full p-5 bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {content.title !== undefined && (
        <h3
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          data-placeholder="Title"
          className="text-base font-semibold text-gray-900 mb-2 outline-none"
        />
      )}
      <p
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBodyBlur}
        onKeyDown={handleKeyDown}
        data-placeholder="Your text here..."
        className="text-sm text-gray-600 leading-relaxed outline-none flex-1"
      />
    </div>
  );
}
