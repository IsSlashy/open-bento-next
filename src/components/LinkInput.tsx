'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, X, Loader2 } from 'lucide-react';
import { useBentoStore } from '@/lib/store';

// Patterns pour détecter les plateformes - ORDRE IMPORTANT !
// Les patterns les plus spécifiques doivent être en premier
const platformPatterns: Array<{ name: string; pattern: RegExp; usernameGroup: number }> = [
  // Twitch - AVANT Twitter (éviter confusion)
  { name: 'twitch', pattern: /^https?:\/\/(www\.)?twitch\.tv\/([^\/\?]+)/i, usernameGroup: 2 },

  // Twitter / X
  { name: 'twitter', pattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/([^\/\?]+)/i, usernameGroup: 3 },

  // Instagram
  { name: 'instagram', pattern: /^https?:\/\/(www\.)?instagram\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // TikTok
  { name: 'tiktok', pattern: /^https?:\/\/(www\.)?tiktok\.com\/@?([^\/\?]+)/i, usernameGroup: 2 },

  // YouTube
  { name: 'youtube', pattern: /^https?:\/\/(www\.)?(youtube\.com\/(watch|channel|c|@)|youtu\.be\/)([^\/\?&]+)?/i, usernameGroup: 4 },

  // GitHub
  { name: 'github', pattern: /^https?:\/\/(www\.)?github\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // LinkedIn
  { name: 'linkedin', pattern: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/([^\/\?]+)/i, usernameGroup: 3 },

  // Discord
  { name: 'discord', pattern: /^https?:\/\/(www\.)?(discord\.(gg|com\/invite))\/([^\/\?]+)/i, usernameGroup: 4 },

  // Spotify
  { name: 'spotify', pattern: /^https?:\/\/(www\.|open\.)?spotify\.com\/(artist|playlist|album|track|user)\/([^\/\?]+)/i, usernameGroup: 3 },

  // Buy Me a Coffee
  { name: 'buymeacoffee', pattern: /^https?:\/\/(www\.)?buymeacoffee\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // Ko-fi
  { name: 'kofi', pattern: /^https?:\/\/(www\.)?ko-fi\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // Patreon
  { name: 'patreon', pattern: /^https?:\/\/(www\.)?patreon\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // Threads
  { name: 'threads', pattern: /^https?:\/\/(www\.)?threads\.net\/@?([^\/\?]+)/i, usernameGroup: 2 },

  // Reddit
  { name: 'reddit', pattern: /^https?:\/\/(www\.)?reddit\.com\/(r|u|user)\/([^\/\?]+)/i, usernameGroup: 3 },

  // Pinterest
  { name: 'pinterest', pattern: /^https?:\/\/(www\.)?pinterest\.(com|fr|de|co\.uk)\/([^\/\?]+)/i, usernameGroup: 3 },

  // Dribbble
  { name: 'dribbble', pattern: /^https?:\/\/(www\.)?dribbble\.com\/([^\/\?]+)/i, usernameGroup: 2 },

  // Behance
  { name: 'behance', pattern: /^https?:\/\/(www\.)?behance\.net\/([^\/\?]+)/i, usernameGroup: 2 },

  // Snapchat
  { name: 'snapchat', pattern: /^https?:\/\/(www\.)?snapchat\.com\/add\/([^\/\?]+)/i, usernameGroup: 2 },
];

// Types de cartes sociales
const socialPlatforms = ['instagram', 'tiktok', 'twitter', 'youtube', 'twitch', 'spotify', 'threads'];

interface LinkInputProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function LinkInput({ onClose, onSuccess }: LinkInputProps) {
  const { addCard } = useBentoStore();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Valider l'URL
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Détecter la plateforme
  const detectPlatform = (inputUrl: string): { platform: string; username: string | null } => {
    // Parcourir les patterns dans l'ordre (array garantit l'ordre)
    for (const { name, pattern, usernameGroup } of platformPatterns) {
      const match = inputUrl.match(pattern);
      if (match) {
        const username = match[usernameGroup] || null;
        return { platform: name, username };
      }
    }
    return { platform: 'link', username: null };
  };

  // Extraire le titre depuis l'URL
  const getTitleFromUrl = (inputUrl: string): string => {
    try {
      const urlObj = new URL(inputUrl);
      const hostname = urlObj.hostname.replace('www.', '');
      // Capitaliser le nom de domaine
      return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    } catch {
      return 'Link';
    }
  };

  // Traiter le lien
  const processLink = async (inputUrl: string) => {
    if (!inputUrl.trim()) return;

    // Ajouter https:// si manquant
    let processedUrl = inputUrl.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!isValidUrl(processedUrl)) {
      onSuccess('Invalid URL');
      return;
    }

    setIsLoading(true);

    try {
      const { platform, username } = detectPlatform(processedUrl);

      // Créer la carte selon le type
      if (socialPlatforms.includes(platform)) {
        // Carte sociale
        addCard({
          type: 'social',
          position: { x: 0, y: 0 },
          size: { width: 2, height: 2 },
          content: {
            type: 'social',
            data: {
              platform,
              username: username ? `@${username}` : '@user',
              url: processedUrl,
              icon: platform,
            },
          },
        });
        onSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} card added!`);
      } else if (platform === 'github') {
        // Carte GitHub
        addCard({
          type: 'github',
          position: { x: 0, y: 0 },
          size: { width: 4, height: 4 },
          content: {
            type: 'github',
            data: {
              username: username || 'user',
              showContributions: true,
            },
          },
        });
        onSuccess('GitHub card added!');
      } else {
        // Carte lien générique
        const hostname = new URL(processedUrl).hostname.replace('www.', '');
        addCard({
          type: 'link',
          position: { x: 0, y: 0 },
          size: { width: 4, height: 2 },
          content: {
            type: 'link',
            data: {
              url: processedUrl,
              title: getTitleFromUrl(processedUrl),
              favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            },
          },
        });
        onSuccess('Link added!');
      }

      setUrl('');
      onClose();
    } catch (error) {
      console.error('Error processing link:', error);
      onSuccess('Error adding link');
    } finally {
      setIsLoading(false);
    }
  };

  // Coller depuis le presse-papier
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      // Auto-process after paste
      processLink(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Gérer le submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processLink(url);
  };

  // Gérer le paste dans l'input
  const handleInputPaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    // Auto-process after a short delay
    setTimeout(() => {
      processLink(pastedText);
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="link-input-container">
      <Link className="link-input-icon" />
      <input
        ref={inputRef}
        type="text"
        className="link-input"
        placeholder="Enter Link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onPaste={handleInputPaste}
        disabled={isLoading}
      />
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : (
        <>
          <button
            type="button"
            className="paste-btn"
            onClick={handlePaste}
          >
            Paste
          </button>
          <button
            type="button"
            className="link-close-btn"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </form>
  );
}
