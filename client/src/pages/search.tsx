import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { TrustStars } from '@/components/common/TrustStars';

export default function Search() {
  const router = useRouter();
  const { q: initialQuery } = router.query;
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    rating: 'all',
    sortBy: 'rating',
  });
  const [searchQuery, setSearchQuery] = useState(initialQuery as string || '');

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery as string);
      searchCompanies(initialQuery as string);
    }
  }, [initialQuery]);

  const searchCompanies = async (query: string) => {
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from('companies')
        .select('*')
        .textSearch('name', query, {
          type: 'websearch',
          config: 'english',
        });

      // تطبيق الفلاتر
      if (filters.category !== 'all') {
        supabaseQuery = supabaseQuery.contains('categories', [filters.category]);
      }
      if (filters.location !== 'all') {
        supabaseQuery = supabaseQuery.eq('location', filters.location);
      }
      if (filters.rating !== 'all') {
        supabaseQuery = supabaseQuery.gte('rating', parseInt(filters.rating));
      }

      // الترتيب
      switch (filters.sortBy) {
        case 'rating':
          supabaseQuery = supabaseQuery.order('rating', { ascending: false });
          break;
        case 'reviews':
          supabaseQuery = supabaseQuery.order('total_reviews', { ascending: false });
          break;
        case 'newest':
          supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      searchCompanies(searchQuery);
    }
  };

  const handleFilterChange = (
    field: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    searchCompanies(searchQuery);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          نتائج البحث
        </Typography>

        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن شركة..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </form>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>التصنيف</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="التصنيف"
              >
                <MenuItem value="all">الكل</MenuItem>
                <MenuItem value="restaurants">مطاعم</MenuItem>
                <MenuItem value="hotels">فنادق</MenuItem>
                <MenuItem value="shopping">تسوق</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>المدينة</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                label="المدينة"
              >
                <MenuItem value="all">الكل</MenuItem>
                <MenuItem value="riyadh">الرياض</MenuItem>
                <MenuItem value="jeddah">جدة</MenuItem>
                <MenuItem value="dammam">الدمام</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>التقييم</InputLabel>
              <Select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                label="التقييم"
              >
                <MenuItem value="all">الكل</MenuItem>
                <MenuItem value="4">4+ نجوم</MenuItem>
                <MenuItem value="3">3+ نجوم</MenuItem>
                <MenuItem value="2">2+ نجوم</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>الترتيب حسب</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label="الترتيب حسب"
              >
                <MenuItem value="rating">الأعلى تقييماً</MenuItem>
                <MenuItem value="reviews">الأكثر مراجعات</MenuItem>
                <MenuItem value="newest">الأحدث</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : companies.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ py: 4 }}>
          لم يتم العثور على نتائج
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item key={company.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={company.cover_image || '/images/placeholder.jpg'}
                  alt={company.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {company.name}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <TrustStars rating={company.rating} />
                    <Typography variant="body2" color="text.secondary">
                      {company.total_reviews} مراجعة
                    </Typography>
                  </Box>
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
                    }}
                  >
                    {company.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {company.categories.map((category: string) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/company/${company.id}`)}
                  >
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
