"use client";

import { useState, useCallback, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { checkBackendHealth, analyzeData } from "@/services/api";
import { Header } from "@/components/Header";
import { StageNav } from "@/components/StageNav";
import { InputPanel } from "@/components/InputPanel";
import { Phase1Cleaning } from "@/components/Phase1Cleaning";
import { Phase2Descriptive } from "@/components/Phase2Descriptive";
import { Phase3Regression } from "@/components/Phase3Regression";
import { Phase4Hypothesis } from "@/components/Phase4Hypothesis";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { SAMPLE_DATA } from "./sample-data";
import type { AnalysisResponse, AnalysisRequest } from "./types";

export default function Dashboard() {
  const [rawText, setRawText] = useState("");
  const [alpha, setAlpha] = useState(0.05);
  const [mu0, setMu0] = useState(7.0);
  const [predictXInput, setPredictXInput] = useState("7.5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Kiểm tra sức khỏe kết nối Backend khi tải trang
  useEffect(() => {
    checkBackendHealth().then((isOnline) => setBackendOnline(isOnline));
  }, []);

  // Chuyển đổi dữ liệu chuỗi người dùng nhập/dán thành mảng cặp [x, y][]
  const parseInput = useCallback((): [number, number][] => {
    return rawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((line) => {
        const parts = line
          .split(/[,;\t\s]+/)
          .filter((p) => p.length > 0)
          .map((p) => parseFloat(p));
        return [parts[0], parts[1]] as [number, number];
      })
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));
  }, [rawText]);

  // Tải dữ liệu mẫu 45 cặp điểm
  const handleLoadSample = useCallback(() => {
    const text = SAMPLE_DATA.map(([x, y]) => `${x}, ${y}`).join("\n");
    setRawText(text);
    setError(null);
  }, []);

  // Xóa trắng bảng dữ liệu
  const handleClear = useCallback(() => {
    setRawText("");
    setError(null);
  }, []);

  // Gọi service API để chạy phân tích thống kê
  const handleRunAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = parseInput();
      if (data.length < 3) {
        throw new Error(
          "Cần ít nhất 3 cặp dữ liệu hợp lệ (thang điểm 0 - 10) để thực hiện hồi quy & kiểm định"
        );
      }

      const payload: AnalysisRequest = {
        data,
        alpha,
        mu_0: mu0,
      };

      if (predictXInput.trim() && !isNaN(parseFloat(predictXInput))) {
        payload.predict_x = parseFloat(predictXInput);
      }

      const response = await analyzeData(payload);
      setResult(response);
      setBackendOnline(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.includes("Không thể kết nối")) {
          setBackendOnline(false);
        }
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  }, [parseInput, alpha, mu0, predictXInput]);

  // Tính giá trị dự đoán Ŷ tương tác trực tiếp
  const livePredictedY =
    result && predictXInput.trim() && !isNaN(parseFloat(predictXInput))
      ? result.regression.beta_0 +
        result.regression.beta_1 * parseFloat(predictXInput)
      : null;

  const validPairCount = parseInput().length;

  return (
    <div className="min-h-screen bg-ground text-text">
      {/* ── Top Bar Header ─────────────────────────────────── */}
      <Header backendOnline={backendOnline} />

      {/* ── Main Container ─────────────────────────────────── */}
      <main className="max-w-[1360px] mx-auto px-6 py-6">
        {/* Title Header */}
        <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-bold text-text tracking-tight">
              Phân tích Hồi quy Tuyến tính Đơn &amp; Thống kê Mô tả
            </h1>
            <p className="text-[14px] text-muted mt-1">
              Khảo sát mối quan hệ giữa Điểm Thi Giữa Kỳ (X) và Điểm Thi Cuối Kỳ (Y)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[12px] text-muted bg-surface border border-border px-3 py-1.5 rounded-md font-medium">
              Đồ án Thống kê MAS • 4 Giai đoạn
            </span>
          </div>
        </div>

        {/* 4 Stage Quick Navigation */}
        <StageNav />

        {/* Input & Parameters Panel */}
        <InputPanel
          rawText={rawText}
          setRawText={setRawText}
          alpha={alpha}
          setAlpha={setAlpha}
          mu0={mu0}
          setMu0={setMu0}
          loading={loading}
          validPairCount={validPairCount}
          onLoadSample={handleLoadSample}
          onClear={handleClear}
          onRunAnalysis={handleRunAnalysis}
        />

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-[#fecaca] bg-negative-bg rounded-[var(--radius-card)] p-4 text-[13px] text-negative-ink shadow-2xs">
            <AlertTriangle size={18} className="shrink-0 mt-0.5 text-negative" />
            <div className="space-y-1">
              <p className="font-semibold text-negative">
                Có lỗi xảy ra trong quá trình xử lý:
              </p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton States */}
        {loading && !result && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <Card>
              <div className="h-6 w-48 bg-active rounded animate-pulse" />
              <div className="mt-4 space-y-3">
                <div className="h-5 bg-active rounded animate-pulse" />
                <div className="h-5 bg-active rounded animate-pulse" />
                <div className="h-5 bg-active rounded animate-pulse" />
              </div>
            </Card>
          </div>
        )}

        {/* ── Results Dashboard (4 Independent Component Phases) ── */}
        {result && (
          <div className="space-y-8 animate-fadeIn" id="results-area">
            {/* Giai đoạn 1: Làm sạch dữ liệu & Mẫu */}
            <Phase1Cleaning cleaning={result.cleaning} alpha={alpha} />

            {/* Giai đoạn 2: Thống kê mô tả & So sánh phân phối */}
            <Phase2Descriptive descriptive={result.descriptive} />

            {/* Giai đoạn 3: Hồi quy tuyến tính, dự đoán & 2 biểu đồ Recharts */}
            <Phase3Regression
              regression={result.regression}
              predictXInput={predictXInput}
              setPredictXInput={setPredictXInput}
              livePredictedY={livePredictedY}
            />

            {/* Giai đoạn 4: Kiểm định giả thuyết (Trung bình & Hệ số góc) */}
            <Phase4Hypothesis
              meanTest={result.hypothesis.mean_test}
              slopeTest={result.hypothesis.slope_test}
              alpha={alpha}
              mu0={mu0}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 text-center text-[12px] text-muted">
        <p>
          Đồ án Thống kê Ứng dụng (MAS) — Phân tích Hồi quy Tuyến tính Đơn &amp;
          Kiểm định Giả thuyết
        </p>
        <p className="text-faint mt-1">
          Kiến trúc mô-đun: Next.js App Router, Component per Section, API
          Services, Recharts &amp; Flask
        </p>
      </footer>
    </div>
  );
}
