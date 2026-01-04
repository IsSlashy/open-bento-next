'use client'

import { useState, useRef } from 'react'
import { useBentoStore } from '@/lib/store'
import { Camera, Pencil } from 'lucide-react'

export function ProfileSidebar() {
  const { profile, updateProfile } = useBentoStore()
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateProfile({ avatar: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUrl = () => {
    const url = prompt('Enter image URL:', profile.avatar)
    if (url) {
      updateProfile({ avatar: url })
    }
  }

  const updateTag = (index: number, value: string) => {
    const newTags = [...profile.tags]
    newTags[index] = value
    updateProfile({ tags: newTags })
  }

  return (
    <aside className="w-80 min-w-80 h-screen p-10 flex flex-col border-r border-gray-200 bg-white fixed left-0 top-0">
      <div className="flex-1">
        {/* Avatar */}
        <div className="relative mb-5 w-20 h-20 group">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div
            onClick={handleAvatarClick}
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            onClick={handleAvatarUrl}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Enter URL"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>

        {/* Name */}
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateProfile({ name: e.currentTarget.textContent || '' })}
          className="text-2xl font-extrabold mb-1 outline-none"
        >
          {profile.name}
        </h1>

        {/* Title */}
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateProfile({ title: e.currentTarget.textContent || '' })}
          className="text-sm text-gray-600 font-medium mb-4 outline-none"
        >
          {profile.title}
        </p>

        {/* Tags */}
        <div className="flex flex-col gap-2 mb-5">
          {profile.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              {editingTagIndex === index ? (
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  onBlur={() => setEditingTagIndex(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTagIndex(null)}
                  autoFocus
                  className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded outline-none flex-1"
                />
              ) : (
                <span
                  onClick={() => setEditingTagIndex(index)}
                  className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {tag}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-gray-200">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateProfile({ bio: e.currentTarget.textContent || '' })}
            className="text-sm text-gray-600 leading-relaxed outline-none"
          >
            {profile.bio}
          </p>
        </div>
      </div>
    </aside>
  )
}
