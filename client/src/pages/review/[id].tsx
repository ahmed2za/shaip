import { useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Head from 'next/head';
import Link from 'next/link';
import { mockCompanies } from '@/data/mockCompanies';
import CustomStarRating from '@/components/common/CustomStarRating';
import { ModernTextField, ModernButton, FormContainer } from '@/components/common/ModernFormElements';

interface Props {
  company: {
    id: string;
    name: string;
    logo: string;
  };
}

export default function WriteReview({ company }: Props) {
  const [rating, setRating] = useState<number | null>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    console.log({
      companyId: company.id,
      rating,
      title,
      content,
    });
    // For now, just redirect back to the company page
    window.location.href = `/company/${company.id}`;
  };

  return (
    <>
      <Head>
        <title>كتابة تقييم - {company.name} | مصداقية</title>
      </Head>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 4, direction: 'rtl' }}
          >
            <Link href="/" passHref>
              <MuiLink underline="hover" color="inherit">
                الرئيسية
              </MuiLink>
            </Link>
            <Link href={`/company/${company.id}`} passHref>
              <MuiLink underline="hover" color="inherit">
                {company.name}
              </MuiLink>
            </Link>
            <Typography color="text.primary">كتابة تقييم</Typography>
          </Breadcrumbs>

          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              }
            }}
          >
            {/* Company Info */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Avatar
                src={company.logo}
                alt={company.name}
                sx={{ 
                  width: 64, 
                  height: 64,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Box>
                <Typography variant="h5" gutterBottom>
                  كتابة تقييم لـ {company.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  شاركنا تجربتك مع {company.name}
                </Typography>
              </Box>
            </Stack>

            {/* Review Form */}
            <FormContainer>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    تقييمك العام
                  </Typography>
                  <CustomStarRating
                    value={rating || 0}
                    onChange={setRating}
                    readOnly={false}
                    size="large"
                    showValue
                  />
                </Box>

                <ModernTextField
                  fullWidth
                  label="عنوان التقييم"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="اكتب عنواناً موجزاً لتجربتك"
                />

                <ModernTextField
                  fullWidth
                  label="محتوى التقييم"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  multiline
                  rows={6}
                  placeholder="اكتب تجربتك بالتفصيل لمساعدة الآخرين في اتخاذ قرارهم"
                  helperText="يجب أن يكون التقييم موضوعياً وصادقاً"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <ModernButton
                    variant="outlined"
                    component={Link}
                    href={`/company/${company.id}`}
                  >
                    إلغاء
                  </ModernButton>
                  <ModernButton
                    type="submit"
                    variant="contained"
                    disabled={!rating || !title || !content}
                  >
                    نشر التقييم
                  </ModernButton>
                </Stack>
              </form>
            </FormContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const company = mockCompanies[id];

  if (!company) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      company: {
        id: company.id,
        name: company.name,
        logo: company.logo,
      },
    },
  };
};
