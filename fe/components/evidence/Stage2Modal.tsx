"use client";

import React, { useState } from "react";
import {
  Calculator,
  ShieldAlert,
  BarChart2,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { EvidenceModal, type TabItem } from "./EvidenceModal";
import { DefenseCallout } from "./DefenseCallout";
import type { DescriptiveStats } from "@/app/types";

interface Stage2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  descriptive: {
    x: DescriptiveStats;
    y: DescriptiveStats;
  };
}

export function Stage2Modal({ isOpen, onClose, descriptive }: Stage2ModalProps) {
  const [activeTab, setActiveTab] = useState("tab-calc");
  const { x, y } = descriptive;

  // Tính ngưỡng hàng rào Tukey 1.5*IQR thực tế
  const xLower = Number((x.q1 - 1.5 * x.iqr).toFixed(2));
  const xUpper = Number((x.q3 + 1.5 * x.iqr).toFixed(2));
  const yLower = Number((y.q1 - 1.5 * y.iqr).toFixed(2));
  const yUpper = Number((y.q3 + 1.5 * y.iqr).toFixed(2));

  // Nhận xét hình thái phân phối (Mean vs Median)
  const getSkewComment = (mean: number, median: number, varName: string) => {
    const diff = mean - median;
    if (Math.abs(diff) < 0.15) {
      return {
        type: "Gần đối xứng (Approximately Symmetric)",
        detail: `Mean (${mean.toFixed(2)}) xấp xỉ bằng Median (${median.toFixed(2)}), phân phối điểm ${varName} tập trung đều đặn quanh tâm.`,
        color: "text-accent",
      };
    }
    if (diff < 0) {
      return {
        type: "Lệch trái (Negatively Skewed / Left-skewed)",
        detail: `Mean (${mean.toFixed(2)}) < Median (${median.toFixed(2)}). Đa số sinh viên đạt điểm khá giỏi, một số ít điểm thấp kéo giá trị trung bình lệch về phía trái.`,
        color: "text-amber-600",
      };
    }
    return {
      type: "Lệch phải (Positively Skewed / Right-skewed)",
      detail: `Mean (${mean.toFixed(2)}) > Median (${median.toFixed(2)}). Đa số sinh viên tập trung ở thang điểm trung bình, một số ít điểm xuất sắc kéo trung bình lệch sang phải.`,
      color: "text-positive",
    };
  };

  const xSkew = getSkewComment(x.mean, x.median, "Giữa kỳ (X)");
  const ySkew = getSkewComment(y.mean, y.median, "Cuối kỳ (Y)");

  const tabs: TabItem[] = [
    {
      id: "tab-calc",
      label: "Công thức & Phương pháp Tính toán (Câu 3)",
      icon: Calculator,
    },
    {
      id: "tab-outlier",
      label: "Phân tích Ngoại lệ theo Hàng rào IQR (Câu 4)",
      icon: ShieldAlert,
      badge: `${x.outliers.length + y.outliers.length} điểm`,
    },
    {
      id: "tab-distribution",
      label: "Đánh giá Phân phối (Độ lệch & Phân tán)",
      icon: BarChart2,
    },
  ];

  return (
    <EvidenceModal
      isOpen={isOpen}
      onClose={onClose}
      stageNumber="Giai đoạn 2"
      title="Thống kê Mô tả & Khảo sát Phân phối Điểm số (Câu 3 & 4)"
      subtitle="Minh chứng công thức mẫu số (n-1), ngưỡng Tukey 1.5*IQR và phân tích hình thái dữ liệu"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: Công thức & Phương pháp tính toán (Câu 3)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-calc" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phương sai mẫu */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Bậc tự do (ddof = 1)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Phương sai Mẫu Hiệu chỉnh (Sample Variance, s²)
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 font-mono text-[13px] text-center text-text">
                s² = ∑(X_i - X̄)² / (n - 1)
              </div>
              <p className="text-[12.5px] text-muted leading-relaxed">
                <strong>Quy tắc học thuật:</strong> Bắt buộc dùng mẫu số{" "}
                <code className="text-text font-bold">(n - 1)</code> thay vì n (Hiệu
                chỉnh Bessel - Bessel's correction). Điều này đảm bảo s² là ước lượng
                không chệch (Unbiased Estimator) cho phương sai tổng thể σ².
              </p>
            </div>

            {/* Độ lệch chuẩn mẫu */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Độ phân tán
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Độ lệch Chuẩn Mẫu (Sample Standard Deviation, s)
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 font-mono text-[13px] text-center text-text">
                s = √(s²) = √[ ∑(X_i - X̄)² / (n - 1) ]
              </div>
              <p className="text-[12.5px] text-muted leading-relaxed">
                Đo lường mức độ dao động trung bình của điểm thi xung quanh giá trị trung
                bình mẫu. Cùng đơn vị đo (điểm) với dữ liệu gốc.
              </p>
            </div>
          </div>

          {/* Quy tắc tính Tứ phân vị */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h5 className="font-semibold text-text text-[14px] mb-1.5">
              Quy tắc Tính Tứ phân vị (Sample Quantiles & Percentiles)
            </h5>
            <p className="text-[13px] text-muted leading-relaxed">
              Mô hình áp dụng thuật toán <strong>nội suy tuyến tính (Linear Interpolation)</strong>{" "}
              tương đương hàm chuẩn <code className="bg-active px-1.5 py-0.5 rounded text-accent font-mono">np.percentile(data, [25, 75], method='linear')</code>.
            </p>
            <ul className="list-disc pl-5 text-[12.5px] text-muted space-y-1 mt-2">
              <li>
                <strong>Q1 (25%):</strong> Ngưỡng điểm mà 25% sinh viên có điểm thấp hơn
                hoặc bằng mức này.
              </li>
              <li>
                <strong>Q2 (50% - Median):</strong> Trung vị, phân chia 50% sinh viên
                điểm thấp hơn và 50% điểm cao hơn.
              </li>
              <li>
                <strong>Q3 (75%):</strong> Ngưỡng điểm mà 75% sinh viên có điểm thấp hơn
                hoặc bằng mức này.
              </li>
            </ul>
          </div>

          {/* Đối đáp phản biện câu hỏi quan trọng */}
          <DefenseCallout
            question="Khi nào Trung vị (Median) mô tả tập dữ liệu tốt hơn Trung bình (Mean)?"
            answer="Trung vị mô tả giá trị điển hình tốt hơn khi phân phối bị lệch mạnh (Skewed) hoặc xuất hiện giá trị ngoại lệ cực đoan (Outliers), vì trung bình rất nhạy cảm với các điểm cực trị (chỉ 1 điểm 0 hoặc 10 đột biến có thể kéo lệch trung bình), còn trung vị có tính vững (robustness), không bị ảnh hưởng bởi độ lớn của các giá trị ở hai đuôi phân phối."
            note="Khi phân phối đối xứng và không có ngoại lệ, Trung bình và Trung vị sẽ xấp xỉ bằng nhau."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: Phân tích Ngoại lệ theo Hàng rào IQR (Câu 4)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-outlier" && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h5 className="font-semibold text-text text-[14px] mb-2">
              Nguyên lý Hàng rào Tukey (Tukey's Fences 1.5 × IQR)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px]">
              <div className="p-3 bg-raised border border-border rounded">
                <span className="font-semibold text-text block mb-1">Khoảng IQR</span>
                <p className="font-mono text-accent">IQR = Q3 - Q1</p>
                <p className="text-muted text-[11.5px] mt-1">Độ trải giữa của 50% dữ liệu trung tâm</p>
              </div>
              <div className="p-3 bg-raised border border-border rounded">
                <span className="font-semibold text-text block mb-1">Hàng rào Dưới (LF)</span>
                <p className="font-mono text-negative">LF = Q1 - 1.5 × IQR</p>
                <p className="text-muted text-[11.5px] mt-1">Giá trị dưới ngưỡng này bị coi là ngoại lệ thấp</p>
              </div>
              <div className="p-3 bg-raised border border-border rounded">
                <span className="font-semibold text-text block mb-1">Hàng rào Trên (UF)</span>
                <p className="font-mono text-positive">UF = Q3 + 1.5 × IQR</p>
                <p className="text-muted text-[11.5px] mt-1">Giá trị trên ngưỡng này bị coi là ngoại lệ cao</p>
              </div>
            </div>
          </div>

          {/* Bảng đối chiếu ngưỡng thực tế */}
          <div className="border border-border rounded-lg overflow-hidden bg-surface">
            <div className="p-3 bg-raised border-b border-border text-[13px] font-semibold text-text">
              Bảng Đối chiếu Ngưỡng Ngoại lệ Thực tế của Dữ liệu
            </div>
            <table className="w-full text-[13px] text-left border-collapse font-mono num">
              <thead className="bg-active/40 text-[11.5px] font-semibold text-muted uppercase font-sans">
                <tr>
                  <th className="py-2.5 px-3">Biến số</th>
                  <th className="py-2.5 px-3 text-right">Q1</th>
                  <th className="py-2.5 px-3 text-right">Q3</th>
                  <th className="py-2.5 px-3 text-right">IQR</th>
                  <th className="py-2.5 px-3 text-right">Hàng rào Dưới</th>
                  <th className="py-2.5 px-3 text-right">Hàng rào Trên</th>
                  <th className="py-2.5 px-3 text-center font-sans">Ngoại lệ phát hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-text">
                    Điểm Giữa kỳ (X)
                  </td>
                  <td className="py-2.5 px-3 text-right">{x.q1.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right">{x.q3.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-accent font-semibold">
                    {x.iqr.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-negative">{xLower}</td>
                  <td className="py-2.5 px-3 text-right text-positive">{xUpper}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    {x.outliers.length > 0 ? (
                      <span className="text-[11.5px] text-negative font-semibold bg-negative-bg px-2 py-0.5 rounded">
                        {x.outliers.join(", ")}
                      </span>
                    ) : (
                      <span className="text-[11.5px] text-positive bg-positive-bg px-2 py-0.5 rounded font-medium">
                        Không có
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-text">
                    Điểm Cuối kỳ (Y)
                  </td>
                  <td className="py-2.5 px-3 text-right">{y.q1.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right">{y.q3.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-accent font-semibold">
                    {y.iqr.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-negative">{yLower}</td>
                  <td className="py-2.5 px-3 text-right text-positive">{yUpper}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    {y.outliers.length > 0 ? (
                      <span className="text-[11.5px] text-negative font-semibold bg-negative-bg px-2 py-0.5 rounded">
                        {y.outliers.join(", ")}
                      </span>
                    ) : (
                      <span className="text-[11.5px] text-positive bg-positive-bg px-2 py-0.5 rounded font-medium">
                        Không có
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <DefenseCallout
            question="Tại sao nhóm không tự động xóa bỏ các điểm ngoại lệ phát hiện theo 1.5*IQR?"
            answer="Ngoại lệ tiềm năng theo 1.5*IQR phản ánh sự biến thiên tự nhiên của năng lực học tập thực tế (sinh viên điểm quá cao hoặc quá thấp), không phải lỗi nhập liệu hay lỗi đo lường kỹ thuật, nên cần giữ lại để phản ánh đúng thực tế. Việc tự ý xóa ngoại lệ mà không có bằng chứng sai sót sẽ làm giảm nhân tạo phương sai và dẫn đến kết luận thiên lệch."
            note="Chỉ xóa ngoại lệ khi có chứng cứ rõ ràng là lỗi kỹ thuật gõ nhầm (ví dụ điểm 99 hoặc -5)."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: Đánh giá Phân phối (Độ lệch & Độ phân tán)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-distribution" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phân phối X */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
                Biến X — Giữa kỳ
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Hình thái Phân phối Điểm Giữa kỳ
              </h5>
              <div className="mt-2.5 p-3 rounded-md bg-raised border border-border text-[13px]">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <span className={xSkew.color}>●</span>
                  {xSkew.type}
                </p>
                <p className="text-muted text-[12.5px] leading-relaxed">{xSkew.detail}</p>
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border font-mono text-[12px] text-muted">
                  <span>Mean: <strong>{x.mean.toFixed(2)}</strong></span>
                  <span>Median: <strong>{x.median.toFixed(2)}</strong></span>
                  <span>Std Dev: <strong>{x.std_dev.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>

            {/* Phân phối Y */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Biến Y — Cuối kỳ
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Hình thái Phân phối Điểm Cuối kỳ
              </h5>
              <div className="mt-2.5 p-3 rounded-md bg-raised border border-border text-[13px]">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <span className={ySkew.color}>●</span>
                  {ySkew.type}
                </p>
                <p className="text-muted text-[12.5px] leading-relaxed">{ySkew.detail}</p>
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border font-mono text-[12px] text-muted">
                  <span>Mean: <strong>{y.mean.toFixed(2)}</strong></span>
                  <span>Median: <strong>{y.median.toFixed(2)}</strong></span>
                  <span>Std Dev: <strong>{y.std_dev.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Đánh giá Độ phân tán */}
          <div className="bg-surface border border-border rounded-lg p-4 text-[13px]">
            <h5 className="font-semibold text-text text-[14px] mb-2">
              So sánh Mức độ Phân tán (Variability Comparison)
            </h5>
            <p className="text-muted leading-relaxed">
              Hệ số biến thiên (Coefficient of Variation) phản ánh mức độ đồng đều của điểm số:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 font-mono text-[12.5px]">
              <div className="p-3 bg-raised border border-border rounded">
                <span className="font-sans font-medium text-text block">CV của Điểm Giữa kỳ (X):</span>
                <span className="text-accent font-bold text-[14px]">
                  {((x.std_dev / x.mean) * 100).toFixed(1)}%
                </span>
                <span className="font-sans text-[11.5px] text-muted block mt-0.5">
                  (s = {x.std_dev.toFixed(2)}, X̄ = {x.mean.toFixed(2)})
                </span>
              </div>
              <div className="p-3 bg-raised border border-border rounded">
                <span className="font-sans font-medium text-text block">CV của Điểm Cuối kỳ (Y):</span>
                <span className="text-accent font-bold text-[14px]">
                  {((y.std_dev / y.mean) * 100).toFixed(1)}%
                </span>
                <span className="font-sans text-[11.5px] text-muted block mt-0.5">
                  (s = {y.std_dev.toFixed(2)}, Ȳ = {y.mean.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </EvidenceModal>
  );
}
