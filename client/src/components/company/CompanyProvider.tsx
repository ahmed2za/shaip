import React, { useEffect } from 'react';
import { useRecentlyVisited } from '@/hooks/useRecentlyVisited';

interface CompanyProviderProps {
  children: React.ReactNode;
  company: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    domain: string;
  };
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children, company }) => {
  const { addCompany } = useRecentlyVisited();

  useEffect(() => {
    // Add company to recently visited when viewing company page
    addCompany(company);
  }, [company, addCompany]);

  return <>{children}</>;
};
