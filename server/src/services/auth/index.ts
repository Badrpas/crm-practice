'use strict';
const User = require('../../db/models/user');
const Token = require('../../db/models/token');
const config = require('config');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const SALT_ROUNDS = config.get('saltRounds') || 10;

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

  const hashedPassword = await hash(password, SALT_ROUNDS);

  return await User.create({
    email,
    password: hashedPassword,
    Token: {},
  }, {
    include: [Token]
  });
}

export async function authenticateUser ({ email, password }) {
  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    throw new Error(ERRORS.NONEXISTENT_USER_ERROR);
  }

  if (!await compare(password, user.password)) {
    throw new Error(ERRORS.INCORRECT_PASSWORD_ERROR);
  }

  return await user.createToken();
}

export async function getToken (id) {
  return await Token.findOne({
    where: { id }
  });
}