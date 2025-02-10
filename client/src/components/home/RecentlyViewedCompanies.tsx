import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Rating, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Company } from '@/types';

interface RecentlyViewedCompaniesProps {
  companies: Company[];
}

export default function RecentlyViewedCompanies({ companies }: RecentlyViewedCompaniesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || companies.length === 0) return null;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        آخر الشركات التي تم تصفحها
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/companies/${company.id}`} style={{ textDecoration: 'none' }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ position: 'relative', height: 60, width: '100%' }}>
                    {company.logo ? (
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="h6" color="text.secondary">
                          {company.name.charAt(0)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {company.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={company.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({company.reviewCount || 0} تقييم)
                    </Typography>
                  </Stack>
                  {company.industry && (
                    <Chip
                      label={company.industry}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </Stack>
              </Paper>
            </Link>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
