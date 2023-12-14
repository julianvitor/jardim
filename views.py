from flask import (
    Flask,
    render_template,
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
