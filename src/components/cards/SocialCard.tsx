'use client';

import { SocialContent } from '@/lib/types';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154 1.132-.018 2.163.086 3.079.313-.048-1.026-.397-1.81-1.04-2.335-.715-.584-1.782-.876-3.172-.869-.665.004-1.349.07-2.035.192l-.37-2.017c.823-.146 1.654-.22 2.476-.224 1.918-.01 3.477.472 4.636 1.434 1.22 1.012 1.858 2.473 1.898 4.342.428.182.834.399 1.212.654 1.318.888 2.236 2.131 2.654 3.598.506 1.77.39 4.12-1.565 6.032C18.612 23.049 15.915 23.974 12.186 24zm.048-9.884c-1.966.054-3.251.754-3.205 1.974.026.69.378 1.162.989 1.5.704.388 1.63.538 2.564.49 1.072-.06 1.9-.449 2.463-1.158.466-.585.756-1.403.872-2.464-.965-.2-2.02-.314-3.102-.333l-.58-.01z" />
  </svg>
);

const platformConfig: Record<string, {
  icon: React.ComponentType;
  className: string;
  name: string;
}> = {
  instagram: {
    icon: InstagramIcon,
    className: 'instagram',
    name: 'Instagram',
  },
  tiktok: {
    icon: TikTokIcon,
    className: 'tiktok',
    name: 'TikTok',
  },
  twitter: {
    icon: TwitterIcon,
    className: 'twitter',
    name: 'X',
  },
  youtube: {
    icon: YoutubeIcon,
    className: 'youtube',
    name: 'YouTube',
  },
  twitch: {
    icon: TwitchIcon,
    className: 'twitch',
    name: 'Twitch',
  },
  spotify: {
    icon: SpotifyIcon,
    className: 'spotify',
    name: 'Spotify',
  },
  threads: {
    icon: ThreadsIcon,
    className: 'threads',
    name: 'Threads',
  },
};

interface SocialCardProps {
  content: SocialContent;
  style?: { backgroundColor?: string; textColor?: string };
}

// Extract display name from username (e.g., "@not_mikuu" -> "Not Miku")
function getDisplayName(username: string): string {
  // Remove @ symbol and underscores, capitalize words
  const cleaned = username.replace('@', '').replace(/_/g, ' ');
  return cleaned.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function SocialCard({ content }: SocialCardProps) {
  const platform = content.platform?.toLowerCase() || 'twitter';
  const config = platformConfig[platform] || platformConfig.twitter;
  const IconComponent = config.icon;

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(content.url, '_blank', 'noopener,noreferrer');
  };

  // Get display name - prioritize custom name, then derive from username
  const displayName = getDisplayName(content.username || '@user');

  return (
    <div
      className={`social-card ${config.className}-bg`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon with platform color */}
      <div className={`social-icon ${config.className}`}>
        <IconComponent />
      </div>

      {/* Account info - NOM DU COMPTE, pas du réseau */}
      <span className="social-name">{displayName}</span>
      <span className="social-handle">{content.username}</span>

      {/* Follow button - compact with followers count */}
      <button
        onClick={handleFollow}
        className={`social-follow ${config.className}`}
      >
        Follow
        {content.followers && (
          <span className="follower-count">{content.followers}</span>
        )}
      </button>
    </div>
  );
}
