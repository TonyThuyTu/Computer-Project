import React from "react";
import { ShieldCheck, HelpCircle } from "lucide-react";

interface DefenseCalloutProps {
  question: string;
  answer: string | React.ReactNode;
  note?: string;
  variant?: "defense" | "theory" | "warning";
}

export function DefenseCallout({
  question,
  answer,
  note,
  variant = "defense",
}: DefenseCalloutProps) {
  const isDefense = variant === "defense";
  const isWarning = variant === "warning";

  return (
    <div
      className={`rounded-lg border p-4 my-3 text-[13px] leading-relaxed transition-all ${
        isDefense
          ? "bg-accent-subtle/40 border-accent/30 text-text"
          : isWarning
          ? "bg-warning-bg/60 border-amber-300 text-text"
          : "bg-surface border-border text-text"
      }`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className={`p-1 rounded shrink-0 mt-0.5 ${
            isDefense
              ? "bg-accent text-white"
              : isWarning
              ? "bg-amber-600 text-white"
              : "bg-active text-text"
          }`}
        >
          {isDefense ? <ShieldCheck size={14} /> : <HelpCircle size={14} />}
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-0.5">
            {isDefense
              ? "Câu hỏi giảng viên phản biện & Chiến lược đối đáp"
              : "Khái niệm lý thuyết trọng tâm"}
          </span>
          <p className="font-semibold text-text text-[13.5px] leading-snug">
            "{question}"
          </p>
        </div>
      </div>

      <div className="pl-6 border-l-2 border-accent/40 ml-2 mt-2 space-y-1.5 text-muted">
        {typeof answer === "string" ? (
          <p className="text-[13px] text-text font-normal">{answer}</p>
        ) : (
          answer
        )}
        {note && (
          <p className="text-[11.5px] text-faint italic mt-1.5">
            💡 Gợi ý thêm: {note}
          </p>
        )}
      </div>
    </div>
  );
}
