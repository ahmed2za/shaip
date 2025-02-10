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
  IconButton,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Comment as CommentIcon,
  Star as RatingIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

const QuickActions = () => {
  const router = useRouter();
  const [settingsDialog, setSettingsDialog] = React.useState(false);
  const [latestComments, setLatestComments] = React.useState([]);
  const [latestRatings, setLatestRatings] = React.useState([]);
  const [siteSettings, setSiteSettings] = React.useState({
    siteName: '',
    siteDescription: '',
    privacyPolicy: '',
    aboutUs: '',
    pricing: '',
    homeImages: [],
  });

  React.useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      // Fetch latest comments
      const commentsResponse = await fetch('/api/admin/comments/latest');
      const commentsData = await commentsResponse.json();
      setLatestComments(commentsData);

      // Fetch latest ratings
      const ratingsResponse = await fetch('/api/admin/ratings/latest');
      const ratingsData = await ratingsResponse.json();
      setLatestRatings(ratingsData);

      // Fetch site settings
      const settingsResponse = await fetch('/api/admin/settings');
      const settingsData = await settingsResponse.json();
      setSiteSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSettingsSave = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      });
      setSettingsDialog(false);
      fetchLatestData();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleCommentApproval = async (commentId: string, approved: boolean) => {
    try {
      await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });
      fetchLatestData();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>إجراءات سريعة</Typography>
      
      <Grid container spacing={3}>
        {/* Quick Action Buttons */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">إضافة شركة</Typography>
              <Typography variant="body2" color="text.secondary">
                إضافة شركة جديدة إلى النظام
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<AddIcon />}
                onClick={() => router.push('/admin/companies/add')}
                fullWidth
              >
                إضافة
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">إدارة المستخدمين</Typography>
              <Typography variant="body2" color="text.secondary">
                إدارة حسابات المستخدمين
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<EditIcon />}
                onClick={() => router.push('/admin/users')}
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
              <Typography variant="h6">مراجعة التقييمات</Typography>
              <Typography variant="body2" color="text.secondary">
                مراجعة وإدارة تقييمات المستخدمين
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<RatingIcon />}
                onClick={() => router.push('/admin/ratings')}
                fullWidth
              >
                مراجعة
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">إعدادات الموقع</Typography>
              <Typography variant="body2" color="text.secondary">
                تعديل إعدادات ومحتوى الموقع
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SettingsIcon />}
                onClick={() => setSettingsDialog(true)}
                fullWidth
              >
                تعديل
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
                      <Button
                        color="success"
                        size="small"
                        onClick={() => handleCommentApproval(comment._id, true)}
                      >
                        موافقة
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleCommentApproval(comment._id, false)}
                      >
                        رفض
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
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
                      primary={`${rating.rating} نجوم - ${rating.company.name}`}
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

      {/* Site Settings Dialog */}
      <Dialog
        open={settingsDialog}
        onClose={() => setSettingsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>إعدادات الموقع</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="اسم الموقع"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="وصف الموقع"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="سياسة الخصوصية"
                  value={siteSettings.privacyPolicy}
                  onChange={(e) => setSiteSettings({ ...siteSettings, privacyPolicy: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="من نحن"
                  value={siteSettings.aboutUs}
                  onChange={(e) => setSiteSettings({ ...siteSettings, aboutUs: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="الأسعار"
                  value={siteSettings.pricing}
                  onChange={(e) => setSiteSettings({ ...siteSettings, pricing: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>إلغاء</Button>
          <Button onClick={handleSettingsSave} variant="contained">
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { QuickActions };
