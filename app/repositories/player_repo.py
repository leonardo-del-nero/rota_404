import json
import os
import threading
from datetime import datetime

class PlayerRepository:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.file_path = os.path.join(base_dir, 'data', 'players.json')
        self.lock = threading.Lock()
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        with self.lock:
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            
            is_valid = False
            if os.path.exists(self.file_path):
                try:
                    with open(self.file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if isinstance(data, dict) and "players" in data and isinstance(data["players"], list):
                            is_valid = True
                except (json.JSONDecodeError, Exception):
                    pass
            
            if not is_valid:
                with open(self.file_path, 'w', encoding='utf-8') as f:
                    json.dump({"players": []}, f, indent=4)

    def get_all_players(self):
        self._ensure_file_exists()
        with self.lock:
            try:
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get("players", [])
            except (FileNotFoundError, json.JSONDecodeError):
                return []

    def save_player(self, player_data):
        self._ensure_file_exists()
        with self.lock:
            players = []
            try:
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    players = data.get("players", [])
            except (json.JSONDecodeError):
                pass

            player_data['id'] = str(len(players) + 1)
            player_data['created_at'] = datetime.now().isoformat()
            players.append(player_data)
            
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump({"players": players}, f, indent=4, ensure_ascii=False)
                
            return player_data

    def update_score(self, player_id, score, modules=None):
        self._ensure_file_exists()
        with self.lock:
            players = []
            try:
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    players = data.get("players", [])
            except (json.JSONDecodeError):
                return False
                
            updated = False
            for p in players:
                if str(p.get('id')) == str(player_id):
                    if 'progress' not in p:
                        p['progress'] = {}
                    p['progress']['score'] = score
                    if modules is not None:
                        p['progress']['modules'] = modules
                    updated = True
                    break
                    
            if updated:
                with open(self.file_path, 'w', encoding='utf-8') as f:
                    json.dump({"players": players}, f, indent=4, ensure_ascii=False)
                return True
            return False
