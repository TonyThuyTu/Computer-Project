import React from "react";

interface SectionHeadingProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  stepNumber?: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  icon: Icon,
  stepNumber,
  title,
  subtitle,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div className="flex items-start gap-3">
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
      {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
    </div>
  );
}
