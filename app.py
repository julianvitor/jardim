from flask import (
    Flask,
    jsonify,
    render_template,
    send_from_directory,
    Response
)
from flask_minify import Minify
import random


app = Flask(__name__, static_folder='static')
app.static_folder = 'static'
minify = Minify(app=app, html=False, js=True, cssless=True)

def generate_sensor_data():
    return {
        "air_temp": f"{random.uniform(20, 30):.1f}°C",
        "soil_temp": f"{random.uniform(15, 25):.1f}°C",
        "ph": f"{random.uniform(5, 8):.2f}",
        "air_humidity": f"{random.uniform(40, 70):.1f}%",
        "soil_moisture": f"{random.uniform(30, 60):.1f}%",
        "electrical_consumption": f"{random.uniform(10, 20):.2f} kWh",
        "reservoir_l1": f"{random.uniform(50, 90):.1f}%",
        "reservoir_l2": f"{random.uniform(40, 80):.1f}%",
        "co2": f"{random.randint(300, 500)} ppm",
        "light": f"{random.randint(500, 1000)} Lux",
    }

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

@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    sensor_data = generate_sensor_data()
    return jsonify(sensor_data)

@app.route('/water-plant', methods=['POST'])
def water_plant():
    response = {"message": "Regando"}
    return jsonify(response)

@app.errorhandler(404)
def page_not_found(error):
    return send_from_directory(app.static_folder + '/error_images', '404.jpg'), 404

if __name__ == '__main__':
    app.run()

