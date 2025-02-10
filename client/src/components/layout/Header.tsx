import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Header = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo.png"
              alt="مصداقية"
              width={150}
              height={40}
              style={{ cursor: 'pointer' }}
            />
          </Link>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Main navigation links */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.primary', 
                  ml: 1,
                  fontWeight: 500
                }}
              >
                هل اشتريت مؤخراً؟
              </Typography>
              <Link href="/write-review" passHref style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    color: '#00b67a',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#00a067',
                    },
                  }}
                >
                  اكتب تقييم
                </Button>
              </Link>
            </Box>

            <Link href="/categories" passHref style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: '#2d3748',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                التصنيفات
              </Button>
            </Link>

            <Link href="/blog" passHref style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: '#2d3748',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                المدونة
              </Button>
            </Link>

            {/* Auth buttons */}
            {session ? (
              <>
                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem component={Link} href="/profile">
                    الملف الشخصي
                  </MenuItem>
                  <MenuItem component={Link} href="/my-reviews">
                    تقييماتي
                  </MenuItem>
                  <MenuItem onClick={() => signOut()}>
                    تسجيل الخروج
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" color="primary">تسجيل الدخول</Button>
                </Link>
                <Link href="/register" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">إنشاء حساب</Button>
                </Link>
              </Box>
            )}
          </Box>

          <Link href="/business" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                bgcolor: '#00b67a',
                '&:hover': {
                  bgcolor: '#00a670',
                },
              }}
            >
              للشركات
            </Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
