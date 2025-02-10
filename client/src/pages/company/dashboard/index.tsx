import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Star as StarIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions } from '@/utils/chartConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from '@/lib/supabase';
import { TrustStars } from '@/components/common/TrustStars';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// تسجيل مكونات الرسم البياني
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Profile {
  name: string;
  avatar_url: string;
}

interface ReviewResponse {
  content: string;
  created_at: string;
}

interface ReviewData {
  id: string;
  profiles: Profile;
  review_responses: ReviewResponse[];
  [key: string]: any;  // for other properties
}

interface ProcessedReview {
  user: {
    name: string;
    avatar_url: string;
  };
  response?: ReviewResponse;
  [key: string]: any;
}

interface CompanyStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  responseRate: number;
  monthlyStats: {
    labels: string[];
    reviews: number[];
    ratings: number[];
  };
}

export default function CompanyDashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<ProcessedReview[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // جلب إحصائيات الشركة
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating, created_at')
        .eq('company_id', user?.id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // حساب الإحصائيات
      const totalReviews = reviewsData.length;
      const averageRating = reviewsData.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
      
      // توزيع التقييمات
      const ratingDistribution = reviewsData.reduce((acc: { [key: number]: number }, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {});

      // الإحصائيات الشهرية
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('ar', { month: 'short' });
      }).reverse();

      const monthlyStats = reviewsData.reduce(
        (acc: { reviews: number[]; ratings: number[] }, review) => {
          const reviewDate = new Date(review.created_at);
          const monthIndex = last6Months.findIndex(
            (month) =>
              month === reviewDate.toLocaleString('ar', { month: 'short' })
          );
          if (monthIndex !== -1) {
            acc.reviews[monthIndex]++;
            acc.ratings[monthIndex] += review.rating;
          }
          return acc;
        },
        { reviews: Array(6).fill(0), ratings: Array(6).fill(0) }
      );

      // حساب معدل الرد
      const { count } = await supabase
        .from('review_responses')
        .select('*', { count: 'exact' })
        .eq('company_id', user?.id);

      const responseRate = (count || 0) / totalReviews * 100;

      setStats({
        totalReviews,
        averageRating,
        ratingDistribution,
        responseRate,
        monthlyStats: {
          labels: last6Months,
          reviews: monthlyStats.reviews,
          ratings: monthlyStats.ratings.map(
            (total, i) =>
              monthlyStats.reviews[i] ? total / monthlyStats.reviews[i] : 0
          ),
        },
      });

      // جلب آخر التقييمات
      const { data: recentReviewsData, error: recentError } = await supabase
        .from('reviews')
        .select('*, profiles(name, avatar_url), review_responses(*)')
        .eq('company_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setRecentReviews(
        (recentReviewsData as ReviewData[]).map((review): ProcessedReview => ({
          ...review,
          user: {
            name: review.profiles.name,
            avatar_url: review.profiles.avatar_url,
          },
          response: review.review_responses[0],
        }))
      );
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const handleReplyToReview = async (reviewId: string, content: string) => {
    try {
      const { error } = await supabase.from('review_responses').insert({
        review_id: reviewId,
        company_id: user?.id,
        content,
      });

      if (error) throw error;

      toast.success('تم إضافة الرد بنجاح');
      fetchDashboardData();
    } catch (error) {
      console.error('Error replying to review:', error);
      toast.error('حدث خطأ أثناء إضافة الرد');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* الإحصائيات العامة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                التقييم العام
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrustStars rating={stats?.averageRating || 0} size="large" />
                <Typography variant="h4">
                  {stats?.averageRating.toFixed(1)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                عدد التقييمات
              </Typography>
              <Typography variant="h4">{stats?.totalReviews}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معدل الرد
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={stats?.responseRate || 0}
                  size={40}
                />
                <Typography variant="h4">
                  {Math.round(stats?.responseRate || 0)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الزيارات
              </Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* التبويبات */}
      <Card sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="نظرة عامة" />
          <Tab label="التقييمات" />
          <Tab label="الإحصائيات" />
        </Tabs>

        <CardContent>
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Grid container spacing={3}>
                  {/* الرسم البياني للتقييمات */}
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          تطور التقييمات
                        </Typography>
                        <Line
                          data={{
                            labels: stats?.monthlyStats.labels,
                            datasets: [
                              {
                                label: 'متوسط التقييم',
                                data: stats?.monthlyStats.ratings,
                                borderColor: theme.palette.primary.main,
                                tension: 0.4,
                              },
                            ],
                          }}
                          options={defaultChartOptions}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* توزيع التقييمات */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          توزيع التقييمات
                        </Typography>
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = stats?.ratingDistribution[rating] || 0;
                          const percentage =
                            (count / (stats?.totalReviews || 1)) * 100;
                          return (
                            <Box key={rating} sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 0.5,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <StarIcon
                                    sx={{
                                      color: theme.palette.warning.main,
                                      mr: 0.5,
                                    }}
                                  />
                                  <Typography>{rating}</Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ ml: 'auto' }}
                                >
                                  {count} ({percentage.toFixed(1)}%)
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: theme.palette.grey[200],
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    bgcolor:
                                      rating > 3
                                        ? theme.palette.success.main
                                        : rating > 2
                                        ? theme.palette.warning.main
                                        : theme.palette.error.main,
                                  },
                                }}
                              />
                            </Box>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* آخر التقييمات */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      آخر التقييمات
                    </Typography>
                    <List>
                      {recentReviews.map((review) => (
                        <ListItem
                          key={review.id}
                          alignItems="flex-start"
                          sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '&:last-child': {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={review.user.avatar_url}>
                              {review.user.name[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {review.user.name}
                                </Typography>
                                <TrustStars rating={review.rating} size="small" />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {review.title}
                                </Typography>
                                <Typography variant="body2">
                                  {review.content}
                                </Typography>
                                {review.response && (
                                  <Box
                                    sx={{
                                      mt: 1,
                                      p: 1,
                                      bgcolor: 'action.hover',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      <strong>ردك:</strong> {review.response.content}
                                    </Typography>
                                  </Box>
                                )}
                              </>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {!review.response && (
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleReplyToReview(review.id, 'شكراً على تقييمك')
                                }
                              >
                                <ReplyIcon />
                              </IconButton>
                            )}
                            <IconButton color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* محتوى التقييمات */}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* محتوى الإحصائيات */}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Container>
  );
}
