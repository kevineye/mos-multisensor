load('api_arduino_tsl2561.js');
load('api_config.js');
load('api_log.js');
load('api_mqtt.js');
load('api_rpc.js');
load('api_timer.js');

let Light = {
  tsl: null,
  lastLux: 0,

  read: function () {
    let lum = Light.tsl.getFullLuminosity();
    let ir = lum >> 16;
    let full = lum & 0xFFFF;
    return {
      lux: Light.tsl.calculateLux(full, ir),
    };
  },

  check: function () {
    let d = Light.read();
    if (Math.abs(Light.lastLux - d.lux) >= 10) {
      Light.lastLux = d.lux;
      let s = JSON.stringify(d);
      let topic = Cfg.get('app.mqtt_topic') + '/' + Cfg.get('light.mqtt_topic');
      Log.info("logging light to " + topic + ": " + s);
      MQTT.pub(topic, s);
    }
  },

  init: function (addr) {
    if (addr < 0) return;
    Light.tsl = Adafruit_TSL2561.create(addr);
    Light.lastLux = -1;
    if (Light.tsl.begin() === 1) {
      Light.tsl.setIntegrationTime(Adafruit_TSL2561.TSL2561_INTEGRATIONTIME_13MS);
      Light.tsl.setGain(Adafruit_TSL2561.TSL2561_GAIN_0X);
      Log.info("initialized TSL2561 sensor");
      RPC.addHandler('Light.Read', Light.read);
      Timer.set(Cfg.get('light.sample_frequency'), Timer.REPEAT, Light.check, null);
    } else {
      Log.error("no TSL2561 sensor found");
    }
  },

};
