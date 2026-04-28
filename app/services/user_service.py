import time
from app.repositories.user_repo import UserRepository

class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def get_user_details(self, user_id):
        time.sleep(0.5) # Simulação de latência original
        return self.repo.find_by_id(user_id)
    