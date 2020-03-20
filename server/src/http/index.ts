const express = require('express');
const bodyParser = require('body-parser');
const services = require('../services');
const { authorizationMiddleware, HttpError } = require('./auxiliary');

const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  req.services = services;
  next();
});
apiRouter.use(require('./routes/auth'));
apiRouter.use(authorizationMiddleware);
apiRouter.use('/user/repos', require('./routes/user-repos'));
apiRouter.use('/repos', require('./routes/repos'));

module.exports.init = async ({ port = 3000 } = {}) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/api', apiRouter);

  app.use((err, req, res, next) => {
    let code = 404;
    let message = 'Something went wrong.';

    if (err instanceof Error) {
      message = err.message;
      code = 500;
    }
    if (err instanceof HttpError) {
      code = err.code;
    }

    console.error(err);
    res.status(code).json({ message });
  });

  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      server.off('error', reject);
      resolve();
    });

    server.on('error', reject);
  });

  console.log('API initialized.');
};

