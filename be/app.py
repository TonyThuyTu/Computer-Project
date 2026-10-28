from flask import Flask, jsonify
from flask_cors import CORS
from routes.analysis_routes import api_bp


def create_app():
    """Khởi tạo ứng dụng Flask và đăng ký các mô-đun theo kiến trúc MVC"""
    app = Flask(__name__)
    CORS(app)

    # Đăng ký Blueprint các API Routes
    app.register_blueprint(api_bp)

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "status": "online",
            "architecture": "MVC (Model-View-Controller)",
            "message": "MAS Statistics Backend is running",
            "endpoints": {
                "health": "/api/health",
                "analyze": "/api/analyze",
            },
        })

    return app


# Đối tượng app chính để chạy trực tiếp hoặc WSGI / Docker container
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
