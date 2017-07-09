/**
 * Created by anarlawar on 7/8/17.
 */
'use strict'

exports.isEmptyOrSpaces = function (str) {
  return str === null || str.match(/^ *$/) !== null;
}
