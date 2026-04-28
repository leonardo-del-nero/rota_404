from flask import Flask

def create_app():
    app = Flask(__name__, template_folder='../templates')

    from app.routes.view_routes import view_bp
    from app.routes.api_routes import api_bp

    app.register_blueprint(view_bp)
    app.register_blueprint(api_bp)

    return app
