import axios from 'axios';

const Instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}`,
  withCredentials: true,
});

export default Instance;
