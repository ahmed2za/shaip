import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Popper,
  Fade,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
  type: 'company' | 'category';
}

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      const formattedResults = data.companies.map((company: any) => ({
        id: company.id,
        name: company.name,
        logo_url: company.logo_url || '/company-default.png',
        rating: company.rating || 0,
        type: 'company' as const
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'company') {
      router.push(`/company/${result.id}`);
    } else {
      router.push(`/category/${result.id}`);
    }
    setSearchTerm('');
    setResults([]);
  };

  return (
    <Box sx={{ position: 'relative', width: { xs: '100%', sm: 300 } }}>
      <TextField
        fullWidth
        placeholder="ابحث عن شركة أو تصنيف..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setAnchorEl(e.currentTarget);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setResults([]);
                }}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: 2,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          },
        }}
      />

      <Popper
        open={Boolean(results.length)}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: anchorEl?.clientWidth, zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              <AnimatePresence>
                <List>
                  {loading ? (
                    <ListItem>
                      <ListItemText primary="جاري البحث..." />
                    </ListItem>
                  ) : results.length > 0 ? (
                    results.map((result) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <ListItem
                          button
                          onClick={() => handleResultClick(result)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={result.logo_url}
                              alt={result.name}
                              sx={{
                                bgcolor: result.type === 'category' ? 'primary.main' : 'transparent',
                              }}
                            >
                              {!result.logo_url && result.name[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={result.name}
                            secondary={
                              result.type === 'company' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" component="span">
                                    {result.rating.toFixed(1)}
                                  </Typography>
                                  ★
                                </Box>
                              )
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))
                  ) : searchTerm && (
                    <ListItem>
                      <ListItemText primary="لا توجد نتائج" />
                    </ListItem>
                  )}
                </List>
              </AnimatePresence>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
