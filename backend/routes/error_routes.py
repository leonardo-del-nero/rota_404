from flask import Blueprint, request, jsonify
from backend.services.error_service import ErrorService

error_bp = Blueprint('error', __name__)
error_service = ErrorService()

@error_bp.route('/route-check', methods=['POST'])
def route_check():
    path = request.json.get('path', '')
    result = error_service.validate_route(path)
    status_code = 200 if result['status'] == 'found' else 404
    return jsonify(result), status_code
