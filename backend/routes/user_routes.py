from flask import Blueprint, jsonify
from backend.services.user_service import UserService

user_bp = Blueprint('user', __name__)
user_service = UserService()

@user_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = user_service.get_user_details(user_id)
    if user:
        return jsonify({"status": "success", "data": user}), 200
    return jsonify({"status": "error", "message": "Usuário não encontrado."}), 404
