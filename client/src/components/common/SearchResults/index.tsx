import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import useTranslation from '@/hooks/useTranslation';

export interface SearchResultAction {
  icon: React.ReactNode;
  label: string;
  onClick: (item: any) => void;
  show?: (item: any) => boolean;
}

interface SearchResultsProps {
  results: any[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  getTitleField?: (item: any) => string;
  getDescriptionField?: (item: any) => string;
  getMetadata?: (item: any) => { label: string; value: string }[];
  actions?: SearchResultAction[];
  emptyMessage?: string;
  highlightTerms?: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  pagination,
  onPageChange,
  getTitleField = (item) => item.title || item.name,
  getDescriptionField = (item) => item.description || item.content,
  getMetadata,
  actions = [],
  emptyMessage,
  highlightTerms = [],
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const highlightText = (text: string) => {
    if (!highlightTerms.length) return text;

    const regex = new RegExp(`(${highlightTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          highlightTerms.some((term) => part.toLowerCase() === term.toLowerCase()) ? (
            <span
              key={i}
              style={{
                backgroundColor: theme.palette.warning.light,
                padding: '0 2px',
                borderRadius: 2,
              }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!results.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          {emptyMessage || t('search.noResults')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <List>
        {results.map((item, index) => (
          <React.Fragment key={item.id || index}>
            <ListItem
              component={Paper}
              sx={{
                mb: 2,
                p: 2,
                display: 'block',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Box sx={{ pr: 8 }}>
                <Typography variant="h6" gutterBottom>
                  {highlightText(getTitleField(item))}
                </Typography>
                
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1,
                  }}
                >
                  {highlightText(getDescriptionField(item))}
                </Typography>

                {getMetadata && (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 1 }}
                    flexWrap="wrap"
                  >
                    {getMetadata(item).map(({ label, value }, i) => (
                      <Chip
                        key={i}
                        size="small"
                        label={
                          <>
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {label}:
                            </Typography>{' '}
                            {value}
                          </>
                        }
                      />
                    ))}
                  </Stack>
                )}
              </Box>

              {actions.length > 0 && (
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    {actions.map(
                      (action, actionIndex) =>
                        (!action.show || action.show(item)) && (
                          <IconButton
                            key={actionIndex}
                            edge="end"
                            onClick={() => action.onClick(item)}
                            title={action.label}
                          >
                            {action.icon}
                          </IconButton>
                        )
                    )}
                  </Stack>
                </ListItemSecondaryAction>
              )}
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {pagination.totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          {t('search.showing', {
            start: (pagination.page - 1) * pagination.limit + 1,
            end: Math.min(
              pagination.page * pagination.limit,
              pagination.total
            ),
            total: pagination.total,
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchResults;
