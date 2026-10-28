"use client";

import React, { useState } from "react";
import {
  TestTubes,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  AlertOctagon,
} from "lucide-react";
import { EvidenceModal, type TabItem } from "./EvidenceModal";
import { DefenseCallout } from "./DefenseCallout";
import type { HypothesisTestResult } from "@/app/types";

interface Stage4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  meanTest: HypothesisTestResult;
  slopeTest: HypothesisTestResult;
  alpha: number;
  mu0: number;
  meanY?: number;
  stdY?: number;
  n?: number;
}

export function Stage4Modal({
  isOpen,
  onClose,
  meanTest,
  slopeTest,
  alpha,
  mu0,
  meanY,
  stdY,
  n,
}: Stage4ModalProps) {
  const [activeTab, setActiveTab] = useState("tab-mean");

  const tabs: TabItem[] = [
    {
      id: "tab-mean",
      label: `Kiểm định Trung bình Điểm Cuối kỳ μ_Y > ${mu0} (Câu 9 & 10)`,
      icon: TestTubes,
      badge: meanTest.reject_h0 ? "Bác bỏ H₀" : "Chấp nhận H₀",
    },
    {
      id: "tab-slope",
      label: "Kiểm định Ý nghĩa Hệ số góc β₁ ≠ 0 (Câu 11 & 12)",
      icon: Scale,
      badge: slopeTest.reject_h0 ? "β₁ có ý nghĩa" : "Không ý nghĩa",
    },
  ];

  return (
    <EvidenceModal
      isOpen={isOpen}
      onClose={onClose}
      stageNumber="Giai đoạn 4"
      title="Suy luận Thống kê & Kiểm định Giả thuyết Học thuật (Câu 9 – 12)"
      subtitle="Bằng chứng kiểm định t-Student một phía và hai phía, báo cáo p-value chuẩn và phân biệt nhân quả"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: Kiểm định Điểm cuối kỳ trung bình μ_Y > 7 (Câu 9 & 10)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-mean" && (
        <div className="space-y-4">
          {/* Cặp giả thuyết & Công thức */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Kiểm định 1 phía bên phải (Right-tailed)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Cặp Giả thuyết Thống kê (Câu 9)
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 text-[13px] font-mono space-y-1">
                <p>
                  <strong>H₀:</strong> μ = {mu0} (hoặc μ ≤ {mu0})
                </p>
                <p className="text-accent font-bold">
                  <strong>H₁:</strong> μ &gt; {mu0}
                </p>
              </div>
              <p className="text-[12px] text-muted leading-relaxed">
                Mục đích: Tìm kiếm bằng chứng thống kê ủng hộ nhận định rằng điểm thi
                cuối kỳ trung bình của sinh viên thực sự vượt mức {mu0}.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Giá trị Kiểm định t-Student
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Công thức Tính Thống kê t
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 text-[13px] font-mono text-center text-text font-bold">
                t = (Ȳ - {mu0}) / (s_Y / √n)
              </div>
              <div className="text-[12px] text-muted space-y-0.5 font-mono num">
                <p>• Bậc tự do (df): n - 1 = {meanTest.df}</p>
                <p>• Giá trị thống kê t tính được: {meanTest.t_statistic}</p>
                <p>
                  • Quy ước báo cáo p-value:{" "}
                  <strong className="text-accent">{meanTest.p_display}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quy ước p-value & Khoảng tin cậy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-positive bg-positive-bg px-2 py-0.5 rounded">
                Quy chuẩn Khoa học
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Quy ước Báo cáo p-value
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                Theo chuẩn APA và các tạp chí khoa học quốc tế: Khi p-value tính ra vô
                cùng nhỏ, báo cáo chính xác là{" "}
                <strong className="text-accent font-mono">"p &lt; 0.001"</strong>.{" "}
                <strong>Tuyệt đối không bao giờ ghi "p = 0"</strong>, vì xác suất trong
                phân phối liên tục luôn là một số thực dương vô cùng bé chứ không thể bằng
                0 tuyệt đối.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Bản chất Khoảng tin cậy (CI)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Khoảng Tin cậy 95% của μ_Y: [{meanTest.ci[0]}, {meanTest.ci[1]}]
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                Khoảng tin cậy này ước lượng <strong>điểm trung bình của tổng thể</strong>,{" "}
                <strong>KHÔNG PHẢI là khoảng chứa 95% điểm số của từng cá nhân sinh viên</strong>.
                Điểm của từng sinh viên dao động theo độ lệch chuẩn s_Y rộng hơn nhiều so
                với sai số chuẩn của trung bình mẫu (SE = s_Y / √n).
              </p>
            </div>
          </div>

          {/* Phân tích Sai lầm loại I và loại II */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h5 className="font-semibold text-text text-[14px] mb-2 flex items-center gap-1.5">
              <AlertOctagon size={16} className="text-negative" />
              Sai lầm Loại I và Loại II trong Quyết định Thống kê
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] mt-2">
              <div className="p-3 rounded bg-negative-bg/30 border border-red-200">
                <span className="font-semibold text-negative-ink block mb-1">
                  Sai lầm Loại I (Type I Error — α = {alpha})
                </span>
                <p className="text-muted leading-relaxed">
                  Bác bỏ H₀ khi H₀ thực chất đang đúng. Tức là kết luận điểm cuối kỳ trung
                  bình của sinh viên &gt; 7.0 trong khi thực tế năng lực chỉ ≤ 7.0 (Lạc
                  quan sai lầm về chất lượng đào tạo).
                </p>
              </div>

              <div className="p-3 rounded bg-warning-bg/40 border border-amber-200">
                <span className="font-semibold text-warning-ink block mb-1">
                  Sai lầm Loại II (Type II Error — β)
                </span>
                <p className="text-muted leading-relaxed">
                  Chấp nhận hoặc không bác bỏ H₀ khi H₀ thực tế đã sai. Tức là không nhận
                  ra điểm trung bình đã thực sự vượt trên 7.0 (Đánh giá thấp kết quả học
                  tập của sinh viên).
                </p>
              </div>
            </div>
          </div>

          <DefenseCallout
            question="Nếu kiểm định không bác bỏ H₀, ta có thể kết luận 'H₀ là đúng' không?"
            answer="Không bác bỏ H₀ không đồng nghĩa với việc chứng minh H₀ đúng, mà chỉ là chưa đủ bằng chứng để phủ định nó (Fail to reject H₀ does NOT mean accept H₀ as true). Trong suy luận thống kê, việc thiếu bằng chứng để kết tội không có nghĩa là chứng minh đối tượng vô tội; nó chỉ thể hiện cỡ mẫu hiện tại chưa đủ lực để bác bỏ giả thuyết gốc."
            note="Đây là câu hỏi 'bẫy' lý thuyết kinh điển của giảng viên môn Toán Thống kê."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: Kiểm định Ý nghĩa Hệ số góc β1 ≠ 0 (Câu 11 & 12)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-slope" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cặp giả thuyết */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Kiểm định 2 phía (Two-tailed)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Cặp Giả thuyết Hệ số góc (Câu 11)
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 text-[13px] font-mono space-y-1">
                <p>
                  <strong>H₀:</strong> β₁ = 0 (Không có quan hệ tuyến tính)
                </p>
                <p className="text-accent font-bold">
                  <strong>H₁:</strong> β₁ ≠ 0 (Tồn tại quan hệ tuyến tính)
                </p>
              </div>
              <p className="text-[12px] text-muted leading-relaxed">
                Nếu H₀ bị bác bỏ với p &lt; 0.05, ta khẳng định điểm giữa kỳ là biến giải
                thích có ý nghĩa thống kê cho điểm thi cuối kỳ.
              </p>
            </div>

            {/* Khoảng tin cậy β1 */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-positive bg-positive-bg px-2 py-0.5 rounded">
                Kiểm chứng Song hành (Câu 12)
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Khoảng Tin cậy 95% của β₁
              </h5>
              <div className="bg-raised border border-border rounded p-3 my-2 text-[13px] font-mono text-center text-text font-bold">
                CI₉₅% = [{slopeTest.ci[0]}, {slopeTest.ci[1]}]
              </div>
              <p className="text-[12px] text-muted leading-relaxed">
                Khoảng tin cậy này <strong>hoàn toàn không chứa số 0</strong> (nằm trọn
                vẹn ở miền dương). Điều này cho kết luận hoàn toàn tương đồng với quyết
                định bác bỏ H₀ ở mức ý nghĩa α = {alpha}.
              </p>
            </div>
          </div>

          {/* Phân biệt Tương quan vs Nhân quả */}
          <div className="bg-surface border border-accent/40 rounded-lg p-4 bg-accent-subtle/20">
            <h5 className="font-semibold text-text text-[14px] mb-2 flex items-center gap-2">
              <HelpCircle size={16} className="text-accent" />
              Phân biệt Mấu chốt: Tương quan Thống kê ≠ Mối quan hệ Nhân quả
            </h5>
            <p className="text-[13px] text-text leading-relaxed">
              Mối liên hệ có ý nghĩa thống kê (p &lt; 0.05) <strong>KHÔNG ĐỒNG NGHĨA với mối
              quan hệ nhân quả</strong>. Chúng ta không thể khẳng định điểm thi giữa kỳ
              "sinh ra" hay "gây ra" điểm thi cuối kỳ.
            </p>
            <div className="mt-2.5 p-3 rounded-md bg-surface border border-border text-[12.5px] text-muted">
              <p>
                💡 <strong>Bản chất học thuật:</strong> Cả điểm thi giữa kỳ (X) và điểm
                thi cuối kỳ (Y) thực chất đều chịu tác động bởi các biến ẩn chung
                (Lurking/Common Causes): <em>năng lực tư duy, phương pháp học tập, nền
                tảng toán học và độ chăm chỉ của sinh viên</em>.
              </p>
            </div>
          </div>

          <DefenseCallout
            question="Nếu có kết quả β₁ > 0 với p < 0.001, ta có thể khẳng định 'Muốn tăng điểm cuối kỳ thì nhà trường chỉ cần cho sinh viên điểm giữa kỳ cao' được không?"
            answer="Tuyệt đối không! Đây là ngụy biện kinh điển 'Tương quan không phải Nhân quả' (Correlation does not imply Causation). Điểm giữa kỳ cao chỉ là dấu hiệu báo trước cho năng lực tốt của sinh viên, chứ bản thân con số điểm giữa kỳ không thể tự nó làm điểm cuối kỳ tăng lên nếu sinh viên không thực học."
            note="Luôn nhấn mạnh đây là kiến thức nền tảng trong môn Thống kê Ứng dụng."
          />
        </div>
      )}
    </EvidenceModal>
  );
}
