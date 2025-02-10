import { storage } from './storage';
import { db } from './db';

export const client = {
  storage,
  from: db.from,
};
