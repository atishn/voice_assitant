'use strict'

const Speaker = require('speaker')

const speaker = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 16000,
})

speaker.on('close', () => process.exit(0))

process.stdin.pipe(speaker)
