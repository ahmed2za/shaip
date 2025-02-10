import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Stack,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { reportService, ReportMetadata, ReportFormat } from '@/services/reportService';
import useTranslation from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReportListProps {
  onReportDeleted?: () => void;
}

export const ReportList: React.FC<ReportListProps> = ({ onReportDeleted }) => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ReportMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportMetadata | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportService.getReportsList({
        page: page + 1,
        limit: rowsPerPage,
      });
      setReports(result.reports);
      setTotalReports(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    report: ReportMetadata
  ) => {
    setSelectedReport(report);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDeleteClick = () => {
    setMenuAnchor(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReport) return;

    try {
      setDeleteLoading(true);
      await reportService.deleteReport(selectedReport.id);
      setDeleteDialogOpen(false);
      if (onReportDeleted) {
        onReportDeleted();
      }
      fetchReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (
    status: 'pending' | 'processing' | 'completed' | 'failed'
  ): 'default' | 'primary' | 'success' | 'error' => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
    }
  };

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case 'excel':
        return '📊';
      case 'pdf':
        return '📄';
      case 'csv':
        return '📑';
      default:
        return '📁';
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          {t('reports.generatedReports')}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchReports}
          disabled={loading}
        >
          {t('reports.refresh')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t('reports.name')}</TableCell>
              <TableCell>{t('reports.format')}</TableCell>
              <TableCell>{t('reports.status')}</TableCell>
              <TableCell>{t('reports.createdAt')}</TableCell>
              <TableCell align="right">{t('reports.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    {t('reports.noReports')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{getFormatIcon(report.format)}</span>
                      <span>{report.format.toUpperCase()}</span>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`reports.status.${report.status}`)}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(report.createdAt), 'PPp', {
                      locale: ar,
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {report.status === 'completed' && report.url && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(report.url, '_blank')}
                          title={t('reports.download')}
                        >
                          <DownloadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, report)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalReports}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedReport?.status === 'completed' && selectedReport.url && (
          <MenuItem
            onClick={() => {
              window.open(selectedReport.url, '_blank');
              handleMenuClose();
            }}
          >
            <DownloadIcon sx={{ mr: 1 }} />
            {t('reports.download')}
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          {t('reports.delete')}
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('reports.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('reports.deleteConfirmMessage', {
              name: selectedReport?.name,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {deleteLoading ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReportList;
