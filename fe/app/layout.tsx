import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAS Statistics — Phân tích Hồi quy & Thống kê Mô tả",
  description:
    "Dashboard phân tích Hồi quy Tuyến tính Đơn & Thống kê Mô tả cho đồ án Toán Thống kê Ứng dụng",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
