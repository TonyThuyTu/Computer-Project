FROM node:22-alpine

WORKDIR /app

# Cài đặt pnpm phiên bản tương thích với dự án
RUN npm install -g pnpm@11.3.0

# Copy các file quản lý dependency
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

# Biến môi trường CI để pnpm không hỏi TTY confirmation
ENV CI=true

# Cài đặt dependencies
RUN pnpm install

# Copy toàn bộ mã nguồn frontend
COPY . .

# Build production bundle trước (giảm RAM xuống <80MB, tránh OOM crash và lỗi 502 trên Render)
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://computer-project-be.onrender.com
RUN pnpm build

ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Chạy Next.js ở chế độ production với cổng linh hoạt theo $PORT của Render (hoặc 3000)
CMD ["sh", "-c", "pnpm start --hostname 0.0.0.0 --port ${PORT:-3000}"]
