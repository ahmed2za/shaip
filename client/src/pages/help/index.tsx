import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArticleIcon from '@mui/icons-material/Article';

const faqCategories = [
  {
    title: 'التسجيل والحساب',
    questions: [
      {
        question: 'كيف يمكنني إنشاء حساب جديد؟',
        answer: 'يمكنك إنشاء حساب جديد بالنقر على زر "تسجيل" في أعلى الصفحة، ثم اتباع الخطوات البسيطة لإدخال معلوماتك الأساسية أو التسجيل باستخدام حساب Google أو Facebook.',
      },
      {
        question: 'نسيت كلمة المرور، ماذا أفعل؟',
        answer: 'يمكنك استعادة كلمة المرور بالنقر على رابط "نسيت كلمة المرور؟" في صفحة تسجيل الدخول. سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
      },
    ],
  },
  {
    title: 'الشركات والتقييمات',
    questions: [
      {
        question: 'كيف يمكنني إضافة شركتي؟',
        answer: 'يمكنك إضافة شركتك من خلال النقر على "أضف شركتك" في القائمة الرئيسية، ثم ملء النموذج بمعلومات شركتك الأساسية.',
      },
      {
        question: 'كيف يتم التحقق من التقييمات؟',
        answer: 'نقوم بمراجعة جميع التقييمات للتأكد من مصداقيتها وتوافقها مع معايير المنصة قبل نشرها.',
      },
    ],
  },
  {
    title: 'الدفع والاشتراكات',
    questions: [
      {
        question: 'ما هي طرق الدفع المتاحة؟',
        answer: 'نقبل الدفع عبر البطاقات الائتمانية (Visa/Mastercard)، مدى، وApple Pay.',
      },
      {
        question: 'كيف يمكنني إلغاء اشتراكي؟',
        answer: 'يمكنك إلغاء اشتراكك في أي وقت من خلال الذهاب إلى إعدادات حسابك > الاشتراكات > إلغاء الاشتراك.',
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          مركز المساعدة
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          كيف يمكننا مساعدتك اليوم؟
        </Typography>

        {/* Search Section */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ابحث عن سؤال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        {/* Quick Links */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  دليل الاستخدام
                </Typography>
                <Typography color="text.secondary" paragraph>
                  تعرف على كيفية استخدام جميع ميزات المنصة
                </Typography>
                <Button variant="outlined">اقرأ الدليل</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <HelpOutlineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  الأسئلة الشائعة
                </Typography>
                <Typography color="text.secondary" paragraph>
                  إجابات على الأسئلة الأكثر شيوعاً
                </Typography>
                <Button variant="outlined">استعرض الأسئلة</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SupportAgentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  الدعم الفني
                </Typography>
                <Typography color="text.secondary" paragraph>
                  تواصل مع فريق الدعم الفني على مدار الساعة
                </Typography>
                <Button variant="outlined">اتصل بنا</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAQ Sections */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            الأسئلة الشائعة
          </Typography>
          {faqCategories.map((category, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                {category.title}
              </Typography>
              {category.questions.map((faq, faqIndex) => (
                <Accordion key={faqIndex}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>

        {/* Contact Support */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            لم تجد ما تبحث عنه؟
          </Typography>
          <Typography color="text.secondary" paragraph>
            فريق الدعم الفني متاح على مدار الساعة لمساعدتك
          </Typography>
          <Button variant="contained" size="large">
            تواصل مع الدعم الفني
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
