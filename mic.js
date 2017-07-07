const snowboy = require('snowboy');
const Stream = require('stream')
const Speaker = require('speaker')
const AWS = require('aws-sdk');
const fs = require('fs')
const synthesize = require('./lib/synthesize')
const say = require('./lib/say')
const wolfram = require('./lib/wolfram')
const config = require('./resources/config')


const Models = snowboy.Models;
const Detector = snowboy.Detector;
const models = new Models();

var polly = new AWS.Polly({'region': 'us-east-1'});

var recorder = require('./lib/record');
var file = fs.createWriteStream('tempcommand.wav', {encoding: 'binary'});
var detector = null;
var apiai = require('apiai');

const uuidv4 = require('uuid/v4');
const SESSION_ID = uuidv4();
let isBusy = false


var apiAiApp = apiai("97a8b329b7f54fa7a7c786265d9a0027");
var tempFileName = 'tempcommand.wav'

var speech = require('@google-cloud/speech');
var speechClient = speech({
  projectId: 'clab-poc',
  keyFilename: './resources/gkey.json'
});

//load hotword models
models.add({
  file: 'resources/smart_mirror.umdl',
  sensitivity: '0.5',
  hotwords: 'smart mirror'
});

models.add({
  file: 'resources/jarvis.pmdl',
  sensitivity: '0.5',
  hotwords: 'Jarvis'
});


//DFA states
var listenForHotword = function () {

  detector = new Detector({
    resource: "resources/common.res",
    models: models,
    audioGain: 2.0
  });

  detector.on('silence', function () {
    console.log("silence");
  });

  detector.on('sound', function (buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
    console.log("not hotword");
  });

  detector.on('error', function () {

    console.log('Error on detector');
  });

  //add detection event
  detector.on('hotword', function (index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
    console.log('hotword', index, hotword);
    voiceTriggered = true;
    recorder.stop();
    console.log("Recorder stop");
    setTimeout(function () {
      startRecordingCommand();
    }, 50);
  });

  const mic = recorder.start({
    threshold: 0,
    verbose: false
  });
  mic.pipe(detector);
};

var startRecordingCommand = function () {
  file = fs.createWriteStream(tempFileName, {encoding: 'binary'});
  console.log("Recorder starting for command");
  recorder.start({
    sampleRate: 44100,
    threshold: 0.5,
    verbose: false
  }, function () {
    console.log("command recorded");
    setTimeout(function () {
      listenForHotword();
    }, 100);
    sendAudioForProcessing()
  }).pipe(file)

  // Stop recording after three seconds
  setTimeout(function () {
    console.log("Stop recording after three seconds");
    //recorder.stop();
    // file.end();
  }, 3000)
};

var sendAudioForProcessing = function () {
  // Detect the speech in an audio file.
  speechClient.recognize('./' + tempFileName, {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: "en_US"
  }, function (err, transcript) {
    // transcript = 'how old is the Brooklyn Bridge'
    if (err) {
      console.log("Error during google speech " + err);
    } else {
      console.log("The spoken text is " + "\"", transcript, "\"");
      sendTextForProcessing(transcript);
    }
  });
};

var sendTextForProcessing = function (text) {
  if (!isEmptyOrSpaces(text)) {
    var request = apiAiApp.textRequest(text, {
      sessionId: SESSION_ID
    });
    request.on('response', function (response) {
      if (response && response.result) {

        if (response.result.action == "input.unknown") {

          wolfram(config.appId, text, convertTextToVoice)

        } else if (response.result.fulfillment) {
          console.log("Response from API.ai -- " + response.result.fulfillment.speech);
          convertTextToVoice(response.result.fulfillment.speech);
        }

      }
    });
    request.on('error', function (error) {
      console.log("Error during API.ai" + error);
    });
    request.end();
  }
};


var convertTextToVoice = function (text) {
  if (!isBusy) {
    isBusy = true;
    synthesize(text).
        then(data => {
          console.log(`Synthesized ${data.requestCharacters} characters`)
          return say(data.audioStream)
        }).
        then(() => {
          isBusy = false
          //return res.sendStatus(200)
        }).
        catch(err => {
          isBusy = false
          console.error(err)
          //return res.sendStatus(500)
        })
  }
}
var isEmptyOrSpaces = function (str) {
  return str === null || str.match(/^ *$/) !== null;
}

listenForHotword();
