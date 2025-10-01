import React from "react";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <div id={id} className="section">
      {title && <h2>{title}</h2>} 
      <div className="content">{children}</div>
    </div>
  );
};

export default Section;
