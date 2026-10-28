import React from "react";

export function StageNav() {
  const stages = [
    {
      num: 1,
      title: "Làm sạch & Mẫu",
      sub: "Valid n & Loại trừ",
      anchor: "#phase-1-cleaning",
    },
    {
      num: 2,
      title: "Thống kê Mô tả",
      sub: "Bảng 10 chỉ số & Outlier",
      anchor: "#phase-2-descriptive",
    },
    {
      num: 3,
      title: "Hồi quy Tuyến tính",
      sub: "Ŷ = β₀ + β₁X & 2 Biểu đồ",
      anchor: "#phase-3-regression",
    },
    {
      num: 4,
      title: "Kiểm định Giả thuyết",
      sub: "Trung bình μ & Hệ số β₁",
      anchor: "#phase-4-hypothesis",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      {stages.map((stage) => (
        <a
          key={stage.num}
          href={stage.anchor}
          className="bg-surface border border-border rounded-lg p-2.5 flex items-center gap-2.5 hover:border-accent/40 hover:bg-raised transition-all"
        >
          <div className="w-6 h-6 rounded bg-active flex items-center justify-center text-[12px] font-bold text-muted">
            {stage.num}
          </div>
          <div className="text-[12px] leading-tight">
            <p className="font-semibold text-text">{stage.title}</p>
            <p className="text-faint text-[11px]">{stage.sub}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
