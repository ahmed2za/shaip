export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastLogin: string;
  reviewCount: number;
  verified: boolean;
}

export const mockUsers: { [key: string]: User } = {
  '1': {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2025-02-09',
    reviewCount: 15,
    verified: true,
  },
  '2': {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'moderator',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2025-02-08',
    reviewCount: 8,
    verified: true,
  },
  '3': {
    id: '3',
    name: 'محمد علي',
    email: 'mohamed@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'user',
    status: 'active',
    joinDate: '2024-02-01',
    lastLogin: '2025-02-07',
    reviewCount: 3,
    verified: true,
  },
  '4': {
    id: '4',
    name: 'فاطمة حسن',
    email: 'fatima@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'user',
    status: 'suspended',
    joinDate: '2024-01-20',
    lastLogin: '2025-01-15',
    reviewCount: 1,
    verified: false,
  },
  '5': {
    id: '5',
    name: 'عمر خالد',
    email: 'omar@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'user',
    status: 'pending',
    joinDate: '2025-02-08',
    lastLogin: '2025-02-08',
    reviewCount: 0,
    verified: false,
  },
};
