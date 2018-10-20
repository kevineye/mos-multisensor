load('api_config.js');
load('api_gpio.js');
load('api_log.js');
load('api_mqtt.js');
load('api_rpc.js');

let Motion = {
  pin: 0,
  state: false,

  send: function (data) {
    let topic = Cfg.get('app.mqtt_topic') + '/' + Cfg.get('motion.mqtt_topic');
    let s = JSON.stringify(data);
    Log.info("logging motion to " + topic + ": " + s);
    MQTT.pub(topic, s);
  },

  read: function () {
    return {motion: GPIO.read(Motion.pin) === 1};
  },

  _int_cb: function () {
    let newstate = GPIO.read(Motion.pin) === 1;
    if (Motion.state !== newstate) {
      Motion.state = newstate;
      // TODO feedback
      Motion.send({motion: Motion.state});
    }
  },

  init: function (gpio_pin) {
    if (gpio_pin < 0) return;
    Motion.pin = gpio_pin;
    GPIO.set_mode(Motion.pin, GPIO.MODE_INPUT);
    GPIO.set_pull(Motion.pin, GPIO.PULL_DOWN);
    // GPIO.set_button_handler(Motion.pin, GPIO.PULL_DOWN, GPIO.INT_EDGE_POS, 50, Motion._int_cb, null);
    GPIO.set_int_handler(Motion.pin, GPIO.INT_EDGE_ANY, Motion._int_cb, null);
    GPIO.enable_int(Motion.pin);
    RPC.addHandler('Motion.Read', Motion.read);
  },

};

