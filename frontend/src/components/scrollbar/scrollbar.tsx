import { memo, ReactNode, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { Theme, SxProps } from '@mui/material';

import * as styles from './styles';

// ----------------------------------------------------------------------
interface ScrollbarProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}
const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }: ScrollbarProps, ref) => {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (mobile) {
      return (
        <Box ref={ref} sx={{ overflow: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      );
    }

    return (
      <styles.StyledRootScrollbar>
        <styles.StyledScrollbar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </styles.StyledScrollbar>
      </styles.StyledRootScrollbar>
    );
  }
);

export default memo(Scrollbar);
