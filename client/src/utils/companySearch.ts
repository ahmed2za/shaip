import axios from 'axios';

interface CompanyInfo {
  name: string;
  logo: string;
  website: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  category?: string;
}

export async function searchCompanyOnline(query: string): Promise<CompanyInfo | null> {
  try {
    // البحث عن معلومات الشركة باستخدام Clearbit API
    const clearbitResponse = await axios.get(`https://company.clearbit.com/v2/companies/find?domain=${query}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}`
      }
    });

    if (clearbitResponse.data) {
      const companyData = clearbitResponse.data;
      
      // البحث عن موقع الشركة باستخدام Google Places API
      const googleResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(companyData.name)}&inputtype=textquery&fields=formatted_address,geometry&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      let location: { lat: number; lng: number; name: string; } | undefined;
      if (googleResponse.data.candidates && googleResponse.data.candidates.length > 0) {
        const place = googleResponse.data.candidates[0];
        location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.formatted_address
        };
      }

      // تحويل البيانات إلى الشكل المطلوب
      return {
        name: companyData.name,
        logo: companyData.logo || '/images/companies/default-company.jpg',
        website: companyData.domain,
        description: companyData.description || '',
        location,
        category: mapCategory(companyData.category?.industry)
      };
    }
  } catch (error) {
    console.error('Error searching for company:', error);
  }

  return null;
}

// تحويل تصنيفات Clearbit إلى تصنيفاتنا
function mapCategory(industry: string | undefined): string {
  const categoryMap: { [key: string]: string } = {
    'Information Technology': 'تقنية المعلومات',
    'Telecommunications': 'اتصالات',
    'Financial Services': 'خدمات مالية',
    'E-Commerce': 'تجارة إلكترونية',
    'Manufacturing': 'صناعة',
    'Logistics': 'خدمات لوجستية'
  };

  if (!industry) return 'أخرى';
  
  for (const [eng, ar] of Object.entries(categoryMap)) {
    if (industry.toLowerCase().includes(eng.toLowerCase())) {
      return ar;
    }
  }

  return 'أخرى';
}
