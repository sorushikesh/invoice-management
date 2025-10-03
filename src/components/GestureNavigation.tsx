import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material';
import { useEffect } from 'react';

export const GestureNavigation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const controls = useAnimation();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const THRESHOLD = 50;
    
    if (info.offset.x > THRESHOLD) {
      // Swipe right - go back
      controls.start({
        x: '100%',
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        navigate(-1);
      });
    } else if (info.offset.x < -THRESHOLD) {
      // Swipe left - go forward
      controls.start({
        x: '-100%',
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        navigate(1);
      });
    } else {
      // Reset if threshold not met
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    }
  };

  // Reset animation when route changes
  useEffect(() => {
    controls.set({ x: 0, opacity: 1 });
  }, [window.location.pathname]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          height: '100px',
          background: `linear-gradient(90deg, 
            ${alpha(theme.palette.primary.main, 0)} 0%,
            ${alpha(theme.palette.primary.main, 0.1)} 50%,
            ${alpha(theme.palette.primary.main, 0)} 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        className="gesture-indicator"
      />
    </motion.div>
  );
};