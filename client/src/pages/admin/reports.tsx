import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '@/components/layouts/AdminLayout';
import ReportGenerator from '@/components/admin/ReportGenerator';
import ReportList from '@/components/admin/ReportList';
import useTranslation from '@/hooks/useTranslation';
import { useNotification } from '@/hooks/useNotification';

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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleReportGenerated = (report: any) => {
    showNotification(
      'success',
      t('reports.generatedSuccess', { name: report.name })
    );
  };

  const handleReportDeleted = () => {
    showNotification('success', t('reports.deletedSuccess'));
  };

  // Available columns for different report types
  const reportTypes = {
    users: {
      columns: [
        { value: 'id', label: t('reports.columns.id') },
        { value: 'name', label: t('reports.columns.name') },
        { value: 'email', label: t('reports.columns.email') },
        { value: 'role', label: t('reports.columns.role') },
        { value: 'status', label: t('reports.columns.status') },
        { value: 'createdAt', label: t('reports.columns.createdAt') },
        { value: 'lastLoginAt', label: t('reports.columns.lastLoginAt') },
      ],
      filters: [
        {
          field: 'role',
          label: t('reports.filters.role'),
          type: 'select',
          options: [
            { value: 'ADMIN', label: t('roles.admin') },
            { value: 'USER', label: t('roles.user') },
          ],
        },
        {
          field: 'status',
          label: t('reports.filters.status'),
          type: 'select',
          options: [
            { value: 'ACTIVE', label: t('status.active') },
            { value: 'INACTIVE', label: t('status.inactive') },
          ],
        },
      ],
    },
    orders: {
      columns: [
        { value: 'id', label: t('reports.columns.id') },
        { value: 'userId', label: t('reports.columns.userId') },
        { value: 'total', label: t('reports.columns.total') },
        { value: 'status', label: t('reports.columns.status') },
        { value: 'createdAt', label: t('reports.columns.createdAt') },
        { value: 'updatedAt', label: t('reports.columns.updatedAt') },
      ],
      filters: [
        {
          field: 'status',
          label: t('reports.filters.orderStatus'),
          type: 'select',
          options: [
            { value: 'PENDING', label: t('orderStatus.pending') },
            { value: 'COMPLETED', label: t('orderStatus.completed') },
            { value: 'CANCELLED', label: t('orderStatus.cancelled') },
          ],
        },
        {
          field: 'minTotal',
          label: t('reports.filters.minTotal'),
          type: 'number',
        },
        {
          field: 'maxTotal',
          label: t('reports.filters.maxTotal'),
          type: 'number',
        },
      ],
    },
    products: {
      columns: [
        { value: 'id', label: t('reports.columns.id') },
        { value: 'name', label: t('reports.columns.name') },
        { value: 'price', label: t('reports.columns.price') },
        { value: 'stock', label: t('reports.columns.stock') },
        { value: 'category', label: t('reports.columns.category') },
        { value: 'createdAt', label: t('reports.columns.createdAt') },
        { value: 'updatedAt', label: t('reports.columns.updatedAt') },
      ],
      filters: [
        {
          field: 'category',
          label: t('reports.filters.category'),
          type: 'select',
          options: [
            { value: 'ELECTRONICS', label: t('categories.electronics') },
            { value: 'CLOTHING', label: t('categories.clothing') },
            { value: 'BOOKS', label: t('categories.books') },
          ],
        },
        {
          field: 'minPrice',
          label: t('reports.filters.minPrice'),
          type: 'number',
        },
        {
          field: 'maxPrice',
          label: t('reports.filters.maxPrice'),
          type: 'number',
        },
        {
          field: 'inStock',
          label: t('reports.filters.inStock'),
          type: 'select',
          options: [
            { value: 'true', label: t('common.yes') },
            { value: 'false', label: t('common.no') },
          ],
        },
      ],
    },
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('reports.title')}
          </Typography>
          <Typography color="textSecondary">
            {t('reports.description')}
          </Typography>
        </Box>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t('reports.generateTab')} />
            <Tab label={t('reports.historyTab')} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {Object.entries(reportTypes).map(([type, config]) => (
                <Grid item xs={12} key={type}>
                  <Typography variant="h6" gutterBottom>
                    {t(`reports.types.${type}`)}
                  </Typography>
                  <ReportGenerator
                    reportType={type}
                    availableColumns={config.columns}
                    filterOptions={config.filters}
                    onReportGenerated={handleReportGenerated}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <ReportList onReportDeleted={handleReportDeleted} />
          </TabPanel>
        </Paper>
      </Container>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Reports;
