class ErrorService:
    def __init__(self):
        self._valid_routes = ['/home', '/contato', '/sobre', '/api', '/hash', '/404-lab']

    def validate_route(self, path: str):
        if path in self._valid_routes:
            return {'status': 'found', 'message': f'Rota {path} encontrada no servidor!'}
        else:
            return {'status': 'not_found', 'message': f'Erro 404: O caminho {path} não existe.'}
