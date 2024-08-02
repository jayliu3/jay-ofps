import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
export interface navConfigItem {
  title: string;
  path: string;
  icon: ReactNode;
}
const NavConfig = (): Array<navConfigItem> => {
  const { t } = useTranslation();
  return [
    {
      title: t('dashboard'),
      path: '/',
      icon: <Iconify icon="material-symbols:space-dashboard" width={24} />,
    },
    {
      title: t('fileInfo'),
      path: '/fileInfo',
      icon: <Iconify icon="material-symbols:upload-file-rounded" width={24} />,
    },
    {
      title: t('video'),
      path: '/video',
      icon: <Iconify icon="material-symbols:hangout-video-rounded" width={24} />,
    },
    {
      title: 'Not found',
      path: '/404',
      icon: icon('ic_disabled'),
    },
  ];
};

export default NavConfig;
