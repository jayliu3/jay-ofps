import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface navConfigItem {
  title: string;
  path: string;
  icon: ReactNode;
}
const NavConfig = (): Array<navConfigItem> => {
  const { t } = useTranslation();
  return [
    {
      title: t('Dashboard'),
      path: '/',
      icon: <Iconify icon="material-symbols:space-dashboard" width={24} />,
    },
    {
      title: t('FileInfo'),
      path: '/fileInfo',
      icon: <Iconify icon="material-symbols:upload-file-rounded" width={24} />,
    },
    {
      title: t('Video'),
      path: '/video',
      icon: <Iconify icon="material-symbols:hangout-video-rounded" width={24} />,
    },
  ];
};

export default NavConfig;
