import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AdSense from './AdSense';
import { useQuery } from 'react-query';

interface AdManagerProps {
  location: string;
  className?: string;
}

export default function AdManager({ location, className }: AdManagerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: ad } = useQuery(
    ['ad', location],
    async () => {
      const res = await fetch(`/api/ads?location=${location}`);
      return res.json();
    },
    {
      enabled: isClient,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  if (!isClient || !ad?.active || !ad?.code) {
    return null;
  }

  // Check if ad is within its date range
  const now = new Date();
  if (
    (ad.startDate && new Date(ad.startDate) > now) ||
    (ad.endDate && new Date(ad.endDate) < now)
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        my: 2,
      }}
    >
      <AdSense adCode={ad.code} location={location} className={className} />
    </Box>
  );
}
