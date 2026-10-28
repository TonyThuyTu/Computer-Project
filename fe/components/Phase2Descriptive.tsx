import React from "react";
import { BarChart3, Info, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import type { DescriptiveStats } from "@/app/types";

interface Phase2DescriptiveProps {
  descriptive: {
    x: DescriptiveStats;
    y: DescriptiveStats;
  };
}

export function Phase2Descriptive({ descriptive }: Phase2DescriptiveProps) {
  const statRows = [
    {
      label: "Cỡ mẫu (n)",
      key: "n" as const,
      desc: "Số lượng sinh viên hợp lệ trong khảo sát",
    },
    {
      label: "Trung bình (Mean)",
      key: "mean" as const,
      desc: "Giá trị kỳ vọng trung bình của phân phối",
    },
    {
      label: "Trung vị (Median)",
      key: "median" as const,
      desc: "Điểm ở vị trí 50% khi sắp xếp thứ tự",
    },
    {
      label: "Độ lệch chuẩn (Std Dev, s)",
      key: "std_dev" as const,
      desc: "Mức độ phân tán quanh giá trị trung bình",
    },
    {
      label: "Phương sai (Variance, s²)",
      key: "variance" as const,
      desc: "Bình phương độ lệch chuẩn",
    },
    {
      label: "Giá trị nhỏ nhất (Min)",
      key: "min" as const,
      desc: "Điểm số thấp nhất ghi nhận được",
    },
    {
      label: "Tứ phân vị 1 (Q1 - 25%)",
      key: "q1" as const,
      desc: "25% sinh viên có điểm thấp hơn mức này",
    },
    {
      label: "Tứ phân vị 3 (Q3 - 75%)",
      key: "q3" as const,
      desc: "75% sinh viên có điểm thấp hơn mức này",
    },
    {
      label: "Giá trị lớn nhất (Max)",
      key: "max" as const,
      desc: "Điểm số cao nhất ghi nhận được",
    },
    {
      label: "Khoảng tứ phân vị (IQR = Q3 - Q1)",
      key: "iqr" as const,
      desc: "Độ trải giữa của 50% dữ liệu trung tâm",
    },
  ];

  return (
    <section id="phase-2-descriptive">
      <SectionHeading
        icon={BarChart3}
        stepNumber="Giai đoạn 2"
        title="Thống kê Mô tả & So sánh Phân phối (Câu 3 & 4)"
        subtitle="Đối chiếu phân phối tập trung và độ phân tán giữa Điểm Giữa Kỳ (X) và Điểm Cuối Kỳ (Y)"
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-raised">
                <th className="text-left py-3 px-4 text-[12px] uppercase font-semibold text-muted">
                  Chỉ số Thống kê
                </th>
                <th className="text-right py-3 px-4 text-[12px] uppercase font-semibold text-text">
                  Điểm Giữa Kỳ (X)
                </th>
                <th className="text-right py-3 px-4 text-[12px] uppercase font-semibold text-text">
                  Điểm Cuối Kỳ (Y)
                </th>
                <th className="text-left py-3 px-4 text-[12px] uppercase font-semibold text-muted hidden md:table-cell">
                  Ý nghĩa Thống kê
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {statRows.map((row) => (
                <tr key={row.key} className="hover:bg-raised/60 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-text">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-4 text-right num font-semibold text-text">
                    {descriptive.x[row.key]}
                  </td>
                  <td className="py-2.5 px-4 text-right num font-semibold text-accent">
                    {descriptive.y[row.key]}
                  </td>
                  <td className="py-2.5 px-4 text-faint text-[13px] hidden md:table-cell">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Outliers Box (1.5 * IQR Rule) */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-muted" />
            <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider">
              Chẩn đoán Ngoại lệ (Outliers) — Quy tắc Hàng rào 1.5 × IQR
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-raised rounded-lg p-3.5 border border-border">
              <p className="text-[12px] font-semibold text-muted">
                Ngoại lệ Điểm Giữa Kỳ (X)
              </p>
              <p className="text-[14px] text-text mt-1.5 num font-medium">
                {descriptive.x.outliers.length > 0 ? (
                  <span className="text-negative font-bold">
                    Phát hiện {descriptive.x.outliers.length} giá trị:{" "}
                    {descriptive.x.outliers.join(", ")}
                  </span>
                ) : (
                  <span className="text-positive flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={14} />
                    Không phát hiện ngoại lệ tiềm năng
                  </span>
                )}
              </p>
              <p className="text-[11px] text-faint mt-1">
                Hàng rào: [
                {(descriptive.x.q1 - 1.5 * descriptive.x.iqr).toFixed(2)},{" "}
                {(descriptive.x.q3 + 1.5 * descriptive.x.iqr).toFixed(2)}]
              </p>
            </div>

            <div className="bg-raised rounded-lg p-3.5 border border-border">
              <p className="text-[12px] font-semibold text-muted">
                Ngoại lệ Điểm Cuối Kỳ (Y)
              </p>
              <p className="text-[14px] text-text mt-1.5 num font-medium">
                {descriptive.y.outliers.length > 0 ? (
                  <span className="text-negative font-bold">
                    Phát hiện {descriptive.y.outliers.length} giá trị:{" "}
                    {descriptive.y.outliers.join(", ")}
                  </span>
                ) : (
                  <span className="text-positive flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={14} />
                    Không phát hiện ngoại lệ tiềm năng
                  </span>
                )}
              </p>
              <p className="text-[11px] text-faint mt-1">
                Hàng rào: [
                {(descriptive.y.q1 - 1.5 * descriptive.y.iqr).toFixed(2)},{" "}
                {(descriptive.y.q3 + 1.5 * descriptive.y.iqr).toFixed(2)}]
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
