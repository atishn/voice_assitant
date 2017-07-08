/**
 * Created by anarlawar on 7/8/17.
 */
const { exec } = require('child_process');
exec('youtube-dl -o - https://youtu.be/TJDU1IGlFx0 | castnow --quiet -', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
