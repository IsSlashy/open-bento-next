import Link from 'next/link';
import { auth } from '@/lib/auth';
import ShowcaseGrid from '@/components/landing/ShowcaseGrid';
import FeatureBlock from '@/components/landing/FeatureBlock';
import SocialProof from '@/components/landing/SocialProof';

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="14" height="14" rx="4" fill="#10b981" />
              <rect x="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
              <rect y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
              <rect x="18" y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.3" />
            </svg>
            Open Bento
          </Link>
          <div className="landing-nav-actions">
            {session?.user ? (
              <Link href="/editor" className="landing-btn landing-btn-primary">
                Go to Editor
              </Link>
            ) : (
              <>
                <Link href="/login" className="landing-btn landing-btn-ghost">
                  Log In
                </Link>
                <Link href="/register" className="landing-btn landing-btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Free & Open Source
          </div>
          <h1 className="landing-title">
            All your links & content
            <br />
            on one beautiful page.
          </h1>
          <p className="landing-subtitle">
            Create a stunning portfolio that brings together all your work,
            social profiles, and content into a beautiful bento grid layout.
          </p>
          <div className="landing-cta-row">
            <Link href="/register" className="landing-btn landing-btn-cta">
              Sign up — it&apos;s free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/IsSlashy/open-bento-next"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-btn landing-btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
          <SocialProof />
        </div>
      </section>

      {/* Showcase Widgets */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">
            Your content, beautifully organized
          </h2>
          <p className="landing-section-subtitle">
            Mix and match widgets to create the perfect page. Social links, maps, music, code, text — all in one place.
          </p>
          <ShowcaseGrid />
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Everything you need</h2>
          <p className="landing-section-subtitle">
            A powerful editor with intuitive tools to build your perfect page.
          </p>
          <div className="landing-features-grid">
            <FeatureBlock
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="3" width="7" height="7" rx="2" />
                  <rect x="3" y="14" width="7" height="7" rx="2" />
                  <rect x="14" y="14" width="7" height="7" rx="2" />
                </svg>
              }
              title="Beautiful Widgets"
              description="Choose from social, media, map, text, and link widgets. Each one is designed to showcase your content perfectly."
            />
            <FeatureBlock
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              }
              title="Drag & Drop"
              description="Arrange your cards with intuitive drag and drop. Resize, reorder, and customize your layout in seconds."
            />
            <FeatureBlock
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Open Source"
              description="Free forever. Self-host or use our cloud. MIT licensed with a growing community of contributors."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner landing-final-cta">
          <h2 className="landing-final-title">
            Create your page today
          </h2>
          <p className="landing-final-subtitle">
            Join thousands of creators who use Open Bento to share their work with the world.
          </p>
          <Link href="/register" className="landing-btn landing-btn-cta">
            Get started for free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="14" height="14" rx="4" fill="#10b981" />
              <rect x="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
              <rect y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
              <rect x="18" y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.3" />
            </svg>
            <span>Open Bento</span>
          </div>
          <div className="landing-footer-links">
            <a
              href="https://github.com/IsSlashy/open-bento-next"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://github.com/IsSlashy/open-bento-next/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Issues
            </a>
          </div>
          <span className="landing-footer-copy">
            MIT License
          </span>
        </div>
      </footer>
    </div>
  );
}
