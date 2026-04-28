from flask import Blueprint, request, jsonify
from backend.services.dns_service import DnsService

dns_bp = Blueprint('dns', __name__)
dns_service = DnsService()

@dns_bp.route('/dns-lookup', methods=['POST'])
def dns_lookup():
    domain = request.json.get('domain', '')
    ip = dns_service.lookup(domain)
    return jsonify({'ip': ip})
