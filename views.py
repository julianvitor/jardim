from flask import Flask, render_template, Response, send_from_directory
from flask_minify import Minify
from flask_cors import CORS  # Importe o Flask-CORS

app = Flask(__name__, static_folder='static')
app.static_folder = 'static'
minify = Minify(app=app, html=False, js=False, cssless=True)

# Configure o CORS para permitir solicitações de todas as origens
CORS(app)

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/robots.txt')
def serve_robots():
    with open('static/robots.txt', 'rb') as file:
        content = file.read()

    response = Response(content, content_type='text/plain')
    return response

@app.errorhandler(404)
def page_not_found(error):
    return send_from_directory(app.static_folder + '/error_images', '404.jpg'), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
