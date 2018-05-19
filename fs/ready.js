load('api_bitbang.js');
load('api_config.js');
load('api_gpio.js');
load('api_log.js');
load('api_mqtt.js');
load('api_timer.js');

let Ready = {
  led_pin: Cfg.get('app.led_pin'),
  startup_flasher: null,

  _pulse3: function () {
    // three fast pulses
    BitBang.write(Ready.led_pin, BitBang.DELAY_MSEC, 0, 0, 50, 50, '\xE0', 1);
    GPIO.write(Ready.led_pin, 1);
  },

  _mqtt_connect: function (conn, ev) {
    if (ev === MQTT.EV_CONNACK) {
      Log.info("MQTT connected");
      Log.info("app initialization complete");
      Timer.del(Ready.startup_flasher);
    }
  },

  init: function () {
    GPIO.set_mode(Ready.led_pin, GPIO.MODE_OUTPUT);
    Log.info("app initialization starting");
    Ready.startup_flasher = Timer.set(2000, Timer.REPEAT, Ready._pulse3, null);
    MQTT.setEventHandler(Ready._mqtt_connect, null);
  },

};
