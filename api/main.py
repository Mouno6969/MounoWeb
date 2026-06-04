import os
from flask import send_from_directory
from app import app as api_app

# Serve React static files
@api_app.route('/', defaults={'path': ''})
@api_app.route('/<path:path>')
def serve(path):
    frontend_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "build")
    if path != "" and os.path.exists(os.path.join(frontend_folder, path)):
        return send_from_directory(frontend_folder, path)
    else:
        return send_from_directory(frontend_folder, 'index.html')

if __name__ == '__main__':
    # When running production, we might use gunicorn, but for this setup:
    api_app.run(host='0.0.0.0', port=5001)
