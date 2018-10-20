load('api_timer.js');
load('api_ws2812fx.js');

let Feedback = {
  pixels: null,

  stop: function () {
    Feedback.pixels.stop();
  },

  // white comet sweep
  waiting: function () {
    Feedback.pixels.setBrightness(50);
    Feedback.pixels.setSpeed(800);
    Feedback.pixels.setColor(0xFFFFFF);
    Feedback.pixels.setMode("COMET");
    Feedback.pixels.start();
  },

  // green pulse
  success: function () {
    Feedback.pixels.setBrightness(WS2812FX.BRIGHTNESS_MAX);
    Feedback.pixels.setSpeed(100);
    Feedback.pixels.setColor(0x00FF00);
    Feedback.pixels.setMode("FADE");
    Feedback.pixels.start();
    Timer.set(1000, 0, Feedback.stop, null);
  },

  // blue pulse
  press: function () {
    Feedback.pixels.setBrightness(WS2812FX.BRIGHTNESS_MAX);
    Feedback.pixels.setSpeed(500);
    Feedback.pixels.setColor(0x0000FF);
    Feedback.pixels.setMode("FADE");
    Feedback.pixels.start();
    Timer.set(1000, 0, Feedback.stop, null);
  },

  // red flash effect
  fail: function () {
    Feedback.pixels.setBrightness(WS2812FX.BRIGHTNESS_MAX);
    Feedback.pixels.setSpeed(500);
    Feedback.pixels.setColor(0xFF0000);
    Feedback.pixels.setMode("LARSON_SCANNER");
    Feedback.pixels.start();
    Timer.set(600, 0, Feedback.stop, null);
  },

  init: function (gpio_pin) {
    if (gpio_pin < 0) return;
    Feedback.pixels = WS2812FX.create(Cfg.get('pixels.count'), gpio_pin, WS2812FX.NEO_GRB + WS2812FX.NEO_KHZ800);
  },

};
