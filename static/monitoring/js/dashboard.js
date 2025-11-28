// Dashboard JavaScript
class EnvironmentalDashboard {
    constructor() {
        this.chart = null;
        this.updateInterval = null;
        this.currentTimeRange = 1; // hours
        
        this.initializeChart();
        this.setupEventListeners();
        this.startAutoUpdate();
        this.updateConnectionStatus('connecting');
    }

    // Initialize Chart.js
    initializeChart() {
        const ctx = document.getElementById('sensorChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        data: [],
                        yAxisID: 'y'
                    },
                    {
                        label: 'Humidity (%)',
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        data: [],
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Light (lumens)',
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        data: [],
                        yAxisID: 'y2'
                    },
                    {
                        label: 'CO₂ (ppm)',
                        borderColor: '#95a5a6',
                        backgroundColor: 'rgba(149, 165, 166, 0.1)',
                        data: [],
                        yAxisID: 'y3'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                minute: 'HH:mm',
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y1: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Light (lumens)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y3: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'CO₂ (ppm)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Time range buttons
        document.querySelectorAll('[data-hours]').forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('[data-hours]').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update time range and refresh data
                this.currentTimeRange = parseInt(e.target.dataset.hours);
                this.loadChartData();
            });
        });

        // Sensor card clicks
        document.querySelectorAll('.sensor-card').forEach(card => {
            card.addEventListener('click', () => {
                const sensor = card.dataset.sensor;
                this.focusOnSensor(sensor);
            });
        });
    }

    // Start automatic updates
    startAutoUpdate() {
        this.updateData();
        this.updateInterval = setInterval(() => {
            this.updateData();
        }, 5000); // Update every 5 seconds
    }

    // Update all dashboard data
    async updateData() {
        try {
            await Promise.all([
                this.updateSensorCards(),
                this.loadChartData(),
                this.updateHeartbeat(),
                this.updateEvents(),
                this.updateCommands()
            ]);
            this.updateConnectionStatus('connected');
        } catch (error) {
            console.error('Error updating dashboard:', error);
            this.updateConnectionStatus('disconnected');
        }
    }

    // Update sensor value cards
    async updateSensorCards() {
        try {
            const response = await fetch('/api/sensor-latest/');
            const data = await response.json();

            Object.keys(data).forEach(sensor => {
                const sensorData = data[sensor];
                
                // Update values
                document.getElementById(`${sensor}-value`).textContent = 
                    sensorData.value.toFixed(1);
                document.getElementById(`${sensor}-avg`).textContent = 
                    sensorData.avg ? sensorData.avg.toFixed(1) : '--';
                
                // Update status badge
                const statusBadge = document.getElementById(`${sensor}-status`);
                statusBadge.textContent = sensorData.status.toUpperCase();
                statusBadge.className = `badge status-${this.getStatusClass(sensorData.status)}`;
            });
        } catch (error) {
            console.error('Error updating sensor cards:', error);
        }
    }

    // Get CSS class for status
    getStatusClass(status) {
        switch (status) {
            case 'normal': return 'normal';
            case 'low':
            case 'high': return 'warning';
            case 'critical': return 'danger';
            default: return 'unknown';
        }
    }

    // Load chart data
    async loadChartData() {
        try {
            const sensors = ['temperature', 'humidity', 'light', 'co2'];
            const promises = sensors.map(sensor => 
                fetch(`/api/sensor-data/?sensor=${sensor}&hours=${this.currentTimeRange}`)
                    .then(response => response.json())
            );

            const results = await Promise.all(promises);
            
            // Update chart datasets
            results.forEach((result, index) => {
                const chartData = result.data.map(point => ({
                    x: new Date(point.x),
                    y: point.y
                }));
                
                this.chart.data.datasets[index].data = chartData;
            });
            
            this.chart.update('none');
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }

    // Update heartbeat status
    async updateHeartbeat() {
        try {
            const response = await fetch('/api/heartbeat/');
            const data = await response.json();
            
            const statusBadge = document.getElementById('device-status-badge');
            const lastHeartbeat = document.getElementById('last-heartbeat');
            
            if (data.status && data.status !== 'unknown') {
                statusBadge.textContent = data.status.toUpperCase();
                statusBadge.className = `badge ${this.getHeartbeatStatusClass(data.status, data.is_recent)}`;
                
                if (data.timestamp) {
                    const date = new Date(data.timestamp);
                    lastHeartbeat.textContent = this.formatDateTime(date);
                }
            } else {
                statusBadge.textContent = 'UNKNOWN';
                statusBadge.className = 'badge bg-secondary';
                lastHeartbeat.textContent = 'Never';
            }
        } catch (error) {
            console.error('Error updating heartbeat:', error);
        }
    }

    // Get heartbeat status class
    getHeartbeatStatusClass(status, isRecent) {
        if (!isRecent) return 'bg-warning';
        
        switch (status) {
            case 'alive': return 'bg-success';
            case 'warning': return 'bg-warning';
            case 'offline': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Update events list
    async updateEvents() {
        try {
            const response = await fetch('/api/events/?limit=10');
            const data = await response.json();
            
            const eventsList = document.getElementById('events-list');
            
            if (data.events && data.events.length > 0) {
                eventsList.innerHTML = data.events.map(event => `
                    <div class="list-group-item event-item level-${event.level} ${event.acknowledged ? 'opacity-50' : ''}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">
                                <i class="fas fa-${this.getSensorIcon(event.sensor)} me-2"></i>
                                ${event.sensor.toUpperCase()} ${event.event.replace('_', ' ')}
                            </h6>
                            <small class="event-time">${this.formatDateTime(new Date(event.timestamp))}</small>
                        </div>
                        <p class="mb-1">Value: ${event.value} - Level: ${event.level.toUpperCase()}</p>
                        ${event.message ? `<small>${event.message}</small>` : ''}
                        ${!event.acknowledged ? `
                            <button class="btn btn-sm btn-outline-primary mt-2" onclick="acknowledgeEvent(${event.id})">
                                Acknowledge
                            </button>
                        ` : '<small class="text-success">✓ Acknowledged</small>'}
                    </div>
                `).join('');
            } else {
                eventsList.innerHTML = '<div class="list-group-item text-center text-muted">No recent events</div>';
            }
        } catch (error) {
            console.error('Error updating events:', error);
        }
    }

    // Update commands list
    async updateCommands() {
        try {
            const response = await fetch('/api/commands/?limit=5');
            const data = await response.json();
            
            const commandsList = document.getElementById('commands-list');
            
            if (data.commands && data.commands.length > 0) {
                commandsList.innerHTML = data.commands.map(command => `
                    <div class="list-group-item command-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">
                                ${command.command_type.replace('_', ' ').toUpperCase()}
                            </h6>
                            <small class="event-time">${this.formatDateTime(new Date(command.created_at))}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <small>Device: ${command.device}</small>
                            <span class="badge command-status status-${command.status}">${command.status.toUpperCase()}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                commandsList.innerHTML = '<div class="list-group-item text-center text-muted">No recent commands</div>';
            }
        } catch (error) {
            console.error('Error updating commands:', error);
        }
    }

    // Get sensor icon
    getSensorIcon(sensor) {
        const icons = {
            temperature: 'thermometer-half',
            humidity: 'tint',
            light: 'sun',
            co2: 'smog'
        };
        return icons[sensor] || 'microchip';
    }

    // Format date and time
    formatDateTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            return `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) { // Less than 1 day
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    // Update connection status
    updateConnectionStatus(status) {
        const statusIcon = document.getElementById('connection-status');
        const statusText = document.getElementById('connection-text');
        
        statusIcon.className = `fas fa-circle ${status}`;
        
        switch (status) {
            case 'connected':
                statusText.textContent = 'Connected';
                break;
            case 'disconnected':
                statusText.textContent = 'Disconnected';
                break;
            case 'connecting':
                statusText.textContent = 'Connecting...';
                break;
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toastElement = document.getElementById('toast');
        const toastBody = toastElement.querySelector('.toast-body');
        
        toastBody.textContent = message;
        toastElement.className = `toast align-items-center text-white bg-${type}`;
        
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    // Focus chart on specific sensor
    focusOnSensor(sensor) {
        const datasets = this.chart.data.datasets;
        
        datasets.forEach((dataset, index) => {
            if (dataset.label.toLowerCase().includes(sensor)) {
                dataset.hidden = false;
                // Show corresponding y-axis
                this.chart.options.scales[`y${index === 0 ? '' : index}`].display = true;
            } else {
                dataset.hidden = true;
                // Hide corresponding y-axis
                this.chart.options.scales[`y${index === 0 ? '' : index}`].display = false;
            }
        });
        
        this.chart.update();
    }
}

// Global functions for button clicks
async function sendCommand(commandType) {
    try {
        const response = await fetch('/api/send-command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command_type: commandType,
                parameters: {},
                device: 'edge01',
                building: 'gedungA'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            dashboard.showToast(`Command "${commandType}" sent successfully`, 'success');
            dashboard.updateCommands(); // Refresh command list
        } else {
            dashboard.showToast(`Failed to send command: ${data.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error sending command:', error);
        dashboard.showToast('Error sending command', 'danger');
    }
}

async function acknowledgeEvent(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}/acknowledge/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            dashboard.showToast('Event acknowledged', 'success');
            dashboard.updateEvents(); // Refresh events list
        } else {
            dashboard.showToast('Failed to acknowledge event', 'danger');
        }
    } catch (error) {
        console.error('Error acknowledging event:', error);
        dashboard.showToast('Error acknowledging event', 'danger');
    }
}

function refreshEvents() {
    dashboard.updateEvents();
}

function refreshCommands() {
    dashboard.updateCommands();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new EnvironmentalDashboard();
});