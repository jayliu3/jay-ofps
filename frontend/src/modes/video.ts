import { useTranslation } from 'react-i18next';

import { Dict } from 'src/utils/format-dicts';

import { FileInfo } from './fileInfo';

export interface Video {
  id: number;
  videoName: string;
  channel: string;
  type: string;
  year: string;
  region: string;
  language: string;
  intro: string;
  createTime: string;
  fileInfo: FileInfo;
}

export const useTypes = (): Dict[] => {
  const { t } = useTranslation();
  return [
    { id: '1', label: t('Comedy') },
    { id: '2', label: t('Romance') },
    { id: '3', label: t('Horror') },
    { id: '4', label: t('Science Fiction') },
    { id: '5', label: t('Action') },
    { id: '6', label: t('War') },
    { id: '7', label: t('Adventure') },
    { id: '8', label: t('Disaster') },
    { id: '9', label: t('Drama') },
    { id: '10', label: t('Crime') },
    { id: '11', label: t('Other') },
  ];
};

export const useChannels = (): Dict[] => {
  const { t } = useTranslation();
  return [
    { id: '1', label: t('Movie') },
    { id: '2', label: t('TV Show') },
    { id: '3', label: t('Animation') },
    { id: '4', label: t('Variety Show') },
    { id: '5', label: t('Sports') },
    { id: '6', label: t('Documentary') },
    { id: '7', label: t('Music') },
    { id: '8', label: t('News') },
    { id: '9', label: t('Other') },
  ];
};

export const useRegions = (): Dict[] => {
  const { t } = useTranslation();
  return [
    { id: '1', label: t('China') },
    { id: '2', label: t('USA') },
    { id: '3', label: t('France') },
    { id: '4', label: t('Japan') },
    { id: '5', label: t('South Korea') },
    { id: '6', label: t('Thailand') },
    { id: '7', label: t('Germany') },
    { id: '8', label: t('India') },
    { id: '9', label: t('Other') },
  ];
};

export const useLanguages = (): Dict[] => {
  const { t } = useTranslation();
  return [
    { id: '1', label: t('Mandarin') },
    { id: '2', label: t('English') },
    { id: '3', label: t('Cantonese') },
    { id: '4', label: t('Japanese') },
    { id: '5', label: t('French') },
    { id: '6', label: t('German') },
    { id: '7', label: t('Other') },
  ];
};
