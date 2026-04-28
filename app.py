from flask import Flask
from flask_cors import CORS

# Importando os Blueprints especializados (SRP)
from app.routes.user_routes import user_bp
from app.routes.hash_routes import hash_bp
from app.routes.https_routes import https_bp
from app.routes.dns_routes import dns_bp
from app.routes.error_routes import error_bp

app = Flask(__name__)
CORS(app)

# Registro de Blueprints com prefixo comum /api
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(hash_bp, url_prefix='/api')
app.register_blueprint(https_bp, url_prefix='/api')
app.register_blueprint(dns_bp, url_prefix='/api')
app.register_blueprint(error_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    