const config = require('config');
const initServer = require('./http').init;
const initDb = require('./db').init;


(async () => {
  await initDb();

  try {
    await initServer({ port: config.get('port') || 4000 });
  } catch (e) {
    if (e.code === 'EADDRINUSE') {
      console.log('You might wanna use different port as this one is taken.');
    } else {
      console.error(e);
    }
  }
})();
