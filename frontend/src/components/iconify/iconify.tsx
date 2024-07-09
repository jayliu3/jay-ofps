import { forwardRef } from 'react';
import { Icon, IconifyIcon } from '@iconify/react';

import Box from '@mui/material/Box';
import { Theme, SxProps } from '@mui/material';

// ----------------------------------------------------------------------
interface IconifyProps {
  icon: string | IconifyIcon;
  width?: number;
  sx?: SxProps<Theme>;
  color?: string;
}
const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref: React.Ref<unknown>) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

export default Iconify;
