import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useThemeContext } from 'src/theme';

import Iconify from 'src/components/iconify';

import { NAV, HEADER } from './config-layout';
import LanguagePopover from './common/language-popover';

// ----------------------------------------------------------------------
interface HeaderProps {
  onOpenNav: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenNav }: HeaderProps) => {
  const theme = useTheme();
  const { toggleTheme, mode } = useThemeContext();

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={toggleTheme}
          color="primary"
          sx={{
            width: 40,
            height: 40,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
          }}
        >
          <Iconify
            icon={mode === 'light' ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'}
            sx={{ width: 25, height: 25 }}
          />
        </IconButton>
        <LanguagePopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH}px)`,
          height: HEADER.H_DESKTOP,
        }),
        ...bgBlur({
          color: theme.palette.background.paper,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
};
export default Header;
