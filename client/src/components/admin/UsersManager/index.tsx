import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'company' | 'admin';
  isActive: boolean;
  createdAt: string;
}

const UsersManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف المستخدم بنجاح');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // Update existing user
        await fetch(`/api/admin/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم تحديث المستخدم بنجاح');
      } else {
        // Create new user
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم إضافة المستخدم بنجاح');
      }
      setDialogOpen(false);
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        isActive: true,
        password: '',
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to save user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">إدارة المستخدمين</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedUser(null);
            setFormData({
              name: '',
              email: '',
              role: 'user',
              isActive: true,
              password: '',
            });
            setDialogOpen(true);
          }}
        >
          إضافة مستخدم
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الدور</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تاريخ الإنشاء</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'admin'
                      ? 'مدير'
                      : user.role === 'company'
                      ? 'شركة'
                      : 'مستخدم'}
                  </TableCell>
                  <TableCell>
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الاسم"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>الدور</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    required
                  >
                    <MenuItem value="user">مستخدم</MenuItem>
                    <MenuItem value="company">شركة</MenuItem>
                    <MenuItem value="admin">مدير</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="كلمة المرور"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!selectedUser}
                  helperText={selectedUser ? 'اتركه فارغاً إذا لم ترد تغيير كلمة المرور' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="نشط"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export { UsersManager };
