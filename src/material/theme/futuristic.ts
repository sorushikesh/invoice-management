import { alpha, Theme } from '@mui/material';

export const getFuturisticStyles = (theme: Theme) => ({
  glass: {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
  glassCard: {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    boxShadow: `
      0 4px 24px -1px ${alpha(theme.palette.common.black, 0.1)},
      0 6px 10px -1px ${alpha(theme.palette.primary.main, 0.04)},
      0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}
    `,
  },
  futuristicBorder: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: '1px',
      background: `linear-gradient(45deg, 
        ${alpha(theme.palette.primary.main, 0.5)},
        ${alpha(theme.palette.secondary.main, 0.5)})`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
  },
  neonGlow: (color: string) => ({
    boxShadow: `0 0 5px ${alpha(color, 0.5)},
                0 0 20px ${alpha(color, 0.3)},
                0 0 40px ${alpha(color, 0.1)}`,
  }),
  futuristicBackdrop: {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    backdropFilter: 'blur(20px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 50% 0%, 
        ${alpha(theme.palette.primary.main, 0.1)},
        transparent 50%)`,
      opacity: 0.4,
    },
  },
  holographicText: {
    background: `linear-gradient(90deg,
      ${theme.palette.primary.main},
      ${theme.palette.secondary.main},
      ${theme.palette.primary.main})`,
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'shine 4s linear infinite',
  },
  futuristicInput: {
    backgroundColor: 'transparent',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    '&:focus-within': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  gradientBg: {
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.primary.dark, 0.1)} 0%,
      ${alpha(theme.palette.primary.main, 0.05)} 50%,
      ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  },
});