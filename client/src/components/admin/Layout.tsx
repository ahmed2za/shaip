import {
  Article as ArticleIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  Divider,
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
import { ReactNode, useState } from 'react';

const drawerWidth = 240;

interface Props {
  children: ReactNode;
}

const menuItems = [
  { text: 'لوحة المعلومات', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'الشركات', icon: <BusinessIcon />, path: '/admin/companies' },
  { text: 'التصنيفات', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'التقييمات', icon: <StarIcon />, path: '/admin/reviews' },
  { text: 'المستخدمين', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'المحتوى', icon: <ArticleIcon />, path: '/admin/content' },
  { text: 'المشاهدات', icon: <VisibilityIcon />, path: '/admin/views' },
  { text: 'الإعدادات', icon: <SettingsIcon />, path: '/admin/settings' },
];

export default function AdminLayout({ children }: Props) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', direction: 'rtl' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            لوحة تحكم المسؤول
          </Typography>
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
          },
        }}
        anchor="right"
      >
        <Toolbar>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <Link
              href={item.path}
              key={item.text}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem
                button
                selected={router.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: router.pathname === item.path ? 'inherit' : 'primary.main',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
