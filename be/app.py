from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Cho phép ứng dụng Frontend (Next.js) kết nối và gọi API
CORS(app)

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "online",
        "message": "Flask Backend is running!"
    })

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "backend"
    })

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({
        "status": "success",
        "data": {
            "message": "Hello from Flask backend!"
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
