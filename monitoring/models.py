from django.db import models
from django.utils import timezone
import json


class SensorState(models.Model):
    SENSOR_TYPES = [
        ('temperature', 'Temperature (°C)'),
        ('humidity', 'Humidity (%)'),
        ('light', 'Light (lumens)'),
        ('co2', 'CO2 (ppm)'),
    ]
    
    sensor = models.CharField(max_length=20, choices=SENSOR_TYPES)
    device = models.CharField(max_length=50, default='edge01')
    building = models.CharField(max_length=50, default='gedungA')
    value = models.FloatField()
    avg = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['sensor', 'device', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.sensor} - {self.device}: {self.value} at {self.timestamp}"


class SensorEvent(models.Model):
    EVENT_TYPES = [
        ('threshold_exceeded', 'Threshold Exceeded'),
        ('threshold_below', 'Threshold Below'),
        ('anomaly_detected', 'Anomaly Detected'),
        ('sensor_error', 'Sensor Error'),
    ]
    
    LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    sensor = models.CharField(max_length=20, choices=SensorState.SENSOR_TYPES)
    device = models.CharField(max_length=50, default='edge01')
    building = models.CharField(max_length=50, default='gedungA')
    value = models.FloatField()
    event = models.CharField(max_length=30, choices=EVENT_TYPES)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    message = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.CharField(max_length=100, blank=True, null=True)
    acknowledged_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['sensor', 'device', '-timestamp']),
            models.Index(fields=['level', '-timestamp']),
            models.Index(fields=['acknowledged', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.sensor} {self.event} - {self.level}: {self.value}"


class Heartbeat(models.Model):
    STATUS_CHOICES = [
        ('alive', 'Alive'),
        ('warning', 'Warning'),
        ('offline', 'Offline'),
    ]
    
    device = models.CharField(max_length=50, default='edge01')
    building = models.CharField(max_length=50, default='gedungA')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['device', '-timestamp']),
            models.Index(fields=['status', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.device} - {self.status} at {self.timestamp}"


class Command(models.Model):
    COMMAND_TYPES = [
        ('fan_on', 'Turn Fan On'),
        ('fan_off', 'Turn Fan Off'),
        ('reset_sensor', 'Reset Sensor'),
        ('calibrate', 'Calibrate Sensor'),
        ('reboot', 'Reboot Device'),
        ('update_threshold', 'Update Threshold'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('acknowledged', 'Acknowledged'),
        ('executed', 'Executed'),
        ('failed', 'Failed'),
    ]
    
    device = models.CharField(max_length=50, default='edge01')
    building = models.CharField(max_length=50, default='gedungA')
    command_type = models.CharField(max_length=20, choices=COMMAND_TYPES)
    parameters = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    executed_at = models.DateTimeField(blank=True, null=True)
    response = models.JSONField(default=dict, blank=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.command_type} for {self.device} - {self.status}"