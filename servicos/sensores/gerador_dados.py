import random

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
