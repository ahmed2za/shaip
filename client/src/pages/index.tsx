import { Box, Container, Typography, TextField, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MainLayout from '@/components/layouts/MainLayout';
import Categories from '@/components/home/Categories';
import RecentReviews from '@/components/home/RecentReviews';
import RecentlyVisited from '@/components/home/RecentlyVisited';

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.default',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: '40%',
            background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
            opacity: 0.05,
            transform: 'skewY(-6deg)',
            transformOrigin: 'top left',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '30%',
            left: -200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
            opacity: 0.05,
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3.5rem' },
              color: 'text.primary',
              position: 'relative',
              zIndex: 1
            }}
          >
            ابحث عن شركة تثق بها
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              position: 'relative',
              zIndex: 1
            }}
          >
            تقييمات حقيقية من أشخاص حقيقيين
          </Typography>

          {/* Search Box */}
          <Box
            sx={{
              maxWidth: 600,
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              placeholder="ابحث عن شركة أو تصنيف"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: '50px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '& input': {
                    py: 2,
                    px: 3,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      mr: -1,
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Categories />

      {/* Recently Visited Companies */}
      <RecentlyVisited />

      {/* Recent Reviews Section */}
      <RecentReviews />
    </MainLayout>
  );
};

export default HomePage;
