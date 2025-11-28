from django.urls import path
from . import views

app_name = 'monitoring'

urlpatterns = [
    # Dashboard
    path('', views.dashboard, name='dashboard'),
    
    # API endpoints
    path('api/sensor-data/', views.api_sensor_data, name='api_sensor_data'),
    path('api/sensor-latest/', views.api_sensor_latest, name='api_sensor_latest'),
    path('api/events/', views.api_events, name='api_events'),
    path('api/events/<int:event_id>/acknowledge/', views.api_acknowledge_event, name='api_acknowledge_event'),
    path('api/heartbeat/', views.api_heartbeat, name='api_heartbeat'),
    path('api/send-command/', views.api_send_command, name='api_send_command'),
    path('api/commands/', views.api_commands, name='api_commands'),
    path('api/statistics/', views.api_statistics, name='api_statistics'),
]