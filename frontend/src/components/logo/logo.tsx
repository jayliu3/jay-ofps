import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Theme, SxProps } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------
interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps<Theme>;
}

const Logo = forwardRef<HTMLLinkElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const logo = (
      <Box
        ref={ref}
        component="img"
        src="/assets/logo.svg"
        sx={{ width: 80, height: 80, cursor: 'pointer', ...sx }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
