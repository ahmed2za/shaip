export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  companyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
