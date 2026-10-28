import React from "react";
import { TrendingUp, Target, Sparkles } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import type { RegressionResult } from "@/app/types";

interface Phase3RegressionProps {
  regression: RegressionResult;
  predictXInput: string;
  setPredictXInput: (val: string) => void;
  livePredictedY: number | null;
}

export function Phase3Regression({
  regression,
  predictXInput,
  setPredictXInput,
  livePredictedY,
}: Phase3RegressionProps) {
  return (
    <section id="phase-3-regression">
      <SectionHeading
        icon={TrendingUp}
        stepNumber="Giai đoạn 3"
        title="Mô hình Hồi quy Tuyến tính Đơn & Chẩn đoán (Câu 5, 6, 7, 8)"
        subtitle="Xây dựng phương trình dự đoán, đánh giá chất lượng mô hình và khảo sát phần dư"
      />

      {/* Equation Banner */}
      <div className="bg-surface border-2 border-accent/40 rounded-[var(--radius-card)] p-5 mb-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-subtle px-2 py-0.5 rounded">
              Phương trình Hồi quy Tuyến tính Thực nghiệm (OLS)
            </span>
            <p className="text-[26px] font-bold text-text mt-2 font-mono num">
              {regression.equation}
            </p>
            <p className="text-[13px] text-muted mt-1">
              Hệ số chặn β₀ = {regression.beta_0} • Hệ số góc β₁ = {regression.beta_1}
            </p>
          </div>

          <div className="bg-raised border border-border rounded-lg p-3 text-[12px] text-muted max-w-sm">
            <p className="font-semibold text-text mb-0.5">Ý nghĩa kinh tế/thực tế:</p>
            Khi điểm thi giữa kỳ tăng 1.0 điểm, điểm thi cuối kỳ được dự đoán tăng trung bình{" "}
            <span className="font-bold text-accent">{regression.beta_1}</span> điểm.
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card>
          <p className="text-[13px] text-muted font-medium">
            Hệ số Tương quan Pearson (r)
          </p>
          <p className="text-[28px] font-bold text-text mt-1 num">
            {regression.r_pearson}
          </p>
          <p className="text-[12px] text-faint mt-1">
            {regression.r_pearson > 0.8
              ? "Tương quan tuyến tính thuận rất mạnh"
              : regression.r_pearson > 0.5
              ? "Tương quan tuyến tính thuận vừa"
              : "Tương quan yếu"}
          </p>
        </Card>

        <Card className="border-accent/30 bg-accent-subtle/20">
          <p className="text-[13px] text-accent font-semibold">
            Hệ số Xác định (R² - R-Squared)
          </p>
          <p className="text-[28px] font-bold text-accent mt-1 num">
            {regression.r_squared}
          </p>
          <p className="text-[12px] text-accent/80 mt-1">
            Điểm giữa kỳ giải thích{" "}
            <span className="font-bold">
              {(regression.r_squared * 100).toFixed(1)}%
            </span>{" "}
            sự biến thiên của điểm cuối kỳ
          </p>
        </Card>

        <Card>
          <p className="text-[13px] text-muted font-medium">
            Sai số chuẩn của Hồi quy (s)
          </p>
          <p className="text-[28px] font-bold text-text mt-1 num">
            {regression.se_regression}
          </p>
          <p className="text-[12px] text-faint mt-1">
            Độ lệch tiêu chuẩn của phần dư quanh đường hồi quy
          </p>
        </Card>
      </div>

      {/* Live Prediction Sandbox */}
      <Card className="mb-5 bg-raised border-border">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-accent" />
          <h3 className="text-[14px] font-semibold text-text uppercase tracking-wider">
            Dự đoán Điểm Cuối Kỳ trong Bối cảnh Thực tế
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset X = 6 */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <span className="text-[11px] font-semibold uppercase text-muted">
              Trường hợp chuẩn 1
            </span>
            <p className="text-[13px] font-medium text-text mt-1">
              Khi Điểm Giữa Kỳ X = 6.0
            </p>
            <p className="text-[22px] font-bold text-text mt-1 num">
              Ŷ = {regression.predictions["6"]}
            </p>
            <p className="text-[12px] text-faint mt-0.5">Dự đoán điểm thi cuối kỳ</p>
          </div>

          {/* Preset X = 8 */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <span className="text-[11px] font-semibold uppercase text-muted">
              Trường hợp chuẩn 2
            </span>
            <p className="text-[13px] font-medium text-text mt-1">
              Khi Điểm Giữa Kỳ X = 8.0
            </p>
            <p className="text-[22px] font-bold text-text mt-1 num">
              Ŷ = {regression.predictions["8"]}
            </p>
            <p className="text-[12px] text-faint mt-0.5">Dự đoán điểm thi cuối kỳ</p>
          </div>

          {/* Interactive Input */}
          <div className="bg-surface rounded-lg p-4 border-2 border-accent/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-accent">
                Thử nghiệm trực tiếp
              </span>
              <Sparkles size={13} className="text-accent" />
            </div>
            <label
              htmlFor="input-predict-x"
              className="block text-[13px] font-medium text-text mt-1"
            >
              Nhập điểm giữa kỳ (X) bất kỳ:
            </label>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                id="input-predict-x"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={predictXInput}
                onChange={(e) => setPredictXInput(e.target.value)}
                placeholder="VD: 7.5"
                className="w-24 border border-control rounded-[var(--radius-control)] h-[34px] px-2.5 text-[14px] font-bold text-text bg-surface num focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              <div className="text-[16px] font-bold text-accent num">
                {livePredictedY !== null ? `Ŷ ≈ ${livePredictedY.toFixed(2)}` : "—"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scatter Chart + Regression Line */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[14px] font-semibold text-text">
                Biểu đồ Tán xạ (Scatter Plot) & Đường Hồi quy
              </p>
              <p className="text-[12px] text-muted">
                Mỗi điểm là 1 sinh viên • Đường đỏ là đường thẳng OLS dự đoán
              </p>
            </div>
          </div>

          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: 0 }}>
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 12, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Điểm Thi Giữa Kỳ (X)",
                    position: "insideBottom",
                    offset: -12,
                    fontSize: 12,
                    fill: "var(--muted)",
                  }}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 12, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Điểm Thi Cuối Kỳ (Y)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 12,
                    fontSize: 12,
                    fill: "var(--muted)",
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value: any, name: any) => [
                    Number(value).toFixed(2),
                    name === "x" ? "Giữa kỳ (X)" : "Cuối kỳ (Y)",
                  ]}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
                {/* Regression line segment */}
                {regression.regression_line.length >= 2 && (
                  <ReferenceLine
                    segment={[
                      {
                        x: regression.regression_line[0].x,
                        y: regression.regression_line[0].y,
                      },
                      {
                        x: regression.regression_line[1].x,
                        y: regression.regression_line[1].y,
                      },
                    ]}
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    label={{
                      value: "Đường hồi quy",
                      fill: "#dc2626",
                      fontSize: 11,
                      position: "top",
                    }}
                  />
                )}
                <Scatter
                  name="Điểm sinh viên"
                  data={regression.scatter_data}
                  fill="var(--accent)"
                  fillOpacity={0.75}
                  r={4.5}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Residuals vs Fitted Chart */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[14px] font-semibold text-text">
                Biểu đồ Phần dư (Residuals vs Fitted Values)
              </p>
              <p className="text-[12px] text-muted">
                Chẩn đoán giả định phương sai đồng nhất & tính tuyến tính
              </p>
            </div>
          </div>

          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: 0 }}>
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="none"
                  vertical={false}
                />
                <XAxis
                  dataKey="fitted"
                  type="number"
                  tick={{ fontSize: 12, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Giá trị Dự đoán (Ŷ)",
                    position: "insideBottom",
                    offset: -12,
                    fontSize: 12,
                    fill: "var(--muted)",
                  }}
                />
                <YAxis
                  dataKey="residual"
                  type="number"
                  tick={{ fontSize: 12, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Phần dư (e = Y - Ŷ)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 12,
                    fontSize: 12,
                    fill: "var(--muted)",
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value: any, name: any) => [
                    Number(value).toFixed(4),
                    name === "fitted" ? "Giá trị dự đoán (Ŷ)" : "Phần dư (e)",
                  ]}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
                <ReferenceLine
                  y={0}
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  label={{
                    value: "e = 0",
                    fill: "#6b7280",
                    fontSize: 11,
                    position: "right",
                  }}
                />
                <Scatter
                  name="Phần dư"
                  data={regression.residual_data}
                  fill="var(--accent)"
                  fillOpacity={0.7}
                  r={4.5}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}
