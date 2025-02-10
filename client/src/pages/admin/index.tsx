import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Grid, Paper, Typography, Link, Button, Card, CardContent, LinearProgress, Chip, CircularProgress } from '@mui/material';
import { People as UsersIcon, Business as CompaniesIcon, Star as ReviewsIcon, Settings as SettingsIcon, Article as BlogIcon, Campaign as AdsIcon } from '@mui/icons-material';
import { ArrowForward, TrendingUp, TrendingDown } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

// Import components
import { UsersManager } from '@/components/admin/UsersManager';
import { CompaniesManager } from '@/components/admin/CompaniesManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { AdManager } from '@/components/admin/AdManager';
import { QuickActions } from '@/components/admin/QuickActions';
import AdminLayout from '@/components/layouts/AdminLayout';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AdminDashboard() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        // هنا يمكنك إضافة استدعاءات API للحصول على البيانات الأولية
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const content = (
    <Box sx={{ width: '100%', mt: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="h6">خطأ</Typography>
            <Typography>{error}</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </Button>
          </Paper>
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={value} 
              onChange={handleTabChange} 
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={t('admin.overview')} {...a11yProps(0)} />
              <Tab label={t('admin.users')} {...a11yProps(1)} />
              <Tab label={t('admin.companies')} {...a11yProps(2)} />
              <Tab label={t('admin.analytics')} {...a11yProps(3)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <QuickActions />
              </Grid>
              <Grid item xs={12} md={8}>
                <UsersManager />
              </Grid>
              <Grid item xs={12} md={4}>
                <CompaniesManager />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <UsersManager />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <CompaniesManager />
          </TabPanel>

          <TabPanel value={value} index={3}>
            <ReviewsManager />
          </TabPanel>
        </>
      )}
    </Box>
  );

  return <AdminLayout>{content}</AdminLayout>;
}
