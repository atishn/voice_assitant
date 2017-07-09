var httpRequest = require('request')
const { exec } = require('child_process');
const util = require ('./util');
const default_video_id = "TJDU1IGlFx0";



module.exports = async (query, youtubekey) => {
  if (!util.isEmptyOrSpaces(query)) {
    var uri = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&type=video&q=' + encodeURIComponent(query) + '&key=' + youtubekey;
    console.log(uri);
    httpRequest(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var videoId = JSON.parse(body).items[0].id.videoId;

        console.log("Video id" + videoId);

        ///**
        // * Created by anarlawar on 7/8/17.
        // */

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

var launchChromeCast = function (videoId) {
  "use strict";
  exec('youtube-dl -o - https://youtu.be/' + videoId + ' | castnow --quiet -', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}



