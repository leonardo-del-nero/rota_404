class HttpsService:
    @staticmethod
    def simulate_encryption(data: str) -> str:
        # Simulação simples de criptografia (Shift +13) para fins didáticos
        return "".join([chr(ord(c) + 13) for c in data])
