import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface CompanyMapProps {
  location: Location;
  zoom?: number;
}

export default function CompanyMap({ location, zoom = 15 }: CompanyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        
        if (mapRef.current && !googleMapRef.current) {
          googleMapRef.current = new Map(mapRef.current, {
            center: location,
            zoom: zoom,
            styles: [
              {
                featureType: 'administrative',
                elementType: 'geometry',
                stylers: [{ visibility: 'on' }]
              },
              {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          new google.maps.Marker({
            position: location,
            map: googleMapRef.current,
            title: location.name,
            animation: google.maps.Animation.DROP
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [location, zoom]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
