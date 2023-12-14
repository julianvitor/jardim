from flask import (
    Flask,
    render_template,Response
)
from flask_minify import Minify


app = Flask(__name__, static_folder='static')
app.static_folder = 'static'
minify = Minify(app=app, html=False, js=True, cssless=True)


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

if __name__ == '__main__':
    app.run()
