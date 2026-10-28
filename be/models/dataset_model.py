import math


class DatasetModel:
    """
    Model tiếp nhận và làm sạch dữ liệu từ Frontend.
    Hỗ trợ nhận mảng cặp số (X, Y), tham số alpha, mu_0, predict_x
    từ JSON body hoặc form/file upload từ request.
    """

    def __init__(self, raw_pairs=None, alpha=0.05, mu_0=7.0, predict_x=None):
        self.raw_pairs = raw_pairs or []
        self.alpha = self._validate_alpha(alpha)
        self.mu_0 = self._validate_float(mu_0, 7.0)
        self.predict_x = self._validate_optional_float(predict_x)

        # Trạng thái sau làm sạch
        self.valid_pairs = []
        self.total_raw = 0
        self.valid_n = 0
        self.removed = 0
        self.xs = []
        self.ys = []
        self.clean_data()

    @classmethod
    def from_request(cls, request):
        """Khởi tạo Model từ Flask request (JSON hoặc Form/File upload)"""
        if request.is_json:
            body = request.get_json(silent=True) or {}
            raw_pairs = body.get("data", [])
            alpha = body.get("alpha", 0.05)
            mu_0 = body.get("mu_0", 7.0)
            predict_x = body.get("predict_x", None)
            return cls(raw_pairs=raw_pairs, alpha=alpha, mu_0=mu_0, predict_x=predict_x)

        # Hỗ trợ đọc từ multipart form hoặc file tải lên trực tiếp
        alpha = request.form.get("alpha", 0.05)
        mu_0 = request.form.get("mu_0", 7.0)
        predict_x = request.form.get("predict_x", None)
        raw_pairs = []

        if "file" in request.files:
            file = request.files["file"]
            content = file.read().decode("utf-8", errors="ignore")
            for line in content.splitlines():
                line = line.strip()
                if not line:
                    continue
                parts = [
                    p.strip()
                    for p in line.replace(";", ",").replace("\t", ",").split(",")
                    if p.strip()
                ]
                if len(parts) >= 2:
                    raw_pairs.append([parts[0], parts[1]])

        return cls(raw_pairs=raw_pairs, alpha=alpha, mu_0=mu_0, predict_x=predict_x)

    def _validate_alpha(self, val):
        try:
            a = float(val)
            return a if 0 < a < 1 else 0.05
        except (ValueError, TypeError):
            return 0.05

    def _validate_float(self, val, default):
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    def _validate_optional_float(self, val):
        if val is None or val == "":
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    def clean_data(self):
        """Thực hiện quy trình sàng lọc và làm sạch dữ liệu"""
        self.total_raw = len(self.raw_pairs)
        seen = set()
        self.valid_pairs = []
        self.removed = 0

        for pair in self.raw_pairs:
            if not isinstance(pair, (list, tuple)) or len(pair) < 2:
                self.removed += 1
                continue
            x, y = pair[0], pair[1]
            if x is None or y is None:
                self.removed += 1
                continue
            try:
                x_val, y_val = float(x), float(y)
            except (ValueError, TypeError):
                self.removed += 1
                continue

            if math.isnan(x_val) or math.isnan(y_val) or math.isinf(x_val) or math.isinf(y_val):
                self.removed += 1
                continue

            # Kiểm tra khoảng thang điểm hợp lệ [0, 10]
            if not (0 <= x_val <= 10 and 0 <= y_val <= 10):
                self.removed += 1
                continue

            # Loại trừ dòng trùng lặp hoàn toàn
            key = (round(x_val, 4), round(y_val, 4))
            if key in seen:
                self.removed += 1
                continue
            seen.add(key)
            self.valid_pairs.append((x_val, y_val))

        self.valid_n = len(self.valid_pairs)
        self.xs = [p[0] for p in self.valid_pairs]
        self.ys = [p[1] for p in self.valid_pairs]

    @property
    def is_valid_for_analysis(self):
        return self.valid_n >= 3

    @property
    def confidence_level(self):
        return round(float((1 - self.alpha) * 100), 1)

    def to_cleaning_dict(self):
        return {
            "total_raw": int(self.total_raw),
            "valid_n": int(self.valid_n),
            "removed": int(self.removed),
            "confidence_level": self.confidence_level,
        }
