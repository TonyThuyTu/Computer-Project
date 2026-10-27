FROM python:3.12-slim

WORKDIR /app

# Ngăn Python tạo file cache .pyc và hiển thị log ngay lập tức
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy và cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy mã nguồn backend
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
