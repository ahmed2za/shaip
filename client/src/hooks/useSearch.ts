import { useState, useCallback, useEffect } from 'react';
import { searchService, SearchParams, SearchResult } from '@/services/searchService';
import { useDebounce } from '@/hooks/useDebounce';
import { logger } from '@/utils/logger';

interface UseSearchOptions<T> extends Omit<SearchParams, 'query'> {
  debounceMs?: number;
  autoSearch?: boolean;
}

interface UseSearchReturn<T> {
  results: T[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  search: (query: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: SearchParams['filters']) => void;
  setSort: (sort: SearchParams['sort']) => void;
  suggestions: string[];
  clearSearch: () => void;
}

export function useSearch<T>({
  model,
  filters = [],
  sort = [],
  page = 1,
  limit = 10,
  debounceMs = 300,
  autoSearch = true,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });

  const debouncedQuery = useDebounce(query, debounceMs);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      try {
        setLoading(true);
        setError(null);

        const searchParams: SearchParams = {
          query: searchQuery,
          filters,
          sort,
          page: pagination.page,
          limit: pagination.limit,
          model,
        };

        const result = await searchService.search<T>(searchParams);
        setResults(result.items);
        setPagination(result.pagination);

        // Get search suggestions if query is not empty
        if (searchQuery) {
          const suggestions = await searchService.suggest(searchQuery, model);
          setSuggestions(suggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Search failed');
        setError(error);
        logger.error('useSearch', 'Search error', error);
      } finally {
        setLoading(false);
      }
    },
    [filters, sort, pagination.page, pagination.limit, model]
  );

  // Handle automatic search when query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery !== undefined) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, autoSearch, performSearch]);

  const search = async (newQuery: string) => {
    setQuery(newQuery);
    if (!autoSearch) {
      await performSearch(newQuery);
    }
  };

  const setPage = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const setLimit = (newLimit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when changing limit
    }));
  };

  const setFilters = (newFilters: SearchParams['filters'] = []) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when changing filters
    }));
    performSearch(query);
  };

  const setSort = (newSort: SearchParams['sort'] = []) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when changing sort
    }));
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setPagination({
      page: 1,
      limit: pagination.limit,
      total: 0,
      totalPages: 0,
    });
    setResults([]);
    setSuggestions([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    pagination,
    search,
    setPage,
    setLimit,
    setFilters,
    setSort,
    suggestions,
    clearSearch,
  };
}
