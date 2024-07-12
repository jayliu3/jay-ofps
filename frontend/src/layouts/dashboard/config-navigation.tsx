import { ReactNode } from 'react';

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
const navConfig: Array<navConfigItem> = [
  {
    title: 'dashboard',
    path: '/',
    icon: <Iconify icon="material-symbols:space-dashboard" width={24} />,
  },
  {
    title: 'fileInfo',
    path: '/fileInfo',
    icon: <Iconify icon="material-symbols:upload-file-rounded" width={24} />,
  },
  {
    title: 'video',
    path: '/video',
    icon: <Iconify icon="material-symbols:hangout-video-outline" width={24} />,
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
