import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const footerSections = [
  {
    title: 'عن مصداقية',
    links: [
      { text: 'من نحن', href: '/about' },
      { text: 'فريق العمل', href: '/team' },
      { text: 'الوظائف', href: '/careers' },
      { text: 'اتصل بنا', href: '/contact' },
    ],
  },
  {
    title: 'للشركات',
    links: [
      { text: 'أضف شركتك', href: '/companies/add' },
      { text: 'الباقات والأسعار', href: '/pricing' },
      { text: 'الشروط والأحكام', href: '/terms' },
    ],
  },
  {
    title: 'المساعدة',
    links: [
      { text: 'الأسئلة الشائعة', href: '/faq' },
      { text: 'سياسة الخصوصية', href: '/privacy' },
      { text: 'الإبلاغ عن مشكلة', href: '/report' },
      { text: 'دليل الاستخدام', href: '/guide' },
    ],
  },
];

const socialLinks = [
  { icon: <FacebookIcon />, href: 'https://facebook.com/misdaqia', color: '#3b5998' },
  { icon: <TwitterIcon />, href: 'https://twitter.com/misdaqia', color: '#1da1f2' },
  { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/misdaqia', color: '#0077b5' },
  { icon: <InstagramIcon />, href: 'https://instagram.com/misdaqia', color: '#e4405f' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        pt: 6,
        pb: 3,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and About */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Image src="/logo.png" alt="مصداقية" width={150} height={50} />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              مصداقية هي منصة تقييم الشركات الرائدة في الشرق الأوسط. نساعد المستهلكين على اتخاذ قرارات مستنيرة من خلال تقييمات وآراء حقيقية.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: link.color }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography
                variant="h6"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <Stack spacing={2}>
                {section.links.map((link) => (
                  <Link key={link.text} href={link.href} passHref>
                    <MuiLink
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {link.text}
                    </MuiLink>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} مصداقية. جميع الحقوق محفوظة
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" passHref>
              <MuiLink variant="body2" color="text.secondary">
                سياسة الخصوصية
              </MuiLink>
            </Link>
            <Link href="/terms" passHref>
              <MuiLink variant="body2" color="text.secondary">
                الشروط والأحكام
              </MuiLink>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
