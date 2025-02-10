import { mockCompanies } from '@/data/mockCompanies';

interface RecentCompany {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
  categories: string[];
  description: string;
}

const STORAGE_KEY = 'recentlyViewedCompanies';
const MAX_RECENT_COMPANIES = 5;

export const addRecentlyViewedCompany = (companyId: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const company = mockCompanies[companyId];
    if (!company) {
      console.error('Company not found:', companyId);
      return null;
    }

    const companyData: RecentCompany = {
      id: companyId,
      name: company.name,
      logo_url: company.logo,
      rating: company.rating,
      categories: company.categories,
      description: company.description
    };

    // Get existing companies
    const existingCompanies = getRecentlyViewedCompanies();
    
    // Remove if company already exists
    const filteredCompanies = existingCompanies.filter(c => c.id !== companyId);
    
    // Add new company at the beginning
    const updatedCompanies = [companyData, ...filteredCompanies].slice(0, MAX_RECENT_COMPANIES);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompanies));

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('recentlyViewedUpdate', {
      detail: updatedCompanies
    }));
    
    return updatedCompanies;
  } catch (error) {
    console.error('Error adding recently viewed company:', error);
    return null;
  }
};

export const getRecentlyViewedCompanies = (): RecentCompany[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const companies = localStorage.getItem(STORAGE_KEY);
    return companies ? JSON.parse(companies) : [];
  } catch (error) {
    console.error('Error getting recently viewed companies:', error);
    return [];
  }
};
