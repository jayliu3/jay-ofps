import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Dialog,
  Button,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { useNotification } from 'src/hooks/notification-context';

import { SelectAllVideos } from 'src/utils/string-pool';

import { FileInfo } from 'src/modes/fileInfo';
import { addVideos } from 'src/api/video-service';
import { uploadFile } from 'src/api/file-service';
import { types, regions, channels, languages, Video } from 'src/modes/video';

interface AddVideoFormProps {
  open: boolean;
  onClose: () => void;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ open, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({} as null | FileInfo);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const { isPending, mutate: mutateAdd } = useMutation({
    mutationFn: addVideos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SelectAllVideos] });
      showNotification('Video added successfully', 'success');
      reset();
      onClose();
    },
    onError: () => {
      showNotification('Failed to add video', 'error');
    },
  });

  const onSubmit = (data: object) => {
    const videoData = data as Video;
    if (uploadedFile) {
      videoData.fileInfo = uploadedFile;
    }
    mutateAdd(videoData);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const response = await uploadFile(file, (event2) => {
          let total = 1;
          if (event2.total) {
            // eslint-disable-next-line prefer-destructuring
            total = event2.total;
          }
          setUploadProgress(Math.round((100 * event2.loaded) / total));
        });
        setUploadedFile(response);
        showNotification('File uploaded successfully', 'success');
      } catch (error) {
        showNotification('Failed to upload file', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Video</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="videoName"
            control={control}
            defaultValue=""
            rules={{ required: 'Video name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Video Name"
                fullWidth
                size="small"
                margin="normal"
                error={!!errors.videoName}
                helperText={errors.videoName?.message as React.ReactNode}
              />
            )}
          />
          <Controller
            name="channel"
            control={control}
            defaultValue=""
            rules={{ required: 'Channel is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label="Channel"
                fullWidth
                margin="normal"
                error={!!errors.channel}
                helperText={errors.channel?.message as React.ReactNode}
              >
                {channels.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="type"
            control={control}
            defaultValue=""
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label="Type"
                fullWidth
                margin="normal"
                error={!!errors.type}
                helperText={errors.type?.message as React.ReactNode}
              >
                {types.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="year"
            control={control}
            defaultValue=""
            rules={{
              required: 'Year is required',
              min: { value: 1900, message: 'Year must be after 1900' },
              max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Year"
                fullWidth
                size="small"
                margin="normal"
                error={!!errors.year}
                helperText={errors.year?.message as React.ReactNode}
              />
            )}
          />
          <Controller
            name="region"
            control={control}
            defaultValue=""
            rules={{ required: 'Region is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label="Region"
                fullWidth
                margin="normal"
                error={!!errors.region}
                helperText={errors.region?.message as React.ReactNode}
              >
                {regions.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="language"
            control={control}
            defaultValue=""
            rules={{ required: 'Language is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label="Language"
                fullWidth
                margin="normal"
                error={!!errors.language}
                helperText={errors.language?.message as React.ReactNode}
              >
                {languages.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="intro"
            control={control}
            defaultValue=""
            rules={{ required: 'Introduction is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                label="Introduction"
                fullWidth
                size="small"
                margin="normal"
                error={!!errors.intro}
                helperText={errors.intro?.message as React.ReactNode}
              />
            )}
          />
          {/* File upload section */}
          <Box sx={{ my: 2 }}>
            <input
              accept="*/*"
              id="upload-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-file">
              <Button variant="contained" component="span" disabled={uploading} sx={{ mr: 2 }}>
                {uploadedFile ? 'Change File' : 'Upload File'}
              </Button>
            </label>
            {uploading && <LinearProgress variant="determinate" value={uploadProgress} />}
            {uploadedFile && (
              <Box>
                <Box>{uploadedFile.name}</Box>
                <Button onClick={handleDeleteFile} color="error">
                  Delete File
                </Button>
              </Box>
            )}
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending || uploading}>
            Add
          </Button>
          {(isPending || uploading) && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddVideoForm;
