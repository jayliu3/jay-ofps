import { Video } from 'src/modes/video';

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

export const addVideo = async (params: object) => {
  const response = await axiosInstance.post('/Videos', params);
  return response.data;
};

export const updateVideo = async (params: Video) => {
  const response = await axiosInstance.put(`/Videos/${params.id}`, params);
  return response.data;
};
