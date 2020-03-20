'use strict';
import { HttpError } from '../auxiliary';
export {};
const { Router } = require('express');
const router = Router();

router.get('/:username/:repoName', async (req, res, next) => {
  const { services } = req;
  const { username, repoName } = req.params;

  try {
    let repo;
    try {
      const repoInfo = await services.github.getRepo(username, repoName);
      repo = await services.store.saveRepo(repoInfo);
    } catch (err) {
      if (err instanceof HttpError) {
        repo = await services.store.getRepo(username, repoName);
      } else {
        return next(err);
      }
    }

    if (!repo) {
      const error = new HttpError('Repo is not available right now.', 404);
      return next(error);
    }

    res.json(repo.getSanitized());
  } catch (err) {
    next(err);
  }
});

module.exports = router;