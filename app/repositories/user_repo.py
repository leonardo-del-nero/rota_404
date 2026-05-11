class UserRepository:
    def __init__(self):
        # Baseado no MOCK_DB original
        self._db = {
            "1": {"nome": "Neo", "role": "The One", "status": "Awake", "skills": ["Kung Fu", "Flying"]},
            "2": {"nome": "Trinity", "role": "Hacker", "status": "Active", "skills": ["Motorcycles", "Combat"]},
            "3": {"nome": "Morpheus", "role": "Captain", "status": "Active", "skills": ["Leadership", "Tactics"]},
            "4": {"nome": "Piaba", "role": "Fat", "status": "Inactive", "skills": ["Iluminat", "Strongness"]},
            "5": {"nome": "Pipoca", "role": "Bark", "status": "Active", "skills": ["Iluminat's Daughter", "Loud Bark"]}
        }

    def find_by_id(self, user_id):
        return self._db.get(user_id)
    