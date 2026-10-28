"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { EvidenceModal, type TabItem } from "./EvidenceModal";
import { DefenseCallout } from "./DefenseCallout";
import type { RegressionResult } from "@/app/types";

interface Stage3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  regression: RegressionResult;
}

export function Stage3Modal({ isOpen, onClose, regression }: Stage3ModalProps) {
  const [activeTab, setActiveTab] = useState("tab-coef");

  const b0 = regression.beta_0;
  const b1 = regression.beta_1;

  // Tính toán dự đoán thay số cho X = 6 và X = 8 theo Câu 1A
  const yAt6 = Number((b0 + b1 * 6.0).toFixed(2));
  const yAt8 = Number((b0 + b1 * 8.0).toFixed(2));
  const deltaY = Number((yAt8 - yAt6).toFixed(2));

  const tabs: TabItem[] = [
    {
      id: "tab-coef",
      label: "Ý nghĩa Hệ số Hồi quy & Dự đoán (Câu 6, 7 & 1A)",
      icon: TrendingUp,
    },
    {
      id: "tab-diag",
      label: "Chẩn đoán Giả định qua Phần dư (Câu 8)",
      icon: Activity,
    },
    {
      id: "tab-limits",
      label: "Giới hạn & Rủi ro Ngoại suy (Câu 1B)",
      icon: AlertTriangle,
    },
  ];

  return (
    <EvidenceModal
      isOpen={isOpen}
      onClose={onClose}
      stageNumber="Giai đoạn 3"
      title="Mô hình Hồi quy OLS, Chẩn đoán Phần dư & Ngoại suy (Câu 5 – 8 & 1A, 1B)"
      subtitle="Chứng minh công thức bình phương tối thiểu, giải thích các hệ số và phân tích giới hạn mô hình"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: Ý nghĩa các Hệ số Hồi quy (Câu 6, 7 & 1A)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-coef" && (
        <div className="space-y-4">
          {/* Công thức OLS */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h5 className="font-semibold text-text text-[14px] mb-2 flex items-center gap-2">
              <Calculator size={15} className="text-accent" />
              Công thức Ước lượng Bình phương Tối thiểu (Ordinary Least Squares - OLS)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-raised border border-border rounded">
                <span className="text-[11px] font-bold uppercase text-accent tracking-wider block mb-1">
                  Hệ số góc (Slope, β₁)
                </span>
                <div className="font-mono text-[13px] text-text font-bold my-1 text-center bg-surface py-1 rounded border border-border">
                  β₁ = ∑(X - X̄)(Y - Ȳ) / ∑(X - X̄)²
                </div>
                <p className="text-[12px] text-muted mt-1 leading-relaxed">
                  Tỷ lệ giữa hiệp phương sai Cov(X, Y) và phương sai Var(X). Đo lường
                  độ dốc của đường hồi quy.
                </p>
              </div>

              <div className="p-3 bg-raised border border-border rounded">
                <span className="text-[11px] font-bold uppercase text-accent tracking-wider block mb-1">
                  Hệ số chặn (Intercept, β₀)
                </span>
                <div className="font-mono text-[13px] text-text font-bold my-1 text-center bg-surface py-1 rounded border border-border">
                  β₀ = Ȳ - β₁·X̄
                </div>
                <p className="text-[12px] text-muted mt-1 leading-relaxed">
                  Đảm bảo đường thẳng hồi quy OLS luôn đi qua điểm trọng tâm trung bình
                  mẫu (X̄, Ȳ).
                </p>
              </div>
            </div>
          </div>

          {/* Giải thích chi tiết β1 và β0 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-positive bg-positive-bg px-2 py-0.5 rounded">
                Giải thích Hệ số góc β₁ = {b1} (Câu 6)
              </span>
              <p className="text-[13px] text-text mt-2 leading-relaxed">
                Khi điểm thi giữa kỳ tăng thêm <strong>1.0 điểm</strong>, điểm thi cuối
                kỳ dự kiến sẽ tăng trung bình <strong>{b1} điểm</strong> (trong điều kiện
                các yếu tố khác không đổi - <em>ceteris paribus</em>).
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
                Giải thích Hệ số chặn β₀ = {b0} (Câu 7)
              </span>
              <p className="text-[13px] text-text mt-2 leading-relaxed">
                Về mặt toán học, β₀ là điểm cuối kỳ kỳ vọng khi điểm giữa kỳ bằng 0.
                Tuy nhiên về mặt thực tế, giá trị này ít có ý nghĩa vì hiếm sinh viên đi
                thi đạt 0 điểm giữa kỳ và mô hình có thể bị sai lệch khi ngoại suy về 0.
              </p>
            </div>
          </div>

          {/* Dự đoán theo bối cảnh Câu 1A: Chi tiết phép tính thay số khi X = 6 và X = 8 */}
          <div className="bg-surface border border-accent/40 rounded-lg p-4 bg-accent-subtle/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-accent" />
              <h5 className="font-semibold text-text text-[14px]">
                Dự đoán theo Bối cảnh Thực tế (Câu 1A — Phép tính Thay số Chi tiết)
              </h5>
            </div>
            <p className="text-[13px] text-muted mb-3">
              Phương trình thực nghiệm:{" "}
              <strong className="text-text font-mono">
                Ŷ = {b0} + {b1} · X
              </strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div className="p-3 bg-surface border border-border rounded-md font-mono">
                <span className="font-sans font-semibold text-text block mb-1">
                  Trường hợp 1: Sinh viên đạt X = 6.0 điểm
                </span>
                <p className="text-muted text-[12.5px]">
                  Ŷ₍₆₎ = {b0} + {b1} × 6.0
                </p>
                <p className="text-[12.5px] text-muted">
                  Ŷ₍₆₎ = {b0} + {(b1 * 6.0).toFixed(3)}
                </p>
                <p className="text-accent font-bold text-[15px] mt-1">
                  Ŷ₍₆₎ = {yAt6} điểm
                </p>
              </div>

              <div className="p-3 bg-surface border border-border rounded-md font-mono">
                <span className="font-sans font-semibold text-text block mb-1">
                  Trường hợp 2: Sinh viên đạt X = 8.0 điểm
                </span>
                <p className="text-muted text-[12.5px]">
                  Ŷ₍₈₎ = {b0} + {b1} × 8.0
                </p>
                <p className="text-[12.5px] text-muted">
                  Ŷ₍₈₎ = {b0} + {(b1 * 8.0).toFixed(3)}
                </p>
                <p className="text-accent font-bold text-[15px] mt-1">
                  Ŷ₍₈₎ = {yAt8} điểm
                </p>
              </div>
            </div>

            <p className="text-[12.5px] text-muted mt-3">
              📌 <strong>Nhận xét:</strong> Khi sinh viên cải thiện điểm giữa kỳ từ 6.0
              lên 8.0 điểm (tăng 2.0 điểm), điểm cuối kỳ kỳ vọng tăng thêm:{" "}
              <strong className="text-text font-mono">
                2 × {b1} = {deltaY} điểm
              </strong>{" "}
              (từ {yAt6} lên {yAt8}).
            </p>
          </div>

          <DefenseCallout
            question="Tại sao hệ số chặn β₀ có thể mang giá trị âm hoặc giá trị điểm không thực tế?"
            answer="Về mặt toán học, β₀ đơn thuần là giao điểm của đường thẳng hồi quy với trục tung tại X = 0 để cố định vị trí đường thẳng. Trong thực tế giáo dục, điểm giữa kỳ của sinh viên thường dao động từ 4 đến 10, hoàn toàn không có dữ liệu tại X = 0. Do đó, β₀ chỉ đóng vai trò hằng số toán học của mô hình OLS và không nên diễn giải như điểm số thi thật khi bỏ thi."
            note="Luôn nhấn mạnh đây là hạn chế tự nhiên của phép ngoại suy về gốc tọa độ 0."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: Chẩn đoán Giả định Mô hình qua Phần dư (Câu 8)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-diag" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Residual Plot */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                1. Biểu đồ Phần dư (Residual Plot)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Kiểm tra Tính Tuyến tính & Phương sai Đồng nhất
              </h5>
              <div className="mt-2 text-[12.5px] text-muted space-y-2 leading-relaxed">
                <p>
                  <strong>Đặc điểm quan sát:</strong> Các điểm phần dư{" "}
                  <code className="text-text font-mono">e_i = Y_i - Ŷ_i</code> phân tán
                  hoàn toàn ngẫu nhiên và đồng đều xung quanh trục hoành 0 (e = 0).
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Tính tuyến tính (Linearity):</strong> Không xuất hiện quy
                    luật hình chữ U hay đường cong $\implies$ Giả định quan hệ tuyến tính
                    thỏa mãn.
                  </li>
                  <li>
                    <strong>Phương sai đồng nhất (Homoscedasticity):</strong> Dải phân
                    tán không có hình phễu hay mở rộng dần $\implies$ Phương sai sai số là
                    hằng số không đổi.
                  </li>
                </ul>
              </div>
            </div>

            {/* Q-Q Plot */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-positive bg-positive-bg px-2 py-0.5 rounded">
                2. Biểu đồ Q-Q Plot (Normal Q-Q)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Kiểm tra Phân phối Chuẩn của Sai số (Normality)
              </h5>
              <div className="mt-2 text-[12.5px] text-muted space-y-2 leading-relaxed">
                <p>
                  <strong>Đặc điểm quan sát:</strong> Phần lớn các điểm phân vị thực tế
                  bám sát theo đường thẳng tham chiếu chuẩn 45 độ (y = x).
                </p>
                <p>
                  <strong>Kết luận kiểm định:</strong> Sai số ngẫu nhiên của mô hình
                  thỏa mãn phân phối chuẩn:{" "}
                  <code className="text-text font-mono">ε ~ N(0, σ²)</code>. Điều này đảm
                  bảo độ tin cậy tuyệt đối cho các kiểm định t-test và khoảng tin cậy ở
                  Giai đoạn 4.
                </p>
              </div>
            </div>
          </div>

          {/* Lưu ý lý thuyết về tính độc lập */}
          <div className="bg-surface border border-border rounded-lg p-4 bg-raised">
            <h5 className="font-semibold text-text text-[13.5px] flex items-center gap-2">
              <HelpCircle size={15} className="text-accent" />
              Lưu ý Lý thuyết Quan trọng về Tính Độc lập (Independence Assumption)
            </h5>
            <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
              Biểu đồ đẹp <strong>không đủ để chứng minh tính độc lập của sai số</strong>.
              Tính độc lập được bảo đảm trực tiếp từ <strong>thiết kế thu thập mẫu</strong>:
              mỗi dòng dữ liệu là một cá nhân sinh viên riêng biệt làm bài thi độc lập,
              không có việc đo lặp lại trên cùng một đối tượng hay chép bài của nhau.
            </p>
          </div>

          <DefenseCallout
            question="Nếu biểu đồ phần dư có dạng hình cái phễu (Funnel Shape) thì mô hình vi phạm điều gì và ảnh hưởng ra sao?"
            answer="Nếu biểu đồ phần dư có hình phễu (độ phân tán rộng dần theo chiều tăng của điểm số), mô hình vi phạm giả định phương sai sai số đồng nhất (xảy ra hiện tượng Heteroscedasticity - phương sai sai số thay đổi). Khi đó, các ước lượng OLS vẫn không chệch nhưng sai số chuẩn SE(β) sẽ bị tính sai, dẫn đến p-value và khoảng tin cậy của kiểm định t không còn đáng tin cậy."
            note="Trong bộ dữ liệu của chúng ta, phần dư phân tán đều đặn, không có hình phễu."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: Giới hạn & Ngoại suy (Câu 1B)                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-limits" && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-negative bg-negative-bg px-2 py-0.5 rounded">
              Rủi ro Ngoại suy (Extrapolation Risk)
            </span>
            <h5 className="font-semibold text-text text-[14px] mt-2">
              Tại sao không nên dự đoán ngoài miền quan sát thực nghiệm?
            </h5>
            <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
              Mô hình hồi quy chỉ được huấn luyện và kiểm chứng trên miền dữ liệu thực tế
              của sinh viên (thường từ 4.0 đến 9.5 điểm). Khi dự đoán cho điểm{" "}
              <code className="text-text font-mono">X &lt; 0</code> hoặc{" "}
              <code className="text-text font-mono">X &gt; 10</code>, phương trình tuyến
              tính thuần túy có thể cho kết quả vô lý ngoài thang điểm [0, 10] (ví dụ dự
              đoán điểm cuối kỳ &gt; 10.0 hoặc &lt; 0).
            </p>
          </div>

          {/* Thảo luận bối cảnh thực tế */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h5 className="font-semibold text-text text-[14px] mb-2">
              Các Yếu tố Nhiễu & Bối cảnh Thực tế chưa được đo lường (Confounding Factors)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
              <div className="p-3 rounded bg-raised border border-border">
                <span className="font-semibold text-text block mb-1">
                  1. Độ khó đề thi không tương đương
                </span>
                <p className="text-muted leading-relaxed">
                  Đề thi cuối kỳ thường bao quát toàn bộ nội dung học phần và có tính
                  phân loại cao hơn đề thi giữa kỳ, tạo ra độ lệch chuẩn tự nhiên lớn hơn.
                </p>
              </div>

              <div className="p-3 rounded bg-raised border border-border">
                <span className="font-semibold text-text block mb-1">
                  2. Nỗ lực học tập sau giữa kỳ
                </span>
                <p className="text-muted leading-relaxed">
                  Sinh viên bị điểm giữa kỳ thấp có thể nỗ lực học bù mạnh mẽ, hoặc ngược
                  lại sinh viên điểm giữa kỳ cao có tâm lý chủ quan. Đây là các biến tâm lý
                  và hành vi mà mô hình hồi quy đơn biến chưa đo lường được.
                </p>
              </div>
            </div>
          </div>

          <DefenseCallout
            question="Nếu dùng mô hình này để dự đoán cho một sinh viên đạt 12 điểm giữa kỳ thì điều gì xảy ra?"
            answer="Đây là lỗi ngoại suy nghiêm trọng (Extrapolation Error). Điểm 12 hoàn toàn nằm ngoài thang điểm hợp lệ [0, 10] và ngoài tập dữ liệu quan sát. Phương trình tuyến tính sẽ tính ra một số điểm cuối kỳ trên 10 vô nghĩa. Mô hình chỉ có giá trị dự đoán trong khoảng nội suy điểm số thực tế từ 0 đến 10 của sinh viên."
            note="Luôn khẳng định: Mô hình toán học phải đi đôi với miền xác định của thực tế."
          />
        </div>
      )}
    </EvidenceModal>
  );
}
