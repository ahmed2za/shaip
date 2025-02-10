import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';
import styles from './Footer.module.css';

const categories = [
  { title: 'المطاعم', path: '/companies/restaurants' },
  { title: 'التسوق', path: '/companies/shopping' },
  { title: 'السيارات', path: '/companies/cars' },
  { title: 'العقارات', path: '/companies/real-estate' },
  { title: 'السياحة والسفر', path: '/companies/travel' },
];

const business = [
  { title: 'للشركات', path: '/business' },
  { title: 'أضف شركتك', path: '/business/add' },
  { title: 'الباقات والأسعار', path: '/business/pricing' },
  { title: 'الدعم الفني', path: '/support' },
];

const support = [
  { title: 'عن المنصة', path: '/about' },
  { title: 'سياسة الخصوصية', path: '/privacy' },
  { title: 'الشروط والأحكام', path: '/terms' },
  { title: 'الأسئلة الشائعة', path: '/faq' },
  { title: 'تواصل معنا', path: '/contact' },
];

const socialLinks = [
  { icon: <Facebook />, url: 'https://facebook.com' },
  { icon: <Twitter />, url: 'https://twitter.com' },
  { icon: <Instagram />, url: 'https://instagram.com' },
  { icon: <LinkedIn />, url: 'https://linkedin.com' },
  { icon: <YouTube />, url: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.logo}>
              LOGO
            </Typography>
            <Typography variant="body2" className={styles.description}>
              منصة رائدة في مجال تقييم الشركات والخدمات في المملكة العربية السعودية. نساعد المستهلكين في اتخاذ قرارات مستنيرة ونساعد الشركات في تحسين خدماتها.
            </Typography>
            <Box className={styles.social}>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>
              التصنيفات
            </Typography>
            <ul className={styles.linkList}>
              {categories.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>

          {/* Business */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>
              خدمات الأعمال
            </Typography>
            <ul className={styles.linkList}>
              {business.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.sectionTitle}>
              الدعم
            </Typography>
            <ul className={styles.linkList}>
              {support.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box className={styles.bottomBar}>
          <Typography variant="body2" className={styles.copyright}>
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </Typography>
          <Box className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className={styles.bottomLink}>
              الشروط والأحكام
            </Link>
          </Box>
        </Box>
      </Container>
    </footer>
  );
}
