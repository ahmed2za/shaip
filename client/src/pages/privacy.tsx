import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Typography, Box, Paper } from '@mui/material';

const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>سياسة الخصوصية - مصداقية</title>
        <meta name="description" content="سياسة الخصوصية وحماية البيانات في منصة مصداقية" />
      </Head>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          سياسة الخصوصية
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Box component="section" sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              مقدمة
            </Typography>
            <Typography paragraph>
              نحن في مصداقية نلتزم بحماية خصوصية مستخدمينا. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.
            </Typography>
          </Box>

          <Box component="section" sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              المعلومات التي نجمعها
            </Typography>
            <Typography paragraph>
              نقوم بجمع المعلومات التالية:
            </Typography>
            <ul>
              <Typography component="li">معلومات الحساب (الاسم، البريد الإلكتروني)</Typography>
              <Typography component="li">معلومات التقييمات والمراجعات</Typography>
              <Typography component="li">معلومات تصفح الموقع</Typography>
              <Typography component="li">المعلومات التي تشاركها طواعية معنا</Typography>
            </ul>
          </Box>

          <Box component="section" sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              كيفية استخدام المعلومات
            </Typography>
            <Typography paragraph>
              نستخدم معلوماتك للأغراض التالية:
            </Typography>
            <ul>
              <Typography component="li">تقديم خدماتنا وتحسينها</Typography>
              <Typography component="li">التواصل معك بخصوص حسابك</Typography>
              <Typography component="li">تحسين تجربة المستخدم</Typography>
              <Typography component="li">حماية أمن وسلامة منصتنا</Typography>
            </ul>
          </Box>

          <Box component="section" sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              حماية المعلومات
            </Typography>
            <Typography paragraph>
              نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
            </Typography>
          </Box>

          <Box component="section" sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              مشاركة المعلومات
            </Typography>
            <Typography paragraph>
              لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
            </Typography>
            <ul>
              <Typography component="li">بموافقتك الصريحة</Typography>
              <Typography component="li">للامتثال للقوانين والأنظمة</Typography>
              <Typography component="li">لحماية حقوقنا القانونية</Typography>
            </ul>
          </Box>

          <Box component="section">
            <Typography variant="h5" gutterBottom>
              تحديثات السياسة
            </Typography>
            <Typography paragraph>
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على موقعنا.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Privacy;
