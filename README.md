# Environmental Monitoring System

Sistem pemantauan lingkungan berbasis Edge Computing dengan arsitektur Event-Driven menggunakan Django, MQTT, dan Docker containers.

## 🚀 Fitur Utama

- **Real-time Monitoring**: Dashboard real-time untuk suhu, kelembaban, cahaya, dan CO₂
- **Event-Driven Architecture**: Sistem berbasis event dengan MQTT messaging
- **Edge Computing Ready**: Siap menerima data dari edge devices
- **Container-based**: Deployment menggunakan Docker dan VS Code Dev Containers
- **Interactive Dashboard**: Dashboard dengan Chart.js dan kontrol perangkat
- **Command & Control**: Mengirim perintah ke edge devices melalui MQTT

## 📋 Sensor yang Dipantau

| Sensor | Unit | Threshold |
|--------|------|-----------|
| Suhu | °C | 18-30°C |
| Kelembaban | % | 30-70% |
| Cahaya | lumens | 10-1000 lumens |
| CO₂ | ppm | 0-1000 ppm |

## 🏗️ Arsitektur Sistem

```
Edge Device → MQTT Broker → Django App → PostgreSQL Database
                ↓
            Dashboard (Web UI)
```

### MQTT Topics:
- **State**: `env/gedungA/edge01/<sensor>/state`
- **Event**: `env/gedungA/edge01/<sensor>/event` 
- **Heartbeat**: `env/gedungA/edge01/heartbeat`
- **Command**: `env/gedungA/edge01/command`

## 🛠️ Teknologi Stack

- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL 15
- **Message Broker**: Eclipse Mosquitto (MQTT)
- **Frontend**: Bootstrap 5, Chart.js
- **Containerization**: Docker, Docker Compose
- **Development**: VS Code Dev Containers

## 📦 Quick Start

### Prerequisite
- Docker & Docker Compose
- VS Code dengan extension Dev Containers (optional)

### 1. Clone Repository

```bash
git clone <repository-url>
cd Environmental_Monitoring-1
```

### 2. Menggunakan VS Code Dev Containers (Recommended)

1. Buka project di VS Code
2. Install extension "Dev Containers" 
3. Tekan `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
4. VS Code akan membuild dan menjalankan container secara otomatis

### 3. Manual dengan Docker Compose

```bash
# Build dan jalankan semua services
docker-compose up --build

# Atau jalankan di background
docker-compose up --build -d

# Lihat logs
docker-compose logs -f django
```

### 4. Setup Database

```bash
# Masuk ke container Django
docker-compose exec django bash

# Jalankan migrations
python manage.py migrate

# Buat superuser (optional)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

## 🌐 Akses Aplikasi

- **Dashboard**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **MQTT Broker**: localhost:1883
- **MQTT WebSocket**: localhost:9001
- **PostgreSQL**: localhost:5432

## 📊 Format Payload MQTT

### State Message
```json
{
  "sensor": "temperature",
  "value": 28.5,
  "avg": 27.9,
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### Event Message
```json
{
  "sensor": "co2",
  "value": 1200,
  "event": "threshold_exceeded",
  "level": "high",
  "timestamp": "2025-01-01T12:00:10Z"
}
```

### Heartbeat Message
```json
{
  "device": "edge01",
  "status": "alive",
  "timestamp": "2025-01-01T12:00:30Z"
}
```

### Command Message (dari Dashboard)
```json
{
  "command": "fan_on",
  "parameters": {},
  "timestamp": "2025-01-01T12:01:00Z",
  "device": "edge01",
  "building": "gedungA"
}
```

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env` atau edit file yang sudah ada:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=env_monitor
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
MQTT_BROKER_HOST=mosquitto
MQTT_BROKER_PORT=1883
MQTT_KEEPALIVE=60
```

## 🧪 Testing MQTT

### Publish Test Data

```bash
# Install mosquitto clients
apt-get update && apt-get install -y mosquitto-clients

# Test temperature state
mosquitto_pub -h localhost -t "env/gedungA/edge01/temperature/state" \
  -m '{"sensor": "temperature", "value": 25.5, "avg": 24.8, "timestamp": "2025-01-01T12:00:00Z"}'

# Test CO2 event
mosquitto_pub -h localhost -t "env/gedungA/edge01/co2/event" \
  -m '{"sensor": "co2", "value": 1200, "event": "threshold_exceeded", "level": "high", "timestamp": "2025-01-01T12:00:10Z"}'

# Test heartbeat
mosquitto_pub -h localhost -t "env/gedungA/edge01/heartbeat" \
  -m '{"device": "edge01", "status": "alive", "timestamp": "2025-01-01T12:00:30Z"}'
```

### Subscribe to Commands

```bash
# Subscribe to command topic
mosquitto_sub -h localhost -t "env/gedungA/edge01/command"
```

## 🎛️ Dashboard Features

### 📈 Real-time Monitoring
- Live sensor value cards dengan status indicators
- Multi-sensor chart dengan time range selection (1H, 6H, 24H)
- Device heartbeat status monitoring

### 🚨 Event Management  
- Real-time event notifications
- Event acknowledgment system
- Event filtering by level (low, medium, high, critical)

### 🎮 Device Control
- Send commands to edge devices:
  - Turn Fan On/Off
  - Calibrate Sensors
  - Reboot Device
  - Custom commands dengan parameters

### 📊 Command History
- Track semua commands yang dikirim
- Status monitoring (pending, sent, executed, failed)

## 🔄 Development Workflow

### 1. Menjalankan dalam Development Mode

```bash
# Start services
docker-compose up

# Dalam terminal terpisah - masuk ke Django container
docker-compose exec django bash

# Jalankan development server dengan auto-reload
python manage.py runserver 0.0.0.0:8000

# Atau buat migrations
python manage.py makemigrations
python manage.py migrate
```

### 2. Debugging

```bash
# Lihat logs semua services
docker-compose logs -f

# Lihat logs Django saja  
docker-compose logs -f django

# Lihat logs MQTT broker
docker-compose logs -f mosquitto

# Lihat logs database
docker-compose logs -f db
```

### 3. Reset Database

```bash
# Stop services
docker-compose down

# Hapus volumes
docker-compose down -v

# Rebuild dan start ulang
docker-compose up --build
```

## 📁 Struktur Project

```
Environmental_Monitoring-1/
├── .devcontainer/
│   └── devcontainer.json          # VS Code Dev Container config
├── env_monitor/                   # Django project settings
│   ├── __init__.py
│   ├── settings.py               # Main settings
│   ├── urls.py                   # URL routing
│   ├── wsgi.py
│   └── asgi.py
├── monitoring/                    # Django app
│   ├── __init__.py
│   ├── apps.py                   # App config + MQTT startup
│   ├── models.py                 # Database models
│   ├── views.py                  # API endpoints & views
│   ├── urls.py                   # App URL routing
│   ├── admin.py                  # Django admin config
│   └── mqtt_client.py            # MQTT client implementation
├── templates/monitoring/
│   └── dashboard.html            # Main dashboard template
├── static/monitoring/
│   ├── css/dashboard.css         # Custom styles
│   └── js/dashboard.js           # Dashboard JavaScript
├── mosquitto/
│   └── mosquitto.conf            # MQTT broker config
├── docker-compose.yml            # Docker services definition
├── Dockerfile                    # Django app container
├── requirements.txt              # Python dependencies
├── manage.py                     # Django management
├── .env                          # Environment variables
└── README.md                     # This file
```

## 🔒 Security Notes

### Production Deployment

1. **Change Secret Key**: Generate new Django secret key
2. **Set DEBUG=False**: Disable debug mode
3. **Configure ALLOWED_HOSTS**: Set proper domain names
4. **MQTT Authentication**: Enable MQTT username/password
5. **Database Security**: Use strong passwords
6. **HTTPS**: Enable SSL/TLS certificates

### MQTT Security

```conf
# mosquitto.conf untuk production
password_file /mosquitto/config/passwd
allow_anonymous false
require_certificate true
```

## 📈 Scaling Considerations

### Multiple Edge Devices
- Ganti topic pattern untuk multiple buildings/devices
- Update `MQTT_TOPICS` di settings untuk wildcard subscriptions
- Modify models untuk support multiple locations

### High Availability
- Setup PostgreSQL cluster
- Multiple MQTT broker instances dengan clustering
- Load balancer untuk Django instances

## 🐛 Troubleshooting

### Common Issues

**1. MQTT Connection Failed**
```bash
# Check mosquitto container
docker-compose logs mosquitto
# Restart MQTT service
docker-compose restart mosquitto
```

**2. Database Connection Error**
```bash
# Check database container
docker-compose logs db
# Restart database
docker-compose restart db
```

**3. Static Files Not Loading**
```bash
# Collect static files
docker-compose exec django python manage.py collectstatic --noinput
```

**4. Port Already in Use**
```bash
# Check what's using the port
sudo lsof -i :8000
# Kill the process or change ports in docker-compose.yml
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Environmental Monitoring Team** - Initial work

## 🙏 Acknowledgments

- Eclipse Mosquitto for MQTT broker
- Django team for the amazing framework
- Chart.js for beautiful charts
- Bootstrap for responsive UI components