FROM node:22-alpine

WORKDIR /app

# Cài đặt pnpm phiên bản tương thích với dự án
RUN npm install -g pnpm@11.3.0

# Copy các file quản lý dependency
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Cài đặt dependencies
RUN pnpm install

# Copy toàn bộ mã nguồn frontend
COPY . .

# Biến môi trường bind IP ra toàn bộ mạng container
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Chạy Next.js ở chế độ phát triển
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
