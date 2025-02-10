import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { Business as BusinessIcon } from '@mui/icons-material';
import { useRecentlyVisited } from '@/hooks/useRecentlyVisited';

const CompanyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const LogoWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
  marginBottom: 2,
});

const Logo = styled(Image)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
});

const CompanyName = styled(Typography)({
  fontWeight: 600,
  marginBottom: 1,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '48px',
});

const RecentlyVisited = () => {
  const { recentCompanies } = useRecentlyVisited();

  if (!recentCompanies || recentCompanies.length === 0) {
    return (
      <Box 
        sx={{ 
          py: 4,
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" paragraph>
              لم تقم بزيارة أي شركات حتى الآن
            </Typography>
            <Typography variant="body2" color="text.secondary">
              عند زيارة صفحة شركة، ستظهر هنا في قائمة آخر الشركات التي زرتها
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: 4,
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 600,
            textAlign: { xs: 'center', md: 'right' }
          }}
        >
          آخر الشركات التي زرتها
        </Typography>

        <Grid container spacing={2}>
          {recentCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <Link href={`/companies/${company.id}`} style={{ textDecoration: 'none' }}>
                <CompanyCard elevation={0}>
                  <LogoWrapper>
                    <Logo
                      src={company.logo}
                      alt={company.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </LogoWrapper>
                  <CompanyName variant="h6" color="text.primary">
                    {company.name}
                  </CompanyName>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={company.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {company.rating.toFixed(1)}
                    </Typography>
                  </Box>
                </CompanyCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentlyVisited;