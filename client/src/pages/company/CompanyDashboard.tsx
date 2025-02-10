import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PhotoLibrary as GalleryIcon,
  Star as ReviewsIcon,
  Settings as SettingsIcon,
  Article as BlogIcon,
  Ads as AdsIcon,
} from '@mui/icons-material';
import QuickActions from '@/components/company/QuickActions';
import GalleryManager from '@/components/company/GalleryManager';
import ReviewsManager from '@/components/company/ReviewsManager';
import BlogManager from '@/components/company/BlogManager';
import AdManager from '@/components/company/AdManager';
import SettingsManager from '@/components/company/SettingsManager';

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

export default function CompanyDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="company dashboard tabs">
          <Tab icon={<DashboardIcon />} label="لوحة التحكم" {...a11yProps(0)} />
          <Tab icon={<GalleryIcon />} label="معرض الصور" {...a11yProps(1)} />
          <Tab icon={<ReviewsIcon />} label="التقييمات" {...a11yProps(2)} />
          <Tab icon={<BlogIcon />} label="المدونة" {...a11yProps(3)} />
          <Tab icon={<AdsIcon />} label="الإعلانات" {...a11yProps(4)} />
          <Tab icon={<SettingsIcon />} label="الإعدادات" {...a11yProps(5)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <QuickActions />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <GalleryManager />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <ReviewsManager />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <BlogManager />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <AdManager />
      </TabPanel>

      <TabPanel value={value} index={5}>
        <SettingsManager />
      </TabPanel>
    </Box>
  );
}
