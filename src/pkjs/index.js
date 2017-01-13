// Author: Ed Dam

// pebblejs
require('pebblejs');

// clayjs
var Clay       = require('pebble-clay');
var clayConfig = require('./config');
var clay       = new Clay(clayConfig);

// libraries
var UI       = require('pebblejs/ui');
var Vector2  = require('pebblejs/lib/vector2');
var ajax     = require('pebblejs/lib/ajax');
var Settings = require('pebblejs/settings');

// api data
var matchDay;
var token = 'fbaf269c163c46fe8f6fb73afa1e4a45';
//console.log('Saved apidata: ' + Settings.data('avfcapi'));
collectmatchdayweek();
collectapidata();

// definitions
var window = new UI.Window();
var windowSize = window.size();
var size = new Vector2(windowSize.x, windowSize.y);
var backgroundColor = 'black';
var textAlign = 'center';
var fontLarge = 'gothic-28-bold';
var fontMedium = 'gothic-24-bold';
var fontSmall = 'gothic-18-bold';
var fontXSmall = 'gothic-14-bold';
function position(height){
  return new Vector2(0, windowSize.y / 2 + height);
}

// main screen
var mainWind = new UI.Window();
var mainText = new UI.Text({
  size: size, backgroundColor: backgroundColor, textAlign: textAlign,
  font: fontLarge
});
var mainImage = new UI.Image({size: size});
mainText.position(position(-75));
mainImage.position(position(-70));
mainText.text('AVFC');
mainImage.image('images/splash.png');
mainWind.add(mainText);
mainWind.add(mainImage);
mainWind.show();

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontLarge
  });
  var upText = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontMedium
  });
  upHead.position(position(-35));
  upText.position(position(-5));
  upHead.text('Aston Villa');
  upText.text('Supporters Club');
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontMedium
  });
  var downText = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontSmall
  });
  downHead.position(position(-30));
  downText.position(position(-5));
  downHead.text('AVFC v1.1');
  downText.text('by Edward Dam');
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select screen
mainWind.on('click', 'select', function(e) {

  // load collected api data
  var apidata = Settings.data('avfcapi');
  //console.log('Loaded apidata: ' + apidata);
  
  // live score screen
  var liveStatus = apidata[1].status;
  var liveDate = apidata[1].date.substr(0, 10);
  var liveHomeTeam = apidata[1].homeTeamName.substr(0, 3).toUpperCase();
  var liveAwayTeam = apidata[1].awayTeamName.substr(0, 3).toUpperCase();
  var liveHomeGoals = apidata[1].result.goalsHomeTeam;
  var liveAwayGoals = apidata[1].result.goalsAwayTeam;
  //console.log(liveStatus);
  var liveState;
  var liveScore = liveHomeGoals + '-' + liveAwayGoals;
  if (liveStatus === "FINISHED") {
    liveState = "Full-Time";
  } else if (liveStatus === "IN_PLAY") {
    liveState = "In-Play";
  } else {
    liveState = liveDate;
    liveScore = "vs";
  }
  var liveWind = new UI.Window();
  var liveHead = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontLarge
  });
  var liveText = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontMedium
  });
  var liveInfo = new UI.Text({
    size: size, backgroundColor: backgroundColor, textAlign: textAlign,
    font: fontXSmall
  });
  liveHead.position(position(-45));
  liveText.position(position(-5));
  liveInfo.position(position(20));
  liveHead.text('Live Score');
  liveText.text(liveHomeTeam + ' ' + liveScore + ' ' + liveAwayTeam);
  liveInfo.text(liveState);
  liveWind.add(liveHead);
  liveWind.add(liveText);
  liveWind.add(liveInfo);
  liveWind.show();
  
  // result screen
  var resultDate = apidata[0].date.substr(0, 10);
  var resultHomeTeam = apidata[0].homeTeamName.substr(0, 3).toUpperCase();
  var resultAwayTeam = apidata[0].awayTeamName.substr(0, 3).toUpperCase();
  var resultHomeGoals = apidata[0].result.goalsHomeTeam;
  var resultAwayGoals = apidata[0].result.goalsAwayTeam;
  var resultScore = resultHomeGoals + "-" + resultAwayGoals;
  //console.log(resultDate);
  liveWind.on('click', 'up', function(e) {
    var resultWind = new UI.Window();
    var resultHead = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontLarge
    });
    var resultText = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontMedium
    });
    var resultInfo = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontXSmall
    });
    resultHead.position(position(-45));
    resultText.position(position(-5));
    resultInfo.position(position(20));
    resultHead.text('Result');
    resultText.text(resultHomeTeam + ' ' + resultScore + ' ' + resultAwayTeam);
    resultInfo.text(resultDate);
    resultWind.add(resultHead);
    resultWind.add(resultText);
    resultWind.add(resultInfo);
    resultWind.show();
    liveWind.hide();
    resultWind.on('click', 'down', function(e) {
      liveWind.show();
      resultWind.hide();
    });
  });
  
  // fixture screen
  var fixtureDate = apidata[2].date.substr(0, 10);
  var fixtureHomeTeam = apidata[2].homeTeamName.substr(0, 3).toUpperCase();
  var fixtureAwayTeam = apidata[2].awayTeamName.substr(0, 3).toUpperCase();
  //console.log(fixtureDate);
  liveWind.on('click', 'down', function(e) {
    var fixtureWind = new UI.Window();
    var fixtureHead = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontLarge
    });
    var fixtureText = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontMedium
    });
    var fixtureInfo = new UI.Text({
      size: size, backgroundColor: backgroundColor, textAlign: textAlign,
      font: fontXSmall
    });
    fixtureHead.position(position(-45));
    fixtureText.position(position(-5));
    fixtureInfo.position(position(20));
    fixtureHead.text('Fixture');
    fixtureText.text(fixtureHomeTeam + ' vs ' + fixtureAwayTeam);
    fixtureInfo.text(fixtureDate);
    fixtureWind.add(fixtureHead);
    fixtureWind.add(fixtureText);
    fixtureWind.add(fixtureInfo);
    fixtureWind.show();
    liveWind.hide();
    fixtureWind.on('click', 'up', function(e) {
      liveWind.show();
      fixtureWind.hide();
    });
  });

});

// functions

function collectmatchdayweek() {
  var url = 'http://api.football-data.org/v1/competitions/427';
  ajax({ url: url, headers: { 'X-Auth-Token': token }, type: 'json' },
    function(api){
      matchDay = api.currentMatchday;
      //console.log('Collected matchDay: ' + matchDay);
    }
  );
}

function collectapidata() {
  var url = 'http://api.football-data.org/v1/teams/58/fixtures';
  ajax({ url: url, headers: { 'X-Auth-Token': token }, type: 'json' },
    function(api){
      var result = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay - 1;
      });
      var live = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay;
      });
      var fixture = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay + 1;
      });
      var data = result.concat(live).concat(fixture);
      Settings.data('avfcapi', data);
      //console.log('Collected apidata: ' + data);
    }
  );
}
