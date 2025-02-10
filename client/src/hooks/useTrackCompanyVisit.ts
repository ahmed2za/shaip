import { useEffect } from 'react';
import { useRecentlyVisited, RecentCompany } from './useRecentlyVisited';

export const useTrackCompanyVisit = (company: RecentCompany) => {
  const { addCompany } = useRecentlyVisited();

  useEffect(() => {
    if (company) {
      // Add small delay to ensure the page has loaded
      const timeoutId = setTimeout(() => {
        addCompany(company);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [company, addCompany]);
};
