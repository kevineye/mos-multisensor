load('api_log.js');
load('api_timer.js');
load('api_ws2812fx.js');

let Pixels = {
  pixels: WS2812FX.create(Cfg.get('pixels.count'), 2, WS2812FX.NEO_GRB + WS2812FX.NEO_KHZ800),

  stop: function () {
    Pixels.pixels.stop();
  },

  waiting: function () {
    Pixels.pixels.setBrightness(50);
    Pixels.pixels.setSpeed(800);
    Pixels.pixels.setColor(0xFFFFFF);
    Pixels.pixels.setMode("COMET");
    Pixels.pixels.start();
  },

  success: function () {
    Pixels.pixels.setBrightness(WS2812FX.BRIGHTNESS_MAX);
    Pixels.pixels.setSpeed(100);
    Pixels.pixels.setColor(0x00FF00);
    Pixels.pixels.setMode("FADE");
    Pixels.pixels.start();
    Timer.set(1000, 0, Pixels.stop, null);
  },

  fail: function () {
    Pixels.pixels.setBrightness(WS2812FX.BRIGHTNESS_MAX);
    Pixels.pixels.setSpeed(500);
    Pixels.pixels.setColor(0xFF0000);
    Pixels.pixels.setMode("LARSON_SCANNER");
    Pixels.pixels.start();
    Timer.set(600, 0, Pixels.stop, null);
  },

};
