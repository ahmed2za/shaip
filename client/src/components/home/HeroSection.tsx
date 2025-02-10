import { Box, Container, Typography, TextField, InputAdornment, IconButton, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StoreIcon from '@mui/icons-material/Store';
import DiamondIcon from '@mui/icons-material/Diamond';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LaptopIcon from '@mui/icons-material/Laptop';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { alpha } from '@mui/material/styles';

export default function HeroSection() {
  const categories = [
    { icon: AccountBalanceIcon, label: 'البنوك' },
    { icon: LocalShippingIcon, label: 'شركات التأمين' },
    { icon: StorefrontIcon, label: 'وكالات السيارات' },
    { icon: StoreIcon, label: 'متاجر الأثاث' },
    { icon: DiamondIcon, label: 'متاجر المجوهرات' },
    { icon: CheckroomIcon, label: 'متاجر الملابس' },
    { icon: LaptopIcon, label: 'الإلكترونيات والتقنية' },
    { icon: FitnessCenterIcon, label: 'خدمات اللياقة والتغذية' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'primary.main',
        color: 'white',
        pt: 8,
        pb: 12,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, 
            ${alpha('#2196f3', 0.4)} 0%,
            ${alpha('#3f51b5', 0.4)} 100%
          )`,
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 2,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                ابحث عن شركة تثق بها
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                تقييمات حقيقية من أشخاص حقيقيين
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 0.5,
                  maxWidth: 700,
                  mx: 'auto',
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.98)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <TextField
                  fullWidth
                  placeholder="ابحث عن شركة أو تصنيف..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark'
                            }
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                      borderRadius: 2,
                    }
                  }}
                />
              </Paper>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Grid container spacing={2} justifyContent="center">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Grid item key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Paper
                        sx={{
                          px: 2,
                          py: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Icon sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" color="text.primary">
                          {category.label}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
