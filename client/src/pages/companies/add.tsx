import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Upload } from '@mui/icons-material';

const steps = ['معلومات الشركة الأساسية', 'معلومات الاتصال', 'الخدمات والمميزات', 'المراجعة والنشر'];

const industries = [
  'تقنية المعلومات',
  'التجارة الإلكترونية',
  'التعليم',
  'الصحة',
  'العقارات',
  'المطاعم',
  'السياحة والسفر',
  'الخدمات المالية',
  'أخرى',
];

export default function AddCompanyPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    logo: null,
    website: '',
    email: '',
    phone: '',
    address: '',
    services: '',
    workingHours: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // في الواقع، يجب إرسال البيانات إلى الخادم
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="اسم الشركة"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="مجال العمل"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="وصف الشركة"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                fullWidth
              >
                رفع شعار الشركة
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                />
              </Button>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الموقع الإلكتروني"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="البريد الإلكتروني"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="العنوان"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="الخدمات المقدمة"
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ساعات العمل"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="فيسبوك"
                value={formData.socialMedia.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="تويتر"
                value={formData.socialMedia.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, twitter: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              مراجعة المعلومات
            </Typography>
            <Typography paragraph>
              يرجى مراجعة جميع المعلومات التي تم إدخالها قبل النشر. بعد النشر، سيتم مراجعة المعلومات
              من قبل فريقنا قبل ظهورها على المنصة.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          أضف شركتك
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          أضف شركتك إلى منصة مصداقية واحصل على تقييمات وآراء عملائك
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {renderStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    السابق
                  </Button>
                )}
                <Button
                  variant="contained"
                  type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                  onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                >
                  {activeStep === steps.length - 1 ? 'نشر' : 'التالي'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
