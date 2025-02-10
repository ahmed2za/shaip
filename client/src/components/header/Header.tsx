import { useAuth } from '@/contexts/AuthContext';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Header.module.css';

const pages = [
  { name: 'اكتب تقييم', path: '/write-review' },
  { name: 'التصنيفات', path: '/categories' },
  { name: 'المدونة', path: '/blog' },
];

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleCloseMenu();
  };

  return (
    <AppBar position="sticky" className={styles.header} sx={{ bgcolor: '#1c1c1c' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            مصداقية
          </Typography>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}

            {/* User Menu */}
            {user ? (
              <>
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={user.name || ''}
                    src={user.image || ''}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  sx={{ mt: '45px' }}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    الملف الشخصي
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/settings')}>
                    الإعدادات
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/logout')}>
                    تسجيل الخروج
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/auth/signin')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  },
                }}
              >
                تسجيل الدخول
              </Button>
            )}

            {/* For Businesses Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation('/business')}
              sx={{
                bgcolor: '#a5c3f0',
                color: '#000',
                '&:hover': {
                  bgcolor: '#8eb0e6',
                },
                borderRadius: '20px',
                px: 3,
              }}
            >
              للشركات
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
