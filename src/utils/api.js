import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5021/api', // ⬅️ Your API root
  withCredentials: true, // Optional, for cookies/session
});

export default instance;
