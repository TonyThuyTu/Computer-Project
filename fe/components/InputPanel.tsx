"use client";

import React, { useRef, useState } from "react";
import {
  Database,
  RotateCcw,
  Upload,
  Play,
  Loader2,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { SAMPLE_DATA } from "@/app/sample-data";

interface InputPanelProps {
  rawText: string;
  setRawText: (text: string) => void;
  alpha: number;
  setAlpha: (val: number) => void;
  mu0: number;
  setMu0: (val: number) => void;
  loading: boolean;
  validPairCount: number;
  onLoadSample: () => void;
  onClear: () => void;
  onRunAnalysis: () => void;
}

export function InputPanel({
  rawText,
  setRawText,
  alpha,
  setAlpha,
  mu0,
  setMu0,
  loading,
  validPairCount,
  onLoadSample,
  onClear,
  onRunAnalysis,
}: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileMsg, setFileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Xử lý nạp file Excel (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileMsg(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const wb = XLSX.read(buffer, { type: "array" });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows: (string | number)[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
        });

        const extractedPairs: [number, number][] = [];
        for (const row of rows) {
          if (!row || !Array.isArray(row)) continue;
          const nums: number[] = [];
          for (const cell of row) {
            if (cell !== null && cell !== undefined && cell !== "") {
              const num =
                typeof cell === "number"
                  ? cell
                  : parseFloat(String(cell).trim().replace(",", "."));
              if (!isNaN(num)) {
                nums.push(num);
              }
            }
          }
          if (nums.length >= 2) {
            extractedPairs.push([nums[0], nums[1]]);
          }
        }

        if (extractedPairs.length === 0) {
          setFileMsg({
            type: "error",
            text: `Không tìm thấy cặp điểm hợp lệ nào trong file "${file.name}". Vui lòng đảm bảo file có ít nhất 2 cột số.`,
          });
          return;
        }

        const formatted = extractedPairs
          .map(([x, y]) => `${x}, ${y}`)
          .join("\n");
        setRawText(formatted);
        setFileMsg({
          type: "success",
          text: `Đã nạp thành công ${extractedPairs.length} cặp điểm từ file "${file.name}".`,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Định dạng file không được hỗ trợ";
        setFileMsg({
          type: "error",
          text: `Lỗi đọc file Excel: ${message}`,
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Xuất file Excel mẫu chứa 45 cặp điểm
  const handleDownloadExcelTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["Diem_Giua_Ky_X", "Diem_Cuoi_Ky_Y"],
        ...SAMPLE_DATA,
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [{ wch: 18 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws, "DuLieu_MAS");
      XLSX.writeFile(wb, "du_lieu_mau_MAS_45_sinh_vien.xlsx");
      setFileMsg({
        type: "success",
        text: "Đã tải file Excel mẫu: du_lieu_mau_MAS_45_sinh_vien.xlsx",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo file";
      setFileMsg({
        type: "error",
        text: `Lỗi tải file mẫu: ${message}`,
      });
    }
  };

  return (
    <Card className="mb-6 shadow-xs" id="input-panel">
      <SectionHeading
        icon={Database}
        title="Dữ liệu Đầu vào & Tham số Phân tích"
        subtitle="Nhập/dán cặp điểm hoặc tải lên trực tiếp từ file Excel (.xlsx, .csv). Hỗ trợ tải file Excel mẫu để tham khảo."
      />

      {/* Hidden File Input for Excel/CSV */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="hidden"
        id="excel-file-input"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Textarea + Action Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="input-raw-data"
              className="text-[13px] font-medium text-text flex items-center gap-1.5"
            >
              <span>Bảng số liệu cặp (X, Y)</span>
              {validPairCount > 0 && (
                <span className="text-[11px] font-mono text-accent bg-accent-subtle px-2 py-0.5 rounded">
                  Đã nhận diện: {validPairCount} cặp
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              {rawText && (
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    setFileMsg(null);
                  }}
                  className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-text cursor-pointer transition-colors"
                  title="Xóa toàn bộ nội dung trong ô"
                >
                  <RotateCcw size={12} />
                  Xóa bảng
                </button>
              )}
            </div>
          </div>

          <textarea
            id="input-raw-data"
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (fileMsg) setFileMsg(null);
            }}
            placeholder={
              "Dán dữ liệu cặp điểm vào đây hoặc nhấn 'Tải lên file Excel', ví dụ:\n3.0, 4.2\n5.5, 6.1\n7.0, 7.8\n8.5, 8.9\n..."
            }
            rows={9}
            className="w-full border border-control rounded-[var(--radius-control)] px-3.5 py-3 text-[14px] text-text bg-surface placeholder:text-faint font-mono resize-y focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 num leading-relaxed"
          />

          {/* Excel notification badge */}
          {fileMsg && (
            <div
              className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] border ${
                fileMsg.type === "success"
                  ? "bg-positive-bg text-positive-ink border-[#bbf7d0]"
                  : "bg-negative-bg text-negative-ink border-[#fecaca]"
              }`}
            >
              {fileMsg.type === "success" ? (
                <CheckCircle2 size={14} className="shrink-0 text-positive" />
              ) : (
                <AlertCircle size={14} className="shrink-0 text-negative" />
              )}
              <span>{fileMsg.text}</span>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {/* Button 1: Load sample memory */}
            <button
              id="btn-load-sample"
              type="button"
              onClick={() => {
                onLoadSample();
                setFileMsg(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] border border-control bg-raised text-[13px] text-text font-medium hover:bg-active hover:border-text/30 cursor-pointer transition-colors shadow-2xs"
            >
              <Upload size={14} className="text-accent" />
              <span>Dữ liệu mẫu (n = 45)</span>
            </button>

            {/* Button 2: Upload Excel file */}
            <button
              id="btn-upload-excel"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] border border-control bg-raised text-[13px] text-text font-medium hover:bg-active hover:border-text/30 cursor-pointer transition-colors shadow-2xs"
              title="Chọn file Excel (.xlsx, .xls) hoặc CSV từ máy tính của bạn"
            >
              <FileSpreadsheet size={14} className="text-positive" />
              <span>Tải lên file Excel</span>
            </button>

            {/* Button 3: Download sample Excel template */}
            <button
              id="btn-download-excel"
              type="button"
              onClick={handleDownloadExcelTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] border border-control bg-surface text-[13px] text-muted font-medium hover:bg-active hover:text-text cursor-pointer transition-colors shadow-2xs"
              title="Tải về file Excel mẫu chứa sẵn 45 cặp điểm để điền hoặc lưu trữ"
            >
              <Download size={14} />
              <span>Tải file Excel mẫu</span>
            </button>
          </div>
        </div>

        {/* Configuration Params & Submit */}
        <div className="flex flex-col justify-between bg-raised border border-border rounded-[var(--radius-control)] p-4">
          <div className="space-y-4">
            <p className="text-[13px] font-semibold text-text uppercase tracking-wider text-muted">
              Cấu hình tham số kiểm định
            </p>

            {/* Alpha */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="input-alpha"
                  className="text-[13px] font-medium text-text"
                >
                  Mức ý nghĩa α
                </label>
                <span className="text-[12px] text-muted font-mono num">
                  {(alpha * 100).toFixed(0)}%
                </span>
              </div>
              <input
                id="input-alpha"
                type="number"
                step="0.01"
                min="0.01"
                max="0.2"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.05)}
                className="w-full border border-control rounded-[var(--radius-control)] h-[36px] px-3 text-[14px] text-text bg-surface num focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              <p className="text-[11px] text-faint mt-1">
                Độ tin cậy tương ứng: {((1 - alpha) * 100).toFixed(0)}% (Mặc định α = 0.05)
              </p>
            </div>

            {/* Mu_0 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="input-mu0"
                  className="text-[13px] font-medium text-text"
                >
                  Mốc kiểm định trung bình μ₀
                </label>
                <span className="text-[12px] text-muted font-mono num">
                  {mu0} điểm
                </span>
              </div>
              <input
                id="input-mu0"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={mu0}
                onChange={(e) => setMu0(parseFloat(e.target.value) || 7.0)}
                className="w-full border border-control rounded-[var(--radius-control)] h-[36px] px-3 text-[14px] text-text bg-surface num focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              <p className="text-[11px] text-faint mt-1">
                Giả thuyết H₀: Điểm cuối kỳ trung bình μ = {mu0}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border mt-4">
            <button
              id="btn-run-analysis"
              type="button"
              onClick={onRunAnalysis}
              disabled={loading || !rawText.trim()}
              className="w-full flex items-center justify-center gap-2 h-[42px] bg-primary text-white text-[14px] font-semibold rounded-[var(--radius-control)] cursor-pointer hover:bg-primary/85 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang tính toán thống kê...</span>
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" />
                  <span>Chạy Phân Tích &amp; Kiểm Định</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
