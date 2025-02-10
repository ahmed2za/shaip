import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  FormHelperText,
  CircularProgress,
  Alert,
  Stack,
  Autocomplete,
} from '@mui/material';
import { DateRangePicker } from '@mui/lab';
import {
  FileDownload as DownloadIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { reportService, ReportFormat, ReportOptions } from '@/services/reportService';
import useTranslation from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReportGeneratorProps {
  reportType: string;
  availableColumns: { value: string; label: string }[];
  filterOptions?: { field: string; label: string; type: string; options?: any[] }[];
  onReportGenerated?: (report: any) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  reportType,
  availableColumns,
  filterOptions = [],
  onReportGenerated,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReportOptions>({
    defaultValues: {
      format: 'excel',
      sortBy: '',
      sortOrder: 'asc',
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
    },
  });

  const format = watch('format');

  const handleGenerateReport = async (data: ReportOptions) => {
    try {
      setLoading(true);
      setError(null);

      const report = await reportService.generateReport(reportType, {
        ...data,
        columns: selectedColumns,
        filters,
      });

      if (onReportGenerated) {
        onReportGenerated(report);
      }

      // If report is ready for download, trigger download
      if (report.url) {
        window.open(report.url, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('reports.generateReport')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleGenerateReport)}>
        <Grid container spacing={3}>
          {/* Report Format */}
          <Grid item xs={12} md={6}>
            <Controller
              name="format"
              control={control}
              rules={{ required: t('reports.formatRequired') }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.format}>
                  <InputLabel>{t('reports.format')}</InputLabel>
                  <Select {...field} label={t('reports.format')}>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                  {errors.format && (
                    <FormHelperText>{errors.format.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} md={6}>
            <Controller
              name="dateRange"
              control={control}
              render={({ field }) => (
                <DateRangePicker
                  startText={t('reports.startDate')}
                  endText={t('reports.endDate')}
                  value={[field.value.start, field.value.end]}
                  onChange={([start, end]) =>
                    field.onChange({ start, end })
                  }
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}>{t('reports.to')}</Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              )}
            />
          </Grid>

          {/* Column Selection */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={availableColumns}
              value={selectedColumns.map((col) => ({
                value: col,
                label: availableColumns.find((c) => c.value === col)?.label || col,
              }))}
              onChange={(_, newValue) =>
                setSelectedColumns(newValue.map((v) => v.value))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('reports.selectColumns')}
                  placeholder={t('reports.selectColumnsPlaceholder')}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
            />
          </Grid>

          {/* Filters */}
          {filterOptions.map((filter) => (
            <Grid item xs={12} md={6} key={filter.field}>
              {filter.type === 'select' ? (
                <FormControl fullWidth>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={filters[filter.field] || ''}
                    onChange={(e) =>
                      handleFilterChange(filter.field, e.target.value)
                    }
                    label={filter.label}
                  >
                    <MenuItem value="">
                      <em>{t('reports.none')}</em>
                    </MenuItem>
                    {filter.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={filter.label}
                  value={filters[filter.field] || ''}
                  onChange={(e) =>
                    handleFilterChange(filter.field, e.target.value)
                  }
                  type={filter.type}
                />
              )}
            </Grid>
          ))}

          {/* Sorting */}
          <Grid item xs={12} md={6}>
            <Controller
              name="sortBy"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('reports.sortBy')}</InputLabel>
                  <Select {...field} label={t('reports.sortBy')}>
                    <MenuItem value="">
                      <em>{t('reports.none')}</em>
                    </MenuItem>
                    {selectedColumns.map((col) => (
                      <MenuItem key={col} value={col}>
                        {availableColumns.find((c) => c.value === col)?.label ||
                          col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('reports.sortOrder')}</InputLabel>
                  <Select {...field} label={t('reports.sortOrder')}>
                    <MenuItem value="asc">{t('reports.ascending')}</MenuItem>
                    <MenuItem value="desc">{t('reports.descending')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            {loading ? t('reports.generating') : t('reports.generate')}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ReportGenerator;
