load('button.js');
load('ready.js');
load('temp-htu21df.js');

Ready.init();
Temp.init();
Button.init(Cfg.get('button.pin_1'));
Button.init(Cfg.get('button.pin_2'));
