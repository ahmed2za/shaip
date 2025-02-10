import { Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, Rating } from '@mui/material';
import { useState } from 'react';
import {
  Star as RatingIcon,
  Message as ReviewIcon,
  Edit as EditIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

export default function CompanyDashboard() {
  const [companyStats] = useState({
    averageRating: 4.2,
    totalReviews: 48,
    pendingResponses: 3,
    lastUpdated: '2024-02-09'
  });

  const [recentReviews] = useState([
    {
      id: 1,
      rating: 4,
      comment: "خدمة ممتازة وسرعة في التنفيذ",
      date: "منذ يومين"
    },
    {
      id: 2,
      rating: 5,
      comment: "تجربة رائعة مع الشركة",
      date: "منذ 3 أيام"
    },
    {
      id: 3,
      rating: 3,
      comment: "خدمة جيدة ولكن تحتاج لبعض التحسينات",
      date: "منذ أسبوع"
    }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>لوحة تحكم الشركة</Typography>
      
      {/* إحصائيات الشركة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <RatingIcon sx={{ mb: 1 }} />
            <Typography variant="h6">{companyStats.averageRating}</Typography>
            <Typography color="textSecondary">متوسط التقييم</Typography>
            <Rating value={companyStats.averageRating} readOnly size="small" sx={{ mt: 1 }} />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <ReviewIcon sx={{ mb: 1 }} />
            <Typography variant="h6">{companyStats.totalReviews}</Typography>
            <Typography color="textSecondary">إجمالي التقييمات</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <NotificationIcon sx={{ mb: 1 }} />
            <Typography variant="h6">{companyStats.pendingResponses}</Typography>
            <Typography color="textSecondary">تقييمات تنتظر الرد</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <EditIcon sx={{ mb: 1 }} />
            <Typography variant="h6">{companyStats.lastUpdated}</Typography>
            <Typography color="textSecondary">آخر تحديث للمعلومات</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* الإجراءات وآخر التقييمات */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>إجراءات سريعة</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained">تحديث معلومات الشركة</Button>
              <Button variant="contained">الرد على التقييمات</Button>
              <Button variant="contained">إضافة عروض</Button>
              <Button variant="contained">تحليلات التقييمات</Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>آخر التقييمات</Typography>
            <List>
              {recentReviews.map(review => (
                <ListItem key={review.id}>
                  <ListItemText 
                    primary={review.comment}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption">{review.date}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
