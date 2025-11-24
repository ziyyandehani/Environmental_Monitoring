import { MQTTClient } from '../mqtt/client';
import { mapSensorData } from './mapper';
import { TemperatureSensor } from '../sensors/temperature';
import { HumiditySensor } from '../sensors/humidity';
import { LightSensor } from '../sensors/light';
import { WindSensor } from '../sensors/wind';
import { RainSensor } from '../sensors/rain';

const mqttClient = new MQTTClient();
const temperatureSensor = new TemperatureSensor();
const humiditySensor = new HumiditySensor();
const lightSensor = new LightSensor();
const windSensor = new WindSensor();
const rainSensor = new RainSensor();

export function publishData() {
    const temperature = temperatureSensor.getTemperature();
    const humidity = humiditySensor.getHumidity();
    const lightIntensity = lightSensor.getLightIntensity();
    const windSpeed = windSensor.getWindSpeed();
    const rainfall = rainSensor.getRainfall();

    const sensorData = {
        temperature,
        humidity,
        lightIntensity,
        windSpeed,
        rainfall
    };

    const formattedData = mapSensorData(sensorData);
    mqttClient.publish(formattedData);
}