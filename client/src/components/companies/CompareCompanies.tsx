import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Rating,
  Chip,
  LinearProgress,
  Autocomplete,
  TextField,
  Button,
} from '@mui/material';
import { CompareArrows, TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Company } from '@prisma/client';

interface CompanyWithStats extends Company {
  _count: {
    reviews: number;
  };
  reviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
  industry: string;
  size: string;
}

interface CompareCompaniesProps {
  initialCompanies?: CompanyWithStats[];
}

export default function CompareCompanies({ initialCompanies = [] }: CompareCompaniesProps) {
  const [companies, setCompanies] = useState<CompanyWithStats[]>(initialCompanies);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableCompanies();
  }, []);

  const fetchAvailableCompanies = async () => {
    try {
      const res = await fetch('/api/companies?limit=100');
      const data = await res.json();
      setAvailableCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleAddCompany = async (company: Company | null) => {
    if (!company) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${company.id}/stats`);
      const companyStats = await res.json();
      setCompanies((prev) => [...prev, companyStats]);
    } catch (error) {
      console.error('Error fetching company stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCompany = (companyId: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
  };

  const renderRatingDistribution = (distribution: { [key: number]: number }, total: number) => {
    return [5, 4, 3, 2, 1].map((rating) => (
      <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ minWidth: 20 }}>
          {rating}
        </Typography>
        <Box sx={{ flexGrow: 1, mx: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(distribution[rating] || 0) / total * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Typography variant="body2" sx={{ minWidth: 30 }}>
          {distribution[rating] || 0}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          options={availableCompanies.filter(
            (c) => !companies.find((selected) => selected.id === c.id)
          )}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="أضف شركة للمقارنة"
              variant="outlined"
              fullWidth
              dir="rtl"
            />
          )}
          onChange={(_, value) => handleAddCompany(value)}
          loading={loading}
        />
      </Box>

      <AnimatePresence>
        <Grid container spacing={3}>
          {companies.map((company, index) => (
            <Grid item xs={12} md={6} lg={4} key={company.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveCompany(company.id)}
                      >
                        إزالة
                      </Button>
                      <Typography variant="h6" component="h3">
                        {company.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        التقييم العام
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={company.averageRating} precision={0.5} readOnly />
                        <Typography variant="body2">
                          ({company._count.reviews} تقييم)
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        توزيع التقييمات
                      </Typography>
                      {renderRatingDistribution(company.ratingDistribution, company._count.reviews)}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        معلومات الشركة
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Chip
                            label={company.industry}
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Chip
                            label={company.size}
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        الاتجاه
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {company.averageRating >= 4 ? (
                          <TrendingUp color="success" />
                        ) : company.averageRating <= 2 ? (
                          <TrendingDown color="error" />
                        ) : (
                          <CompareArrows color="warning" />
                        )}
                        <Typography variant="body2">
                          {company.averageRating >= 4
                            ? 'أداء ممتاز'
                            : company.averageRating <= 2
                            ? 'يحتاج إلى تحسين'
                            : 'أداء متوسط'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>
    </Box>
  );
}
