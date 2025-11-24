import { TemperatureSensor } from '../../src/sensors/temperature';
import { HumiditySensor } from '../../src/sensors/humidity';
import { LightSensor } from '../../src/sensors/light';
import { WindSensor } from '../../src/sensors/wind';
import { RainSensor } from '../../src/sensors/rain';

describe('Sensor Modules', () => {
    let temperatureSensor: TemperatureSensor;
    let humiditySensor: HumiditySensor;
    let lightSensor: LightSensor;
    let windSensor: WindSensor;
    let rainSensor: RainSensor;

    beforeEach(() => {
        temperatureSensor = new TemperatureSensor();
        humiditySensor = new HumiditySensor();
        lightSensor = new LightSensor();
        windSensor = new WindSensor();
        rainSensor = new RainSensor();
    });

    test('TemperatureSensor should return a valid temperature', () => {
        const temperature = temperatureSensor.getTemperature();
        expect(temperature).toBeDefined();
        expect(typeof temperature).toBe('number');
    });

    test('HumiditySensor should return a valid humidity', () => {
        const humidity = humiditySensor.getHumidity();
        expect(humidity).toBeDefined();
        expect(typeof humidity).toBe('number');
    });

    test('LightSensor should return a valid light intensity', () => {
        const lightIntensity = lightSensor.getLightIntensity();
        expect(lightIntensity).toBeDefined();
        expect(typeof lightIntensity).toBe('number');
    });

    test('WindSensor should return a valid wind speed', () => {
        const windSpeed = windSensor.getWindSpeed();
        expect(windSpeed).toBeDefined();
        expect(typeof windSpeed).toBe('number');
    });

    test('RainSensor should return a valid rainfall', () => {
        const rainfall = rainSensor.getRainfall();
        expect(rainfall).toBeDefined();
        expect(typeof rainfall).toBe('number');
    });
});