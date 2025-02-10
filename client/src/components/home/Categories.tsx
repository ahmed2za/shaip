import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  styled,
  Chip,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  FlightTakeoff as TravelIcon,
  Checkroom as ClothingIcon,
  Computer as TechIcon,
  Store as StoreIcon,
  Restaurant as FoodIcon,
  School as EducationIcon,
  Build as ConstructionIcon,
  LocalHospital as HealthcareIcon,
  DirectionsCar as AutoIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'tech',
    title: 'الخدمات التقنية',
    icon: TechIcon,
    count: '200+',
    color: '#4caf50',
    featured: true,
    companies: ['شركة التقنية المتطورة', 'اكتيف 9', 'تك سوليوشنز'],
  },
  {
    id: 'restaurants',
    title: 'مطاعم',
    icon: FoodIcon,
    count: '800+',
    color: '#f44336',
    featured: true,
    companies: ['مطعم الأصالة', 'مطعم الذواقة', 'مطعم السلطان'],
  },
  {
    id: 'education',
    title: 'التعليم والتدريب',
    icon: EducationIcon,
    count: '150+',
    color: '#2196f3',
    featured: true,
    companies: ['معهد التدريب التقني', 'أكاديمية التعلم', 'معهد اللغات'],
  },
  {
    id: 'construction',
    title: 'المقاولات والعقارات',
    icon: ConstructionIcon,
    count: '300+',
    color: '#ff9800',
    companies: ['شركة التطوير العقاري', 'الإعمار للمقاولات', 'البناء الحديث'],
  },
  {
    id: 'healthcare',
    title: 'الرعاية الصحية',
    icon: HealthcareIcon,
    count: '250+',
    color: '#e91e63',
    companies: ['مستشفى الشفاء', 'عيادات الرحمة', 'مركز الصحة'],
  },
  {
    id: 'automotive',
    title: 'السيارات',
    icon: AutoIcon,
    count: '180+',
    color: '#9c27b0',
    companies: ['معرض السيارات الحديثة', 'مركز الصيانة المتكامل', 'وكالة السيارات'],
  },
  {
    id: 'banks',
    title: 'البنوك',
    icon: BankIcon,
    count: '50+',
    color: '#795548',
    companies: ['البنك الأول', 'بنك التمويل', 'البنك التجاري'],
  },
  {
    id: 'clothing',
    title: 'الأزياء والملابس',
    icon: ClothingIcon,
    count: '450+',
    color: '#607d8b',
    companies: ['متجر الأناقة', 'بوتيك الموضة', 'ملابس العائلة'],
  },
];

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .MuiChip-root': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const FeaturedChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
}));

const Categories = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              تصفح حسب الفئات
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              اكتشف وقيّم أفضل الشركات والخدمات في مختلف المجالات
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/categories/${category.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <CategoryCard>
                      {category.featured && (
                        <FeaturedChip
                          label="مميز"
                          color="primary"
                          size="small"
                        />
                      )}
                      <IconWrapper sx={{ bgcolor: `${category.color}15` }}>
                        <Icon
                          sx={{ fontSize: 36, color: category.color }}
                        />
                      </IconWrapper>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {category.count} شركة
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          bgcolor: category.color,
                          '&:hover': {
                            bgcolor: category.color,
                            filter: 'brightness(0.9)',
                          },
                        }}
                      >
                        استعرض الشركات
                      </Button>
                    </CategoryCard>
                  </Link>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Categories;
