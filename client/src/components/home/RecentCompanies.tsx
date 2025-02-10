import { Box, Container, Typography, Grid, Paper, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
}

interface RecentCompaniesProps {
  companies: Company[];
}

export default function RecentCompanies({ companies }: RecentCompaniesProps) {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
          تابع من حيث توقفت
        </Typography>
        
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/company/${company.id}`} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', width: 120, height: 60, mb: 2 }}>
                      <Image
                        src={company.logo}
                        alt={company.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </Box>
                    
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        fontWeight: 500,
                        textAlign: 'center',
                        color: 'text.primary'
                      }}
                    >
                      {company.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <Rating value={company.rating} readOnly precision={0.1} size="small" />
                      <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {company.reviewCount} تقييم
                    </Typography>
                  </Paper>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
