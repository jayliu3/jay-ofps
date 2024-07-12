import { AxiosProgressEvent } from 'axios';
import axiosInstance from './config/axiosInstance';

export const getFiles = async (params: object) => {
  const response = await axiosInstance.get('/File', {
    params: { ...params },
  });
  return response.data;
};

export const uploadFile = async (
  file: File,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/File/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const deleteFiles = async (ids: number[]) => {
  const response = await axiosInstance.request({
    method: 'DELETE',
    url: '/File',
    data: ids,
  });
  return response.data;
};
