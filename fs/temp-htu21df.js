load('api_rpc.js');
load('api_arduino_htu21df.js');
load('api_timer.js');
load('api_log.js');
load('api_mqtt.js');

let htu = Adafruit_HTU21DF.create();
let lastTemperature = -100;
let lastHumidity = -1;


function readSensorData() {
  return {
    temperature: Math.round(htu.readTemperature() * 90 / 5 + 320) / 10,
    humidity: Math.max(Math.min(Math.round(htu.readHumidity()),100),0),
  };
}

function watchSensorData() {
  let d = readSensorData();
  if (Math.abs(lastTemperature - d.temperature) >= 0.2 || Math.abs(lastHumidity - d.humidity) >= 2) {
    lastTemperature = d.temperature;
    lastHumidity = d.humidity;
    let z = Cfg.get('app.zone');
    if (z > 0) d.zone = z;
    let s = JSON.stringify(d);
    let topic = Cfg.get('app.mqtt_topic');
    Log.info("logging to " + topic + ": " + s);
    MQTT.pub(topic, s);
  }
}

if (htu.begin() === 1) {
  Log.error("initialized HTU21DF sensor");
  RPC.addHandler('Sensors.Read', readSensorData);
  Timer.set(Cfg.get('app.sample_frequency'), Timer.REPEAT, watchSensorData, null);
} else {
  Log.error("no HTU21DF sensor found");
}
