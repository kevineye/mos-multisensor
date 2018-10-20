load('api_bme280.js');
load('api_config.js');
load('api_log.js');
load('api_mqtt.js');
load('api_rpc.js');
load('api_timer.js');

let Temp = {
  bme: null,
  lastTemperature: 0,
  lastHumidity: 0,

  read: function () {
    return {
      temperature: Math.round(Temp.bme.readTemp() * 90 / 5 + 320) / 10,
      humidity: Math.max(Math.min(Math.round(Temp.bme.readHumid()), 100), 0),
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
      Log.info("logging temp to " + topic + ": " + s);
      MQTT.pub(topic, s);
    }
  },

  init: function (addr) {
    Temp.bme = BME280.createI2C(addr);
    Temp.lastTemperature = -100;
    Temp.lastHumidity = -1;
    if (Temp.bme !== null) {
      Log.info("initialized BME280 sensor");
      RPC.addHandler('Temp.Read', Temp.read);
      Timer.set(Cfg.get('temp.sample_frequency'), Timer.REPEAT, Temp.check, null);
    } else {
      Log.error("no BME280 sensor found");
    }
  },

};
