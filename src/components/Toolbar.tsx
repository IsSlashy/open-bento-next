'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBentoStore } from '@/lib/store';
import { Image, MapPin, Link, Trash2, Monitor, Smartphone, Type } from 'lucide-react';
import { compressImage } from '@/lib/utils';
import { LinkInput } from './LinkInput';

interface ToolbarProps {
  username?: string;
}

export function Toolbar({ username }: ToolbarProps) {
  const { addCard, resetCards } = useBentoStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const getShareUrl = () => {
    if (username) {
      return `${window.location.origin}/${username}`;
    }
    return window.location.href;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Bento Portfolio',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    toast('Link copied to clipboard!');
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const isGif = file.type === 'image/gif';
      const isVideo = file.type.startsWith('video/');

      if (isVideo) {
        // Video - read directly
        const reader = new FileReader();
        reader.onload = () => {
          addCard({
            type: 'media',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 4 },
            content: {
              type: 'media',
              data: {
                type: 'video',
                url: reader.result as string,
                alt: file.name,
              },
            },
          });
          toast('Video added!');
        };
        reader.readAsDataURL(file);
      } else if (isGif) {
        // GIF - read directly (no compression to keep animation)
        const reader = new FileReader();
        reader.onload = () => {
          addCard({
            type: 'media',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 4 },
            content: {
              type: 'media',
              data: {
                type: 'gif',
                url: reader.result as string,
                alt: file.name,
              },
            },
          });
          toast('GIF added!');
        };
        reader.readAsDataURL(file);
      } else {
        // Image - compress
        const compressed = await compressImage(file);
        addCard({
          type: 'media',
          position: { x: 0, y: 0 },
          size: { width: 4, height: 4 },
          content: {
            type: 'media',
            data: {
              type: 'image',
              url: compressed,
              alt: file.name,
            },
          },
        });
        toast('Image added!');
      }
    } catch (error) {
      toast('Error adding media');
    }

    e.target.value = '';
  };

  const handleAddMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          addCard({
            type: 'map',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 2 },
            content: {
              type: 'map',
              data: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                zoom: 14,
              },
            },
          });
          toast('Location added!');
        },
        () => {
          addCard({
            type: 'map',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 2 },
            content: {
              type: 'map',
              data: {
                lat: 48.8566,
                lng: 2.3522,
                zoom: 12,
              },
            },
          });
          toast('Map added (default location)');
        }
      );
    }
  };

  const handleAddSectionTitle = () => {
    addCard({
      type: 'title',
      position: { x: 0, y: 0 },
      size: { width: 8, height: 2 },
      content: {
        type: 'title',
        data: {
          text: 'Section Title',
        },
      },
    });
    toast('Section title added!');
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleAddImage}
        className="hidden"
      />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="toast"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar Container avec Popup */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="toolbar-container"
      >
        {/* Link Popup - au dessus de la toolbar */}
        <AnimatePresence>
          {showLinkInput && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <LinkInput
                onClose={() => setShowLinkInput(false)}
                onSuccess={(message) => {
                  toast(message);
                  setShowLinkInput(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toolbar */}
        <div className="toolbar">
          {/* Share Button */}
          <button className="share-btn" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            <span>Share my Bento</span>
          </button>

          {/* Username URL indicator */}
          {username && (
            <button className="toolbar-url" onClick={handleCopy} title="Click to copy your public URL">
              /{username}
            </button>
          )}

          {/* Toolbar Icons */}
          <div className="toolbar-icons">
            {/* Add Link */}
            <button
              className={`toolbar-icon-btn ${showLinkInput ? 'active' : ''}`}
              onClick={() => setShowLinkInput(!showLinkInput)}
              title="Add Link"
            >
              <Link className="w-[18px] h-[18px]" />
            </button>

            {/* Add Image/Video */}
            <button
              className="toolbar-icon-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Add Image/Video"
            >
              <Image className="w-[18px] h-[18px]" />
            </button>

            {/* Section Title */}
            <button
              className="toolbar-icon-btn"
              onClick={handleAddSectionTitle}
              title="Section Title"
            >
              <Type className="w-[18px] h-[18px]" />
            </button>

            {/* Add Map */}
            <button
              className="toolbar-icon-btn"
              onClick={handleAddMap}
              title="Add Location"
            >
              <MapPin className="w-[18px] h-[18px]" />
            </button>

            {/* Reset */}
            <button
              className="toolbar-icon-btn"
              onClick={() => {
                if (confirm('Reset all cards to default?')) {
                  resetCards();
                  toast('Cards reset!');
                }
              }}
              title="Reset"
            >
              <Trash2 className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewMode('desktop')}
              title="Desktop View"
            >
              <Monitor className="w-[18px] h-[18px]" />
            </button>
            <button
              className={`view-btn ${viewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewMode('mobile')}
              title="Mobile View"
            >
              <Smartphone className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
