import { GetServerSideProps } from 'next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  Check as CheckIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { mockCompanies } from '@/data/mockCompanies';

interface Props {
  category: any;
  companies: any[];
}

export default function CategoryPage({ category, companies }: Props) {
  if (!category) {
    return <Typography>Category not found</Typography>;
  }

  return (
    <>
      <Head>
        <title>{category.name} | تقييم</title>
        <meta name="description" content={category.description} />
      </Head>

      <Box
        sx={{
          position: 'relative',
          height: '300px',
          width: '100%',
          overflow: 'hidden',
          mb: 6,
        }}
      >
        <Image
          src={category.image}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          priority
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            color="white"
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            {category.name}
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              الشركات في {category.name}
            </Typography>
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} sm={6} key={company.id}>
                  <Link href={`/company/${company.id}`} passHref style={{ textDecoration: 'none' }}>
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
                      <CardMedia
                        component="div"
                        sx={{
                          pt: '56.25%',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={company.logo}
                          alt={company.name}
                          layout="fill"
                          objectFit="contain"
                        />
                      </CardMedia>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {company.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {company.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                عن {category.name}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {category.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                المميزات
              </Typography>
              <List>
                {category.features.map((feature: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                إحصائيات
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    عدد الشركات
                  </Typography>
                  <Typography variant="h4">
                    {companies.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    متوسط التقييم
                  </Typography>
                  <Typography variant="h4">
                    {(companies.reduce((acc, company) => acc + company.rating, 0) / companies.length).toFixed(1)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const categoryId = params?.id as string;
  const category = categories[categoryId];

  if (!category) {
    return {
      notFound: true,
    };
  }

  const categoryCompanies = category.companies.map(id => mockCompanies[id]).filter(Boolean);

  return {
    props: {
      category,
      companies: categoryCompanies,
    },
  };
};
