import React from 'react';
import Layout from '@/components/Layout';
import { Container, Typography, Paper, Box } from '@mui/material';

export default function Terms() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            شروط الاستخدام
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              1. مقدمة
            </Typography>
            <Typography paragraph>
              مرحباً بكم في منصتنا. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              2. حسابات المستخدمين
            </Typography>
            <Typography paragraph>
              - يجب أن تكون جميع المعلومات المقدمة عند إنشاء الحساب دقيقة وصحيحة
              - أنت مسؤول عن الحفاظ على سرية معلومات حسابك
              - يحق لنا إنهاء أو تعليق حسابك في حالة مخالفة الشروط
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              3. الخدمات المقدمة
            </Typography>
            <Typography paragraph>
              - نقدم منصة للربط بين الشركات والعملاء
              - نحن نسعى لتقديم أفضل تجربة ممكنة لمستخدمينا
              - نحتفظ بالحق في تعديل أو إيقاف الخدمات في أي وقت
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              4. حقوق الملكية الفكرية
            </Typography>
            <Typography paragraph>
              - جميع المحتويات والمواد على المنصة محمية بموجب حقوق الملكية الفكرية
              - لا يجوز نسخ أو توزيع أي محتوى دون إذن كتابي
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              5. الخصوصية والبيانات
            </Typography>
            <Typography paragraph>
              - نحن نحترم خصوصية مستخدمينا ونلتزم بحماية بياناتهم
              - يمكنك الاطلاع على سياسة الخصوصية الخاصة بنا للمزيد من المعلومات
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              6. التعديلات على الشروط
            </Typography>
            <Typography paragraph>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}
