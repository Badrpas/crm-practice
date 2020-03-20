import * as axios from 'axios';

export const addRepo = async (owner, repoId) => {
  const response = await axios.post('/api/user/repos', { owner, repoId });
  return response.data;
};


export const removeRepo = async (ownerName, projectName) => {
  const url = `/api/user/repos/${ownerName}/${projectName}`;
  await axios.delete(url);
};


export const fetchRepo = async (ownerName, projectName) => {
  const url = `/api/repos/${ownerName}/${projectName}`;
  const response = await axios.get(url);
  return response.data;
};

