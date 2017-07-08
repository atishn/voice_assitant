const config = require('./lib/config');
var wolfram = require('./lib/wolfram');
const startchrome = require('./lib/startchrome');



//DFA states
var queryWalfram = function () {

  startchrome();

  //wolfram("VY9PYK-QW32V6KT55", "India Prime Minister").
  //    then(data => {
  //      console.log(`Synthesized` + data.result)
  //    }).
  //    then(() => {
  //      isBusy = false
  //      return res.sendStatus(200)
  //    }).
  //    catch(err => {
  //      isBusy = false
  //      console.error(err)
  //      return res.sendStatus(500)
  //    })
  //

  //response = wolfram.init(config.getAppId()).query("India Prime minister");
  //console.log("Result:" + response)


  //
  //config.getAppId()
  //    .then((appId) => {
  //      return require('./lib/wolfram')
  //          .init(appId)
  //          .query("pi");
  //    })
  //    .then((data) => {
  //      console.log(data);
  //    })
  //    .then((data) => {
  //      console.log(data);
  //    })
  //    .done();

}

queryWalfram();
//
//var index = {
//  run: (input) => {
//
//  }
//};
//
//module.exports = index;


//var wolfram = require('wolfram').createClient("VY9PYK-QW32V6KT55")
//
//request = require('request')
//
//var uri = 'https://api.wolframalpha.com/v1/result?i=' + encodeURIComponent("Who is India Prime Minister") + '&appid=' + "VY9PYK-QW32V6KT55"
//
//request(uri, function (error, response, body) {
//  if (!error && response.statusCode == 200) {
//    console.log(body);
//  }
//})

//wolfram.query("india prime minister", function (err, result) {
//  if (err) throw err
//  console.log("Result: %j", result)
//})


//var request = app.textRequest('Who are you?', {
//  sessionId: SESSION_ID
//});
//
//request.on('response', function (response) {
//  console.log(response);
//  console.log(response.result.fulfillment.speech);
//});
//
//request.on('error', function (error) {
//  console.log(error);
//});
//
//request.end();