import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Button,
  Popover,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import useTranslation from '@/hooks/useTranslation';

export interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean' | 'number';
  options?: { value: string; label: string }[];
}

export interface SortOption {
  field: string;
  label: string;
}

interface Filter {
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
}

interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  onSearch: (params: {
    query: string;
    filters: Filter[];
    sort: Sort[];
  }) => void;
  initialFilters?: Filter[];
  initialSort?: Sort[];
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filterOptions,
  sortOptions,
  onSearch,
  initialFilters = [],
  initialSort = [],
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filter[]>(initialFilters);
  const [sort, setSort] = useState<Sort[]>(initialSort);
  
  // Menu anchors
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [filterValueAnchor, setFilterValueAnchor] = useState<null | HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  useEffect(() => {
    handleSearch();
  }, [filters, sort]);

  const handleSearch = () => {
    onSearch({
      query,
      filters,
      sort,
    });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const handleFilterSelect = (filter: FilterOption) => {
    setActiveFilter(filter);
    setFilterAnchor(null);
    setFilterValueAnchor(filterAnchor);
  };

  const handleFilterValueSubmit = (value: any) => {
    if (activeFilter) {
      setFilters((prev) => [
        ...prev,
        { field: activeFilter.field, value },
      ]);
    }
    setFilterValueAnchor(null);
    setActiveFilter(null);
  };

  const handleSortSelect = (option: SortOption) => {
    const existingSort = sort.find((s) => s.field === option.field);
    if (existingSort) {
      if (existingSort.direction === 'asc') {
        setSort((prev) =>
          prev.map((s) =>
            s.field === option.field
              ? { ...s, direction: 'desc' }
              : s
          )
        );
      } else {
        setSort((prev) => prev.filter((s) => s.field !== option.field));
      }
    } else {
      setSort((prev) => [
        ...prev,
        { field: option.field, direction: 'asc' },
      ]);
    }
    setSortAnchor(null);
  };

  const handleRemoveFilter = (filter: Filter) => {
    setFilters((prev) => prev.filter((f) => f.field !== filter.field));
  };

  const renderFilterValue = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              multiple
              value={[]}
              onChange={(e) => handleFilterValueSubmit(e.target.value)}
              input={<OutlinedInput label={filter.label} />}
              renderValue={(selected) =>
                selected
                  .map(
                    (value) =>
                      filter.options?.find((o) => o.value === value)?.label
                  )
                  .join(', ')
              }
            >
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox
                    checked={false}
                  />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            type="date"
            size="small"
            fullWidth
            onChange={(e) => handleFilterValueSubmit(e.target.value)}
          />
        );

      default:
        return (
          <TextField
            size="small"
            fullWidth
            label={filter.label}
            onChange={(e) => handleFilterValueSubmit(e.target.value)}
          />
        );
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={t('search.placeholder')}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: query && (
              <IconButton size="small" onClick={() => setQuery('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
          color={filters.length > 0 ? 'primary' : 'inherit'}
        >
          {t('search.filter')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          onClick={handleSortClick}
          color={sort.length > 0 ? 'primary' : 'inherit'}
        >
          {t('search.sort')}
        </Button>
      </Stack>

      {(filters.length > 0 || sort.length > 0) && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filters.map((filter) => (
              <Chip
                key={filter.field}
                label={`${
                  filterOptions.find((f) => f.field === filter.field)?.label
                }: ${filter.value}`}
                onDelete={() => handleRemoveFilter(filter)}
                size="small"
              />
            ))}
            {sort.map((s) => (
              <Chip
                key={s.field}
                label={`${
                  sortOptions.find((o) => o.field === s.field)?.label
                } ${s.direction === 'asc' ? '↑' : '↓'}`}
                onDelete={() =>
                  setSort((prev) => prev.filter((item) => item.field !== s.field))
                }
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        {filterOptions.map((filter) => (
          <MenuItem
            key={filter.field}
            onClick={() => handleFilterSelect(filter)}
            disabled={filters.some((f) => f.field === filter.field)}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
      >
        {sortOptions.map((option) => {
          const currentSort = sort.find((s) => s.field === option.field);
          return (
            <MenuItem
              key={option.field}
              onClick={() => handleSortSelect(option)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {option.label}
                {currentSort && (
                  <Box sx={{ ml: 1 }}>
                    {currentSort.direction === 'asc' ? '↑' : '↓'}
                  </Box>
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Filter Value Popover */}
      <Popover
        open={Boolean(filterValueAnchor)}
        anchorEl={filterValueAnchor}
        onClose={() => {
          setFilterValueAnchor(null);
          setActiveFilter(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          {activeFilter && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {activeFilter.label}
              </Typography>
              {renderFilterValue(activeFilter)}
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default AdvancedSearch;
