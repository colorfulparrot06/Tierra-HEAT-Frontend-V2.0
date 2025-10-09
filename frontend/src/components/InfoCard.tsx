// src/components/InfoCard.tsx
import React from "react";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  accent?: string; // optional color class or hex, e.g. "#1E90FF" or "var(--accent)"
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  children,
  accent = "#2b6cb0",
  className = "",
}) => {
  const accentStyle = { borderLeft: `4px solid ${accent}` };

  return (
    <div className={`info-card ${className}`} style={accentStyle}>
      <div className="info-card-header">
        <h4 className="info-card-title">{title}</h4>
        {subtitle && <div className="info-card-sub">{subtitle}</div>}
      </div>
      <div className="info-card-body">{children}</div>
    </div>
  );
};

export default InfoCard;
