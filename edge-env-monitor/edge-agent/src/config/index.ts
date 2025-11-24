export const config = {
    mqtt: {
        brokerUrl: 'mqtt://localhost:1883',
        options: {
            clientId: 'edge-agent',
            clean: true,
            connectTimeout: 4000,
            username: 'your_username',
            password: 'your_password',
            reconnectPeriod: 1000,
        },
    },
    sensors: {
        temperature: {
            pin: 4,
            interval: 5000,
        },
        humidity: {
            pin: 17,
            interval: 5000,
        },
        light: {
            pin: 27,
            interval: 5000,
        },
        wind: {
            pin: 22,
            interval: 5000,
        },
        rain: {
            pin: 5,
            interval: 5000,
        },
    },
};