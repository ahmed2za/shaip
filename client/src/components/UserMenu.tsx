import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-vars';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      handleClose();
      router.push('/');
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'COMPANY':
        return '/company/dashboard';
      default:
        return '/dashboard';
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => router.push('/login')}
          >
            تسجيل الدخول
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RegisterIcon />}
            onClick={() => router.push('/auth/register')}
          >
            إنشاء حساب
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <>
      <IconButton
        onClick={handleMenu}
        sx={{
          p: 0,
          border: '2px solid',
          borderColor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.light',
          },
        }}
      >
        <Avatar
          alt={user?.email || ''}
          src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''}
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
          }}
        >
          {user?.email?.[0]?.toUpperCase() || ''}
        </Avatar>
      </IconButton>
      
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={() => {
          handleClose();
          router.push('/profile');
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="الملف الشخصي" />
        </MenuItem>

        <MenuItem onClick={() => {
          handleClose();
          router.push(getDashboardLink());
        }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="لوحة التحكم" />
        </MenuItem>

        <MenuItem onClick={() => {
          handleClose();
          router.push('/settings');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="الإعدادات" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="تسجيل الخروج" sx={{ color: 'error.main' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
