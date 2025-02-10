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
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';

const PricingPage = () => {
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

  const benefits = [
    {
      icon: <MonetizationOnIcon fontSize="large" />,
      title: 'توفير في التكاليف',
      description: 'وفر حتى 20% مع الاشتراك السنوي في أي من باقاتنا',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'ضمان استرداد الأموال',
      description: 'استرداد كامل المبلغ خلال 30 يوماً إذا لم تكن راضياً عن الخدمة',
    },
    {
      icon: <SupportIcon fontSize="large" />,
      title: 'دعم فني متميز',
      description: 'فريق دعم فني محترف متواجد على مدار الساعة لمساعدتك',
    },
  ];

  const additionalFeatures = [
    {
      title: 'تحليلات متقدمة',
      description: 'رؤى تفصيلية عن أداء شركتك ومنافسيك في السوق',
      items: [
        'تحليل اتجاهات السوق',
        'مقارنة مع المنافسين',
        'تقارير الأداء الشهرية',
        'توقعات مستقبلية',
      ],
    },
    {
      title: 'حماية متكاملة',
      description: 'حماية سمعة شركتك مع أدوات متقدمة لمكافحة الاحتيال',
      items: [
        'كشف المراجعات المزيفة',
        'حماية ضد الهجمات الممنهجة',
        'تنبيهات فورية',
        'تقارير أمنية',
      ],
    },
    {
      title: 'تكامل شامل',
      description: 'تكامل سلس مع جميع المنصات والأنظمة الخاصة بك',
      items: [
        'واجهة برمجة تطبيقات REST API',
        'تكامل مع وسائل التواصل الاجتماعي',
        'ربط مع أنظمة CRM',
        'تصدير البيانات التلقائي',
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom>
            اختر الباقة المناسبة لنمو أعمالك
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            باقات مرنة تناسب جميع أحجام الأعمال مع ميزة التوسع حسب احتياجاتك
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              icon={<CheckIcon />}
              label="تجربة مجانية لمدة 14 يوم"
              color="primary"
            />
            <Chip
              icon={<CheckIcon />}
              label="لا حاجة لبطاقة ائتمان"
              color="primary"
            />
          </Stack>
        </Box>

        {/* Benefits Section */}
        <Grid container spacing={4} mb={8}>
          {benefits.map((benefit, index) => (
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
                <Box sx={{ color: 'primary.main', mb: 2 }}>{benefit.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {benefit.title}
                </Typography>
                <Typography color="text.secondary">
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Pricing Cards */}
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

        {/* Additional Features */}
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          مميزات إضافية
        </Typography>
        <Grid container spacing={4} mt={4}>
          {additionalFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <List dense>
                    {feature.items.map((item, itemIndex) => (
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
                    ما هي طرق الدفع المتاحة؟
                  </Typography>
                  <Typography color="text.secondary">
                    نقبل جميع البطاقات الائتمانية الرئيسية، مدى، وApple Pay، بالإضافة إلى التحويل البنكي للباقات المؤسسية.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    هل أحتاج إلى بطاقة ائتمان للتسجيل في الباقة المجانية؟
                  </Typography>
                  <Typography color="text.secondary">
                    لا، يمكنك التسجيل في الباقة المجانية بدون الحاجة إلى بطاقة ائتمان والاستفادة من جميع مميزاتها.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingPage;
