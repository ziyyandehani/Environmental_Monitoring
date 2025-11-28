from django.contrib import admin
from .models import SensorState, SensorEvent, Heartbeat, Command


@admin.register(SensorState)
class SensorStateAdmin(admin.ModelAdmin):
    list_display = ['sensor', 'device', 'value', 'avg', 'timestamp', 'created_at']
    list_filter = ['sensor', 'device', 'building', 'timestamp']
    search_fields = ['sensor', 'device', 'building']
    readonly_fields = ['created_at']
    ordering = ['-timestamp']


@admin.register(SensorEvent)
class SensorEventAdmin(admin.ModelAdmin):
    list_display = ['sensor', 'event', 'level', 'value', 'acknowledged', 'timestamp']
    list_filter = ['sensor', 'event', 'level', 'acknowledged', 'device', 'timestamp']
    search_fields = ['sensor', 'device', 'event', 'message']
    readonly_fields = ['created_at']
    ordering = ['-timestamp']
    
    actions = ['mark_acknowledged']
    
    def mark_acknowledged(self, request, queryset):
        queryset.update(acknowledged=True, acknowledged_by=request.user.username)
    mark_acknowledged.short_description = "Mark selected events as acknowledged"


@admin.register(Heartbeat)
class HeartbeatAdmin(admin.ModelAdmin):
    list_display = ['device', 'status', 'timestamp', 'created_at']
    list_filter = ['status', 'device', 'building', 'timestamp']
    search_fields = ['device', 'building']
    readonly_fields = ['created_at']
    ordering = ['-timestamp']


@admin.register(Command)
class CommandAdmin(admin.ModelAdmin):
    list_display = ['command_type', 'device', 'status', 'created_at', 'sent_at', 'created_by']
    list_filter = ['command_type', 'status', 'device', 'building', 'created_at']
    search_fields = ['command_type', 'device', 'created_by']
    readonly_fields = ['created_at', 'sent_at', 'executed_at']
    ordering = ['-created_at']