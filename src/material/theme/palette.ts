import { PaletteOptions } from '@mui/material';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: 'hsl(var(--primary))',
    light: 'hsl(var(--primary-light))',
    dark: 'hsl(var(--primary-dark))',
    contrastText: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    main: 'hsl(var(--secondary))',
    light: 'hsl(var(--secondary-light))',
    dark: 'hsl(var(--secondary-dark))',
    contrastText: 'hsl(var(--secondary-foreground))',
  },
  error: {
    main: 'hsl(var(--destructive))',
    light: 'hsl(var(--destructive-light))',
    dark: 'hsl(var(--destructive-dark))',
    contrastText: 'hsl(var(--destructive-foreground))',
  },
  warning: {
    main: 'hsl(var(--warning))',
    light: 'hsl(var(--warning-light))',
    dark: 'hsl(var(--warning-dark))',
    contrastText: 'hsl(var(--warning-foreground))',
  },
  info: {
    main: 'hsl(var(--info))',
    light: 'hsl(var(--info-light))',
    dark: 'hsl(var(--info-dark))',
    contrastText: 'hsl(var(--info-foreground))',
  },
  success: {
    main: 'hsl(var(--success))',
    light: 'hsl(var(--success-light))',
    dark: 'hsl(var(--success-dark))',
    contrastText: 'hsl(var(--success-foreground))',
  },
  grey: {
    50: 'hsl(var(--gray-50))',
    100: 'hsl(var(--gray-100))',
    200: 'hsl(var(--gray-200))',
    300: 'hsl(var(--gray-300))',
    400: 'hsl(var(--gray-400))',
    500: 'hsl(var(--gray-500))',
    600: 'hsl(var(--gray-600))',
    700: 'hsl(var(--gray-700))',
    800: 'hsl(var(--gray-800))',
    900: 'hsl(var(--gray-900))',
  },
  text: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--muted-foreground))',
    disabled: 'hsl(var(--muted))',
  },
  background: {
    default: 'hsl(var(--background))',
    paper: 'hsl(var(--card))',
  },
  action: {
    active: 'hsl(var(--foreground))',
    hover: 'hsl(var(--muted) / 0.1)',
    selected: 'hsl(var(--muted) / 0.2)',
    disabled: 'hsl(var(--muted) / 0.5)',
    disabledBackground: 'hsl(var(--muted) / 0.1)',
  },
  divider: 'hsl(var(--border))',
};

export const darkPalette: PaletteOptions = {
  ...lightPalette,
  mode: 'dark',
};