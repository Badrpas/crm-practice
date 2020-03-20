'use strict';
export {};
const { Router } = require('express');
const router = Router();


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { services } = req;

  try {
    const token = await services.auth.authenticateUser({ email, password });
    const { id: tokenId, validUntil } = token;

    res.json({ tokenId, validUntil });
  } catch (err) {
    const unauthorizedErrors = [
      services.auth.ERRORS.NONEXISTENT_USER_ERROR,
      services.auth.ERRORS.INCORRECT_PASSWORD_ERROR,
    ];
    if (unauthorizedErrors.includes(err.message)) {
      return res.status(401).json({
        message: 'Email or Password is incorrect.'
      });
    }

    console.error(err);
    res.status(500).send();
  }
});


router.post('/register', async (req, res) => {
  const { services } = req;
  try {
    await services.auth.createUser(req.body);
    res.status(201).send();
  } catch (err) {
    if (err.message === services.auth.ERRORS.USER_ALREADY_EXIST_ERROR) {
      return res.status(409).json({
        message: 'This email already registered. Please use a different one.'
      });
    }

    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
