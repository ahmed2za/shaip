import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Google as GoogleIcon,
  ContentCopy as ContentCopyIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';

interface GoogleIntegrationProps {
  companyId: string;
  companyName: string;
  rating: number;
  reviewCount: number;
}

export default function GoogleIntegration({
  companyId,
  companyName,
  rating,
  reviewCount,
}: GoogleIntegrationProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [googleAdsId, setGoogleAdsId] = useState('');
  const [merchantCenterId, setMerchantCenterId] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Generate schema markup for rich snippets
  const generateSchemaMarkup = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: companyName,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    };

    return JSON.stringify(schema, null, 2);
  };

  // Generate Google Seller Ratings code
  const generateGoogleSellerRatings = () => {
    return `<!-- Google Seller Ratings Integration -->
<script>
  window.renderOptIn = function() {
    window.gapi.load('surveyoptin', function() {
      window.gapi.surveyoptin.render({
        merchant_id: ${merchantCenterId},
        order_id: '', // Dynamic order ID
        email: '', // Dynamic customer email
        delivery_country: 'SA',
        estimated_delivery_date: '', // Dynamic delivery date
      });
    });
  }
</script>
<script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>`;
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Enable/Disable Integration */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">تكامل Google</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                />
              }
              label="تفعيل تكامل Google"
            />
            <Alert severity="info">
              يتيح لك هذا التكامل عرض تقييمات شركتك في نتائج بحث Google وإعلانات
              Google Ads
            </Alert>
          </Stack>
        </Paper>

        {isEnabled && (
          <>
            {/* Google Ads Integration */}
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">إعدادات Google Ads</Typography>
                <TextField
                  fullWidth
                  label="معرف Google Ads"
                  value={googleAdsId}
                  onChange={(e) => setGoogleAdsId(e.target.value)}
                  placeholder="مثال: AW-123456789"
                  helperText="أدخل معرف حساب Google Ads الخاص بك"
                />
                <TextField
                  fullWidth
                  label="معرف Merchant Center"
                  value={merchantCenterId}
                  onChange={(e) => setMerchantCenterId(e.target.value)}
                  placeholder="مثال: 12345"
                  helperText="أدخل معرف Google Merchant Center الخاص بك"
                />
                <Alert severity="success">
                  سيتم عرض تقييمك الحالي ({rating} من 5) في إعلانات Google Ads
                </Alert>
              </Stack>
            </Paper>

            {/* Rich Snippets */}
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Rich Snippets</Typography>
                <Alert severity="info">
                  أضف هذا الكود إلى صفحة شركتك لتحسين ظهورها في نتائج البحث
                </Alert>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <pre style={{ margin: 0, overflow: 'auto' }}>
                    {generateSchemaMarkup()}
                  </pre>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => navigator.clipboard.writeText(generateSchemaMarkup())}
                  >
                    نسخ
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Preview */}
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">معاينة</Typography>
                  <Button
                    startIcon={<PreviewIcon />}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'إخفاء المعاينة' : 'عرض المعاينة'}
                  </Button>
                </Stack>

                {showPreview && (
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                      {/* Search Result Preview */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              معاينة نتائج البحث
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                              <Typography
                                component="div"
                                sx={{ color: '#1a0dab', mb: 1 }}
                              >
                                {companyName} | الموقع الرسمي
                              </Typography>
                              <Typography
                                component="div"
                                sx={{ color: '#006621', mb: 1 }}
                              >
                                www.example.com › company
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#e7711b',
                                  }}
                                >
                                  {'★'.repeat(Math.floor(rating))}
                                  {rating % 1 > 0 && '½'}
                                  {'☆'.repeat(5 - Math.ceil(rating))}
                                </Box>
                                <Typography
                                  component="span"
                                  sx={{ ml: 1, color: '#666' }}
                                >
                                  تقييم: {rating} - ‏{reviewCount} مراجعة
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Google Ads Preview */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              معاينة Google Ads
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                              <Typography
                                component="div"
                                sx={{
                                  color: '#006621',
                                  fontSize: '0.8rem',
                                  mb: 1,
                                }}
                              >
                                إعلان
                              </Typography>
                              <Typography
                                component="div"
                                sx={{ color: '#1a0dab', mb: 1 }}
                              >
                                {companyName} | خدمات موثوقة
                              </Typography>
                              <Typography
                                component="div"
                                sx={{ color: '#006621', mb: 1 }}
                              >
                                www.example.com/ad
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GoogleIcon
                                  sx={{ fontSize: 16, mr: 1, color: '#666' }}
                                />
                                <Typography
                                  component="span"
                                  sx={{ color: '#666' }}
                                >
                                  تقييم البائع
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#e7711b',
                                    mx: 1,
                                  }}
                                >
                                  {'★'.repeat(Math.floor(rating))}
                                  {rating % 1 > 0 && '½'}
                                  {'☆'.repeat(5 - Math.ceil(rating))}
                                </Box>
                                <Typography
                                  component="span"
                                  sx={{ color: '#666' }}
                                >
                                  {rating}/5 · {reviewCount} مراجعة
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Integration Code */}
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">كود التكامل</Typography>
                <Alert severity="info">
                  أضف هذا الكود إلى صفحة إتمام الطلب لجمع تقييمات البائع
                </Alert>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <pre style={{ margin: 0, overflow: 'auto' }}>
                    {generateGoogleSellerRatings()}
                  </pre>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() =>
                      navigator.clipboard.writeText(generateGoogleSellerRatings())
                    }
                  >
                    نسخ
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </Box>
  );
}
