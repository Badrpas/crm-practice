import axios from 'axios';

export const registerUser = async ({ email, password }) => {
  const res = await axios.post('/api/register', { email, password });
  console.log(res);
  return res;
};

export const loginUser = async ({ email, password }) => {
  const res = await axios.post('/api/login', { email, password });
  console.log(res);
  return res;
};