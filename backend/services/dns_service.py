import socket

class DnsService:
    def __init__(self):
        self._dns_db = {
            'rota404.edu': '10.0.0.404'
        }

    def lookup(self, domain: str) -> str:
        domain = domain.lower().replace('http://', '').replace('https://', '').split('/')[0]
        
        # Primeiro checa no mock
        if domain in self._dns_db:
            return self._dns_db[domain]
        
        # Senão, faz a consulta REAL
        try:
            return socket.gethostbyname(domain)
        except Exception:
            return 'IP_NÃO_ENCONTRADO'
