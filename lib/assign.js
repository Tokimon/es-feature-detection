// CREDIT: Thanks MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
// I know exactly how it is used so no need for lodash.assign
module.exports = function assign() {
  var to = Object(arguments[0]);

  for(var index = 1; index < arguments.length; index++) {
    var curr = arguments[index];
    for(var key in curr) {
      to[key] = curr[key];
    }
  }

  return to;
};
