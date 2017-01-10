// Author: Ed Dam

// pebblejs
require('pebblejs');

// clayjs
var Clay       = require('pebble-clay');
var clayConfig = require('./config');
var clay       = new Clay(clayConfig);

// libraries
var UI      = require('pebblejs/ui');
var Vector2 = require('pebblejs/lib/vector2');

// definitions
var emptyWind = new UI.Window();
var windSize  = emptyWind.size();

// main screen
var mainWind = new UI.Window();
var mainText = new UI.Text({
  size: new Vector2(windSize.x, windSize.y),
  position: new Vector2(0, windSize.y / 2 - 75),
  backgroundColor: 'black',
  textAlign: 'center',
  color: 'white',
  font: 'gothic-28-bold',
  text: 'AVFC'
});
var mainImag = new UI.Image({
  size: new Vector2(windSize.x, windSize.y),
  position: new Vector2(0, windSize.y / 2 - 70),
  image: 'images/splash.png'
});
mainWind.add(mainText);
mainWind.add(mainImag);
mainWind.show();