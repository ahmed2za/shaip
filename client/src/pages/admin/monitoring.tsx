import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { monitoringService } from '@/services/monitoringService';
import { activityService } from '@/services/activityService';
import useTranslation from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MonitoringDashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week'>('hour');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);

  const getTimeRange = () => {
    const end = new Date();
    const start = new Date();
    switch (timeRange) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'day':
        start.setDate(start.getDate() - 1);
        break;
      default:
        start.setHours(start.getHours() - 1);
    }
    return { start, end };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const range = getTimeRange();

      const [metricsData, healthData, logsData] = await Promise.all([
        monitoringService.getMetrics(range),
        monitoringService.getSystemHealth(),
        monitoringService.getErrorLogs({
          startDate: range.start,
          endDate: range.end,
          limit: 10,
        }),
      ]);

      setMetrics(metricsData);
      setSystemHealth(healthData);
      setErrorLogs(logsData.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getMetricsChart = () => {
    if (!metrics.length) return null;

    return {
      labels: metrics.map((m) =>
        format(new Date(m.timestamp), 'HH:mm', { locale: ar })
      ),
      datasets: [
        {
          label: t('monitoring.cpuUsage'),
          data: metrics.map((m) => m.cpuUsage),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          yAxisID: 'percentage',
        },
        {
          label: t('monitoring.memoryUsage'),
          data: metrics.map(
            (m) => (m.memoryUsed / m.memoryTotal) * 100
          ),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          yAxisID: 'percentage',
        },
        {
          label: t('monitoring.requestsPerMinute'),
          data: metrics.map((m) => m.requestsPerMinute),
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          yAxisID: 'requests',
        },
      ],
    };
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('monitoring.title') as string}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <FormControl size="small">
              <InputLabel>{t('monitoring.timeRange')}</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                label={t('monitoring.timeRange')}
              >
                <MenuItem value="hour">{t('monitoring.lastHour')}</MenuItem>
                <MenuItem value="day">{t('monitoring.lastDay')}</MenuItem>
                <MenuItem value="week">{t('monitoring.lastWeek')}</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
            >
              {t('monitoring.refresh')}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* System Health */}
            {systemHealth && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t('monitoring.systemStatus')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {systemHealth.status === 'healthy' ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                        )}
                        <Typography>
                          {t(`monitoring.status.${systemHealth.status}`)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t('monitoring.errorRate')}
                      </Typography>
                      <Typography variant="h4" color={
                        systemHealth.metrics.errorRate > 5
                          ? 'error'
                          : 'success'
                      }>
                        {systemHealth.metrics.errorRate.toFixed(2)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t('monitoring.responseTime')}
                      </Typography>
                      <Typography variant="h4">
                        {systemHealth.lastHour.averageResponseTime.toFixed(0)}ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Performance Metrics Chart */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('monitoring.performanceMetrics')}
              </Typography>
              {getMetricsChart() && (
                <Box sx={{ height: 400 }}>
                  <Line
                    data={getMetricsChart()!}
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      scales: {
                        percentage: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: '%',
                          },
                        },
                        requests: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          title: {
                            display: true,
                            text: t('monitoring.requests'),
                          },
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>

            {/* Error Logs */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('monitoring.recentErrors')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('monitoring.timestamp')}</TableCell>
                      <TableCell>{t('monitoring.level')}</TableCell>
                      <TableCell>{t('monitoring.message')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errorLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="textSecondary">
                            {t('monitoring.noErrors')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      errorLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(new Date(log.timestamp), 'PPp', {
                              locale: ar,
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={t(`monitoring.level.${log.level}`)}
                              color={
                                log.level === 'error'
                                  ? 'error'
                                  : log.level === 'warning'
                                  ? 'warning'
                                  : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{log.message}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
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

export default MonitoringDashboard;
