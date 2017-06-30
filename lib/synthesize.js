'use strict'

const stream = require('stream')
const { Polly } = require('aws-sdk')


module.exports = async (text) => {
  var polly = new Polly({'region': 'us-east-1'});

  const data = await polly.synthesizeSpeech({
    OutputFormat: 'pcm',
    SampleRate: '16000',
    Text: String(text).slice(0, 500),
    TextType: 'text',
    VoiceId: 'Raveena',
  }).promise()

  const bufferStream = new stream.PassThrough()
  bufferStream.end(data.AudioStream)

  return {
    audioStream: bufferStream,
    requestCharacters: data.RequestCharacters,
  }
}
