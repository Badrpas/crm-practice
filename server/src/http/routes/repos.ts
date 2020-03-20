'use strict';
export {};
const { Router } = require('express');
const router = Router();

router.get('/:username/:repoName', async (req, res) => {
  const { services } = req;
  const { username, repoName } = req.params;
  try {
    const repoInfo = await services.github.getRepo(username, repoName);
    const repo = await services.store.saveRepo(repoInfo);

    res.json(repo.getSanitized());
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;