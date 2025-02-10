import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  Speed as MonitoringIcon,
  ViewList as ViewsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { NotificationBadge } from '@/components/common/NotificationBadge';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from 'next-i18next';

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  requiresAuth?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();
  const { notifications } = useNotifications();
  const [systemHealth, setSystemHealth] = useState<{ status: string; message?: string }>({
    status: 'healthy'
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      handleMenuClose();
      await signOut({ redirect: true, callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Error signing out:', error);
      // Show error notification
    }
  };

  const menuItems: MenuItem[] = [
    { text: t('admin.dashboard'), icon: <DashboardIcon />, path: '/admin', requiresAuth: true },
    { text: t('admin.users'), icon: <PeopleIcon />, path: '/admin/users', requiresAuth: true },
    { text: t('admin.companies'), icon: <BusinessIcon />, path: '/admin/companies', requiresAuth: true },
    { text: t('admin.views'), icon: <ViewsIcon />, path: '/admin/views', requiresAuth: true },
    { text: t('admin.analytics'), icon: <AnalyticsIcon />, path: '/admin/analytics', requiresAuth: true },
    { text: t('admin.reports'), icon: <ReportsIcon />, path: '/admin/reports', requiresAuth: true },
    { text: t('admin.monitoring'), icon: <MonitoringIcon />, path: '/admin/monitoring', requiresAuth: true },
    { text: t('admin.settings'), icon: <SettingsIcon />, path: '/admin/settings', requiresAuth: true }
  ];

  const handleNavigation = async (path: string) => {
    try {
      await router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Show error notification
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ width: '100%', mt: 4, display: 'flex', justifyContent: 'center' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!session && status !== 'loading') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', direction: theme.direction }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          [theme.direction === 'rtl' ? 'mr' : 'ml']: open ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('admin.dashboard')}
          </Typography>

          {systemHealth && (
            <Tooltip title={t(`admin.systemStatus.${systemHealth.status}`)}>
              <IconButton color="inherit">
                <Badge
                  color={systemHealth.status === 'healthy' ? 'success' : 'error'}
                  variant="dot"
                >
                  {systemHealth.status === 'healthy' ? (
                    <MonitoringIcon />
                  ) : (
                    <WarningIcon />
                  )}
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          <NotificationBadge />

          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            aria-label="user menu"
          >
            <Avatar
              alt={session?.user?.name || 'User'}
              src={session?.user?.image || undefined}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            direction: 'ltr',
          },
        }}
        open={open}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              disablePadding
              sx={{
                display: 'block',
                backgroundColor: router.pathname === item.path ? theme.palette.action.selected : 'transparent',
              }}
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    '& .MuiTypography-root': {
                      fontWeight: router.pathname === item.path ? 'bold' : 'normal',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleNavigation('/admin/profile')}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <ListItemText primary={t('admin.profile')} />
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('admin.signOut')} />
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
