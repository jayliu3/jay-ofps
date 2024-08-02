import { useState, ReactNode } from 'react';

import {
  Box,
  Stack,
  alpha,
  Paper,
  AppBar,
  Drawer,
  Toolbar,
  useTheme,
  InputBase,
  IconButton,
  ListItemButton,
} from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import LanguagePopover from 'src/layouts/dashboard/common/language-popover';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import navConfig from './config-navigation';

const HEADER = {
  H_MOBILE: 55,
  H_DESKTOP: 80,
  H_DESKTOP_OFFSET: 80 - 25,
};
const NAV = {
  WIDTH: 280,
};
const SPACING = 8;

// ------------------------------------------

interface WebLayoutProps {
  children: ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
  const [openNav, setOpenNav] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  const pathname = usePathname();

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <ListItemButton
          component={RouterLink}
          href={item.path}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            ...(item.path === pathname && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
          <Box component="span">{item.title} </Box>
        </ListItemButton>
      ))}
    </Stack>
  );

  return (
    <>
      {/* <Header onOpenNav={() => setOpenNav(true)} /> */}

      <AppBar
        sx={{
          boxShadow: 'none',
          height: HEADER.H_MOBILE,
          zIndex: theme.zIndex.appBar + 1,
          transition: theme.transitions.create(['height'], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(lgUp && {
            width: `calc(100% - ${NAV.WIDTH + 1}px)`,
            height: HEADER.H_DESKTOP,
          }),
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Toolbar
          sx={{
            height: 1,
            px: { lg: 5 },
          }}
        >
          <>
            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" alignItems="center" spacing={1}>
              <LanguagePopover />

              <IconButton
                onClick={() => setOpenSearch(true)}
                sx={{
                  width: 40,
                  height: 40,
                }}
              >
                <Iconify icon="eva:search-fill" />
              </IconButton>

              {!lgUp && (
                <IconButton
                  onClick={() => setOpenNav(true)}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                >
                  <Iconify icon="material-symbols:menu-rounded" />
                </IconButton>
              )}
            </Stack>
          </>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Box
          sx={{
            flexShrink: { lg: 0 },
            width: { lg: NAV.WIDTH },
          }}
        >
          {lgUp ? (
            <Box
              sx={{
                height: 1,
                position: 'fixed',
                width: NAV.WIDTH,
                borderRight: `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <Scrollbar
                sx={{
                  height: 1,
                  '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                <Logo sx={{ mt: 3, ml: 4 }} />
                {renderMenu}
                <Box sx={{ flexGrow: 1 }} />
              </Scrollbar>
            </Box>
          ) : (
            <Drawer
              open={openNav}
              onClose={() => setOpenNav(false)}
              PaperProps={{
                sx: {
                  width: NAV.WIDTH,
                },
              }}
            >
              <Scrollbar
                sx={{
                  height: 1,
                  '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                <Logo sx={{ mt: 3, ml: 4 }} />
                {renderMenu}
                <Box sx={{ flexGrow: 1 }} />
              </Scrollbar>
            </Drawer>
          )}
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 1,
            display: 'flex',
            flexDirection: 'column',
            py: `${HEADER.H_MOBILE + SPACING}px`,
            ...(lgUp && {
              px: 2,
              py: `${HEADER.H_DESKTOP + SPACING}px`,
              width: `calc(100% - ${NAV.WIDTH}px)`,
            }),
          }}
        >
          {children}
        </Box>
      </Box>

      <Drawer
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: 300,
          },
        }}
      >
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Paper elevation={1} sx={{ m: 3, display: 'flex', alignItems: 'center' }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <Iconify icon="eva:search-fill" />
            </IconButton>
          </Paper>
        </Scrollbar>
      </Drawer>
    </>
  );
}
