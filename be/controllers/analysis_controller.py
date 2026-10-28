import math
from scipy import stats


class AnalysisController:
    """
    Controller xử lý toàn bộ logic tính toán thống kê:
    1. Thống kê mô tả (Descriptive statistics & Outlier Tukey 1.5*IQR)
    2. Hồi quy tuyến tính đơn OLS & Chẩn đoán phần dư
    3. Kiểm định giả thuyết (Trung bình một phía & Hệ số góc hai phía)
    """

    @staticmethod
    def describe(data):
        data_sorted = sorted(data)
        n_d = len(data_sorted)
        mean = float(sum(data_sorted) / n_d)
        median = float(
            data_sorted[n_d // 2]
            if n_d % 2 == 1
            else (data_sorted[n_d // 2 - 1] + data_sorted[n_d // 2]) / 2
        )
        variance = (
            float(sum((v - mean) ** 2 for v in data_sorted) / (n_d - 1))
            if n_d > 1
            else 0.0
        )
        std_dev = float(math.sqrt(variance))
        min_val = float(data_sorted[0])
        max_val = float(data_sorted[-1])

        q1_idx = (n_d + 1) * 0.25 - 1
        q3_idx = (n_d + 1) * 0.75 - 1

        def interpolate(arr, idx):
            lower = int(math.floor(idx))
            upper = int(math.ceil(idx))
            if lower < 0:
                lower = 0
            if upper >= len(arr):
                upper = len(arr) - 1
            if lower == upper:
                return float(arr[lower])
            frac = idx - lower
            return float(arr[lower] + frac * (arr[upper] - arr[lower]))

        q1 = interpolate(data_sorted, q1_idx)
        q3 = interpolate(data_sorted, q3_idx)
        iqr = float(q3 - q1)

        lower_fence = q1 - 1.5 * iqr
        upper_fence = q3 + 1.5 * iqr
        outliers = [float(v) for v in data_sorted if v < lower_fence or v > upper_fence]

        return {
            "n": int(n_d),
            "mean": round(mean, 4),
            "median": round(median, 4),
            "std_dev": round(std_dev, 4),
            "variance": round(variance, 4),
            "min": round(min_val, 4),
            "q1": round(q1, 4),
            "q3": round(q3, 4),
            "max": round(max_val, 4),
            "iqr": round(iqr, 4),
            "outliers": [round(v, 4) for v in outliers],
        }

    @staticmethod
    def compute_regression(xs, ys, n, predict_x=None):
        mean_x = float(sum(xs) / n)
        mean_y = float(sum(ys) / n)

        ss_xx = float(sum((x - mean_x) ** 2 for x in xs))
        ss_yy = float(sum((y - mean_y) ** 2 for y in ys))
        ss_xy = float(sum((xs[i] - mean_x) * (ys[i] - mean_y) for i in range(n)))

        beta_1 = float(ss_xy / ss_xx) if ss_xx > 0 else 0.0
        beta_0 = float(mean_y - beta_1 * mean_x)

        y_hat = [float(beta_0 + beta_1 * x) for x in xs]
        residuals = [float(ys[i] - y_hat[i]) for i in range(n)]
        ss_res = float(sum(r ** 2 for r in residuals))

        r_pearson = (
            float(ss_xy / math.sqrt(ss_xx * ss_yy))
            if ss_xx > 0 and ss_yy > 0
            else 0.0
        )
        r_squared = float(r_pearson ** 2)
        se_regression = float(math.sqrt(ss_res / (n - 2))) if n > 2 else 0.0

        scatter_data = [
            {"x": round(float(xs[i]), 4), "y": round(float(ys[i]), 4)}
            for i in range(n)
        ]

        x_min_line = float(min(xs))
        x_max_line = float(max(xs))
        regression_line = [
            {
                "x": round(x_min_line, 4),
                "y": round(float(beta_0 + beta_1 * x_min_line), 4),
            },
            {
                "x": round(x_max_line, 4),
                "y": round(float(beta_0 + beta_1 * x_max_line), 4),
            },
        ]

        residual_data = [
            {
                "fitted": round(float(y_hat[i]), 4),
                "residual": round(float(residuals[i]), 4),
            }
            for i in range(n)
        ]

        predictions = {}
        for x_val in [6, 8]:
            predictions[str(x_val)] = round(float(beta_0 + beta_1 * x_val), 4)
        if predict_x is not None:
            predictions[str(predict_x)] = round(
                float(beta_0 + beta_1 * predict_x), 4
            )

        sign_str = "+" if beta_1 >= 0 else "-"
        equation_str = f"Ŷ = {round(beta_0, 4)} {sign_str} {round(abs(beta_1), 4)} × X"

        return {
            "beta_0": round(beta_0, 4),
            "beta_1": round(beta_1, 4),
            "r_pearson": round(r_pearson, 4),
            "r_squared": round(r_squared, 4),
            "se_regression": round(se_regression, 4),
            "equation": equation_str,
            "scatter_data": scatter_data,
            "regression_line": regression_line,
            "residual_data": residual_data,
            "predictions": predictions,
            "ss_xx": ss_xx,
            "raw_beta_0": beta_0,
            "raw_beta_1": beta_1,
            "raw_se_regression": se_regression,
        }

    @staticmethod
    def compute_hypothesis(desc_y, n, mu_0, alpha, ss_xx, beta_1, se_regression):
        # 4a: Kiểm định trung bình mu_Y (phía phải: H1: mu > mu_0)
        se_mean_y = float(desc_y["std_dev"] / math.sqrt(n)) if n > 0 else 0.0
        df_mean = int(n - 1)
        t_stat_mean = float(
            (desc_y["mean"] - mu_0) / se_mean_y if se_mean_y > 0 else 0.0
        )
        p_value_mean = float(1 - stats.t.cdf(t_stat_mean, df_mean))

        t_crit_ci = float(stats.t.ppf(1 - alpha / 2, df_mean))
        ci_mean = [
            round(float(desc_y["mean"] - t_crit_ci * se_mean_y), 4),
            round(float(desc_y["mean"] + t_crit_ci * se_mean_y), 4),
        ]
        reject_mean = bool(p_value_mean < alpha)

        # 4b: Kiểm định hệ số góc beta_1 (hai phía: H1: beta_1 != 0)
        se_beta_1 = float(se_regression / math.sqrt(ss_xx)) if ss_xx > 0 else 0.0
        df_slope = int(n - 2)
        t_stat_slope = float(beta_1 / se_beta_1 if se_beta_1 > 0 else 0.0)
        p_value_slope = float(2 * (1 - stats.t.cdf(abs(t_stat_slope), df_slope)))

        t_crit_slope = float(stats.t.ppf(1 - alpha / 2, df_slope))
        ci_slope = [
            round(float(beta_1 - t_crit_slope * se_beta_1), 4),
            round(float(beta_1 + t_crit_slope * se_beta_1), 4),
        ]
        reject_slope = bool(p_value_slope < alpha)

        p_display_mean = (
            f"p = {round(p_value_mean, 4)}"
            if p_value_mean >= 0.001
            else "p < 0.001"
        )
        p_display_slope = (
            f"p = {round(p_value_slope, 4)}"
            if p_value_slope >= 0.001
            else "p < 0.001"
        )

        return {
            "mean_test": {
                "h0": f"μ = {mu_0}",
                "h1": f"μ > {mu_0}",
                "test_type": "one-sided (phải)",
                "df": df_mean,
                "t_statistic": round(t_stat_mean, 4),
                "p_value": (
                    round(p_value_mean, 6)
                    if p_value_mean >= 0.001
                    else float(p_value_mean)
                ),
                "p_display": p_display_mean,
                "ci": ci_mean,
                "reject_h0": reject_mean,
                "conclusion": (
                    f"Bác bỏ H₀: Có đủ bằng chứng thống kê cho thấy điểm cuối kỳ trung bình lớn hơn {mu_0} (α = {alpha})"
                    if reject_mean
                    else f"Chưa đủ bằng chứng bác bỏ H₀: Không có đủ bằng chứng cho thấy điểm cuối kỳ trung bình lớn hơn {mu_0} (α = {alpha})"
                ),
            },
            "slope_test": {
                "h0": "β₁ = 0",
                "h1": "β₁ ≠ 0",
                "test_type": "two-sided (hai phía)",
                "df": df_slope,
                "t_statistic": round(t_stat_slope, 4),
                "p_value": (
                    round(p_value_slope, 6)
                    if p_value_slope >= 0.001
                    else float(p_value_slope)
                ),
                "p_display": p_display_slope,
                "ci": ci_slope,
                "reject_h0": reject_slope,
                "conclusion": (
                    "Bác bỏ H₀: Điểm giữa kỳ có ý nghĩa thống kê trong việc dự đoán điểm cuối kỳ (β₁ ≠ 0)"
                    if reject_slope
                    else "Chưa đủ bằng chứng bác bỏ H₀: Chưa đủ cơ sở khẳng định điểm giữa kỳ có ý nghĩa dự đoán điểm cuối kỳ"
                ),
            },
        }

    @classmethod
    def execute_analysis(cls, model):
        """Xử lý toàn bộ quy trình từ Model và trả về kết quả cấu trúc hoàn chỉnh"""
        desc_x = cls.describe(model.xs)
        desc_y = cls.describe(model.ys)

        reg = cls.compute_regression(
            model.xs, model.ys, model.valid_n, model.predict_x
        )

        hyp = cls.compute_hypothesis(
            desc_y=desc_y,
            n=model.valid_n,
            mu_0=model.mu_0,
            alpha=model.alpha,
            ss_xx=reg["ss_xx"],
            beta_1=reg["raw_beta_1"],
            se_regression=reg["raw_se_regression"],
        )

        return {
            "cleaning": model.to_cleaning_dict(),
            "descriptive": {
                "x": desc_x,
                "y": desc_y,
            },
            "regression": {
                "beta_0": reg["beta_0"],
                "beta_1": reg["beta_1"],
                "r_pearson": reg["r_pearson"],
                "r_squared": reg["r_squared"],
                "se_regression": reg["se_regression"],
                "equation": reg["equation"],
                "scatter_data": reg["scatter_data"],
                "regression_line": reg["regression_line"],
                "residual_data": reg["residual_data"],
                "predictions": reg["predictions"],
            },
            "hypothesis": hyp,
        }
