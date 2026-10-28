import React, { useState } from "react";
import { TestTubes, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { Stage4Modal } from "./evidence/Stage4Modal";
import type { HypothesisTestResult } from "@/app/types";

interface Phase4HypothesisProps {
  meanTest: HypothesisTestResult;
  slopeTest: HypothesisTestResult;
  alpha: number;
  mu0: number;
  meanY?: number;
  stdY?: number;
  n?: number;
}

export function Phase4Hypothesis({
  meanTest,
  slopeTest,
  alpha,
  mu0,
  meanY,
  stdY,
  n,
}: Phase4HypothesisProps) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  return (
    <section id="phase-4-hypothesis">
      <SectionHeading
        icon={TestTubes}
        stepNumber="Giai đoạn 4"
        title="Suy luận Thống kê & Kiểm định Giả thuyết (Câu 9 – 12)"
        subtitle="Kiểm định ý nghĩa thống kê của trung bình điểm cuối kỳ và hệ số góc mô hình hồi quy"
        action={
          <button
            type="button"
            onClick={() => setIsEvidenceOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-active border border-border hover:border-accent/50 text-text font-medium text-[12.5px] rounded-md transition-all shadow-2xs group cursor-pointer"
          >
            <FileText
              size={14}
              className="text-accent group-hover:scale-105 transition-transform"
            />
            <span>Xem chi tiết & Bằng chứng</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hypothesis Block 1: Mean Test */}
        <HypothesisCard
          blockNumber="Khối 1"
          title="Kiểm định Trung bình Điểm Cuối Kỳ (μ_Y)"
          subtitle={`Kiểm định một phía (Right-tailed): H₁: μ > ${mu0}`}
          test={meanTest}
          alpha={alpha}
        />

        {/* Hypothesis Block 2: Slope Test */}
        <HypothesisCard
          blockNumber="Khối 2"
          title="Kiểm định Ý nghĩa Hệ số Góc (β₁)"
          subtitle="Kiểm định hai phía (Two-tailed): H₁: β₁ ≠ 0"
          test={slopeTest}
          alpha={alpha}
        />
      </div>

      {/* Modal Bằng chứng & Đối đáp phản biện cho Giai đoạn 4 */}
      <Stage4Modal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        meanTest={meanTest}
        slopeTest={slopeTest}
        alpha={alpha}
        mu0={mu0}
        meanY={meanY}
        stdY={stdY}
        n={n}
      />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Sub-component: Single Hypothesis Card                                     */
/* ────────────────────────────────────────────────────────────────────────── */

interface HypothesisCardProps {
  blockNumber: string;
  title: string;
  subtitle: string;
  test: HypothesisTestResult;
  alpha: number;
}

function HypothesisCard({
  blockNumber,
  title,
  subtitle,
  test,
  alpha,
}: HypothesisCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
            {blockNumber}
          </span>
          <span className="text-[12px] text-muted font-mono">
            Mức ý nghĩa α = {alpha}
          </span>
        </div>

        <h3 className="text-[16px] font-bold text-text">{title}</h3>
        <p className="text-[12px] text-muted mt-0.5 mb-4">{subtitle}</p>

        {/* Hypothesis statements H0 / H1 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-raised rounded-lg p-3 border border-border">
            <span className="text-[11px] font-bold text-muted uppercase">
              Giả thuyết Không (H₀)
            </span>
            <p className="text-[15px] font-mono font-bold text-text mt-0.5 num">
              {test.h0}
            </p>
          </div>
          <div className="bg-raised rounded-lg p-3 border border-border">
            <span className="text-[11px] font-bold text-accent uppercase">
              Giả thuyết Đối (H₁)
            </span>
            <p className="text-[15px] font-mono font-bold text-accent mt-0.5 num">
              {test.h1}
            </p>
          </div>
        </div>

        {/* Statistical Test Metrics Table */}
        <div className="space-y-2.5 mb-5 text-[14px]">
          <div className="flex justify-between items-center py-1">
            <span className="text-muted">Phương pháp kiểm định</span>
            <span className="text-text font-medium">{test.test_type}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-rule">
            <span className="text-muted">Bậc tự do (Degrees of Freedom - df)</span>
            <span className="text-text font-mono num font-semibold">{test.df}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-rule">
            <span className="text-muted">Giá trị Thống kê t (t-Statistic)</span>
            <span className="text-text font-mono num font-bold text-base">
              {test.t_statistic}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-rule">
            <span className="text-muted">Giá trị p-value</span>
            <span
              className={`font-mono num font-bold text-base ${
                test.reject_h0 ? "text-positive" : "text-negative"
              }`}
            >
              {test.p_display}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-rule">
            <span className="text-muted">
              Khoảng tin cậy {((1 - alpha) * 100).toFixed(0)}% (Confidence Interval)
            </span>
            <span className="text-text font-mono num font-semibold">
              [{test.ci[0]}, {test.ci[1]}]
            </span>
          </div>
        </div>
      </div>

      {/* Formal Conclusion Box */}
      <div
        className={`rounded-lg p-3.5 border ${
          test.reject_h0
            ? "bg-positive-bg text-positive-ink border-[#bbf7d0]"
            : "bg-negative-bg text-negative-ink border-[#fecaca]"
        }`}
      >
        <div className="flex items-start gap-2.5">
          {test.reject_h0 ? (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-positive" />
          ) : (
            <XCircle size={18} className="shrink-0 mt-0.5 text-negative" />
          )}
          <div className="text-[13px] leading-relaxed">
            <p className="font-bold mb-0.5">
              {test.reject_h0 ? "Bác bỏ Giả thuyết H₀" : "Chưa đủ cơ sở bác bỏ Giả thuyết H₀"}
            </p>
            <p>{test.conclusion}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
