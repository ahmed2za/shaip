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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

const CompaniesManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError('Failed to fetch companies');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      isActive: company.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
      try {
        await fetch(`/api/admin/companies/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف الشركة بنجاح');
        fetchCompanies();
      } catch (err) {
        setError('Failed to delete company');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCompany) {
        // Update existing company
        await fetch(`/api/admin/companies/${selectedCompany._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم تحديث الشركة بنجاح');
      } else {
        // Create new company
        await fetch('/api/admin/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم إضافة الشركة بنجاح');
      }
      setDialogOpen(false);
      setSelectedCompany(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        isActive: true,
      });
      fetchCompanies();
    } catch (err) {
      setError('Failed to save company');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">إدارة الشركات</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedCompany(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
              isActive: true,
            });
            setDialogOpen(true);
          }}
        >
          إضافة شركة
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
              <TableCell>اسم الشركة</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>العنوان</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تاريخ الإنشاء</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company._id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>
                    {company.isActive ? 'نشط' : 'غير نشط'}
                  </TableCell>
                  <TableCell>
                    {new Date(company.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(company)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(company._id)}>
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
          count={companies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedCompany ? 'تعديل شركة' : 'إضافة شركة جديدة'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="اسم الشركة"
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
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="العنوان"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
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
              {selectedCompany ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export { CompaniesManager };
