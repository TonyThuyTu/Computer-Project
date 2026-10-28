import type { AnalysisRequest, AnalysisResponse } from "@/app/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ANALYZE_ENDPOINT = `${API_BASE}/api/analyze`;
const HEALTH_ENDPOINT = `${API_BASE}/api/health`;

/**
 * Kiểm tra kết nối tới máy chủ Flask Backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_ENDPOINT, {
      method: "GET",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Gửi yêu cầu phân tích hồi quy và kiểm định thống kê tới Backend
 */
export async function analyzeData(
  payload: AnalysisRequest
): Promise<AnalysisResponse> {
  try {
    const res = await fetch(ANALYZE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.error ?? `Máy chủ trả về mã lỗi HTTP ${res.status}`
      );
    }

    const data: AnalysisResponse = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes("fetch")) {
      throw new Error(
        `Không thể kết nối tới Backend Flask tại ${API_BASE}. Hãy kiểm tra server đang chạy (python app.py).`
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Đã xảy ra lỗi không xác định khi gọi API phân tích.");
  }
}
