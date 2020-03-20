import { HttpError } from '../../http/auxiliary';

export {};
const axios = require('axios');

const BASE_URL = 'https://api.github.com/';

export interface IRepositoryInfo {
  owner: {
    login: string;
  };
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
}

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

const REMAINING_REQUESTS_HEADER = 'x-ratelimit-remaining';
const LIMIT_RESET_HEADER = 'x-ratelimit-reset';

export const getRepo = async function (username, repoName): Promise<IRepositoryInfo> {
  try {
    const repoAddr = username + '/' + repoName;
    const url = BASE_URL + 'repos/' + repoAddr;
    const response = await axios.get(url);

    const { data } = response;
    return data as IRepositoryInfo;
  } catch (err) {
    if (err.isAxiosError) {
      const { response } = err;
      const { status, statusText, headers } = response;

      if (status === 403 && statusText.includes('rate limit exceeded')) {
        const requestsRemaining: number = +headers[REMAINING_REQUESTS_HEADER];

        if (requestsRemaining === 0) {
          const resetStamp: number = +headers[LIMIT_RESET_HEADER];
          const timeDiff = resetStamp * 1000 - Date.now();
          const diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);

          throw new HttpError(`GitHub rate limit exceeded. Retry later in ${diffMins} minutes.`, 403);
        }

        await sleep(100);
        return getRepo(username, repoName);
      }
    }
    throw err;
  }
};
