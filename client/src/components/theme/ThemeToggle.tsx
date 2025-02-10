import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@/theme/ThemeProvider';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Tooltip title={mode === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
    </motion.div>
  );
}
