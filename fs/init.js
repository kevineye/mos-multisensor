load('api_config.js');
load('button.js');
load('light-tsl2561.js');
load('motion.js');
// load('feedback-led.js');
load('feedback-neopixels.js');
load('ready.js');
load('relay.js');
// load('temp-htu21df.js');
load('temp-bme280.js');

Feedback.init(Cfg.get('pixels.pin'));
// Feedback.init(Cfg.get('app.led_pin'));
Ready.init();
Relay.init(Cfg.get('relay.pin'), false);
Button.init(Cfg.get('button.pin_1'));
Button.init(Cfg.get('button.pin_2'));
Motion.init(Cfg.get('motion.pin'));
Temp.init(Cfg.get('temp.addr'));
Light.init(Cfg.get('light.addr'));
