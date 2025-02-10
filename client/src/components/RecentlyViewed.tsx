import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import { getRecentlyViewedCompanies } from '@/utils/recentlyViewed';

interface RecentCompany {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
  categories: string[];
  description: string;
}

export default function RecentlyViewed() {
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);

  useEffect(() => {
    // Initial load
    const loadCompanies = () => {
      const companies = getRecentlyViewedCompanies();
      setRecentCompanies(companies);
    };

    loadCompanies();

    // Listen for updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recentlyViewedCompanies') {
        loadCompanies();
      }
    };

    const handleRecentlyViewedUpdate = (e: CustomEvent) => {
      setRecentCompanies(e.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('recentlyViewedUpdate', handleRecentlyViewedUpdate as EventListener);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('recentlyViewedUpdate', handleRecentlyViewedUpdate as EventListener);
      };
    }
  }, []);

  if (recentCompanies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'right',
            mb: 1
          }}
        >
          شركات شاهدتها مؤخراً
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            textAlign: 'right',
            mb: 3
          }}
        >
          تابع الشركات التي تهمك
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {recentCompanies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
            <Link href={`/company/${company.id}`} passHref style={{ textDecoration: 'none' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                    }}
                  >
                    {company.name}
                  </Typography>
                  
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{
                      fontWeight: 'medium'
                    }}
                  >
                    {company.categories[0]}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1
                    }}
                  >
                    {company.description}
                  </Typography>
                  
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 'auto'
                    }}
                  >
                    ({company.id})
                  </Typography>
                </Stack>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
