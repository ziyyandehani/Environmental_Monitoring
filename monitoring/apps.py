from django.apps import AppConfig
import threading


class MonitoringConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'monitoring'

    def ready(self):
        # Import here to avoid apps not ready error
        from .mqtt_client import MqttClient
        
        # Start MQTT client in a separate thread
        if not getattr(self, '_mqtt_started', False):
            mqtt_client = MqttClient()
            mqtt_thread = threading.Thread(target=mqtt_client.run, daemon=True)
            mqtt_thread.start()
            self._mqtt_started = True