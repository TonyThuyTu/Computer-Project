import React from "react";

export type PillVariant =
  | "positive"
  | "negative"
  | "warning"
  | "neutral"
  | "accent";

interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ variant, children, className = "" }: PillProps) {
  const styles: Record<PillVariant, string> = {
    positive: "bg-positive-bg text-positive-ink border border-[#bbf7d0]",
    negative: "bg-negative-bg text-negative-ink border border-[#fecaca]",
    warning: "bg-warning-bg text-warning-ink border border-[#fef08a]",
    neutral: "bg-active text-muted border border-border",
    accent: "bg-accent-subtle text-accent border border-accent/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
