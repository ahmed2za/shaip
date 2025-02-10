import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQPage = () => {
  const faqs = [
    {
      question: 'ما هو موقع مصداقية؟',
      answer: 'مصداقية هو منصة تقييم الشركات في الشرق الأوسط، حيث يمكن للمستخدمين مشاركة تجاربهم وتقييماتهم للشركات المختلفة، مما يساعد المستهلكين على اتخاذ قرارات مستنيرة.'
    },
    {
      question: 'كيف يمكنني إضافة تقييم؟',
      answer: 'يمكنك إضافة تقييم من خلال تسجيل الدخول إلى حسابك، ثم البحث عن الشركة التي تريد تقييمها، والنقر على زر "إضافة تقييم". قم بملء النموذج بتجربتك وتقييمك للشركة.'
    },
    {
      question: 'هل يمكن للشركات الرد على التقييمات؟',
      answer: 'نعم، يمكن للشركات المسجلة في منصتنا الرد على تقييمات العملاء وتوضيح أي مشكلات أو ملاحظات.'
    },
    {
      question: 'كيف يتم التحقق من صحة التقييمات؟',
      answer: 'نستخدم مجموعة من الإجراءات للتحقق من صحة التقييمات، بما في ذلك التحقق من هوية المستخدمين ومراجعة المحتوى للتأكد من جودته وموثوقيته.'
    },
    {
      question: 'ماذا يحدث إذا وجدت تقييماً غير لائق؟',
      answer: 'يمكنك الإبلاغ عن أي تقييم غير لائق من خلال زر "الإبلاغ عن مشكلة". سيقوم فريقنا بمراجعة البلاغ واتخاذ الإجراء المناسب.'
    },
    {
      question: 'كيف يمكنني تسجيل شركتي في المنصة؟',
      answer: 'يمكنك تسجيل شركتك من خلال النقر على "للشركات" في القائمة العلوية، ثم اتباع خطوات التسجيل. سنقوم بالتحقق من معلومات شركتك قبل تفعيل الحساب.'
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        الأسئلة الشائعة
      </Typography>
      <Box sx={{ mt: 4 }}>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQPage;
