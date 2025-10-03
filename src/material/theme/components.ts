import { alpha, Components, Theme } from '@mui/material';
import { getFuturisticStyles } from './futuristic';
import { futuristicAnimations } from './animations';

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
      'input[type=number]': {
        MozAppearance: 'textfield',
        '&::-webkit-outer-spin-button': {
          margin: 0,
          WebkitAppearance: 'none',
        },
        '&::-webkit-inner-spin-button': {
          margin: 0,
          WebkitAppearance: 'none',
        },
      },
      img: {
        maxWidth: '100%',
        height: 'auto',
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-color', 'transform'],
          { duration: 200 }
        ),
        '&.MuiButton-contained': {
          backgroundColor: alpha(theme.palette.primary.main, 0.9),
          color: theme.palette.primary.contrastText,
          backdropFilter: 'blur(4px)',
          ...getFuturisticStyles(theme).futuristicBorder,
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: theme.palette.primary.main,
            ...getFuturisticStyles(theme).neonGlow(theme.palette.primary.main),
          },
        },
        '&.MuiButton-outlined': {
          borderColor: alpha(theme.palette.primary.main, 0.5),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            ...getFuturisticStyles(theme).neonGlow(theme.palette.primary.main),
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          transition: 'opacity 0.3s',
          animation: `${futuristicAnimations.glow} 2s infinite`,
          opacity: 0,
        },
        '&:hover::before': {
          opacity: 1,
        },
      }),
      sizeSmall: {
        padding: '6px 16px',
      },
      sizeMedium: {
        padding: '8px 20px',
      },
      sizeLarge: {
        padding: '11px 24px',
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiInputBase-root': {
          borderRadius: theme.shape.borderRadius,
        },
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        '&::placeholder': {
          opacity: 0.7,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        backgroundImage: 'none',
        ...getFuturisticStyles(theme).glassCard,
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: theme.transitions.create(['transform', 'box-shadow']),
          boxShadow: `
            0 14px 28px ${alpha(theme.palette.common.black, 0.15)},
            0 10px 10px ${alpha(theme.palette.common.black, 0.12)},
            0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}
          `,
        },
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '32px 24px',
        '&:last-child': {
          paddingBottom: '32px',
        },
      },
    },
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: { variant: 'h6' },
      subheaderTypographyProps: { variant: 'body2' },
    },
    styleOverrides: {
      root: {
        padding: '32px 24px 16px',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
      }),
    },
  },
  MuiList: {
    styleOverrides: {
      padding: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }),
    },
  },
  MuiSelect: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...getFuturisticStyles(theme).glass,
        '.MuiTableCell-root': {
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, 
              ${alpha(theme.palette.primary.main, 0)}, 
              ${alpha(theme.palette.primary.main, 0.5)},
              ${alpha(theme.palette.primary.main, 0)})`,
          },
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        transition: theme.transitions.create(['background-color', 'transform']),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transform: 'scale(1.001)',
          ...getFuturisticStyles(theme).glass,
        },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        },
      }),
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
};