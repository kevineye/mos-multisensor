load('api_arduino_htu21df.js');
load('api_config.js');
load('api_log.js');
load('api_mqtt.js');
load('api_rpc.js');
load('api_timer.js');

let Temp = {
  htu: null,
  lastTemperature: 0,
  lastHumidity: 0,

  read: function () {
    return {
      temperature: Math.round(Temp.htu.readTemperature() * 90 / 5 + 320) / 10,
      humidity: Math.max(Math.min(Math.round(Temp.htu.readHumidity()), 100), 0),
    };
  },

  check: function () {
    let d = Temp.read();
    if (Math.abs(Temp.lastTemperature - d.temperature) >= 0.2 || Math.abs(Temp.lastHumidity - d.humidity) >= 2) {
      Temp.lastTemperature = d.temperature;
      Temp.lastHumidity = d.humidity;
      let z = Cfg.get('temp.zone');
      if (z > 0) d.zone = z;
      let s = JSON.stringify(d);
      let topic = Cfg.get('app.mqtt_topic') + '/' + Cfg.get('temp.mqtt_topic');
      Log.info("logging sensors to " + topic + ": " + s);
      MQTT.pub(topic, s);
    }
  },

  init: function () {
    Temp.htu = Adafruit_HTU21DF.create();
    Temp.lastTemperature = -100;
    Temp.lastHumidity = -1;
    if (Temp.htu.begin() === 1) {
      Log.info("initialized HTU21DF sensor");
      RPC.addHandler('Sensors.Read', Temp.read);
      Timer.set(Cfg.get('temp.sample_frequency'), Timer.REPEAT, Temp.check, null);
    } else {
      Log.error("no HTU21DF sensor found");
    }
  },

};
