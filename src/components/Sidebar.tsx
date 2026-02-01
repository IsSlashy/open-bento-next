'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { signOut } from 'next-auth/react';
import { useBentoStore } from '@/lib/store';
import { useTheme } from '@/components/providers/ThemeProvider';
import { HelpCircle, Upload, Trash2, X, Check, LogOut, Download, Moon, Sun, UploadCloud } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const MAX_BIO_LENGTH = 280;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const { profile, updateProfile } = useBentoStore();
  const { resolvedTheme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(MAX_BIO_LENGTH - (profile.bio?.length || 0));

  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [mounted, setMounted] = useState(false);

  // Settings menu state
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  useEffect(() => {
    setCharCount(MAX_BIO_LENGTH - (profile.bio?.length || 0));
  }, [profile.bio]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isGif = file.type === 'image/gif';

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const dataUrl = reader.result?.toString() || '';

        // Pour les GIFs, utiliser directement (le crop perd l'animation)
        if (isGif) {
          updateProfile({ avatar: dataUrl });
        } else {
          setImgSrc(dataUrl);
          setShowCropModal(true);
        }
      });
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const getCroppedImg = async (): Promise<string> => {
    const image = imgRef.current;
    if (!image || !completedCrop) return '';

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleCropComplete = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      updateProfile({ avatar: croppedImageUrl });
    }
    setShowCropModal(false);
    setImgSrc('');
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImgSrc('');
  };

  const handleAvatarDelete = () => {
    updateProfile({ avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' });
  };

  const handleBioInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const text = e.currentTarget.textContent || '';
    const remaining = MAX_BIO_LENGTH - text.length;
    setCharCount(remaining);

    // Limit to max length
    if (text.length > MAX_BIO_LENGTH) {
      e.currentTarget.textContent = text.substring(0, MAX_BIO_LENGTH);
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      setCharCount(0);
    }
  };

  const handleBioBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    const text = e.currentTarget.textContent || '';
    updateProfile({ bio: text.substring(0, MAX_BIO_LENGTH) });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...profile.tags];
    newTags[index] = value;
    updateProfile({ tags: newTags });
  };

  const getCharCountClass = () => {
    if (charCount <= 0) return 'char-count error';
    if (charCount <= 20) return 'char-count warning';
    return 'char-count';
  };

  return (
    <aside className="sidebar">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,image/gif"
        onChange={onSelectFile}
        className="hidden"
      />

      {/* Crop Modal - Rendu via Portal dans le body */}
      {mounted && showCropModal && createPortal(
        <div className="crop-overlay">
          <div className="crop-modal">
            <div className="crop-modal-header">
              <h3>Recadrer l'image</h3>
              <button className="crop-close-btn" onClick={handleCropCancel}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop"
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>
            <div className="crop-actions">
              <button className="crop-btn cancel" onClick={handleCropCancel}>
                Annuler
              </button>
              <button className="crop-btn apply" onClick={handleCropComplete}>
                <Check className="w-4 h-4" />
                Appliquer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="profile">
        {/* Avatar - icônes en bas */}
        <div className="avatar-wrapper">
          <img src={profile.avatar} alt={profile.name} className="avatar" />
          {/* Actions en BAS, pas d'overlay */}
          <div className="avatar-actions">
            <button
              className="avatar-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              className="avatar-btn"
              onClick={handleAvatarDelete}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Name - editable */}
        <h1
          className="profile-name"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Your Name"
          onBlur={(e) => updateProfile({ name: e.currentTarget.textContent || '' })}
        >
          {profile.name}
        </h1>

        {/* Title - editable */}
        <p
          className="profile-title"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Your title..."
          onBlur={(e) => updateProfile({ title: e.currentTarget.textContent || '' })}
        >
          {profile.title}
        </p>

        {/* Tags - editable */}
        <ul className="profile-tags">
          {profile.tags.map((tag, index) => (
            <li
              key={index}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Add tag..."
              onBlur={(e) => updateTag(index, e.currentTarget.textContent || '')}
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* Bio - editable with character limit */}
        <div className="bio-wrapper">
          <p
            ref={bioRef}
            className="profile-bio"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write something about yourself..."
            onInput={handleBioInput}
            onBlur={handleBioBlur}
          >
            {profile.bio}
          </p>
          <span className={getCharCountClass()}>
            {charCount}/{MAX_BIO_LENGTH} characters
          </span>
        </div>

        {/* Public URL */}
        {username && (
          <div className="profile-url">
            <span className="profile-url-label">Your public page</span>
            <button
              className="profile-url-value"
              onClick={() => {
                const url = `${window.location.origin}/${username}`;
                navigator.clipboard.writeText(url);
              }}
              title="Click to copy"
            >
              /{username}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="sidebar-footer">
        {/* Settings with menu */}
        <div className="settings-wrapper" ref={settingsRef}>
          <button
            className={`footer-btn ${showSettingsMenu ? 'active' : ''}`}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
          {!showSettingsMenu && <span className="settings-tooltip">Settings</span>}

          {/* Settings Menu */}
          {showSettingsMenu && (
            <div className="settings-menu" role="menu">
              <button
                className="settings-item"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                role="menuitem"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="settings-item-label">
                  {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <div className="settings-divider"></div>
              <button
                className="settings-item"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/export');
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `openbento-export-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error('Export failed:', err);
                  }
                  setShowSettingsMenu(false);
                }}
                role="menuitem"
              >
                <Download className="w-4 h-4" />
                <span className="settings-item-label">Export Data</span>
              </button>
              <button
                className="settings-item"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      const res = await fetch('/api/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                      });
                      if (res.ok) {
                        window.location.reload();
                      }
                    } catch (err) {
                      console.error('Import failed:', err);
                    }
                  };
                  input.click();
                  setShowSettingsMenu(false);
                }}
                role="menuitem"
              >
                <UploadCloud className="w-4 h-4" />
                <span className="settings-item-label">Import Data</span>
              </button>
              <div className="settings-divider"></div>
              <button
                className="settings-item settings-item-danger"
                onClick={() => signOut({ callbackUrl: '/' })}
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                <span className="settings-item-label">Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="footer-btn">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>

        {/* Discord */}
        <div className="discord-btn">
          <button className="footer-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </button>
          <div className="discord-tooltip">Join Discord</div>
        </div>

        <div className="footer-divider"></div>
        <span className="footer-views">2 Views Yesterday</span>
      </footer>
    </aside>
  );
}
