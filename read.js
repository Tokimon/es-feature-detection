const ft = require('./lib/featureTestParser');

ft.read().then((features) => {
  console.log(features.objects);
  console.log(features.methods);
}).catch((err) => console.log(err));
