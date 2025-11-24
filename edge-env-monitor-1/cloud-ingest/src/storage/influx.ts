export class InfluxDBStorage {
    constructor(private influx: any) {}

    saveData(data: any) {
        const point = this.influx.point('sensor_data')
            .tag('sensor', data.sensor)
            .floatField('value', data.value)
            .timestamp(new Date());

        return this.influx.writePoint(point);
    }
}