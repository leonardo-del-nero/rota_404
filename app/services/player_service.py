from app.repositories.player_repo import PlayerRepository

class PlayerService:
    def __init__(self):
        self.repo = PlayerRepository()

    def register_player(self, name, character_id):
        if not name or not character_id:
            return {"error": "Nome e personagem são obrigatórios"}, 400
            
        player_data = {
            "name": name,
            "character_id": character_id,
            "progress": {} # Para uso futuro (leaderboard/quizzes)
        }
        
        saved_player = self.repo.save_player(player_data)
        return saved_player, 201

    def get_players(self):
        return self.repo.get_all_players(), 200

    def update_score(self, player_id, score, modules=None):
        success = self.repo.update_score(player_id, score, modules)
        if success:
            return {"status": "success"}, 200
        return {"error": "Jogador não encontrado"}, 404

    def get_leaderboard(self):
        players = self.repo.get_all_players()
        ranked = [p for p in players if 'progress' in p and 'score' in p['progress']]
        ranked.sort(key=lambda x: x['progress']['score'], reverse=True)
        return ranked, 200
