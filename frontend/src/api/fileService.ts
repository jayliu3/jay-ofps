import axiosInstance from './config/axiosInstance';

export const getFiles = async (pageNumber: number, pageSize: number) => {
  const response = await axiosInstance.get('/File', {
    params: { pageNumber, pageSize },
  });
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/File/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (id: number) => {
  const response = await axiosInstance.delete(`/File/${id}`);
  return response.data;
};
