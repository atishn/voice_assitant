var httpRequest = require('request')
const util = require('./util');
const default_video_id = "TJDU1IGlFx0";

var Client = require('castv2-client').Client;
var Youtube = require('youtube-castv2-client').Youtube;
var mdns = require('mdns');

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

module.exports = async (query, youtubekey) => {
  if (!util.isEmptyOrSpaces(query)) {
    var uri = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&type=video&q=' + encodeURIComponent(query) + '&key=' + youtubekey;
    console.log(uri);
    httpRequest(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var videoId = JSON.parse(body).items[0].id.videoId;
        console.log("Video id" + videoId);
        launchChromeCast(videoId);

        return {
          result: response.body
        }
      }
    })
  } else {
    console.log("Launching Default video");
    launchChromeCast(default_video_id);
  }
}


function launchChromeCast(videoId) {
  "use strict";
  browser.on('serviceUp', function (service) {
    console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
    var client = new Client();
    client.connect(service.addresses[0], function () {
      console.log('connected, launching app ...');
      client.launch(Youtube, function (err, player) {
        player.load(videoId);
      });
    });

    client.on('error', function (err) {
      console.log('Error: %s', err.message);
      client.close();
    });
    browser.stop();
  });
  browser.start();
}





