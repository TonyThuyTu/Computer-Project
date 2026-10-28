import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Card({ children, className = "", id }: CardProps) {
  return (
    <div
      id={id}
      className={`bg-surface border border-border rounded-[var(--radius-card)] p-[var(--card-pad)] transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}
