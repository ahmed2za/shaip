import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  Comment as CommentIcon,
  Star as RatingIcon,
  AddPhotoAlternate as PhotoIcon,
  Business as CompanyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompanyQuickActions() {
  const navigate = useNavigate();
  const [profileDialog, setProfileDialog] = React.useState(false);
  const [latestComments, setLatestComments] = React.useState([]);
  const [latestRatings, setLatestRatings] = React.useState([]);
  const [analytics, setAnalytics] = React.useState([]);
  const [companyProfile, setCompanyProfile] = React.useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    workingHours: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
    },
  });

  React.useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      // Fetch latest comments
      const commentsResponse = await fetch('/api/company/comments/latest');
      const commentsData = await commentsResponse.json();
      setLatestComments(commentsData);

      // Fetch latest ratings
      const ratingsResponse = await fetch('/api/company/ratings/latest');
      const ratingsData = await ratingsResponse.json();
      setLatestRatings(ratingsData);

      // Fetch company profile
      const profileResponse = await fetch('/api/company/profile');
      const profileData = await profileResponse.json();
      setCompanyProfile(profileData);

      // Fetch analytics data
      const analyticsResponse = await fetch('/api/company/analytics');
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProfileSave = async () => {
    try {
      await fetch('/api/company/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyProfile),
      });
      setProfileDialog(false);
      fetchLatestData();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCommentReply = async (commentId: string, reply: string) => {
    try {
      await fetch(`/api/company/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply }),
      });
      fetchLatestData();
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>لوحة التحكم</Typography>
      
      <Grid container spacing={3}>
        {/* Analytics Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              إحصائيات الزيارات والتقييمات
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="views"
                  stroke="#8884d8"
                  name="الزيارات"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ratings"
                  stroke="#82ca9d"
                  name="التقييمات"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Action Buttons */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">الملف التعريفي</Typography>
              <Typography variant="body2" color="text.secondary">
                تحديث معلومات الشركة
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<CompanyIcon />}
                onClick={() => setProfileDialog(true)}
                fullWidth
              >
                تعديل
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">معرض الصور</Typography>
              <Typography variant="body2" color="text.secondary">
                إدارة صور الشركة
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<PhotoIcon />}
                onClick={() => navigate('/company/gallery')}
                fullWidth
              >
                إدارة
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">التقييمات</Typography>
              <Typography variant="body2" color="text.secondary">
                عرض وإدارة التقييمات
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<RatingIcon />}
                onClick={() => navigate('/company/ratings')}
                fullWidth
              >
                عرض
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">الإعلانات</Typography>
              <Typography variant="body2" color="text.secondary">
                إدارة إعلانات الشركة
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<EditIcon />}
                onClick={() => navigate('/company/ads')}
                fullWidth
              >
                إدارة
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Latest Comments Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              أحدث التعليقات
            </Typography>
            <List>
              {latestComments.map((comment: any) => (
                <React.Fragment key={comment._id}>
                  <ListItem>
                    <ListItemText
                      primary={comment.content}
                      secondary={`${comment.user.name} - ${new Date(comment.createdAt).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          const reply = prompt('أدخل ردك على التعليق:');
                          if (reply) {
                            handleCommentReply(comment._id, reply);
                          }
                        }}
                      >
                        <CommentIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {comment.reply && (
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText
                        secondary={`ردك: ${comment.reply}`}
                      />
                    </ListItem>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Latest Ratings Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              أحدث التقييمات
            </Typography>
            <List>
              {latestRatings.map((rating: any) => (
                <React.Fragment key={rating._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${rating.rating} نجوم`}
                      secondary={`${rating.user.name} - ${new Date(rating.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Company Profile Dialog */}
      <Dialog
        open={profileDialog}
        onClose={() => setProfileDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>تعديل الملف التعريفي</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="اسم الشركة"
                  value={companyProfile.name}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="وصف الشركة"
                  value={companyProfile.description}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="العنوان"
                  value={companyProfile.address}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  value={companyProfile.phone}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="البريد الإلكتروني"
                  value={companyProfile.email}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="الموقع الإلكتروني"
                  value={companyProfile.website}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  مواقع التواصل الاجتماعي
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="فيسبوك"
                  value={companyProfile.socialMedia.facebook}
                  onChange={(e) => setCompanyProfile({
                    ...companyProfile,
                    socialMedia: { ...companyProfile.socialMedia, facebook: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="تويتر"
                  value={companyProfile.socialMedia.twitter}
                  onChange={(e) => setCompanyProfile({
                    ...companyProfile,
                    socialMedia: { ...companyProfile.socialMedia, twitter: e.target.value }
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  ساعات العمل
                </Typography>
              </Grid>
              {Object.entries(companyProfile.workingHours).map(([day, hours]) => (
                <Grid item xs={12} md={6} key={day}>
                  <TextField
                    fullWidth
                    label={day}
                    value={hours}
                    onChange={(e) => setCompanyProfile({
                      ...companyProfile,
                      workingHours: { ...companyProfile.workingHours, [day]: e.target.value }
                    })}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>إلغاء</Button>
          <Button onClick={handleProfileSave} variant="contained">
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
