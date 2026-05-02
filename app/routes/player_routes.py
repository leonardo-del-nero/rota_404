from flask import Blueprint, request, jsonify
from app.services.player_service import PlayerService

player_bp = Blueprint('player', __name__)
player_service = PlayerService()

@player_bp.route('/players', methods=['POST'])
def register_player():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Dados inválidos"}), 400
        
    name = data.get('name')
    character_id = data.get('characterId')
    
    result, status_code = player_service.register_player(name, character_id)
    
    if status_code != 201:
        return jsonify({"status": "error", "message": result.get("error")}), status_code
        
    return jsonify({"status": "success", "data": result}), status_code

@player_bp.route('/players', methods=['GET'])
def get_players():
    result, status_code = player_service.get_players()
    return jsonify({"status": "success", "data": result}), status_code

@player_bp.route('/players/<player_id>/score', methods=['PUT'])
def update_score(player_id):
    data = request.get_json()
    if not data or 'score' not in data:
        return jsonify({"status": "error", "message": "Dados inválidos"}), 400
        
    result, status_code = player_service.update_score(player_id, data['score'])
    return jsonify(result), status_code

@player_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    result, status_code = player_service.get_leaderboard()
    return jsonify({"status": "success", "data": result}), status_code
