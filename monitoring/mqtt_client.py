import paho.mqtt.client as mqtt
import json
import logging
from datetime import datetime
from django.conf import settings
from django.utils import timezone
import threading
import time


logger = logging.getLogger(__name__)


class MqttClient:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.connected = False
        self.lock = threading.Lock()
        
    def on_connect(self, client, userdata, flags, rc):
        """Callback untuk koneksi MQTT"""
        if rc == 0:
            self.connected = True
            logger.info("Connected to MQTT broker")
            
            # Subscribe ke semua topic yang diperlukan
            topics = [
                (settings.MQTT_TOPICS['state'], 0),
                (settings.MQTT_TOPICS['event'], 0),
                (settings.MQTT_TOPICS['heartbeat'], 0),
            ]
            
            for topic, qos in topics:
                client.subscribe(topic, qos)
                logger.info(f"Subscribed to topic: {topic}")
        else:
            logger.error(f"Failed to connect to MQTT broker: {rc}")
            
    def on_disconnect(self, client, userdata, rc):
        """Callback untuk disconnect MQTT"""
        self.connected = False
        logger.warning(f"Disconnected from MQTT broker: {rc}")
        
    def on_message(self, client, userdata, msg):
        """Callback untuk menerima message MQTT"""
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode('utf-8'))
            
            logger.info(f"Received message on topic {topic}: {payload}")
            
            # Process berdasarkan topic pattern
            if '/state' in topic:
                self.handle_sensor_state(topic, payload)
            elif '/event' in topic:
                self.handle_sensor_event(topic, payload)
            elif '/heartbeat' in topic:
                self.handle_heartbeat(topic, payload)
            else:
                logger.warning(f"Unknown topic pattern: {topic}")
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON payload: {e}")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")
            
    def handle_sensor_state(self, topic, payload):
        """Handle sensor state messages"""
        try:
            # Import here to avoid circular imports
            from .models import SensorState
            
            # Parse timestamp
            timestamp = timezone.now()
            if 'timestamp' in payload:
                try:
                    timestamp = timezone.datetime.fromisoformat(
                        payload['timestamp'].replace('Z', '+00:00')
                    )
                except:
                    pass
            
            # Extract sensor type from topic (env/gedungA/edge01/<sensor>/state)
            topic_parts = topic.split('/')
            sensor_type = topic_parts[3] if len(topic_parts) >= 4 else payload.get('sensor', 'unknown')
            
            # Create sensor state record
            sensor_state = SensorState.objects.create(
                sensor=sensor_type,
                device=payload.get('device', 'edge01'),
                building=payload.get('building', 'gedungA'),
                value=payload.get('value', 0),
                avg=payload.get('avg'),
                timestamp=timestamp
            )
            
            logger.info(f"Saved sensor state: {sensor_state}")
            
        except Exception as e:
            logger.error(f"Error handling sensor state: {e}")
            
    def handle_sensor_event(self, topic, payload):
        """Handle sensor event messages"""
        try:
            # Import here to avoid circular imports
            from .models import SensorEvent
            
            # Parse timestamp
            timestamp = timezone.now()
            if 'timestamp' in payload:
                try:
                    timestamp = timezone.datetime.fromisoformat(
                        payload['timestamp'].replace('Z', '+00:00')
                    )
                except:
                    pass
            
            # Extract sensor type from topic
            topic_parts = topic.split('/')
            sensor_type = topic_parts[3] if len(topic_parts) >= 4 else payload.get('sensor', 'unknown')
            
            # Create sensor event record
            sensor_event = SensorEvent.objects.create(
                sensor=sensor_type,
                device=payload.get('device', 'edge01'),
                building=payload.get('building', 'gedungA'),
                value=payload.get('value', 0),
                event=payload.get('event', 'unknown'),
                level=payload.get('level', 'medium'),
                message=payload.get('message', ''),
                timestamp=timestamp
            )
            
            logger.info(f"Saved sensor event: {sensor_event}")
            
        except Exception as e:
            logger.error(f"Error handling sensor event: {e}")
            
    def handle_heartbeat(self, topic, payload):
        """Handle heartbeat messages"""
        try:
            # Import here to avoid circular imports
            from .models import Heartbeat
            
            # Parse timestamp
            timestamp = timezone.now()
            if 'timestamp' in payload:
                try:
                    timestamp = timezone.datetime.fromisoformat(
                        payload['timestamp'].replace('Z', '+00:00')
                    )
                except:
                    pass
            
            # Create heartbeat record
            heartbeat = Heartbeat.objects.create(
                device=payload.get('device', 'edge01'),
                building=payload.get('building', 'gedungA'),
                status=payload.get('status', 'alive'),
                timestamp=timestamp,
                metadata=payload.get('metadata', {})
            )
            
            logger.info(f"Saved heartbeat: {heartbeat}")
            
        except Exception as e:
            logger.error(f"Error handling heartbeat: {e}")
            
    def publish_command(self, command_type, parameters=None, device='edge01', building='gedungA'):
        """Publish command to MQTT"""
        try:
            if not self.connected:
                logger.error("MQTT client not connected")
                return False
                
            topic = f"env/{building}/{device}/command"
            payload = {
                'command': command_type,
                'parameters': parameters or {},
                'timestamp': timezone.now().isoformat(),
                'device': device,
                'building': building
            }
            
            with self.lock:
                result = self.client.publish(topic, json.dumps(payload))
                
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Published command {command_type} to {topic}")
                return True
            else:
                logger.error(f"Failed to publish command: {result.rc}")
                return False
                
        except Exception as e:
            logger.error(f"Error publishing command: {e}")
            return False
            
    def connect_and_loop(self):
        """Connect to MQTT broker and start loop"""
        try:
            self.client.connect(
                settings.MQTT_BROKER_HOST,
                settings.MQTT_BROKER_PORT,
                settings.MQTT_KEEPALIVE
            )
            self.client.loop_forever()
        except Exception as e:
            logger.error(f"MQTT connection error: {e}")
            time.sleep(5)  # Wait before retry
            
    def run(self):
        """Main run method with reconnection logic"""
        logger.info("Starting MQTT client...")
        
        while True:
            try:
                self.connect_and_loop()
            except Exception as e:
                logger.error(f"MQTT client error: {e}")
                
            # Wait before reconnecting
            logger.info("Reconnecting to MQTT broker in 5 seconds...")
            time.sleep(5)


# Global MQTT client instance
mqtt_client_instance = None

def get_mqtt_client():
    """Get global MQTT client instance"""
    global mqtt_client_instance
    if mqtt_client_instance is None:
        mqtt_client_instance = MqttClient()
    return mqtt_client_instance