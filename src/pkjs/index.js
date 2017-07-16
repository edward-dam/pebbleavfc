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

// collect api data
var matchDay;
var token = 'fbaf269c163c46fe8f6fb73afa1e4a45';
//console.log('Saved apidata: ' + Settings.data('avfcapi'));
collectmatchdayweek(collectapidata);

// definitions
var window = new UI.Window();
var windowSize = window.size();
var size = new Vector2(windowSize.x, windowSize.y);
var icon = 'images/football_icon.png';
var backgroundColor = 'black';
var highlightBackgroundColor = 'white';
var textColor = 'white';
var highlightTextColor = 'black';
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
var mainText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
var mainImage = new UI.Image({size: size});
mainText.position(position(-75));
mainImage.position(position(-70));
mainText.font(fontLarge);
mainText.text('AVFC');
mainImage.image('images/splash.png');
mainWind.add(mainText);
mainWind.add(mainImage);
mainWind.show();

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var upText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  upHead.position(position(-35));
  upText.position(position(-5));
  upHead.font(fontLarge);
  upText.font(fontMedium);
  upHead.text('Aston Villa');
  upText.text('Supporters Club');
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var downText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  downHead.position(position(-30));
  downText.position(position(-5));
  downHead.font(fontMedium);
  downText.font(fontSmall);
  downHead.text('AVFC v2.1');
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
  
  // determine data
  for (var i = 0; i < apidata.length; i++) {
    var status = apidata[i].status;
    var time = apidata[i].date.substr(11, 5);
    var day = apidata[i].date.substr(8, 2);
    var month = apidata[i].date.substr(5, 2);
    var date = day + '/' + month + ' @' + time;
    var homeTeam = apidata[i].homeTeamName;
    var awayTeam = apidata[i].awayTeamName;
    if ( homeTeam === "Sheffield United FC") {
      homeTeam = "SHU";
    } else if ( homeTeam === "Sheffield Wednesday") {
      homeTeam = "SHW";
    } else {
      homeTeam = homeTeam.substr(0, 3).toUpperCase();
    }
    if ( awayTeam === "Sheffield United FC") {
      awayTeam = "SHU";
    } else if ( awayTeam === "Sheffield Wednesday") {
      awayTeam = "SHW";
    } else {
      awayTeam = awayTeam.substr(0, 3).toUpperCase();
    }
    var homeGoals = apidata[i].result.goalsHomeTeam;
    var awayGoals = apidata[i].result.goalsAwayTeam;
    var score = ' ' + homeGoals + '-' + awayGoals + ' ';
    var title = homeTeam + score + awayTeam;
    var subtitle = date;
    if (status === "FINISHED") {
      subtitle = "Full-Time";
    } else if (status === "IN_PLAY") {
      subtitle = "In-Play";
    } else {
      title = homeTeam + " vs " + awayTeam;
    }
    window["matchTitle" + i] = title;
    window["matchSubtitle" + i] = subtitle;
  }

  // display menu
  var footballMenu = new UI.Menu({ //fullscreen: true,
    textColor: textColor, highlightBackgroundColor: highlightBackgroundColor,
    backgroundColor: backgroundColor, highlightTextColor: highlightTextColor,
    status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
  });
  footballMenu.section(0, { title: "Results" });
  footballMenu.item(0, 0, { icon: icon, title: window.matchTitle0, subtitle: window.matchSubtitle0 });
  footballMenu.item(0, 1, { icon: icon, title: window.matchTitle1, subtitle: window.matchSubtitle1 });
  footballMenu.section(1, { title: "Match Day" });
  footballMenu.item(1, 0, { icon: icon, title: window.matchTitle2, subtitle: window.matchSubtitle2 });
  footballMenu.section(2, { title: "Fixtures" });
  footballMenu.item(2, 0, { icon: icon, title: window.matchTitle3, subtitle: window.matchSubtitle3 });
  footballMenu.item(2, 1, { icon: icon, title: window.matchTitle4, subtitle: window.matchSubtitle4 });
  footballMenu.show();
  mainWind.hide();

  footballMenu.on('select', function(e) {
    var matchWind = new UI.Window();
    var matchHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
    var matchText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
    var matchInfo = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
    matchHead.position(position(-45));
    matchText.position(position(-5));
    matchInfo.position(position(20));
    matchHead.font(fontLarge);
    matchText.font(fontMedium);
    matchInfo.font(fontXSmall);
    if (e.sectionIndex === 0) {
      matchHead.text('Result');
      matchText.text(window["matchTitle" + e.itemIndex]);
      matchInfo.text(window["matchSubtitle" + e.itemIndex]);

    } else if (e.sectionIndex === 1) {
      matchHead.text('Live Score');
      matchText.text(window.matchTitle2);
      matchInfo.text(window.matchSubtitle2);
    } else {
      matchHead.text('Fixture');
      if (e.itemIndex === 0) {
        matchText.text(window.matchTitle3);
        matchInfo.text(window.matchSubtitle3);
      } else {
        matchText.text(window.matchTitle4);
        matchInfo.text(window.matchSubtitle4);
      }
    }
    matchWind.add(matchHead);
    matchWind.add(matchText);
    matchWind.add(matchInfo);
    matchWind.show();
  });

});

// functions

function collectmatchdayweek(callback) {
  var url = 'http://api.football-data.org/v1/competitions/446';
  ajax({ url: url, headers: { 'X-Auth-Token': token }, type: 'json' },
    function(api){
      matchDay = api.currentMatchday;
      //console.log('Collected matchDay: ' + matchDay);
      callback();
    }
  );
}

function collectapidata() {
  var url = 'http://api.football-data.org/v1/teams/58/fixtures';
  ajax({ url: url, headers: { 'X-Auth-Token': token }, type: 'json' },
    function(api){
      var match1 = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay - 2;
      });
      var match2 = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay - 1;
      });
      var match3 = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay;
      });
      var match4 = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay + 1;
      });
      var match5 = api.fixtures.filter(function(val, index, array) {
        return val.matchday === matchDay + 2;
      });
      var data = match1.concat(match2).concat(match3).concat(match4).concat(match5);
      Settings.data('avfcapi', data);
      //console.log('Collected apidata: ' + data);
    }
  );
}
