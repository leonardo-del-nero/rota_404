from flask import Blueprint, request, jsonify
from backend.services.hash_service import HashService

hash_bp = Blueprint('hash', __name__)
hash_service = HashService()

@hash_bp.route('/hash', methods=['POST'])
def generate_hash():
    data = request.json.get('data', '')
    result = hash_service.generate_sha256(data)
    return jsonify({'hash': result})
