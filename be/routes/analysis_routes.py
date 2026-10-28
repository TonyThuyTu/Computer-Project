from flask import Blueprint, jsonify, request
from models.dataset_model import DatasetModel
from controllers.analysis_controller import AnalysisController

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/health", methods=["GET"])
def health_check():
    """Endpoint kiểm tra sức khỏe dịch vụ backend"""
    return jsonify({"status": "healthy", "service": "mas-backend-mvc"})


@api_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Controller Endpoint:
    1. Nhận dữ liệu / file từ Frontend thông qua Model (DatasetModel)
    2. Chuyển Model cho Controller (AnalysisController) xử lý thống kê
    3. Trả về kết quả JSON theo đúng chuẩn API
    """
    try:
        model = DatasetModel.from_request(request)
    except Exception as e:
        return jsonify({"error": f"Lỗi xử lý dữ liệu đầu vào: {str(e)}"}), 400

    if not model.is_valid_for_analysis:
        return (
            jsonify({
                "error": "Cần ít nhất 3 cặp dữ liệu hợp lệ (thang điểm 0 - 10) để thực hiện phân tích thống kê"
            }),
            400,
        )

    try:
        result = AnalysisController.execute_analysis(model)
        return jsonify(result), 200
    except Exception as e:
        return (
            jsonify({"error": f"Lỗi trong quá trình tính toán thống kê: {str(e)}"}),
            500,
        )
