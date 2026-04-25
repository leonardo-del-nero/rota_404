from flask import Blueprint, render_template

view_bp = Blueprint('views', __name__)

@view_bp.route('/')
def hub():
    return render_template('hub.html')

@view_bp.route('/hash')
def hash_module():
    return render_template('hash.html')

@view_bp.route('/api-concept')
def api_module():
    return render_template('api_concept.html')
