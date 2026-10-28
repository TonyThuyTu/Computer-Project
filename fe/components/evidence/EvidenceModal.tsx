"use client";

import React, { useEffect } from "react";
import { X, Sparkles, BookOpen } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageNumber: string;
  title: string;
  subtitle: string;
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  children: React.ReactNode;
}

export function EvidenceModal({
  isOpen,
  onClose,
  stageNumber,
  title,
  subtitle,
  tabs,
  activeTab,
  setActiveTab,
  children,
}: EvidenceModalProps) {
  // Đóng modal khi nhấn phím Escape và khóa cuộn trang nền
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Sticky Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-border bg-surface shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                {stageNumber}
              </span>
              <span className="text-[11px] text-muted flex items-center gap-1 font-medium">
                <Sparkles size={12} className="text-accent" />
                Hồ sơ Bằng chứng & Phản biện Học thuật
              </span>
            </div>
            <h3 className="text-lg font-bold text-text tracking-tight">{title}</h3>
            <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted hover:text-text rounded-md hover:bg-active border border-transparent hover:border-border transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 px-5 border-b border-border bg-raised/50 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon || BookOpen;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-accent text-accent bg-surface font-semibold"
                    : "border-transparent text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                <Icon size={14} className={isActive ? "text-accent" : "text-muted"} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-accent-subtle text-accent font-bold"
                        : "bg-active text-muted"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-text flex-1">
          {children}
        </div>

        {/* Sticky Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface shrink-0 text-[12px] text-muted">
          <span className="flex items-center gap-1.5 text-faint">
            <BookOpen size={13} />
            Môn học: Toán Thống kê Ứng dụng (MAS) • Khảo sát Hồi quy Tuyến tính
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-active hover:bg-control/60 text-text font-medium text-[12.5px] rounded-md border border-border transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
