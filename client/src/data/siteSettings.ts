export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  active: boolean;
}

export interface ApiEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  active: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  direction: 'rtl' | 'ltr';
  logo: string;
  favicon: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
  googleAnalyticsId: string;
  googleAdsenseId: string;
  googleVerification: string;
}

export interface IntegrationSettings {
  googleMapsApiKey: string;
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
  mailchimpApiKey: string;
  mailchimpListId: string;
}

export interface CacheSettings {
  enabled: boolean;
  duration: number;
  excludedPaths: string[];
}

export interface SiteSettings {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    supportEmail: string;
    defaultLanguage: string;
    allowedLanguages: string[];
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  theme: ThemeSettings;
  seo: SeoSettings;
  social: SocialMedia[];
  api: {
    baseUrl: string;
    endpoints: ApiEndpoint[];
    timeout: number;
    retryAttempts: number;
  };
  integrations: IntegrationSettings;
  cache: CacheSettings;
  features: {
    blogEnabled: boolean;
    commentsEnabled: boolean;
    reviewsEnabled: boolean;
    userRegistrationEnabled: boolean;
    newsletterEnabled: boolean;
    adsEnabled: boolean;
  };
  ads: {
    headerAd: string;
    sidebarAd: string;
    footerAd: string;
    articleAd: string;
    enabled: boolean;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
    twoFactorEnabled: boolean;
  };
}

export const defaultSettings: SiteSettings = {
  general: {
    siteName: 'دليل الشركات',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@example.com',
    supportEmail: 'support@example.com',
    defaultLanguage: 'ar',
    allowedLanguages: ['ar', 'en'],
    maintenanceMode: false,
    maintenanceMessage: 'الموقع تحت الصيانة حالياً، يرجى المحاولة لاحقاً.',
  },
  theme: {
    primaryColor: '#2196F3',
    secondaryColor: '#FF9800',
    fontFamily: 'Cairo, sans-serif',
    direction: 'rtl',
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
  },
  seo: {
    title: 'دليل الشركات - اكتشف أفضل الشركات',
    description: 'دليل شامل للشركات مع تقييمات ومراجعات المستخدمين',
    keywords: ['شركات', 'أعمال', 'دليل', 'تقييمات'],
    googleAnalyticsId: 'UA-XXXXXXXX-X',
    googleAdsenseId: 'ca-pub-XXXXXXXXXXXXXXXX',
    googleVerification: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  social: [
    {
      platform: 'twitter',
      url: 'https://twitter.com/example',
      icon: 'TwitterIcon',
      active: true,
    },
    {
      platform: 'facebook',
      url: 'https://facebook.com/example',
      icon: 'FacebookIcon',
      active: true,
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/example',
      icon: 'InstagramIcon',
      active: true,
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/example',
      icon: 'LinkedInIcon',
      active: true,
    },
  ],
  api: {
    baseUrl: 'https://api.example.com',
    endpoints: [
      {
        name: 'companies',
        url: '/api/companies',
        method: 'GET',
        active: true,
      },
      {
        name: 'reviews',
        url: '/api/reviews',
        method: 'POST',
        active: true,
      },
    ],
    timeout: 30000,
    retryAttempts: 3,
  },
  integrations: {
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY',
    recaptchaSecretKey: 'YOUR_RECAPTCHA_SECRET_KEY',
    mailchimpApiKey: 'YOUR_MAILCHIMP_API_KEY',
    mailchimpListId: 'YOUR_MAILCHIMP_LIST_ID',
  },
  cache: {
    enabled: true,
    duration: 3600,
    excludedPaths: ['/api/auth', '/api/admin'],
  },
  features: {
    blogEnabled: true,
    commentsEnabled: true,
    reviewsEnabled: true,
    userRegistrationEnabled: true,
    newsletterEnabled: true,
    adsEnabled: true,
  },
  ads: {
    headerAd: '<script>// Header Ad Code</script>',
    sidebarAd: '<script>// Sidebar Ad Code</script>',
    footerAd: '<script>// Footer Ad Code</script>',
    articleAd: '<script>// Article Ad Code</script>',
    enabled: true,
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorEnabled: false,
  },
};
