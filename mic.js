const snowboy = require('snowboy');
const Models = snowboy.Models;
const Detector = snowboy.Detector;
const models = new Models();
var fs = require('fs')
var recorder = require('./record');
var file = fs.createWriteStream('tempcommand.wav', { encoding: 'binary' });
var detector = null;
var apiai = require('apiai');

const uuidv4 = require('uuid/v4');
const SESSION_ID = uuidv4(); 

var apiAiApp = apiai("f0a0783e5c774224a05656014c4b2e2b");
var tempFileName = 'tempcommand.wav'

var speech = require('@google-cloud/speech');
var speechClient = speech({
  projectId: 'clab-poc',
  keyFilename: './gkey.json'
});


//load hotword models
models.add({
  file: 'resources/okmerck.pmdl',
  sensitivity: '0.5',
  hotwords : 'ok merck'
});

//DFA states
var listenForHotword = function() {

	detector = new Detector({
  		resource: "resources/common.res",
  		models: models,
  		audioGain: 2.0
	});

	//add detection event
	detector.on('hotword', function (index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream 
  		console.log('hotword', index, hotword);
		voiceTriggered = true;
		recorder.stop();
		setTimeout(function(){
			startRecordingCommand();
		},50);
	});

	const mic = recorder.start({
  		threshold: 0,
  		verbose:  false
	});
	mic.pipe(detector);
};

var startRecordingCommand = function() {
	file = fs.createWriteStream(tempFileName, { encoding: 'binary' });
	recorder.start({
  		sampleRate : 44100,
  		verbose : false
	}, function(){
		console.log("command recorded");
		setTimeout(function(){
			listenForHotword();
		},100);
		sendAudioForProcessing()
	}).pipe(file)
};

var sendAudioForProcessing = function() {
	// Detect the speech in an audio file. 
	speechClient.recognize('./'+tempFileName, {
  		encoding: 'LINEAR16',
  		sampleRateHertz: 44100,
  		languageCode: "en_US"
	}, function(err, transcript) {
  		// transcript = 'how old is the Brooklyn Bridge' 
  		if (err) {
  			console.log(err);
  		} else {
  			console.log("\"",transcript,"\"");
	  		sendTextForProcessing(transcript);
  		}
	});
};

var sendTextForProcessing = function(text) {
	var request = apiAiApp.textRequest(text, {
    	sessionId: SESSION_ID
	});
	request.on('response', function(response) {
	    console.log(response);
	});
	request.on('error', function(error) {
    	console.log(error);
	});
	request.end();
};

listenForHotword();
