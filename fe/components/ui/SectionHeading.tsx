import React from "react";

interface SectionHeadingProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  stepNumber?: string;
  title: string;
  subtitle: string;
}

export function SectionHeading({
  icon: Icon,
  stepNumber,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="mt-0.5 p-1.5 rounded bg-active border border-border shrink-0">
        <Icon size={16} className="text-text" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          {stepNumber && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
              {stepNumber}
            </span>
          )}
          <h2 className="text-base font-semibold text-text leading-tight">
            {title}
          </h2>
        </div>
        <p className="text-[13px] text-muted mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
