'use strict'

var httpRequest = require('request')

module.exports = async (appId, query, callback) => {

  var uri = 'https://api.wolframalpha.com/v1/result?i=' + encodeURIComponent(query) + '&appid=' + appId;

  console.log(uri);

  httpRequest(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response.body);
      callback(response.body);
      return {
        result: response.body
      }
    }
  })
}
