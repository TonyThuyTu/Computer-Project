"use client";

import React, { useState } from "react";
import {
  FileText,
  Filter,
  Users,
  Table,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";
import { EvidenceModal, type TabItem } from "./EvidenceModal";
import { DefenseCallout } from "./DefenseCallout";
import type { CleaningResult } from "@/app/types";

interface Stage1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleaning: CleaningResult;
  alpha: number;
  cleanedData?: { x: number; y: number }[];
}

export function Stage1Modal({
  isOpen,
  onClose,
  cleaning,
  alpha,
  cleanedData = [],
}: Stage1ModalProps) {
  const [activeTab, setActiveTab] = useState("tab-filter");

  const tabs: TabItem[] = [
    {
      id: "tab-filter",
      label: "Nhật ký Xử lý & Tiêu chí Lọc (Câu 2)",
      icon: Filter,
      badge: cleaning.removed > 0 ? `${cleaning.removed} loại` : "0 loại",
    },
    {
      id: "tab-design",
      label: "Thiết kế Thu thập & Tính Đại diện (Câu 1)",
      icon: Users,
    },
    {
      id: "tab-data",
      label: "Bảng Dữ liệu Đã làm sạch",
      icon: Table,
      badge: `${cleanedData.length || cleaning.valid_n} dòng`,
    },
  ];

  return (
    <EvidenceModal
      isOpen={isOpen}
      onClose={onClose}
      stageNumber="Giai đoạn 1"
      title="Làm sạch Dữ liệu & Thiết kế Mẫu Nghiên cứu (Câu 1 & 2)"
      subtitle="Minh chứng tính toàn vẹn của dữ liệu, quy trình sàng lọc và phạm vi suy luận thực tế"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: Nhật ký xử lý & Tiêu chí lọc (Câu 2)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-filter" && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h4 className="text-[14px] font-semibold text-text flex items-center gap-2 mb-2">
              <Filter size={15} className="text-accent" />
              Tiêu chuẩn Kiểm định Dữ liệu Đầu vào (Data Validation Rules)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px] mt-3">
              <div className="p-3 rounded-md bg-raised border border-border">
                <span className="font-semibold text-text block mb-1">
                  1. Miền giá trị hợp lệ
                </span>
                <p className="text-muted">
                  Điểm số X và Y bắt buộc nằm trong đoạn số thực{" "}
                  <code className="text-accent font-mono">[0.0, 10.0]</code>. Mọi giá trị âm
                  hoặc &gt; 10 đều bị loại bỏ tự động.
                </p>
              </div>
              <div className="p-3 rounded-md bg-raised border border-border">
                <span className="font-semibold text-text block mb-1">
                  2. Cặp số hoàn chỉnh
                </span>
                <p className="text-muted">
                  Mỗi quan sát phải có đầy đủ cả 2 điểm (X: Giữa kỳ và Y: Cuối kỳ).
                  Không chấp nhận dòng chỉ có 1 điểm duy nhất.
                </p>
              </div>
              <div className="p-3 rounded-md bg-raised border border-border">
                <span className="font-semibold text-text block mb-1">
                  3. Không trùng lặp vô căn cứ
                </span>
                <p className="text-muted">
                  Đảm bảo mỗi bản ghi đại diện cho một sinh viên duy nhất, không bị
                  nhập đúp dữ liệu từ quá trình sao chép.
                </p>
              </div>
            </div>
          </div>

          {/* Trạng thái các dòng bị loại */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h4 className="text-[14px] font-semibold text-text mb-3">
              Kết quả Sàng lọc Thực tế
            </h4>

            {cleaning.removed === 0 ? (
              <div className="flex items-start gap-3 p-3.5 bg-positive-bg/40 border border-emerald-200 rounded-lg text-[13px]">
                <CheckCircle2 size={18} className="text-positive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-positive-ink">
                    Tất cả 45 cặp quan sát đều hợp lệ trong đoạn [0, 10], không có giá
                    trị rỗng hoặc trùng lặp.
                  </p>
                  <p className="text-muted mt-1 text-[12px]">
                    Bộ dữ liệu đạt độ toàn vẹn 100% (45/45 cặp quan sát), sẵn sàng đưa
                    vào tính toán thống kê mô tả và mô hình hồi quy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3.5 bg-negative-bg/40 border border-red-200 rounded-lg text-[13px]">
                <AlertCircle size={18} className="text-negative shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-negative-ink">
                    Đã phát hiện và loại bỏ {cleaning.removed} dòng không đạt tiêu chuẩn.
                  </p>
                  <p className="text-muted mt-1 text-[12px]">
                    Các dòng thiếu dữ liệu hoặc ngoài thang điểm [0, 10] đã được tách ra
                    để bảo vệ độ chính xác của phân phối.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Khung đối đáp phản biện giảng viên */}
          <DefenseCallout
            question="Tại sao nhóm không thay thế dữ liệu thiếu (Missing Value) bằng số 0 hoặc điểm trung bình?"
            answer="Tuân thủ quy tắc không thay dữ liệu thiếu bằng 0 để tránh làm lệch phân phối điểm số. Việc gán giá trị 0 cho sinh viên vắng thi hoặc thiếu điểm sẽ tạo ra các điểm ngoại lệ giả mạo, làm giảm nhân tạo điểm trung bình (X_bar, Y_bar), thổi phồng phương sai mẫu s² và làm méo mó nghiêm trọng đường hồi quy OLS. Việc loại bỏ dòng thiếu là phương pháp chuẩn mực nhất khi cỡ mẫu n = 45 vẫn đủ lớn."
            note="Khi bảo vệ, hãy khẳng định việc làm sạch bảo toàn tính tự nhiên của mẫu nghiên cứu."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: Thiết kế thu thập & Tính đại diện (Câu 1)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-design" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Mục tiêu Nghiên cứu
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Tổng thể Mục tiêu (Target Population)
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                Toàn bộ sinh viên học cùng một học phần Toán Thống kê Ứng dụng (MAS)
                trong cùng một học kỳ tại trường.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
                Đơn vị Khảo sát
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Đơn vị Quan sát (Observational Unit)
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                Từng cá nhân sinh viên cụ thể. Mỗi dòng dữ liệu tương ứng với đúng 1 cặp
                điểm số duy nhất: <strong>(X: Điểm giữa kỳ, Y: Điểm cuối kỳ)</strong>.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
                Phương pháp Thu thập
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Phương pháp Lấy mẫu (Sampling Method)
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                <strong>Mẫu thuận tiện (Convenience Sampling)</strong>: Thu thập điểm số
                từ các lớp học phần/nhóm thực hành sinh viên có thể tiếp cận được trong
                kỳ thi.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-active px-2 py-0.5 rounded">
                Quy mô Mẫu
              </span>
              <h5 className="font-semibold text-text text-[14px] mt-2">
                Cỡ mẫu Nghiên cứu (Sample Size)
              </h5>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                <strong>n = {cleaning.valid_n || 45} quan sát</strong>: Đạt và thỏa mãn
                khuyến nghị thực nghiệm (40 – 50) trong tài liệu hướng dẫn môn học, đảm
                bảo Định lý Giới hạn Trung tâm (CLT) hoạt động tốt.
              </p>
            </div>
          </div>

          {/* Giới hạn kết luận */}
          <div className="bg-surface border border-amber-200 rounded-lg p-4 bg-amber-50/30">
            <h5 className="font-semibold text-text text-[13.5px] flex items-center gap-1.5 text-amber-900">
              <AlertCircle size={15} className="text-amber-600" />
              Giới hạn Kết luận Thống kê (Scope of Inference)
            </h5>
            <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
              Cỡ mẫu n = 45 đạt chuẩn phân tích thống kê, nhưng <strong>do lấy mẫu thuận tiện</strong>, 
              kết luận từ mô hình hồi quy và kiểm định chỉ có giá trị suy luận trong phạm vi 
              nhóm sinh viên được khảo sát; <strong>tuyệt đối không tự ý suy rộng (overgeneralize) cho toàn trường 
              hoặc các khóa học khác</strong>.
            </p>
          </div>

          <DefenseCallout
            question="Kết quả nghiên cứu này có thể áp dụng cho sinh viên toàn trường đại học được không?"
            answer="Thưa thầy/cô, không thể áp dụng cho toàn trường. Vì phương pháp lấy mẫu là mẫu thuận tiện (Convenience Sampling), mẫu chưa đảm bảo tính đại diện ngẫu nhiên cho toàn bộ sinh viên các khoa khác. Do đó, kết luận chỉ có giá trị nội bộ trong nhóm lớp học phần được nghiên cứu."
            note="Giảng viên đánh giá rất cao việc sinh viên nhận thức được giới hạn của phương pháp lấy mẫu."
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: Bảng dữ liệu đã làm sạch                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "tab-data" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[12.5px] text-muted">
            <span>
              Danh sách <strong>{cleanedData.length || cleaning.valid_n}</strong> cặp
              quan sát hợp lệ (Đã mã hóa danh tính SV)
            </span>
            <span className="text-positive font-medium flex items-center gap-1">
              <CheckCircle2 size={13} />
              Thang điểm chuẩn [0.0 - 10.0]
            </span>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-surface max-h-[380px] overflow-y-auto">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead className="bg-raised sticky top-0 border-b border-border text-[11.5px] font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center">STT</th>
                  <th className="py-2.5 px-3">Mã SV</th>
                  <th className="py-2.5 px-3 text-right">Giữa kỳ (X)</th>
                  <th className="py-2.5 px-3 text-right">Cuối kỳ (Y)</th>
                  <th className="py-2.5 px-3 text-right">Chênh lệch (Y - X)</th>
                  <th className="py-2.5 px-3 text-center">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-mono num">
                {cleanedData.length > 0 ? (
                  cleanedData.map((row, idx) => {
                    const diff = Number((row.y - row.x).toFixed(2));
                    return (
                      <tr key={idx} className="hover:bg-active/40 transition-colors">
                        <td className="py-2 px-3 text-center text-faint">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-sans font-medium text-text">
                          SV-{String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-text">
                          {row.x.toFixed(1)}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-accent">
                          {row.y.toFixed(1)}
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-medium ${
                            diff > 0
                              ? "text-positive"
                              : diff < 0
                              ? "text-negative"
                              : "text-muted"
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff}
                        </td>
                        <td className="py-2 px-3 text-center font-sans">
                          <span className="inline-block text-[11px] font-medium text-positive bg-positive-bg px-2 py-0.5 rounded">
                            Hợp lệ
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted font-sans">
                      Dữ liệu đang được tải hoặc chưa được phân tích.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </EvidenceModal>
  );
}
