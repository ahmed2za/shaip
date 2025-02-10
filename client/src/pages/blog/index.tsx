import { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { BookOutlined } from '@mui/icons-material';
import Head from 'next/head';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormat';

// Static blog posts data
const posts = [
  {
    id: '1',
    title: 'كيف تختار أفضل مطعم في مدينتك؟',
    content: 'في عالم المطاعم المتنوع، يمكن أن يكون اختيار المكان المناسب تحدياً. نقدم لك أهم النصائح لاختيار أفضل مطعم يناسب ذوقك وميزانيتك...',
    image: '/images/blog/restaurant-review.jpg',
    createdAt: '2025-02-08T14:30:00Z',
    category: 'مطاعم',
    author: {
      name: 'أحمد محمد',
      image: '/images/authors/ahmed.jpg'
    }
  },
  {
    id: '2',
    title: 'دليلك الشامل لشراء سيارة مستعملة',
    content: 'شراء سيارة مستعملة قرار مهم يحتاج إلى دراسة وتمحيص. في هذا المقال نستعرض أهم النقاط التي يجب مراعاتها قبل اتخاذ قرار الشراء...',
    image: '/images/blog/used-car.jpg',
    createdAt: '2025-02-07T10:15:00Z',
    category: 'سيارات',
    author: {
      name: 'سارة علي',
      image: '/images/authors/sara.jpg'
    }
  },
  {
    id: '3',
    title: 'أفضل 10 شركات تقنية ناشئة في 2025',
    content: 'نستعرض في هذا المقال أبرز الشركات التقنية الناشئة التي حققت نجاحات كبيرة في عام 2025، ونلقي الضوء على أهم إنجازاتها وابتكاراتها...',
    image: '/images/blog/tech-startups.jpg',
    createdAt: '2025-02-06T16:45:00Z',
    category: 'تقنية',
    author: {
      name: 'محمد خالد',
      image: '/images/authors/mohammed.jpg'
    }
  },
  {
    id: '4',
    title: 'نصائح لاختيار أفضل شركة عقارية',
    content: 'يعد اختيار شركة عقارية موثوقة أمراً حيوياً عند شراء أو استئجار عقار. نقدم لك أهم النصائح والمعايير التي تساعدك في اتخاذ القرار الصحيح...',
    image: '/images/blog/real-estate.jpg',
    createdAt: '2025-02-05T09:20:00Z',
    category: 'عقارات',
    author: {
      name: 'نورة سعد',
      image: '/images/authors/noura.jpg'
    }
  },
  {
    id: '5',
    title: 'كيف تقيم تجربة التسوق الإلكتروني؟',
    content: 'مع تزايد منصات التسوق الإلكتروني، أصبح من المهم معرفة كيفية تقييم تجربة التسوق بشكل موضوعي. إليك أهم النقاط التي يجب مراعاتها...',
    image: '/images/blog/ecommerce.jpg',
    createdAt: '2025-02-04T13:10:00Z',
    category: 'تسوق',
    author: {
      name: 'فهد عبدالله',
      image: '/images/authors/fahad.jpg'
    }
  },
  {
    id: '6',
    title: 'مستقبل التقييمات الإلكترونية',
    content: 'كيف ستتطور منصات التقييم في المستقبل؟ وما هو دور الذكاء الاصطناعي في تحسين تجربة المستخدم؟ نناقش هذه التساؤلات وأكثر...',
    image: '/images/blog/future-reviews.jpg',
    createdAt: '2025-02-03T11:25:00Z',
    category: 'تقنية',
    author: {
      name: 'ليلى أحمد',
      image: '/images/authors/layla.jpg'
    }
  }
];

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  category?: string;
  author?: {
    name: string;
    image: string;
  };
}

interface BlogPageProps {
  posts: BlogPost[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  // For now, we'll return static data instead of fetching from the database
  return {
    props: {
      posts,
    },
  };
};

const Blog: NextPage<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>المدونة - مراجعات وتقييمات الشركات</title>
        <meta
          name="description"
          content="مقالات ونصائح حول تقييم الشركات وأفضل الممارسات في عالم الأعمال"
        />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <BookOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              المدونة
            </Typography>
            <Typography variant="h6" color="text.secondary">
              مقالات ونصائح حول تقييم الشركات وأفضل الممارسات في عالم الأعمال
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Link href={`/blog/${post.id}`} passHref style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image || '/blog-placeholder.jpg'}
                      alt={post.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      {post.category && (
                        <Chip
                          label={post.category}
                          size="small"
                          color="primary"
                          sx={{ mb: 2 }}
                        />
                      )}
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.content}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        {post.author && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              src={post.author.image || 'https://www.gravatar.com/avatar/?d=mp'}
                              alt={post.author.name}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {post.author.name}
                            </Typography>
                          </Stack>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Blog;
