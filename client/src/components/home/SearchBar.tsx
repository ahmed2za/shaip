import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Paper,
  InputAdornment,
  styled,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

// مثال للاقتراحات - سيتم استبدالها بالبيانات الفعلية من الخادم
const mockSuggestions = [
  { type: 'company', label: 'شركة تمكين للتجارة', id: '1' },
  { type: 'company', label: 'البنك الأهلي السعودي', id: '2' },
  { type: 'category', label: 'متاجر إلكترونية', id: 'e-commerce' },
  { type: 'category', label: 'مطاعم', id: 'restaurants' },
];

const SearchWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const WriteReviewButton = styled(Button)(({ theme }) => ({
  height: 56,
  minWidth: 150,
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    height: 48,
  },
}));

const SearchBar = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSearch = (searchValue: string) => {
    if (searchValue) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleWriteReview = () => {
    router.push('/write-review');
  };

  return (
    <SearchWrapper>
      <Autocomplete
        freeSolo
        fullWidth
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={value}
        onInputChange={(_, newValue) => setValue(newValue)}
        options={mockSuggestions}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.label
        }
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.type === 'company' ? (
              <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
            ) : (
              <EditIcon sx={{ mr: 1, color: 'secondary.main' }} />
            )}
            {option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="ابحث عن شركة أو فئة..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: { xs: 48, sm: 56 },
                backgroundColor: 'background.paper',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(value);
              }
            }}
          />
        )}
      />
      <WriteReviewButton
        variant="contained"
        color="primary"
        startIcon={<EditIcon />}
        onClick={handleWriteReview}
      >
        اكتب تقييمك
      </WriteReviewButton>
    </SearchWrapper>
  );
};

export default SearchBar;
