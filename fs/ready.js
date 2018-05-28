load('api_log.js');
load('api_mqtt.js');
load('pixels.js');

let Ready = {

  _mqtt_connect: function (conn, ev) {
    if (ev === MQTT.EV_CONNACK) {
      Log.info("MQTT connected");
      Log.info("app initialization complete");
      Pixels.success();
    }
  },

  init: function () {
    Log.info("app initialization starting");
    Pixels.waiting();
    MQTT.setEventHandler(Ready._mqtt_connect, null);
  },

};
