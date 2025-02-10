import React from 'react';
import { Box, Container, Typography, Paper, Rating, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// نموذج بيانات التعليقات الحديثة
const recentReviews = [
  {
    id: 1,
    userName: 'محمد أحمد',
    userAvatar: '/avatars/1.jpg',
    companySlug: 'advanced-tech',
    companyName: 'شركة التقنية المتطورة',
    companyLogo: '/companies/tech.png',
    rating: 1,
    comment: 'المبلغ المدفوع كبير جداً. دعونا نأخذ على سبيل المثال، الغش في Battlefield 2042. يباع في أحد المواقع بـ 657 روبل، وفي موقع آخر...',
    date: new Date('2025-02-09T10:30:00'),
    category: 'تقنية',
  },
  {
    id: 2,
    userName: 'معاذ حسين',
    userAvatar: '/avatars/2.jpg',
    companySlug: 'asala-restaurant',
    companyName: 'مطعم الأصالة',
    companyLogo: '/companies/restaurant.png',
    rating: 5,
    comment: 'مكان رائع جداً. خدمة العملاء كانت ممتازة. صديقي كان لديه ألم في الظهر وعندما طلبنا بعض الوسائد قاموا بتوصيلها. النادلين دائماً...',
    date: new Date('2025-02-09T09:15:00'),
    category: 'مطاعم',
  },
  {
    id: 3,
    userName: 'علي أشتون',
    userAvatar: '/avatars/3.jpg',
    companySlug: 'real-estate-dev',
    companyName: 'شركة التطوير العقاري',
    companyLogo: '/companies/real-estate.png',
    rating: 5,
    comment: 'كان لدي بعض المخاوف في البداية بشأن تقدم موقعي على الويب، ولكن بعد العمل مع الشركة تم حل جميع المشاكل بشكل مرضي...',
    date: new Date('2025-02-09T08:45:00'),
    category: 'عقارات',
  },
  {
    id: 4,
    userName: 'ضرار راج',
    userAvatar: '/avatars/4.jpg',
    companySlug: 'tech-training',
    companyName: 'معهد التدريب التقني',
    companyLogo: '/companies/training.png',
    rating: 5,
    comment: 'تجربتي مع دورة SP3D كانت ممتازة! المدربون شرحوا وحدات SP3D بشكل مفصل مع التطبيق العملي. أفضل جزء كان أنهم ساعدوا في...',
    date: new Date('2025-02-09T08:00:00'),
    category: 'تعليم',
  },
];

const RecentReviews = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const visibleReviews = 3;

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= recentReviews.length - visibleReviews + 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? recentReviews.length - visibleReviews : prev - 1
    );
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            أحدث التقييمات
          </Typography>
          <Box>
            <IconButton onClick={handlePrev} size="small" sx={{ mr: 1 }}>
              <ChevronRight />
            </IconButton>
            <IconButton onClick={handleNext} size="small">
              <ChevronLeft />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
          {recentReviews.slice(currentIndex, currentIndex + visibleReviews).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ flex: '1' }}
            >
              <Link href={`/companies/${review.companySlug}#review-${review.id}`} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={review.userAvatar}
                      alt={review.userName}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ ml: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {review.userName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: review.rating >= 4 ? '#00b67a' : '#ff424f',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {review.comment}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Image
                          src={review.companyLogo}
                          alt={review.companyName}
                          width={16}
                          height={16}
                          style={{ objectFit: 'contain' }}
                        />
                      </Avatar>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                      >
                        {review.companyName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {format(review.date, 'dd MMM yyyy', { locale: ar })}
                    </Typography>
                  </Box>
                </Paper>
              </Link>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default RecentReviews;
