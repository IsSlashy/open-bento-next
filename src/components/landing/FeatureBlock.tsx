interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureBlock({ icon, title, description }: FeatureBlockProps) {
  return (
    <div className="feature-block">
      <div className="feature-icon-wrapper">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
