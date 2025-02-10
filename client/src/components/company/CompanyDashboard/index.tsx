import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Star as StarIcon,
  Message as MessageIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  response?: string;
}

interface CompanyInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  category: string;
}

export default function CompanyDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    pendingResponses: 0,
    lastUpdated: ''
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    category: ''
  });

  const [editForm, setEditForm] = useState(companyInfo);

  useEffect(() => {
    fetchStats();
    fetchCompanyInfo();
    fetchReviews();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/company/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch stats');
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company/profile');
      const data = await response.json();
      setCompanyInfo(data);
      setEditForm(data);
    } catch (err) {
      setError('Failed to fetch company info');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/company/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditCompanyInfo = () => {
    setEditForm(companyInfo);
    setEditDialogOpen(true);
  };

  const handleSaveCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const updatedInfo = await response.json();
        setCompanyInfo(updatedInfo);
        setEditDialogOpen(false);
        fetchStats(); // Refresh stats after update
      }
    } catch (err) {
      setError('Failed to update company info');
    }
  };

  const handleRespondToReview = async (reviewId: string, content: string) => {
    try {
      const response = await fetch(`/api/company/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? updatedReview
            : review
        ));
        fetchStats(); // Refresh stats after responding
      }
    } catch (err) {
      setError('Failed to respond to review');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>لوحة تحكم الشركة</Typography>

      {/* إحصائيات سريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">{stats.averageRating}</Typography>
              </Box>
              <Typography color="textSecondary">متوسط التقييم</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MessageIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">{stats.totalReviews}</Typography>
              </Box>
              <Typography color="textSecondary">إجمالي التقييمات</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimelineIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">{stats.pendingResponses}</Typography>
              </Box>
              <Typography color="textSecondary">تقييمات تنتظر الرد</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">{stats.lastUpdated}</Typography>
              </Box>
              <Typography color="textSecondary">آخر تحديث</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* التبويبات */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="معلومات الشركة" />
            <Tab label="التقييمات" />
            <Tab label="الإحصائيات" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">معلومات الشركة</Typography>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={handleEditCompanyInfo}
                >
                  تعديل المعلومات
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary">الاسم</Typography>
                  <Typography paragraph>{companyInfo.name}</Typography>

                  <Typography variant="subtitle1" color="primary">الوصف</Typography>
                  <Typography paragraph>{companyInfo.description}</Typography>

                  <Typography variant="subtitle1" color="primary">العنوان</Typography>
                  <Typography paragraph>{companyInfo.address}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary">رقم الهاتف</Typography>
                  <Typography paragraph>{companyInfo.phone}</Typography>

                  <Typography variant="subtitle1" color="primary">البريد الإلكتروني</Typography>
                  <Typography paragraph>{companyInfo.email}</Typography>

                  <Typography variant="subtitle1" color="primary">الموقع الإلكتروني</Typography>
                  <Typography paragraph>{companyInfo.website}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <List>
            {reviews.map((review) => (
              <ListItem
                key={review.id}
                alignItems="flex-start"
                sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 1 }}
              >
                <ListItemAvatar>
                  <Avatar>{review.userName[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{review.userName}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', my: 1 }}
                      >
                        {review.content}
                      </Typography>
                      {review.response ? (
                        <Typography variant="body2" color="text.secondary">
                          ردك: {review.response}
                        </Typography>
                      ) : (
                        <Button size="small" color="primary" onClick={() => handleRespondToReview(review.id, '')}>
                          رد على التقييم
                        </Button>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* يمكن إضافة رسوم بيانية وإحصائيات هنا */}
          <Typography>قريباً: رسوم بيانية وتحليلات متقدمة</Typography>
        </TabPanel>
      </Box>

      {/* نافذة تعديل معلومات الشركة */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>تعديل معلومات الشركة</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="اسم الشركة"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <TextField
              label="الوصف"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <TextField
              label="العنوان"
              fullWidth
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
            <TextField
              label="رقم الهاتف"
              fullWidth
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <TextField
              label="البريد الإلكتروني"
              fullWidth
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <TextField
              label="الموقع الإلكتروني"
              fullWidth
              value={editForm.website}
              onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleSaveCompanyInfo} variant="contained">حفظ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
