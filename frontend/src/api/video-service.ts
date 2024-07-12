import axiosInstance from './config/axiosInstance';

export const getVideos = async (params: object) => {
  const response = await axiosInstance.get('/Videos', {
    params: { ...params },
  });
  return response.data;
};

export const deleteVideos = async (ids: number[]) => {
  const response = await axiosInstance.request({
    method: 'DELETE',
    url: '/Videos',
    data: ids,
  });
  return response.data;
};

export const addVideos = async (params: object) => {
  const response = await axiosInstance.post('/Videos', params);
  return response.data;
};
