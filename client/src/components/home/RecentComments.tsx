import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  company: {
    id: number;
    name: string;
    logo: string;
  };
  rating: number;
  content: string;
  createdAt: string;
}

const RecentComments = () => {
  // بيانات افتراضية للتعليقات
  const comments: Comment[] = [
    {
      id: 1,
      user: {
        id: 1,
        name: "أحمد محمد",
        avatar: "/avatars/user1.jpg"
      },
      company: {
        id: 1,
        name: "شركة الاتصالات السعودية",
        logo: "/logos/stc.png"
      },
      rating: 4.5,
      content: "خدمة ممتازة وسرعة في الاستجابة للطلبات. أنصح بالتعامل معهم.",
      createdAt: "2025-02-09T20:15:00Z"
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "سارة أحمد",
        avatar: "/avatars/user2.jpg"
      },
      company: {
        id: 2,
        name: "أمازون السعودية",
        logo: "/logos/amazon.png"
      },
      rating: 5,
      content: "تجربة تسوق رائعة وتوصيل سريع للمنتجات. سأتعامل معهم مرة أخرى.",
      createdAt: "2025-02-09T19:30:00Z"
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "محمد علي",
        avatar: "/avatars/user3.jpg"
      },
      company: {
        id: 3,
        name: "نون",
        logo: "/logos/noon.png"
      },
      rating: 3.5,
      content: "الخدمة جيدة بشكل عام ولكن هناك مجال للتحسين في خدمة العملاء.",
      createdAt: "2025-02-09T18:45:00Z"
    }
  ];

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'primary.main'
            }}
          >
            آخر التقييمات
          </Typography>

          <Grid container spacing={3}>
            {comments.map((comment, index) => (
              <Grid item xs={12} key={comment.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Link href={`/company/${comment.company.id}`} passHref style={{ textDecoration: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Avatar sx={{ width: 50, height: 50, mr: 2 }}>
                              <Image
                                src={comment.company.logo}
                                alt={comment.company.name}
                                width={50}
                                height={50}
                              />
                            </Avatar>
                            <Typography variant="h6" color="primary">
                              {comment.company.name}
                            </Typography>
                          </Box>
                        </Link>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Link href={`/user/${comment.user.id}`} passHref style={{ textDecoration: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              sx={{ width: 40, height: 40, mr: 1 }}
                            />
                            <Typography variant="subtitle1" color="text.primary">
                              {comment.user.name}
                            </Typography>
                          </Box>
                        </Link>
                        <Box sx={{ ml: 'auto' }}>
                          <Rating
                            value={comment.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#00b67a',
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      <Typography variant="body1" paragraph>
                        {comment.content}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default RecentComments;
