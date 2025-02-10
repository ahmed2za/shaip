export interface CompanyDetails {
  name: string;
  website: string;
  category: string;
  customCategory?: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'user' | 'company';
  companyDetails?: CompanyDetails;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
