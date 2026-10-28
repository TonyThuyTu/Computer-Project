import React from "react";
import { Database, CheckCircle2, Layers } from "lucide-react";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { Pill } from "./ui/Pill";
import type { CleaningResult } from "@/app/types";

interface Phase1CleaningProps {
  cleaning: CleaningResult;
  alpha: number;
}

export function Phase1Cleaning({ cleaning, alpha }: Phase1CleaningProps) {
  return (
    <section id="phase-1-cleaning">
      <SectionHeading
        icon={Database}
        stepNumber="Giai đoạn 1"
        title="Làm sạch dữ liệu & Mẫu nghiên cứu (Câu 1 & 2)"
        subtitle="Sàng lọc dữ liệu thô, loại bỏ các dòng thiếu thông tin, trùng lặp hoặc ngoài thang điểm [0, 10]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-[13px] text-muted font-medium">Tổng dòng ban đầu</p>
          <p className="text-[30px] font-bold text-text mt-1 num">
            {cleaning.total_raw}
          </p>
          <p className="text-[12px] text-faint mt-1">Cặp điểm số thô được đưa vào</p>
        </Card>

        <Card className="border-accent/40 bg-accent-subtle/30">
          <p className="text-[13px] text-accent font-semibold">
            Cỡ mẫu hợp lệ (Valid n)
          </p>
          <p className="text-[30px] font-bold text-accent mt-1 num">
            {cleaning.valid_n}
          </p>
          <p className="text-[12px] text-accent/80 mt-1">
            Đủ tiêu chuẩn đưa vào mô hình phân tích
          </p>
        </Card>

        <Card>
          <p className="text-[13px] text-muted font-medium">Số dòng bị loại</p>
          <p
            className={`text-[30px] font-bold mt-1 num ${
              cleaning.removed > 0 ? "text-negative" : "text-text"
            }`}
          >
            {cleaning.removed}
          </p>
          <p className="text-[12px] text-faint mt-1">
            Thiếu giá trị, trùng lặp hoặc sai thang điểm [0, 10]
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mt-3">
        <Pill variant="positive">
          <CheckCircle2 size={13} className="mr-1.5" />
          Độ tin cậy {cleaning.confidence_level.toFixed(0)}% (α = {alpha})
        </Pill>
        <Pill variant="neutral">
          <Layers size={13} className="mr-1.5" />
          Nguyên tắc: Không tự ý loại ngoại lệ khi chưa có căn cứ
        </Pill>
      </div>
    </section>
  );
}
