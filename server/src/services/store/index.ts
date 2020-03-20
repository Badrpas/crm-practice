import { IRepositoryInfo } from '../github';

export {};
const Repository = require('../../db/models/repository');


export const getRepo = async (ownerName, projectName) => {
  return Repository.findOne({
    where: {
      ownerName,
      projectName,
    }
  });
};

export const saveRepo = async (repoInfo: IRepositoryInfo) => {

  const value = {
    ownerName   : repoInfo.owner.login,
    projectName : repoInfo.name,
    url         : repoInfo.html_url,
    starCount   : repoInfo.stargazers_count,
    forkCount   : repoInfo.forks_count,
    issueCount  : repoInfo.open_issues_count,
    creationDate: repoInfo.created_at,
  };

  const existingRepo = await getRepo(value.ownerName, value.projectName);

  if (existingRepo) {
    Object.assign(existingRepo, value);
    await existingRepo.save();
    return existingRepo;
  }

  return Repository.create(value);
};
export const deleteRepoFromUser = async (user, repoId, options) => {
  const repo = await this.getUserRepositories(user, {
    where: { id: repoId }
  });
  if (!repo) {
    return;
  }

  user.removeRepository(repo, options);
};

