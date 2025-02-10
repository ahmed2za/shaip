import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  companyId?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
