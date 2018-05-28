load('api_config.js');
load('api_gpio.js');
load('api_log.js');
load('api_mqtt.js');
load('api_timer.js');

let Button = {
  debounce: Cfg.get('button.debounce'),
  threshold: Cfg.get('button.threshold'),

  count: 0,
  buttons: {},

  press: function (data) {
    let topic = Cfg.get('app.mqtt_topic') + '/' + Cfg.get('button.mqtt_topic');
    let s = JSON.stringify(data);
    Log.info("logging button to " + topic + ": " + s);
    MQTT.pub(topic, s);
  },

  _timer_cb: function (p) {
    let d = Button.buttons[p];
    d.n++;
    d.twoago = d.oneago;
    d.oneago = d.lastread;
    d.lastread = GPIO.read(d.pin);
    if (d.lastread === d.twoago) d.oneago = d.lastread; // debounce
    if (d.n >= 3) {
      if (d.oneago !== d.state) {
        d.state = d.oneago;
        d.lastchange = d.n - 1;
        if (d.state === d.up) d.presses++;
      }
      if (d.presses >= 3 || (d.n - d.lastchange) * Button.debounce >= Button.threshold) {
        Timer.del(d.timer);
        GPIO.enable_int(d.pin);
        if (d.state === d.up) {
          Button.press({
            button: d.id,
            event: 'press-' + (d.presses === 1 ? 'single' : d.presses === 2 ? 'double' : 'triple')
          });
        } else {
          Button.press({button: d.id, event: 'press-long'});
        }
      }
    }
  },

  _int_cb: function (p) {
    GPIO.disable_int(p);
    let d = Button.buttons[p];
    Button.press({button: d.id, event: 'press'});
    d.n = 0;
    d.state = d.down;
    d.lastchange = 0;
    d.presses = 0;
    d.twoago = 0;
    d.oneago = 0;
    d.lastread = 0;
    d.timer = Timer.set(Button.debounce, Timer.REPEAT, Button._timer_cb, p);
  },

  init: function (gpio_pin) {
    Button.count++;
    Button.buttons[gpio_pin] = {
      id: Button.count,
      pin: gpio_pin,
      up: 1,
      down: 0,
    };
    GPIO.set_mode(gpio_pin, GPIO.MODE_INPUT);
    GPIO.set_pull(gpio_pin, GPIO.PULL_UP);
    GPIO.set_int_handler(gpio_pin, GPIO.INT_EDGE_NEG, Button._int_cb, null);
    GPIO.enable_int(gpio_pin);
  },

};

