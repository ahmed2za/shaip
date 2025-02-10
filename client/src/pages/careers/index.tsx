import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const jobs = [
  {
    title: 'مطور واجهات أمامية',
    department: 'تطوير البرمجيات',
    location: 'الرياض، السعودية',
    type: 'دوام كامل',
    experience: '3-5 سنوات',
    description: 'نبحث عن مطور واجهات أمامية متميز للانضمام إلى فريقنا التقني',
    requirements: [
      'خبرة في React.js و Next.js',
      'معرفة جيدة بـ TypeScript',
      'خبرة في تطوير واجهات المستخدم التفاعلية',
      'فهم جيد لمبادئ UX/UI',
    ],
  },
  {
    title: 'مدير تسويق رقمي',
    department: 'التسويق',
    location: 'جدة، السعودية',
    type: 'دوام كامل',
    experience: '5-7 سنوات',
    description: 'نبحث عن مدير تسويق رقمي لقيادة استراتيجيتنا التسويقية',
    requirements: [
      'خبرة في إدارة حملات التسويق الرقمي',
      'معرفة بأدوات التحليل والقياس',
      'مهارات قيادية قوية',
      'خبرة في تسويق المنتجات B2B',
    ],
  },
  {
    title: 'أخصائي خدمة عملاء',
    department: 'خدمة العملاء',
    location: 'الدمام، السعودية',
    type: 'دوام كامل',
    experience: '2-4 سنوات',
    description: 'نبحث عن أخصائي خدمة عملاء للمساعدة في تقديم دعم متميز لعملائنا',
    requirements: [
      'خبرة في خدمة العملاء',
      'مهارات تواصل ممتازة',
      'القدرة على العمل تحت الضغط',
      'إجادة اللغتين العربية والإنجليزية',
    ],
  },
];

export default function CareersPage() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          الوظائف المتاحة
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          انضم إلى فريقنا وساهم في تطوير أكبر منصة لتقييم الشركات في الشرق الأوسط
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {jobs.map((job, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WorkIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{job.department}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{job.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{job.experience}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip label={job.type} color="primary" />
                  </Box>

                  <Typography paragraph>{job.description}</Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    المتطلبات:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {job.requirements.map((req, idx) => (
                      <Typography component="li" key={idx} paragraph>
                        {req}
                      </Typography>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary">
                      تقدم للوظيفة
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
