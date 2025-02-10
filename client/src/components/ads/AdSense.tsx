import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface AdSenseProps {
  adCode: string;
  location: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ adCode, location, className }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.innerHTML === '') {
        // Insert ad code
        adRef.current.innerHTML = adCode;

        // Push to adsbygoogle
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, [adCode]);

  return (
    <Box
      ref={adRef}
      className={`adsense-${location} ${className || ''}`}
      sx={{
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1rem 0',
        '& ins': {
          display: 'block',
          width: '100%',
        },
      }}
    />
  );
}
