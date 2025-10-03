import { keyframes } from '@mui/material';

export const futuristicAnimations = {
  shine: keyframes`
    to {
      background-position: 200% center;
    }
  `,
  pulse: keyframes`
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `,
  float: keyframes`
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  `,
  glow: keyframes`
    0% {
      box-shadow: 0 0 5px rgba(var(--primary), 0.5),
                  0 0 20px rgba(var(--primary), 0.3);
    }
    50% {
      box-shadow: 0 0 10px rgba(var(--primary), 0.7),
                  0 0 30px rgba(var(--primary), 0.5);
    }
    100% {
      box-shadow: 0 0 5px rgba(var(--primary), 0.5),
                  0 0 20px rgba(var(--primary), 0.3);
    }
  `,
  scanline: keyframes`
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  `,
  blink: keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  `,
  ripple: keyframes`
    0% {
      transform: scale(0);
      opacity: 0.8;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  `,
  gradientMove: keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `,
};