from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db.models import Q, Avg
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
import logging

from .models import SensorState, SensorEvent, Heartbeat, Command
from .mqtt_client import get_mqtt_client

logger = logging.getLogger(__name__)


def dashboard(request):
    """Main dashboard view"""
    # Get latest sensor states
    latest_states = {}
    sensors = ['temperature', 'humidity', 'light', 'co2']
    
    for sensor in sensors:
        latest = SensorState.objects.filter(sensor=sensor).first()
        if latest:
            latest_states[sensor] = {
                'value': latest.value,
                'avg': latest.avg,
                'timestamp': latest.timestamp,
                'status': get_sensor_status(sensor, latest.value)
            }
    
    # Get recent events
    recent_events = SensorEvent.objects.filter(
        acknowledged=False
    )[:10]
    
    # Get device status from heartbeat
    latest_heartbeat = Heartbeat.objects.first()
    device_status = latest_heartbeat.status if latest_heartbeat else 'unknown'
    
    context = {
        'latest_states': latest_states,
        'recent_events': recent_events,
        'device_status': device_status,
        'sensors': sensors,
    }
    
    return render(request, 'monitoring/dashboard.html', context)


def get_sensor_status(sensor_type, value):
    """Determine sensor status based on thresholds"""
    thresholds = {
        'temperature': {'min': 18, 'max': 30},
        'humidity': {'min': 30, 'max': 70},
        'light': {'min': 10, 'max': 1000},
        'co2': {'min': 0, 'max': 1000}
    }
    
    if sensor_type in thresholds:
        thresh = thresholds[sensor_type]
        if value < thresh['min']:
            return 'low'
        elif value > thresh['max']:
            return 'high'
        else:
            return 'normal'
    return 'unknown'


@api_view(['GET'])
def api_sensor_data(request):
    """API endpoint for sensor data"""
    sensor_type = request.GET.get('sensor')
    hours = int(request.GET.get('hours', 24))
    
    # Calculate time range
    end_time = timezone.now()
    start_time = end_time - timedelta(hours=hours)
    
    # Get sensor data
    queryset = SensorState.objects.filter(
        timestamp__gte=start_time,
        timestamp__lte=end_time
    )
    
    if sensor_type:
        queryset = queryset.filter(sensor=sensor_type)
    
    # Format data for Chart.js
    data = []
    for state in queryset:
        data.append({
            'x': state.timestamp.isoformat(),
            'y': state.value,
            'sensor': state.sensor,
            'avg': state.avg
        })
    
    return Response({
        'data': data,
        'sensor': sensor_type,
        'hours': hours
    })


@api_view(['GET'])
def api_sensor_latest(request):
    """API endpoint for latest sensor readings"""
    sensors = ['temperature', 'humidity', 'light', 'co2']
    latest_data = {}
    
    for sensor in sensors:
        latest = SensorState.objects.filter(sensor=sensor).first()
        if latest:
            latest_data[sensor] = {
                'value': latest.value,
                'avg': latest.avg,
                'timestamp': latest.timestamp.isoformat(),
                'status': get_sensor_status(sensor, latest.value)
            }
    
    return Response(latest_data)


@api_view(['GET'])
def api_events(request):
    """API endpoint for sensor events"""
    limit = int(request.GET.get('limit', 50))
    acknowledged = request.GET.get('acknowledged')
    level = request.GET.get('level')
    
    queryset = SensorEvent.objects.all()
    
    if acknowledged is not None:
        queryset = queryset.filter(acknowledged=acknowledged.lower() == 'true')
    
    if level:
        queryset = queryset.filter(level=level)
    
    queryset = queryset[:limit]
    
    events = []
    for event in queryset:
        events.append({
            'id': event.id,
            'sensor': event.sensor,
            'event': event.event,
            'level': event.level,
            'value': event.value,
            'message': event.message,
            'timestamp': event.timestamp.isoformat(),
            'acknowledged': event.acknowledged
        })
    
    return Response({'events': events})


@api_view(['POST'])
def api_acknowledge_event(request, event_id):
    """API endpoint to acknowledge an event"""
    try:
        event = SensorEvent.objects.get(id=event_id)
        event.acknowledged = True
        event.acknowledged_at = timezone.now()
        event.acknowledged_by = request.user.username if request.user.is_authenticated else 'anonymous'
        event.save()
        
        return Response({'message': 'Event acknowledged successfully'})
    except SensorEvent.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


@api_view(['GET'])
def api_heartbeat(request):
    """API endpoint for device heartbeat status"""
    latest_heartbeat = Heartbeat.objects.first()
    
    if latest_heartbeat:
        # Check if heartbeat is recent (within last 2 minutes)
        time_diff = timezone.now() - latest_heartbeat.timestamp
        is_recent = time_diff.total_seconds() < 120
        
        return Response({
            'device': latest_heartbeat.device,
            'status': latest_heartbeat.status,
            'timestamp': latest_heartbeat.timestamp.isoformat(),
            'is_recent': is_recent,
            'metadata': latest_heartbeat.metadata
        })
    else:
        return Response({
            'status': 'unknown',
            'is_recent': False
        })


@csrf_exempt
@require_http_methods(['POST'])
def api_send_command(request):
    """API endpoint to send command to device"""
    try:
        data = json.loads(request.body)
        command_type = data.get('command_type')
        parameters = data.get('parameters', {})
        device = data.get('device', 'edge01')
        building = data.get('building', 'gedungA')
        
        if not command_type:
            return JsonResponse({'error': 'Command type is required'}, status=400)
        
        # Create command record
        command = Command.objects.create(
            device=device,
            building=building,
            command_type=command_type,
            parameters=parameters,
            created_by=request.user.username if request.user.is_authenticated else 'anonymous'
        )
        
        # Send command via MQTT
        mqtt_client = get_mqtt_client()
        success = mqtt_client.publish_command(
            command_type=command_type,
            parameters=parameters,
            device=device,
            building=building
        )
        
        if success:
            command.status = 'sent'
            command.sent_at = timezone.now()
            command.save()
            
            return JsonResponse({
                'message': 'Command sent successfully',
                'command_id': command.id
            })
        else:
            command.status = 'failed'
            command.save()
            
            return JsonResponse({'error': 'Failed to send command'}, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Error sending command: {e}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


@api_view(['GET'])
def api_commands(request):
    """API endpoint to get command history"""
    limit = int(request.GET.get('limit', 20))
    
    commands = Command.objects.all()[:limit]
    
    command_list = []
    for cmd in commands:
        command_list.append({
            'id': cmd.id,
            'command_type': cmd.command_type,
            'device': cmd.device,
            'parameters': cmd.parameters,
            'status': cmd.status,
            'created_at': cmd.created_at.isoformat(),
            'sent_at': cmd.sent_at.isoformat() if cmd.sent_at else None,
            'executed_at': cmd.executed_at.isoformat() if cmd.executed_at else None,
            'created_by': cmd.created_by
        })
    
    return Response({'commands': command_list})


@api_view(['GET'])
def api_statistics(request):
    """API endpoint for dashboard statistics"""
    # Calculate statistics for the last 24 hours
    end_time = timezone.now()
    start_time = end_time - timedelta(hours=24)
    
    stats = {}
    sensors = ['temperature', 'humidity', 'light', 'co2']
    
    for sensor in sensors:
        sensor_data = SensorState.objects.filter(
            sensor=sensor,
            timestamp__gte=start_time
        )
        
        if sensor_data.exists():
            avg_value = sensor_data.aggregate(Avg('value'))['value__avg']
            min_value = min(state.value for state in sensor_data)
            max_value = max(state.value for state in sensor_data)
            
            stats[sensor] = {
                'avg': round(avg_value, 2) if avg_value else 0,
                'min': min_value,
                'max': max_value,
                'count': sensor_data.count()
            }
        else:
            stats[sensor] = {
                'avg': 0,
                'min': 0,
                'max': 0,
                'count': 0
            }
    
    # Event statistics
    event_counts = {}
    for level in ['low', 'medium', 'high', 'critical']:
        count = SensorEvent.objects.filter(
            level=level,
            timestamp__gte=start_time
        ).count()
        event_counts[level] = count
    
    return Response({
        'sensor_stats': stats,
        'event_counts': event_counts,
        'time_range': '24 hours'
    })