import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

const teamMembers = [
  {
    name: 'أحمد محمد',
    position: 'المؤسس والرئيس التنفيذي',
    image: '/images/team/ceo.jpg',
    bio: 'خبرة 15 عاماً في مجال التكنولوجيا وريادة الأعمال',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
      email: 'ahmed@misdaqia.com',
    },
  },
  {
    name: 'سارة أحمد',
    position: 'مدير المنتج',
    image: '/images/team/product-manager.jpg',
    bio: 'متخصصة في تطوير المنتجات الرقمية وتحسين تجربة المستخدم',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
      email: 'sara@misdaqia.com',
    },
  },
  {
    name: 'محمد علي',
    position: 'مدير التطوير التقني',
    image: '/images/team/tech-lead.jpg',
    bio: 'مهندس برمجيات محترف مع خبرة في تطوير المنصات الضخمة',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
      email: 'mohamed@misdaqia.com',
    },
  },
  {
    name: 'نورا خالد',
    position: 'مدير خدمة العملاء',
    image: '/images/team/customer-service.jpg',
    bio: 'متخصصة في تحسين رضا العملاء وتطوير عمليات الدعم',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
      email: 'nora@misdaqia.com',
    },
  },
];

export default function TeamPage() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          فريق العمل
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          نحن فريق متكامل من الخبراء الملتزمين بتقديم أفضل تجربة لمستخدمينا
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={member.image}
                  alt={member.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {member.name}
                  </Typography>
                  <Typography gutterBottom color="primary">
                    {member.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {member.bio}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton href={member.social.linkedin} target="_blank" aria-label="linkedin">
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton href={member.social.twitter} target="_blank" aria-label="twitter">
                      <TwitterIcon />
                    </IconButton>
                    <IconButton href={`mailto:${member.social.email}`} aria-label="email">
                      <EmailIcon />
                    </IconButton>
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
