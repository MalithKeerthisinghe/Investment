import axios from 'axios';

const API = axios.create({
  baseURL: 'http://145.223.21.62:5021/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export default API;