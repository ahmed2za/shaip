import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { prisma } from '@/lib/prisma';
import { Company, Review, User } from '@prisma/client';
import { formatDate } from '@/utils/dateFormatter';
import Head from 'next/head';
import { useRecentlyVisited } from '@/hooks/useRecentlyVisited';

interface CompanyDetailsProps {
  company: Company & {
    reviews: (Review & {
      user: User;
    })[];
  };
}

const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { addCompany } = useRecentlyVisited();

  useEffect(() => {
    // Track company view in localStorage
    if (company) {
      const averageRating = company.reviews.length > 0
        ? company.reviews.reduce((acc, review) => acc + review.rating, 0) / company.reviews.length
        : 0;

      // Add to recently visited
      addCompany({
        id: company.id,
        name: company.name,
        logo: company.logo || '/images/default-company.png',
        rating: averageRating
      });

      // Track company view for logged-in users
      if (session?.user) {
        fetch('/api/companies/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ companyId: company.id }),
        }).catch(console.error);
      }
    }
  }, [company, session?.user, addCompany]);

  const averageRating = company.reviews.length > 0
    ? company.reviews.reduce((acc, review) => acc + review.rating, 0) / company.reviews.length
    : 0;

  const displayedReviews = showAllReviews ? company.reviews : company.reviews.slice(0, 3);

  return (
    <>
      <Head>
        <title>{company.name} - مصداقية</title>
        <meta name="description" content={`تقييمات ومراجعات ${company.name} - منصة مصداقية`} />
      </Head>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Company Header */}
        <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  src={company.logo || '/images/default-company.png'}
                  alt={company.name}
                  width={200}
                  height={200}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" component="h1" gutterBottom>
                {company.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({company.reviews.length} تقييم)
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                {company.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<CategoryIcon />} label={company.industry} />
                <Chip icon={<LocationIcon />} label={company.location} />
                {company.verified && (
                  <Chip color="primary" label="شركة موثقة" />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Company Information */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  معلومات الاتصال
                </Typography>
                <List>
                  {company.website && (
                    <ListItem>
                      <ListItemIcon>
                        <WebsiteIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="الموقع الإلكتروني"
                        secondary={
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            {company.website}
                          </a>
                        }
                      />
                    </ListItem>
                  )}
                  {company.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="رقم الهاتف"
                        secondary={company.phone}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="العنوان"
                      secondary={company.location}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Reviews Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  التقييمات ({company.reviews.length})
                </Typography>
                {session && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/companies/${company.id}/review`)}
                  >
                    أضف تقييماً
                  </Button>
                )}
              </Box>

              {displayedReviews.map((review) => (
                <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={review.user.image || undefined} alt={review.user.name || ''} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">
                        {review.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {review.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {review.content}
                  </Typography>
                </Paper>
              ))}

              {company.reviews.length > 3 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    variant="outlined"
                  >
                    {showAllReviews ? 'عرض أقل' : 'عرض المزيد من التقييمات'}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  try {
    const company = await prisma.company.findUnique({
      where: {
        id: String(params.id),
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!company) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        company: JSON.parse(JSON.stringify(company)),
      },
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    return {
      notFound: true,
    };
  }
};

export default CompanyDetails;
