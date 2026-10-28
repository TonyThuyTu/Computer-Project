// Payload gửi đến backend
export interface AnalysisRequest {
  data: [number, number][];
  alpha: number;
  mu_0: number;
  predict_x?: number;
}

// Phần 1: Làm sạch dữ liệu
export interface CleaningResult {
  total_raw: number;
  valid_n: number;
  removed: number;
  confidence_level: number;
}

// Thống kê mô tả cho một biến
export interface DescriptiveStats {
  n: number;
  mean: number;
  median: number;
  std_dev: number;
  variance: number;
  min: number;
  q1: number;
  q3: number;
  max: number;
  iqr: number;
  outliers: number[];
}

// Phần 3: Kết quả hồi quy
export interface RegressionResult {
  beta_0: number;
  beta_1: number;
  r_pearson: number;
  r_squared: number;
  se_regression: number;
  equation: string;
  scatter_data: { x: number; y: number }[];
  regression_line: { x: number; y: number }[];
  residual_data: { fitted: number; residual: number }[];
  predictions: Record<string, number>;
}

// Kết quả kiểm định một giả thuyết
export interface HypothesisTestResult {
  h0: string;
  h1: string;
  test_type: string;
  df: number;
  t_statistic: number;
  p_value: number;
  p_display: string;
  ci: [number, number];
  reject_h0: boolean;
  conclusion: string;
}

// Response toàn bộ từ API
export interface AnalysisResponse {
  cleaning: CleaningResult;
  descriptive: {
    x: DescriptiveStats;
    y: DescriptiveStats;
  };
  regression: RegressionResult;
  hypothesis: {
    mean_test: HypothesisTestResult;
    slope_test: HypothesisTestResult;
  };
}
