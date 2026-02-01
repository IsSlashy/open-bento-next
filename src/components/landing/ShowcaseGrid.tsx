'use client';

export default function ShowcaseGrid() {
  return (
    <div className="showcase-grid">
      {/* Row 1 */}
      <div className="showcase-card showcase-card-sm">
        <div className="showcase-card-inner showcase-social">
          <div className="showcase-icon" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
          <span className="showcase-label">Instagram</span>
          <span className="showcase-handle">@yourname</span>
          <span className="showcase-follow-btn" style={{ background: '#e1306c' }}>Follow</span>
        </div>
      </div>

      <div className="showcase-card showcase-card-lg">
        <div className="showcase-card-inner showcase-map">
          <div className="showcase-map-bg">
            <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="showcase-map-svg">
              <rect width="400" height="200" fill="#e8f4f8" />
              <path d="M0 120 Q100 80 200 110 T400 90" stroke="#b8d4e3" strokeWidth="2" fill="none" />
              <path d="M0 140 Q150 100 250 130 T400 110" stroke="#c8dae3" strokeWidth="1.5" fill="none" />
              <circle cx="200" cy="100" r="6" fill="#10b981" />
              <circle cx="200" cy="100" r="12" fill="#10b981" opacity="0.2" />
              <circle cx="200" cy="100" r="20" fill="#10b981" opacity="0.1" />
              <path d="M50 80 L80 60 L110 85 L140 70 L170 90" stroke="#d0e0e8" strokeWidth="1" fill="none" />
              <path d="M230 75 L260 55 L290 80 L320 65 L350 85" stroke="#d0e0e8" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <div className="showcase-map-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            San Francisco, CA
          </div>
        </div>
      </div>

      <div className="showcase-card showcase-card-sm">
        <div className="showcase-card-inner showcase-github">
          <div className="showcase-icon" style={{ background: '#24292f' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <span className="showcase-label">GitHub</span>
          <span className="showcase-handle">@yourname</span>
          <div className="showcase-github-graph">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="showcase-github-dot"
                style={{
                  background: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="showcase-card showcase-card-lg">
        <div className="showcase-card-inner showcase-spotify">
          <div className="showcase-spotify-content">
            <div className="showcase-icon" style={{ background: '#1DB954' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <div className="showcase-spotify-info">
              <span className="showcase-spotify-playing">Now Playing</span>
              <span className="showcase-spotify-track">Blinding Lights</span>
              <span className="showcase-spotify-artist">The Weeknd</span>
            </div>
          </div>
          <div className="showcase-spotify-bar">
            <div className="showcase-spotify-progress" />
          </div>
        </div>
      </div>

      <div className="showcase-card showcase-card-sm">
        <div className="showcase-card-inner showcase-link">
          <div className="showcase-icon" style={{ background: '#f3f4f6' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="showcase-label">My Website</span>
          <span className="showcase-handle">yoursite.com</span>
          <svg className="showcase-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>

      <div className="showcase-card showcase-card-sm">
        <div className="showcase-card-inner showcase-text">
          <span className="showcase-text-title">About Me</span>
          <span className="showcase-text-body">
            Designer & developer crafting digital experiences. Currently building something new.
          </span>
        </div>
      </div>
    </div>
  );
}
