import React from "react";
import { FlaskConical } from "lucide-react";

interface HeaderProps {
  backendOnline: boolean | null;
}

export function Header({ backendOnline }: HeaderProps) {
  return (
    <header className="h-13 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-text text-surface font-bold text-sm">
          <FlaskConical size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-text tracking-tight">
              MAS Statistical Dashboard
            </span>
            <span className="text-[11px] font-mono uppercase bg-active text-muted px-2 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[12px]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline === true
                ? "bg-positive"
                : backendOnline === false
                ? "bg-negative"
                : "bg-faint animate-pulse"
            }`}
          />
          <span className="text-muted">
            Backend Flask:{" "}
            {backendOnline === true
              ? "Hoạt động (Port 5000)"
              : backendOnline === false
              ? "Mất kết nối"
              : "Đang kiểm tra..."}
          </span>
        </div>
        <span className="hidden sm:inline text-border">|</span>
        <span className="hidden sm:inline text-faint num">
          Môn học: Toán Thống kê Ứng dụng (MAS)
        </span>
      </div>
    </header>
  );
}
