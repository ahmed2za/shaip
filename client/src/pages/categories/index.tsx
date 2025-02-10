import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  alpha,
  Button,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Home,
  Computer,
  School,
  LocalHospital,
} from '@mui/icons-material';
import Link from 'next/link';
import { categories } from '@/data/categories';

const categoryIcons: { [key: string]: any } = {
  'restaurants': Restaurant,
  'shopping': ShoppingCart,
  'real-estate': Home,
  'technology': Computer,
  'education': School,
  'healthcare': LocalHospital,
};

const categoryColors: { [key: string]: string } = {
  'restaurants': '#FF5722',
  'shopping': '#2196F3',
  'real-estate': '#4CAF50',
  'technology': '#00BCD4',
  'education': '#FF9800',
  'healthcare': '#E91E63',
};

export default function Categories() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          التصنيفات
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          اكتشف وقيّم الشركات حسب مجال عملها
        </Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {Object.entries(categories).map(([id, category]) => {
            const Icon = categoryIcons[id];
            const color = categoryColors[id];
            
            return (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Link href={`/categories/${id}`} passHref style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(color || '#000', 0.1),
                      }}
                    >
                      {Icon && <Icon sx={{ fontSize: 40, color: color || 'primary.main' }} />}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" align="center" gutterBottom>
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {category.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          عرض الشركات
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
