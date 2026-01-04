'use client';

import { ProfileContent } from '@/lib/types';
import { useBentoStore } from '@/lib/store';
import { Camera } from 'lucide-react';

interface ProfileCardProps {
  id: string;
  content: ProfileContent;
  isEditing: boolean;
}

export function ProfileCard({ id, content, isEditing }: ProfileCardProps) {
  const { updateCardContent } = useBentoStore();

  const handleAvatarChange = () => {
    const url = prompt('Enter avatar URL:', content.avatar);
    if (url) {
      updateCardContent(id, {
        type: 'profile',
        data: { ...content, avatar: url },
      });
    }
  };

  const handleFieldChange = (field: keyof ProfileContent, value: string | string[]) => {
    updateCardContent(id, {
      type: 'profile',
      data: { ...content, [field]: value },
    });
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Avatar */}
      <div className="relative w-20 h-20 mb-4 group">
        <img
          src={content.avatar}
          alt={content.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
        />
        {isEditing && (
          <button
            onClick={handleAvatarChange}
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Name */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={(e) => handleFieldChange('name', e.currentTarget.textContent || '')}
        className={`text-2xl font-bold mb-1 outline-none ${isEditing ? 'hover:bg-gray-100 rounded px-1' : ''}`}
      >
        {content.name}
      </h2>

      {/* Role */}
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={(e) => handleFieldChange('role', e.currentTarget.textContent || '')}
        className={`text-sm text-gray-500 mb-3 outline-none ${isEditing ? 'hover:bg-gray-100 rounded px-1' : ''}`}
      >
        {content.role}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {content.tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={(e) => handleFieldChange('bio', e.currentTarget.textContent || '')}
        className={`text-sm text-gray-600 leading-relaxed outline-none flex-1 ${isEditing ? 'hover:bg-gray-100 rounded px-1' : ''}`}
      >
        {content.bio}
      </p>
    </div>
  );
}
