from flask import Blueprint, request, jsonify
from app.services.https_service import HttpsService

https_bp = Blueprint('https', __name__)
https_service = HttpsService()

@https_bp.route('/https-encrypt', methods=['POST'])
def https_encrypt():
    data = request.json.get('data', '')
    encrypted = https_service.simulate_encryption(data)
    return jsonify({'encrypted': encrypted})
