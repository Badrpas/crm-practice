'use strict';
export {};
const User = require('../db/models/user');

const authorizationMiddleware = async (req, res, next) => {
  const { services } = req;
  const { authorization } = req.headers;
  if (authorization) {
    const [, tokenId] = /^Bearer (.+)$/.exec(authorization);
    const token = await services.auth.getToken(tokenId);
    req.user = await token.getUser();
    next();
  } else {
    // TODO
    req.user = await User.findOne();
    next();
  }
};

class HttpError extends Error {
  constructor (message: string, public code: number = 500) {
    super(message);
  }
}

export {
  HttpError,
  authorizationMiddleware
};