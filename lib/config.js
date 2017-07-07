const fs = require('fs');
const os = require('os');
const q = require('q');

var config = {
  getAppId: function () {
    var deferred = q.defer();
    fs.readFile(os.homedir() + '/.wolframalpha_key', 'utf8', (error, data) => {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
  }
};

module.exports = config;