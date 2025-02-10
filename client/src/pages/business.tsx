import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const BusinessPage = () => {
  const theme = useTheme();

  const plans = [
    {
      title: 'الباقة المجانية',
      price: '0',
      period: 'شهرياً',
      features: [
        'إضافة شركة واحدة',
        'معلومات أساسية للشركة',
        'تلقي التقييمات والتعليقات',
        'الظهور في نتائج البحث',
        'تحليلات أساسية',
        'دعم العملاء عبر البريد الإلكتروني',
        'شارة التحقق',
        'إحصائيات متقدمة',
      ],
      description: 'مثالية للشركات الصغيرة التي تبدأ رحلتها في إدارة السمعة الإلكترونية',
      popular: false,
      buttonText: 'ابدأ مجاناً',
      buttonVariant: 'outlined' as const,
    },
    {
      title: 'الباقة الاحترافية',
      price: '299',
      period: 'شهرياً',
      features: [
        'إضافة حتى 5 شركات',
        'معلومات مفصلة للشركة',
        'تلقي وإدارة التقييمات',
        'أولوية في نتائج البحث',
        'تحليلات متقدمة',
        'دعم العملاء على مدار الساعة',
        'شارة التحقق',
        'تقارير شهرية مفصلة',
      ],
      description: 'الحل الأمثل للشركات المتوسطة التي تحتاج إلى أدوات متقدمة لإدارة السمعة',
      popular: true,
      buttonText: 'ابدأ الآن',
      buttonVariant: 'contained' as const,
    },
    {
      title: 'الباقة المؤسسية',
      price: '999',
      period: 'شهرياً',
      features: [
        'عدد غير محدود من الشركات',
        'معلومات مفصلة وتخصيص كامل',
        'إدارة متقدمة للتقييمات',
        'أعلى أولوية في نتائج البحث',
        'تحليلات متقدمة مع تقارير مخصصة',
        'مدير حساب مخصص',
        'شارة التحقق الذهبية',
        'واجهة برمجة التطبيقات API',
      ],
      description: 'حل متكامل للمؤسسات الكبيرة التي تحتاج إلى حلول مخصصة وقابلة للتطوير',
      popular: false,
      buttonText: 'تواصل معنا',
      buttonVariant: 'outlined' as const,
    },
  ];

  const businessFeatures = [
    {
      icon: <TrendingUpIcon fontSize="large" />,
      title: 'نمو الأعمال',
      description: 'زيادة المبيعات وتحسين معدل التحويل من خلال إدارة فعالة للمراجعات والتقييمات',
    },
    {
      icon: <StarIcon fontSize="large" />,
      title: 'تحسين السمعة',
      description: 'بناء وتعزيز سمعة علامتك التجارية من خلال إدارة احترافية للمراجعات',
    },
    {
      icon: <BusinessIcon fontSize="large" />,
      title: 'تطوير الأعمال',
      description: 'تحليلات متقدمة ورؤى قيمة لمساعدتك في اتخاذ قرارات أفضل لنمو أعمالك',
    },
  ];

  const businessBenefits = [
    {
      title: 'تحسين تجربة العملاء',
      items: [
        'تحليل آراء العملاء وتوجهاتهم',
        'الاستجابة السريعة للملاحظات',
        'تحسين جودة الخدمة',
        'بناء علاقات أقوى مع العملاء',
      ],
    },
    {
      title: 'زيادة المبيعات',
      items: [
        'تحسين معدل التحويل',
        'زيادة ثقة العملاء',
        'تحسين الظهور في محركات البحث',
        'جذب عملاء جدد',
      ],
    },
    {
      title: 'تطوير الأعمال',
      items: [
        'تحليل اتجاهات السوق',
        'فهم احتياجات العملاء',
        'تحسين المنتجات والخدمات',
        'اتخاذ قرارات مبنية على البيانات',
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom>
            حلول متكاملة لتطوير أعمالك
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            نقدم لك كل ما تحتاجه لإدارة وتحسين سمعة شركتك عبر الإنترنت
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              icon={<CheckIcon />}
              label="دعم فني متخصص"
              color="primary"
            />
            <Chip
              icon={<CheckIcon />}
              label="حلول مخصصة"
              color="primary"
            />
          </Stack>
        </Box>

        {/* Business Features */}
        <Grid container spacing={4} mb={8}>
          {businessFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Pricing Cards */}
        <Typography variant="h3" component="h2" textAlign="center" mb={6}>
          اختر الباقة المناسبة لأعمالك
        </Typography>

        <Grid container spacing={4} alignItems="flex-start" mb={8}>
          {plans.map((plan, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  ...(plan.popular && {
                    border: '2px solid',
                    borderColor: 'primary.main',
                    transform: 'scale(1.05)',
                  }),
                }}
              >
                {plan.popular && (
                  <Chip
                    label="الأكثر شعبية"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h4" component="h3" gutterBottom>
                      {plan.title}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="baseline"
                      spacing={1}
                    >
                      <Typography variant="h3" component="span">
                        {plan.price}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        ريال
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        /{plan.period}
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    align="center"
                    paragraph
                  >
                    {plan.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex}>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    fullWidth
                    variant={plan.buttonVariant}
                    color="primary"
                    size="large"
                  >
                    {plan.buttonText}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Business Benefits */}
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          فوائد الأعمال
        </Typography>
        <Grid container spacing={4} mt={4}>
          {businessBenefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <List dense>
                    {benefit.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box mt={8}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            الأسئلة الشائعة
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    هل يمكنني تغيير باقتي في أي وقت؟
                  </Typography>
                  <Typography color="text.secondary">
                    نعم، يمكنك الترقية أو تخفيض باقتك في أي وقت. سيتم تطبيق التغييرات في دورة الفوترة التالية.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    هل هناك عقد التزام؟
                  </Typography>
                  <Typography color="text.secondary">
                    لا، جميع باقاتنا تعمل بنظام الاشتراك الشهري ويمكنك إلغاء اشتراكك في أي وقت.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    هل يمكنني تجربة الخدمة قبل الاشتراك؟
                  </Typography>
                  <Typography color="text.secondary">
                    نعم، يمكنك البدء مع الباقة المجانية والتعرف على مميزات المنصة قبل الترقية إلى الباقات المدفوعة.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    كيف يمكنني الحصول على مساعدة إضافية؟
                  </Typography>
                  <Typography color="text.secondary">
                    فريق الدعم الفني متاح لمساعدتك في أي وقت. يمكنك التواصل معنا عبر البريد الإلكتروني أو الدردشة المباشرة.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box mt={8} textAlign="center">
          <Typography variant="h4" gutterBottom>
            ابدأ في تطوير أعمالك اليوم
          </Typography>
          <Typography color="text.secondary" paragraph>
            انضم إلى آلاف الشركات الناجحة التي تستخدم منصتنا لتحسين سمعتها وزيادة مبيعاتها
          </Typography>
          <Button variant="contained" color="primary" size="large">
            ابدأ الفترة التجريبية المجانية
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BusinessPage;
