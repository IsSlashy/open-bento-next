const AVATAR_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
const INITIALS = ['A', 'M', 'S', 'J', 'K'];

export default function SocialProof() {
  return (
    <div className="social-proof">
      <div className="social-proof-avatars">
        {AVATAR_COLORS.map((color, i) => (
          <div
            key={i}
            className="social-proof-avatar"
            style={{ background: color, zIndex: AVATAR_COLORS.length - i }}
          >
            <span>{INITIALS[i]}</span>
          </div>
        ))}
        <div className="social-proof-count">+2.4k</div>
      </div>
      <p className="social-proof-text">
        Join <strong>500k+ creators</strong> already using Open Bento
      </p>
    </div>
  );
}
