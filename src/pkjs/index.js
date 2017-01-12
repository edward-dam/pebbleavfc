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

// definitions
var window = new UI.Window();
var windSize = window.size();

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

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 35),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-28-bold',
    text: 'Aston Villa'
  });
  var upText = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 5),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-24-bold',
    text: 'Supporters Club'
  });
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 30),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-24-bold',
    text: 'AVFC v1.1'
  });
  var downText = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 5),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-18-bold',
    text: 'by Edward Dam'
  });
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select screen
mainWind.on('click', 'select', function(e) {
  
  // api collection
  var matchDay;
  var api = Settings.data();
  ajax({
    url: 'http://api.football-data.org/v1/competitions/427',
    headers: { 'X-Auth-Token': 'fbaf269c163c46fe8f6fb73afa1e4a45' },
    type: 'json'
  },function(api){
    matchDay = api.currentMatchday;
    //console.log('matchDay: ' + matchDay);
  });
  ajax({
    url: 'http://api.football-data.org/v1/teams/58/fixtures',
    headers: { 'X-Auth-Token': 'fbaf269c163c46fe8f6fb73afa1e4a45' },
    type: 'json'
  },function(api){
    var result = api.fixtures.filter(function(val, index, array) {
      return val.matchday === matchDay - 1;
    });
    var live = api.fixtures.filter(function(val, index, array) {
      return val.matchday === matchDay;
    });
    var fixture = api.fixtures.filter(function(val, index, array) {
      return val.matchday === matchDay + 1;
    });
    var pair = result.concat(live);
    var join = pair.concat(fixture);
    Settings.data(join);
  });

  // live score screen
  var liveScore;
  var liveState;
  var liveStatus = api[1].status;
  var liveDate = api[1].date.substr(0, 10);
  var liveHomeTeam = api[1].homeTeamName.substr(0, 3).toUpperCase();
  var liveAwayTeam = api[1].awayTeamName.substr(0, 3).toUpperCase();
  var liveHomeGoals = api[1].result.goalsHomeTeam;
  var liveAwayGoals = api[1].result.goalsAwayTeam;
  //console.log('liveStatus: ' + liveStatus);
  //console.log('liveDate: ' + liveDate);
  //console.log('liveHomeTeam: ' + liveHomeTeam);
  //console.log('liveAwayTeam: ' + liveAwayTeam);
  //console.log('liveHomeGoals: ' + liveHomeGoals);
  //console.log('liveAwayGoals: ' + liveAwayGoals);
  if (liveStatus === "FINISHED") {
    liveScore = liveHomeGoals + "-" + liveAwayGoals;
    liveState = "Full-Time";
  } else if (liveStatus === "IN_PLAY") {
    liveScore = liveHomeGoals + "-" + liveAwayGoals;
    liveState = "In-Play";
  } else {
    liveScore = "vs";
    liveState = liveDate;
  }
  var liveWind = new UI.Window();
  var liveHead = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 45),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-28-bold',
    text: 'Live Score'
  });
  var liveText = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 - 5),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-24-bold',
    text: liveHomeTeam + " " + liveScore + " " + liveAwayTeam
  });
  var liveInfo = new UI.Text({
    size: new Vector2(windSize.x, windSize.y),
    position: new Vector2(0, windSize.y / 2 + 20),
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    font: 'gothic-14-bold',
    text: liveState
  });
  liveWind.add(liveHead);
  liveWind.add(liveText);
  liveWind.add(liveInfo);
  liveWind.show();
  
  // result screen
  var resultDate = api[0].date.substr(0, 10);
  var resultHomeTeam = api[0].homeTeamName.substr(0, 3).toUpperCase();
  var resultAwayTeam = api[0].awayTeamName.substr(0, 3).toUpperCase();
  var resultHomeGoals = api[0].result.goalsHomeTeam;
  var resultAwayGoals = api[0].result.goalsAwayTeam;
  var resultScore = resultHomeGoals + "-" + resultAwayGoals;
  //console.log('resultDate: ' + resultDate);
  //console.log('resultHomeTeam: ' + resultHomeTeam);
  //console.log('resultAwayTeam: ' + resultAwayTeam);
  //console.log('resultHomeGoals: ' + resultHomeGoals);
  //console.log('resultAwayGoals: ' + resultAwayGoals);
  liveWind.on('click', 'up', function(e) {
    var resultWind = new UI.Window();
    var resultHead = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 - 45),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-28-bold',
      text: 'Result'
    });
    var resultText = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 - 5),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-24-bold',
      text: resultHomeTeam + " " + resultScore + " " + resultAwayTeam
    });
    var resultInfo = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 + 20),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-14-bold',
      text: resultDate
    });
    resultWind.add(resultHead);
    resultWind.add(resultText);
    resultWind.add(resultInfo);
    resultWind.show();
    resultWind.on('click', 'down', function(e) {
      resultWind.hide();
    });
  });
  
  // fixture screen
  var fixtureDate = api[2].date.substr(0, 10);
  var fixtureHomeTeam = api[2].homeTeamName.substr(0, 3).toUpperCase();
  var fixtureAwayTeam = api[2].awayTeamName.substr(0, 3).toUpperCase();
  //console.log('fixtureDate: ' + fixtureDate);
  //console.log('fixtureHomeTeam: ' + fixtureHomeTeam);
  //console.log('fixtureAwayTeam: ' + fixtureAwayTeam);
  liveWind.on('click', 'down', function(e) {
    var fixtureWind = new UI.Window();
    var fixtureHead = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 - 45),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-28-bold',
      text: 'Fixture'
    });
    var fixtureText = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 - 5),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-24-bold',
      text: fixtureHomeTeam + " vs " + fixtureAwayTeam
    });
    var fixtureInfo = new UI.Text({
      size: new Vector2(windSize.x, windSize.y),
      position: new Vector2(0, windSize.y / 2 + 20),
      backgroundColor: 'black',
      textAlign: 'center',
      color: 'white',
      font: 'gothic-14-bold',
      text: fixtureDate
    });
    fixtureWind.add(fixtureHead);
    fixtureWind.add(fixtureText);
    fixtureWind.add(fixtureInfo);
    fixtureWind.show();
    fixtureWind.on('click', 'up', function(e) {
      fixtureWind.hide();
    });
  });

});

