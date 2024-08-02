import { ReactNode } from 'react';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface navConfigItem {
  title: string;
  path: string;
  icon: ReactNode;
}
const navConfig: Array<navConfigItem> = [
  {
    title: 'home',
    path: '/home',
    icon: <Iconify icon="material-symbols:home-rounded" width={24} />,
  },
  {
    title: 'detail',
    path: '/home/detail/3',
    icon: <Iconify icon="material-symbols:upload-file-rounded" width={24} />,
  },
  {
    title: 'demo',
    path: '/home/detail/4',
    icon: <Iconify icon="material-symbols:hangout-video-rounded" width={24} />,
  },
];

export default navConfig;
