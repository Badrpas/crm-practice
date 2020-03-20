'use strict';
export {};
const User = require('../db/models/user');

class HttpError extends Error {
  constructor (message: string, public code: number = 500) {
    super(message);
  }
}

const authorizationMiddleware = async (req, res, next) => {
  const passError = () => next(new HttpError('Unauthorized', 401));
  const { services } = req;
  const { authorization } = req.headers;

  if (authorization) {
    const [, tokenId] = /^Bearer (.+)$/.exec(authorization);
    const token = await services.auth.getToken(tokenId);
    req.user = await token.getUser();

    if (!req.user) {
      return passError();
    }
    next();
  } else {
    passError();
  }
};

export {
  HttpError,
  authorizationMiddleware
};