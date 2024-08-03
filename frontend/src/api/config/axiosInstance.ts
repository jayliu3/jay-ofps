import qs from 'qs';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json; charset=utf-8 ',
  },
});
axiosInstance.defaults.paramsSerializer = (params) =>
  qs.stringify(params, { arrayFormat: 'repeat' });

export default axiosInstance;
