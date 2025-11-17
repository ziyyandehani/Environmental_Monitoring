FROM eclipse-mosquitto:latest

COPY mosquitto.conf /mosquitto/config/mosquitto.conf

EXPOSE 1883
EXPOSE 9001

CMD ["mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]