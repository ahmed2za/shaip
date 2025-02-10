export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  address?: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  industry?: string;
  workingHours?: {
    from: string;
    to: string;
    days: string[];
  };
  location?: {
    lat: number;
    lng: number;
  };
  services?: string[];
  category?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  phoneNumber?: string;
  email?: string;
  foundedYear?: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  title?: string;
  content: string;
  rating: number;
  pros?: string;
  cons?: string;
  userId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}
