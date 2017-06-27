var apiai = require('apiai');
var app = apiai("97a8b329b7f54fa7a7c786265d9a0027");
const uuidv4 = require('uuid/v4');
const SESSION_ID = uuidv4(); 

var request = app.textRequest(' ', {
    sessionId: SESSION_ID
});

request.on('response', function(response) {
    console.log(response);
    console.log(response.result.fulfillment.speech);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();