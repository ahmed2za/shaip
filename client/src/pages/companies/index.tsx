import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { TrustStars } from '@/components/common/TrustStars';

interface Company {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  rating: number;
  total_reviews: number;
  categories: string[];
  location: string;
  verified: boolean;
}

const categories = [
  'جميع التصنيفات',
  'مطاعم',
  'فنادق',
  'متاجر إلكترونية',
  'خدمات سياحية',
  'عقارات',
  'سيارات',
  'تعليم',
  'صحة',
  'تقنية',
];

const locations = [
  'جميع المدن',
  'الرياض',
  'جدة',
  'الدمام',
  'مكة المكرمة',
  'المدينة المنورة',
  'الخبر',
  'تبوك',
  'أبها',
];

const sortOptions = [
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'reviews', label: 'الأكثر تقييمات' },
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
];

export default function CompaniesPage() {
  const theme = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع التصنيفات');
  const [selectedLocation, setSelectedLocation] = useState('جميع المدن');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let query = prisma.company.findMany({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        include: {
          _count: {
            select: { reviews: true }
          }
        }
      });

      // تطبيق الفلترة
      if (searchTerm) {
        query = prisma.company.findMany({
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          where: {
            name: {
              contains: searchTerm,
            },
          },
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        });
      }

      if (selectedCategory !== 'جميع التصنيفات') {
        query = prisma.company.findMany({
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          where: {
            categories: {
              contains: selectedCategory,
            },
          },
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        });
      }

      if (selectedLocation !== 'جميع المدن') {
        query = prisma.company.findMany({
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          where: {
            location: selectedLocation,
          },
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        });
      }

      // تطبيق الترتيب
      switch (sortBy) {
        case 'rating':
          query = prisma.company.findMany({
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            orderBy: {
              rating: 'desc',
            },
            include: {
              _count: {
                select: { reviews: true }
              }
            }
          });
          break;
        case 'reviews':
          query = prisma.company.findMany({
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            orderBy: {
              _count: {
                reviews: 'desc',
              },
            },
            include: {
              _count: {
                select: { reviews: true }
              }
            }
          });
          break;
        case 'newest':
          query = prisma.company.findMany({
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              _count: {
                select: { reviews: true }
              }
            }
          });
          break;
        case 'oldest':
          query = prisma.company.findMany({
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              _count: {
                select: { reviews: true }
              }
            }
          });
          break;
      }

      const companiesData = await query;
      const totalCompanies = await prisma.company.count();

      setCompanies(companiesData);
      setTotalPages(Math.ceil(totalCompanies / itemsPerPage));
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, selectedCategory, selectedLocation, sortBy, page]);

  const CompanyCard = ({ company }: { company: Company }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/company/${company.id}`} style={{ textDecoration: 'none' }}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Box sx={{ position: 'relative', paddingTop: '60%' }}>
            <Image
              src={company.logo_url || '/images/company-placeholder.jpg'}
              alt={company.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom noWrap>
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
                mb: 2,
                height: '40px',
              }}
            >
              {company.description}
            </Typography>
            <Box sx={{ mb: 1 }}>
              <TrustStars rating={company.rating} />
              <Typography variant="body2" color="text.secondary">
                {company.total_reviews} تقييم
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              {company.categories.slice(0, 2).map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {company.location}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* فلترة وبحث */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="ابحث عن شركة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>التصنيف</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>المدينة</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                }
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>الترتيب حسب</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* قائمة الشركات */}
      <AnimatePresence mode="wait">
        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(12)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={300}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              ))
            : companies.map((company) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
                  <CompanyCard company={company} />
                </Grid>
              ))}
        </Grid>
      </AnimatePresence>

      {/* الترقيم */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}
