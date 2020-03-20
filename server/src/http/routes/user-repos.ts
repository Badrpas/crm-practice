'use strict';

export {};
const { HttpError } = require('../auxiliary');
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  const { user } = req;
  try {
    const repos = await user.getRepositories();
    res.json(repos.map(repo => repo.getSanitized()));
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post('/', async (req, res, next) => {
  const { services, user } = req;
  const { owner, repoId } = req.body;
  try {
    const repoInfo = await services.github.getRepo(owner, repoId);
    const repo = await services.store.saveRepo(repoInfo);
    await user.addRepository(repo);

    res.json(repo.getSanitized());
  } catch (err) {
    if (err.isAxiosError) {
      err = new HttpError(err.message, err.response.status);
    }
    next(err);
  }
});

router.delete('/:ownerName/:projectName', async (req, res) => {
  const { user } = req;
  const { ownerName, projectName } = req.params;
  try {
    const [repo] = await user.getRepositories({
      where: {
        ownerName,
        projectName
      }
    });

    if (repo) {
      await user.removeRepository(repo);
    }

    res.send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;