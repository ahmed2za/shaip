import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import Company from '../models/Company';

export const isCompanyOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.companyId || req.body.companyId || req.query.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. Company owner only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
