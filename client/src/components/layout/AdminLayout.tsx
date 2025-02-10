import {
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Comment as CommentIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  BackupOutlined as BackupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  alpha,
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const menuItems = [
  { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/admin' },
  { text: 'المستخدمين', icon: <PersonIcon />, path: '/admin/users' },
  { text: 'الشركات', icon: <BusinessIcon />, path: '/admin/companies' },
  { text: 'الإعلانات', icon: <AssignmentIcon />, path: '/admin/ads' },
  { text: 'التصنيفات', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'التعليقات', icon: <CommentIcon />, path: '/admin/reviews' },
  { text: 'الإشعارات', icon: <NotificationsIcon />, path: '/admin/notifications' },
  { text: 'النسخ الاحتياطي', icon: <BackupIcon />, path: '/admin/backup' },
  { text: 'الإعدادات', icon: <SettingsIcon />, path: '/admin/settings' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.light, 0.4)} 0%,
              ${alpha(theme.palette.primary.dark, 0.4)} 100%
            )`,
            zIndex: 1,
          }
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            position: 'relative',
            zIndex: 2,
            textAlign: 'center'
          }}
        >
          لوحة التحكم
        </Typography>
      </Box>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            href={item.path}
            selected={router.pathname === item.path}
            sx={{
              mb: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              },
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: router.pathname === item.path ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: router.pathname === item.path ? 600 : 400,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            {menuItems.find(item => item.path === router.pathname)?.text || 'لوحة التحكم'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          pt: { xs: 8, sm: 9 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
