import React, { useCallback, useEffect, useState } from 'react';
import * as axios from 'axios';
import { Table } from '../Table';
import { AddRepoBlock } from '../AddRepoBlock';
import * as RepoService from '../../services/repos';
import './RepoListPage.scss';
import { observer, useObservable } from 'mobx-react-lite';

export const RepoListPage = observer(() => {
  const [repos, setRepos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const reposInProgress = useObservable({});

  const updateRepo = useCallback(repo => {
    const predicate = r => r.ownerName === repo.ownerName
                        && r.projectName === repo.projectName;

    setRepos(repos.map(r => {
      if (predicate(r)) {
        return {
          ...r,
          ...repo
        };
      }
      return r;
    }));
    console.log('updateRepo', repo.projectName, repo);
  }, [repos]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await axios.get('/api/user/repos');
      setRepos(response.data);
      setLoading(false);
    })();
  }, []);

  const addRepo = async (owner, repoId) => {
    try {
      setLoading(true);
      const repo = await RepoService.addRepo(owner, repoId);

      const predicate = r => r.ownerName === repo.ownerName
                          && r.projectName === repo.projectName;
      const existingRepo = repos.find(predicate);

      if (!existingRepo) {
        setRepos([...repos, repo]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const onUpdateClick = useCallback(async (repoToUpdate) => {
    const { ownerName, projectName } = repoToUpdate;
    reposInProgress[ownerName+'/'+projectName] = true;
    // updateRepo({ ownerName, projectName, isLoading: true });
    try {
      const updatedRepo = await RepoService.fetchRepo(ownerName, projectName);
      updateRepo(updatedRepo);
    } catch (err) {
      console.error(err);
    }
    reposInProgress[ownerName+'/'+projectName] = false;
    // updateRepo({ ownerName, projectName, isLoading: false });
  }, [updateRepo, reposInProgress]);


  const onRemoveClick = useCallback(async (repo) => {
    const { ownerName, projectName } = repo;
    updateRepo({ ownerName, projectName, isLoading: true });

    await RepoService.removeRepo(ownerName, projectName);
    setRepos(repos.filter(r => r !== repo));
  }, [repos, updateRepo]);

  return (
    <div className="repos-page">
      <Table {...{repos, onUpdateClick, onRemoveClick, reposInProgress}}/>
      <AddRepoBlock onSubmit={addRepo} {...{isLoading}}/>
    </div>
  );
});