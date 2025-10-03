import { alpha, Theme } from '@mui/material';

export const mixins = {
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  verticalCenter: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  horizontalCenter: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickable: {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'opacity 250ms',
    '&:hover': {
      opacity: 0.8,
    },
  },
  scrollbar: (theme: Theme) => ({
    '*::-webkit-scrollbar': {
      width: 8,
      height: 8,
      backgroundColor: alpha(theme.palette.text.primary, 0.05),
    },
    '*::-webkit-scrollbar-thumb': {
      borderRadius: 4,
      backgroundColor: alpha(theme.palette.text.primary, 0.2),
      minHeight: 24,
      minWidth: 24,
    },
    '*::-webkit-scrollbar-thumb:focus': {
      backgroundColor: alpha(theme.palette.text.primary, 0.3),
    },
    '*::-webkit-scrollbar-thumb:active': {
      backgroundColor: alpha(theme.palette.text.primary, 0.3),
    },
    '*::-webkit-scrollbar-thumb:hover': {
      backgroundColor: alpha(theme.palette.text.primary, 0.3),
    },
    '*::-webkit-scrollbar-corner': {
      backgroundColor: alpha(theme.palette.text.primary, 0.05),
    },
  }),
};