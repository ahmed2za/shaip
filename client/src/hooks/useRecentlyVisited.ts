import { useState, useEffect } from 'react';

export interface RecentCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
}

const STORAGE_KEY = 'recentlyVisitedCompanies';
const MAX_COMPANIES = 4;

export const useRecentlyVisited = () => {
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);

  // Load companies from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentCompanies(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading recently visited companies:', error);
    }
  }, []);

  const addCompany = (company: RecentCompany) => {
    if (!company?.id || !company?.name || !company?.logo || typeof company?.rating !== 'number') {
      console.error('Invalid company data:', company);
      return;
    }

    setRecentCompanies(prev => {
      // Remove duplicates
      const withoutDuplicate = prev.filter(c => c.id !== company.id);
      
      // Add new company at the start and limit to MAX_COMPANIES
      const updated = [company, ...withoutDuplicate].slice(0, MAX_COMPANIES);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return updated;
    });

    // Also track in database if needed
    try {
      fetch('/api/companies/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: company.id }),
      });
    } catch (error) {
      console.error('Error tracking company visit:', error);
    }
  };

  return { recentCompanies, addCompany };
};
