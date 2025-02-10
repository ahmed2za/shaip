import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  status: 'ACTIVE' | 'BLOCKED';
  isVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  _count: {
    reviews: number;
    companies: number;
  };
}

interface UsersTableProps {
  onUserUpdate?: () => void;
}

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    image: 'https://i.pravatar.cc/150?img=1',
    role: 'USER',
    status: 'ACTIVE',
    isVerified: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    _count: {
      reviews: 5,
      companies: 2
    }
  },
  {
    id: '2',
    name: 'سارة علي',
    email: 'sara@example.com',
    image: 'https://i.pravatar.cc/150?img=2',
    role: 'USER',
    status: 'ACTIVE',
    isVerified: false,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    _count: {
      reviews: 3,
      companies: 1
    }
  },
  {
    id: '3',
    name: 'محمد خالد',
    email: 'mohamed@example.com',
    image: 'https://i.pravatar.cc/150?img=3',
    role: 'ADMIN',
    status: 'ACTIVE',
    isVerified: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    _count: {
      reviews: 10,
      companies: 5
    }
  }
];

export default function UsersTable({ onUserUpdate }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users based on search query and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    if (filter === 'ACTIVE') return matchesSearch && user.status === 'ACTIVE';
    if (filter === 'BLOCKED') return matchesSearch && user.status === 'BLOCKED';
    if (filter === 'VERIFIED') return matchesSearch && user.isVerified;
    return matchesSearch;
  });

  const handleStatusChange = (userId: string, newStatus: 'ACTIVE' | 'BLOCKED') => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleVerificationChange = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, isVerified: !user.isVerified } : user
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="بحث"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>تصفية</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="ALL">الكل</MenuItem>
            <MenuItem value="ACTIVE">نشط</MenuItem>
            <MenuItem value="BLOCKED">محظور</MenuItem>
            <MenuItem value="VERIFIED">موثق</MenuItem>
            <MenuItem value="UNVERIFIED">غير موثق</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>المستخدم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تاريخ التسجيل</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={user.image || undefined} alt={user.name}>
                      {user.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{user.name}</Typography>
                      {user.isVerified && (
                        <Chip
                          label="موثق"
                          size="small"
                          color="primary"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 'ACTIVE' ? 'نشط' : 'محظور'}
                    color={user.status === 'ACTIVE' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'PPP', { locale: ar })}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteDialogOpen(true);
                    }}
                    color="primary"
                    size="small"
                  >
                    <InfoIcon />
                  </IconButton>
                  {!user.isVerified && (
                    <IconButton
                      onClick={() => handleVerificationChange(user.id)}
                      color="success"
                      size="small"
                    >
                      <VerifyIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() =>
                      handleStatusChange(
                        user.id,
                        user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
                      )
                    }
                    color={user.status === 'ACTIVE' ? 'error' : 'success'}
                    size="small"
                  >
                    <BlockIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        {selectedUser && (
          <>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
            <DialogContent>
              <Box p={2}>
                <Typography variant="subtitle1" gutterBottom>
                  الاسم: {selectedUser.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  البريد الإلكتروني: {selectedUser.email}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  الدور: {selectedUser.role}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  الحالة: {selectedUser.status === 'ACTIVE' ? 'نشط' : 'محظور'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  التوثيق: {selectedUser.isVerified ? 'موثق' : 'غير موثق'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  عدد المراجعات: {selectedUser._count.reviews}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  عدد الشركات: {selectedUser._count.companies}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  آخر تسجيل دخول:{' '}
                  {selectedUser.lastLogin
                    ? format(new Date(selectedUser.lastLogin), 'PPP', { locale: ar })
                    : 'لم يسجل الدخول بعد'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  تاريخ التسجيل:{' '}
                  {format(new Date(selectedUser.createdAt), 'PPP', { locale: ar })}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>إغلاق</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
