var assign = require('../../lib/assign');

module.exports = assign(
  {},
  require('./misc.json'),
  require('./object.json'),
  require('./string.json')
);
