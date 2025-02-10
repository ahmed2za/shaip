import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Tab,
  Tabs,
  Paper,
  Divider,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VerifiedIcon from '@mui/icons-material/Verified';
import LaunchIcon from '@mui/icons-material/Launch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { mockCompanies } from '@/data/mockCompanies';
import CustomStarRating from '@/components/common/CustomStarRating';
import { addRecentlyViewedCompany } from '@/utils/recentlyViewed';
import { formatDate } from '@/utils/dateFormat';

interface CompanyData {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  rating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
  responseRate: number;
  verified: boolean;
  premiumFeatures: boolean;
  categories: string[];
  location: string;
  workingHours: string;
  contactInfo: {
    phone: string;
    email: string;
    social: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  reviews: {
    id: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    user: {
      name: string;
      image: string | null;
    };
    companyResponse: boolean;
  }[];
}

interface Props {
  company: CompanyData;
}

export default function CompanyPage({ company }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && company?.id) {
      // Add company to recently viewed
      addRecentlyViewedCompany(company.id);
    }
  }, [company?.id, isMounted]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Head>
        <title>{company.name} - تقييمات ومراجعات | مصداقية</title>
        <meta name="description" content={`اقرأ تقييمات ${company.name} من عملاء حقيقيين. التقييم الإجمالي ${company.rating} من 5 بناءً على ${company.totalReviews} تقييم.`} />
      </Head>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Breadcrumbs */}
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ direction: 'rtl' }}
          >
            <Link href="/" passHref>
              <MuiLink underline="hover" color="inherit">
                الرئيسية
              </MuiLink>
            </Link>
            {company.categories.map((category, index) => (
              <Link key={index} href={`/category/${category}`} passHref>
                <MuiLink underline="hover" color="inherit">
                  {category}
                </MuiLink>
              </Link>
            ))}
            <Typography color="text.primary">{company.name}</Typography>
          </Breadcrumbs>
        </Container>

        {/* Company Header */}
        <Box sx={{ bgcolor: 'background.paper', py: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: 120, 
                    height: 120,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" component="h1">
                    {company.name}
                  </Typography>
                  {company.verified && (
                    <VerifiedIcon color="primary" sx={{ fontSize: 24 }} />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CustomStarRating value={company.rating} readOnly showValue />
                  <Typography variant="body2" color="text.secondary">
                    · {company.totalReviews} تقييم
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    · معدل الرد {company.responseRate}%
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    endIcon={<LaunchIcon />}
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    زيارة الموقع
                  </Button>
                  {company.categories.map((category, index) => (
                    <Chip key={index} label={category} variant="outlined" />
                  ))}
                </Stack>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={Link}
                  href={`/review/${company.id}`}
                >
                  كتابة تقييم
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} md={8}>
              <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ '& .MuiTab-root': { fontSize: '1rem' } }}
                  >
                    <Tab label="نظرة عامة" value="overview" />
                    <Tab 
                      label="التقييمات" 
                      value="reviews"
                      sx={{ mr: 2 }}
                    />
                  </Tabs>
                </Box>

                <TabPanel value="overview" sx={{ px: 0 }}>
                  {/* Company Description */}
                  <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      عن {company.name}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {company.description}
                    </Typography>
                  </Paper>

                  {/* Rating Distribution */}
                  <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      توزيع التقييمات
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(company.ratingDistribution)
                        .sort(([a], [b]) => Number(b) - Number(a))
                        .map(([rating, count]) => {
                          const percentage = (count / company.totalReviews) * 100;
                          return (
                            <Grid item xs={12} key={rating}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ minWidth: 30 }}>
                                  <Typography>{rating}★</Typography>
                                </Box>
                                <Box
                                  sx={{
                                    flexGrow: 1,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    height: 8,
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      height: '100%',
                                      bgcolor: 'primary.main',
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </Box>
                                <Box sx={{ minWidth: 40 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {count}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Paper>
                </TabPanel>

                <TabPanel value="reviews" sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {company.reviews.map((review) => (
                      <Paper key={review.id} elevation={0} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Avatar src={review.user.image} alt={review.user.name}>
                            {review.user.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">{review.user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(review.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <CustomStarRating value={review.rating} readOnly sx={{ mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          {review.title}
                        </Typography>
                        <Typography variant="body1">
                          {review.content}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </TabPanel>
              </TabContext>
            </Grid>

            {/* Right Column - Company Info */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  معلومات الشركة
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={company.location} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText primary={company.workingHours} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary={company.contactInfo.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={company.contactInfo.email} />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  تواصل اجتماعي
                </Typography>
                <Stack direction="row" spacing={2}>
                  {company.contactInfo.social.instagram && (
                    <IconButton
                      href={`https://instagram.com/${company.contactInfo.social.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  {company.contactInfo.social.twitter && (
                    <IconButton
                      href={`https://twitter.com/${company.contactInfo.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {company.contactInfo.social.linkedin && (
                    <IconButton
                      href={`https://linkedin.com/company/${company.contactInfo.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const company = mockCompanies[id];

  if (!company) {
    return {
      notFound: true,
    };
  }

  // Ensure company data matches the expected format
  const formattedCompany = {
    ...company,
    id: id // Ensure ID is set correctly
  };

  return {
    props: {
      company: formattedCompany,
    },
  };
};
