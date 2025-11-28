#!/usr/bin/env python3
"""
Script untuk testing MQTT publisher - simulasi edge device
Mengirim data sensor secara berkala ke MQTT broker
"""

import paho.mqtt.client as mqtt
import json
import time
import random
import argparse
from datetime import datetime, timezone


class EdgeDeviceSimulator:
    def __init__(self, broker_host='localhost', broker_port=1883):
        self.client = mqtt.Client()
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.device_id = 'edge01'
        self.building = 'gedungA'
        
        # Sensor thresholds
        self.thresholds = {
            'temperature': {'min': 18, 'max': 30, 'critical': 35},
            'humidity': {'min': 30, 'max': 70, 'critical': 80},
            'light': {'min': 10, 'max': 1000, 'critical': 5},
            'co2': {'min': 0, 'max': 1000, 'critical': 1500}
        }
        
        # Sensor data history for moving average
        self.sensor_history = {
            'temperature': [],
            'humidity': [],
            'light': [],
            'co2': []
        }
        
    def connect(self):
        """Connect to MQTT broker"""
        try:
            self.client.connect(self.broker_host, self.broker_port, 60)
            self.client.loop_start()
            print(f"Connected to MQTT broker at {self.broker_host}:{self.broker_port}")
            return True
        except Exception as e:
            print(f"Failed to connect to MQTT broker: {e}")
            return False
    
    def generate_sensor_data(self):
        """Generate realistic sensor data"""
        base_time = datetime.now(timezone.utc)
        
        # Generate realistic values with some variation
        data = {
            'temperature': round(random.uniform(15, 35), 1),
            'humidity': round(random.uniform(20, 80), 1), 
            'light': round(random.uniform(0, 1200), 1),
            'co2': round(random.uniform(300, 1600), 1)
        }
        
        # Add some correlation (hot = less humidity, more light = more heat)
        if data['temperature'] > 28:
            data['humidity'] = max(20, data['humidity'] - random.uniform(0, 15))
        
        if data['light'] > 800:
            data['temperature'] += random.uniform(0, 3)
            
        return data
    
    def calculate_moving_average(self, sensor, value):
        """Calculate moving average (5 data points)"""
        history = self.sensor_history[sensor]
        history.append(value)
        
        if len(history) > 5:
            history.pop(0)
            
        return sum(history) / len(history)
    
    def check_threshold_violation(self, sensor, value):
        """Check if value violates thresholds"""
        threshold = self.thresholds[sensor]
        
        if value > threshold['critical']:
            return {'event': 'threshold_exceeded', 'level': 'critical'}
        elif value > threshold['max']:
            return {'event': 'threshold_exceeded', 'level': 'high'}
        elif value < threshold['min']:
            return {'event': 'threshold_below', 'level': 'medium'}
        
        return None
    
    def publish_sensor_state(self, sensor, value, avg_value):
        """Publish sensor state to MQTT"""
        topic = f"env/{self.building}/{self.device_id}/{sensor}/state"
        
        payload = {
            'sensor': sensor,
            'device': self.device_id,
            'building': self.building,
            'value': value,
            'avg': round(avg_value, 1),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        self.client.publish(topic, json.dumps(payload))
        print(f"📊 State: {sensor}={value} (avg={avg_value:.1f})")
    
    def publish_sensor_event(self, sensor, value, event_info):
        """Publish sensor event to MQTT"""
        topic = f"env/{self.building}/{self.device_id}/{sensor}/event"
        
        payload = {
            'sensor': sensor,
            'device': self.device_id,
            'building': self.building,
            'value': value,
            'event': event_info['event'],
            'level': event_info['level'],
            'message': f"{sensor} {event_info['event']}: {value}",
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        self.client.publish(topic, json.dumps(payload))
        print(f"🚨 Event: {sensor} {event_info['event']} - {event_info['level']}")
    
    def publish_heartbeat(self):
        """Publish heartbeat to MQTT"""
        topic = f"env/{self.building}/{self.device_id}/heartbeat"
        
        payload = {
            'device': self.device_id,
            'building': self.building,
            'status': 'alive',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'metadata': {
                'uptime': time.time(),
                'sensors_count': 4
            }
        }
        
        self.client.publish(topic, json.dumps(payload))
        print("💓 Heartbeat sent")
    
    def run_simulation(self, duration_minutes=60):
        """Run the edge device simulation"""
        if not self.connect():
            return
        
        print(f"🚀 Starting edge device simulation for {duration_minutes} minutes")
        print(f"📡 Device: {self.device_id}, Building: {self.building}")
        print("=" * 50)
        
        start_time = time.time()
        last_heartbeat = 0
        
        try:
            while (time.time() - start_time) < (duration_minutes * 60):
                # Generate sensor data every 5 seconds
                sensor_data = self.generate_sensor_data()
                
                # Process each sensor
                for sensor, value in sensor_data.items():
                    # Calculate moving average
                    avg_value = self.calculate_moving_average(sensor, value)
                    
                    # Publish state (always)
                    self.publish_sensor_state(sensor, value, avg_value)
                    
                    # Check for threshold violations
                    event_info = self.check_threshold_violation(sensor, value)
                    if event_info:
                        self.publish_sensor_event(sensor, value, event_info)
                
                # Send heartbeat every 30 seconds
                current_time = time.time()
                if current_time - last_heartbeat >= 30:
                    self.publish_heartbeat()
                    last_heartbeat = current_time
                
                print("-" * 30)
                time.sleep(5)  # Wait 5 seconds before next reading
                
        except KeyboardInterrupt:
            print("\n🛑 Simulation stopped by user")
        finally:
            self.client.loop_stop()
            self.client.disconnect()
            print("📡 Disconnected from MQTT broker")


def main():
    parser = argparse.ArgumentParser(description='Edge Device MQTT Simulator')
    parser.add_argument('--host', default='localhost', help='MQTT broker host')
    parser.add_argument('--port', type=int, default=1883, help='MQTT broker port')
    parser.add_argument('--duration', type=int, default=60, help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = EdgeDeviceSimulator(args.host, args.port)
    simulator.run_simulation(args.duration)


if __name__ == '__main__':
    main()