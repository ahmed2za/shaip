import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const UserGuide = () => {
  const guides = [
    {
      title: 'البحث عن الشركات',
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      steps: [
        'استخدم شريط البحث في الصفحة الرئيسية',
        'يمكنك البحث باسم الشركة أو القطاع',
        'استخدم الفلاتر لتضييق نطاق البحث',
        'اطلع على التقييمات والمراجعات السابقة'
      ]
    },
    {
      title: 'كتابة تقييم',
      icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
      steps: [
        'قم بتسجيل الدخول إلى حسابك',
        'ابحث عن الشركة التي تريد تقييمها',
        'انقر على زر "إضافة تقييم"',
        'املأ نموذج التقييم بتجربتك'
      ]
    },
    {
      title: 'إدارة حساب الشركة',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      steps: [
        'سجل حساباً جديداً كشركة',
        'قم بتوثيق معلومات شركتك',
        'أكمل ملف الشركة بالمعلومات المطلوبة',
        'تفاعل مع تقييمات العملاء'
      ]
    },
    {
      title: 'الحصول على المساعدة',
      icon: <HelpOutlineIcon sx={{ fontSize: 40 }} />,
      steps: [
        'راجع قسم الأسئلة الشائعة',
        'استخدم نموذج الإبلاغ عن مشكلة',
        'تواصل معنا عبر البريد الإلكتروني',
        'اطلع على سياسة الخصوصية وشروط الاستخدام'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        دليل الاستخدام
      </Typography>

      <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
        دليل شامل لاستخدام منصة مصداقية بأفضل طريقة ممكنة
      </Typography>

      <Grid container spacing={4}>
        {guides.map((guide, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {guide.icon}
                <Typography variant="h5" sx={{ mr: 2 }}>
                  {guide.title}
                </Typography>
              </Box>

              <Box component="ol" sx={{ m: 0, pl: 3 }}>
                {guide.steps.map((step, stepIndex) => (
                  <Typography component="li" key={stepIndex} paragraph>
                    {step}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          نصائح إضافية
        </Typography>
        <Typography paragraph>
          • احرص على كتابة تقييمات موضوعية ومفيدة
        </Typography>
        <Typography paragraph>
          • استخدم الفلاتر المتقدمة للوصول إلى أفضل النتائج
        </Typography>
        <Typography paragraph>
          • تأكد من تحديث معلومات حسابك باستمرار
        </Typography>
        <Typography>
          • تواصل معنا إذا واجهت أي مشكلة أو كان لديك اقتراح للتحسين
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserGuide;
