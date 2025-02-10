import { Box, Container, Typography, Grid, Paper, Rating, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface LatestReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  user: {
    name: string;
    image: string | null;
  };
  company: {
    name: string;
    logo: string;
  };
  createdAt: string;
}

interface LatestReviewsProps {
  reviews: LatestReview[];
}

export default function LatestReviews({ reviews }: LatestReviewsProps) {
  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
          أحدث التقييمات
        </Typography>
        
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={3} key={review.id}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={review.user.image || undefined}
                      alt={review.user.name}
                      sx={{ width: 40, height: 40, mr: 1.5 }}
                    >
                      {review.user.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {review.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: ar })}
                      </Typography>
                    </Box>
                  </Box>

                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                  
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {review.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}
                  >
                    {review.content}
                  </Typography>

                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ position: 'relative', width: 80, height: 40 }}>
                      <Image
                        src={review.company.logo}
                        alt={review.company.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {review.company.name}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
