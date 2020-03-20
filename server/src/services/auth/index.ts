'use strict';
const User = require('../../db/models/user');
const Token = require('../../db/models/token');

export const ERRORS = {
  USER_ALREADY_EXIST_ERROR: 'User already exists',
  NONEXISTENT_USER_ERROR: `User doesn't exist`,
  INCORRECT_PASSWORD_ERROR: `Password is incorrect`,
};

export async function createUser ({ email, password }) {
  const existingUser = await User.findOne({
    where: { email }
  });

  if (existingUser) {
    throw new Error(ERRORS.USER_ALREADY_EXIST_ERROR);
  }

  const user = await User.create({
    email,
    password,
    Token: {},
  }, {
    include: [Token]
  });

  return user.getToken();
}

export async function authenticateUser ({ email, password }) {
  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    throw new Error(ERRORS.NONEXISTENT_USER_ERROR);
  }

  if (user.password !== password) {
    throw new Error(ERRORS.INCORRECT_PASSWORD_ERROR);
  }

  return await user.createToken();
}

export async function getToken (id) {
  const token = await Token.findOne(id);
  debugger;
  return token;
}