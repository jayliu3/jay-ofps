import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Chip,
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
import { uploadFile } from 'src/api/file-service';
import { addVideo, updateVideo } from 'src/api/video-service';
import { Video, useTypes, useRegions, useChannels, useLanguages } from 'src/modes/video';

interface AddVideoFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Video | null;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ open, onClose, initialData }) => {
  const Regions = useRegions();
  const Types = useTypes();
  const Channels = useChannels();
  const Languages = useLanguages();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState('' as string);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null as null | FileInfo);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Video>();

  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const { isPending: isAdding, mutate: mutateAdd } = useMutation({
    mutationFn: addVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SelectAllVideos] });
      showNotification(t('Video added successfully'), 'success');
      reset({});
      onClose();
    },
    onError: () => {
      showNotification(t('Failed to add video'), 'error');
    },
  });
  const { isPending: isUpdating, mutate: mutateUpdate } = useMutation({
    mutationFn: updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SelectAllVideos] });
      showNotification(t('Video updated successfully'), 'success');
      reset({});
      onClose();
    },
    onError: () => {
      showNotification(t('Failed to update video'), 'error');
    },
  });

  const onSubmit = (data: Video) => {
    if (uploadedFile) {
      data.fileInfo = uploadedFile;
    }
    if (initialData) {
      mutateUpdate({ ...initialData, ...data });
    } else {
      mutateAdd(data);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setUploading(file.name);
      try {
        const response = await uploadFile(file, ({ total, loaded }) => {
          if (total) {
            setUploadProgress(Math.round((100 * loaded) / total));
          }
        });
        setUploadedFile(response);
        showNotification(t('File uploaded successfully'), 'success');
      } catch (error) {
        showNotification(t('Failed to upload file'), 'error');
      } finally {
        setUploading('');
      }
    }
  };

  const handleDeleteFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setUploadedFile(initialData.fileInfo);
    } else {
      reset({
        id: undefined,
        videoName: '',
        channel: '',
        type: '',
        year: '',
        region: '',
        language: '',
        intro: '',
        createTime: undefined,
      });
      setUploadedFile(null);
    }
  }, [initialData, reset, setValue]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? t('Edit Video') : t('Add New Video')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="videoName"
            control={control}
            defaultValue=""
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Video Name')}
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
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label={t('Channel')}
                fullWidth
                margin="normal"
                error={!!errors.channel}
                helperText={errors.channel?.message as React.ReactNode}
              >
                {Channels.map((item) => (
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
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label={t('Type')}
                fullWidth
                margin="normal"
                error={!!errors.type}
                helperText={errors.type?.message as React.ReactNode}
              >
                {Types.map((item) => (
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
              required: t('This field is required!'),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label={t('Year')}
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
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label={t('Region')}
                fullWidth
                margin="normal"
                error={!!errors.region}
                helperText={errors.region?.message as React.ReactNode}
              >
                {Regions.map((item) => (
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
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label={t('Language')}
                fullWidth
                margin="normal"
                error={!!errors.language}
                helperText={errors.language?.message as React.ReactNode}
              >
                {Languages.map((item) => (
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
            rules={{ required: t('This field is required!') }}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                label={t('Introduction')}
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
              <Button
                variant="contained"
                component="span"
                disabled={!!uploading}
                sx={{ mr: 2, mb: 2 }}
              >
                {uploadedFile ? t('Change File') : t('Upload File')}
              </Button>
            </label>

            <Box>
              {uploadedFile && (
                <Chip
                  sx={{ mb: 1 }}
                  color="success"
                  label={uploadedFile.name}
                  onDelete={handleDeleteFile}
                />
              )}
              {!!uploading && (
                <>
                  <Chip sx={{ mb: 1 }} label={uploading} onDelete={handleDeleteFile} />
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </>
              )}
            </Box>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {t('Cancel')}
        </Button>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button onClick={handleSubmit(onSubmit)} disabled={isAdding || isUpdating || !!uploading}>
            {initialData ? 'Update' : 'Add'}
          </Button>
          {(isAdding || isUpdating || !!uploading) && (
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
