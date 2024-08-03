import { PaletteMode } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#E1F5E4',
  light: '#A0E3B8',
  main: '#8BC34A',
  dark: '#5A8F2D',
  darker: '#4A6D23',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#F3E5F5',
  light: '#D1A1E4',
  main: '#AB47BC',
  dark: '#6A1B9A',
  darker: '#4A0072',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#E3F2FD',
  light: '#64B5F6',
  main: '#2196F3',
  dark: '#1976D2',
  darker: '#0D47A1',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#C8E6C9',
  light: '#81C784',
  main: '#4CAF50',
  dark: '#388E3C',
  darker: '#1B5E20',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF9C4',
  light: '#FFF176',
  main: '#FFEB3B',
  dark: '#FBC02D',
  darker: '#F57F17',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFCDD2',
  light: '#EF9A9A',
  main: '#F44336',
  dark: '#D32F2F',
  darker: '#B71C1C',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
}

export function palette(mode: PaletteMode) {
  const isLight = mode === 'light';

  return {
    ...base,
    mode,
    text: {
      primary: isLight ? grey[800] : grey[100],
      secondary: isLight ? grey[600] : grey[300],
      disabled: grey[500],
    },
    background: {
      paper: isLight ? '#FFFFFF' : grey[800],
      default: isLight ? grey[100] : grey[900],
      neutral: isLight ? grey[200] : grey[700],
    },
    action: {
      ...base.action,
      active: isLight ? grey[600] : grey[400],
    },
  };
}
