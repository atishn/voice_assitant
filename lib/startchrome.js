/**
 * Created by anarlawar on 7/8/17.
 */

const { spawn } = require('child_process')

module.exports = youtube => {
  var youtube = spawn('node', ['./lib/youtube.js'])

  return new Promise((resolve, reject) => {
    youtube.on('close', resolve)
    youtube.on('error', resolve)
  })

}

