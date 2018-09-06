var assign = require('../../lib/assign');

module.exports = assign(
  {},
  require('./array.json'),
  require('./mapSet.json'),
  require('./math.json'),
  require('./misc.json'),
  require('./number.json'),
  require('./object.json'),
  require('./string.json'),
  require('./typedarrays.json')
);
