import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Rating,
  Avatar,
  Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/Layout';
import { mockCompanies } from '@/data/mockCompanies';
import { categories } from '@/data/categories';
import Image from 'next/image';

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  rating: number;
  verified: boolean;
}

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState<Company[]>(
    Object.entries(mockCompanies).map(([id, { id: _, ...companyData }]) => ({
      id,
      ...companyData,
      verified: false // Default value for server-side rendering
    }))
  );

  useEffect(() => {
    // Set random verification status only on the client side
    setCompanies(prevCompanies =>
      prevCompanies.map(company => ({
        ...company,
        verified: Math.random() > 0.5
      }))
    );
  }, []); // Empty dependency array means this runs once when component mounts

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
    } else {
      setEditingCompany({
        id: String(Date.now()),
        name: '',
        description: '',
        logo: '',
        categories: [],
        rating: 0,
        verified: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = () => {
    if (editingCompany) {
      const newCompanies = [...companies];
      const index = newCompanies.findIndex((c) => c.id === editingCompany.id);
      if (index > -1) {
        newCompanies[index] = editingCompany;
      } else {
        newCompanies.push(editingCompany);
      }
      setCompanies(newCompanies);
    }
    handleCloseDialog();
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const handleToggleVerification = (id: string) => {
    setCompanies(
      companies.map((company) =>
        company.id === id
          ? { ...company, verified: !company.verified }
          : company
      )
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4">إدارة الشركات</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            إضافة شركة جديدة
          </Button>
        </Stack>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="بحث في الشركات"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الشعار</TableCell>
                  <TableCell>اسم الشركة</TableCell>
                  <TableCell>التصنيفات</TableCell>
                  <TableCell>التقييم</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Avatar
                          sx={{ width: 40, height: 40 }}
                          src={company.logo}
                          alt={company.name}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{company.name}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {company.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {company.categories.map((category) => (
                            <Chip
                              key={category}
                              label={categories[category]?.name || category}
                              size="small"
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Rating value={company.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={company.verified ? 'موثق' : 'غير موثق'}
                          color={company.verified ? 'success' : 'default'}
                          size="small"
                          onClick={() => handleToggleVerification(company.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="عرض الشركة">
                            <IconButton
                              size="small"
                              color="primary"
                              href={`/company/${company.id}`}
                              target="_blank"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تعديل">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(company)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCompany(company.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCompanies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الشركات في الصفحة"
          />
        </Paper>
      </Box>

      {/* Add/Edit Company Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCompany?.id ? 'تعديل شركة' : 'إضافة شركة جديدة'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="اسم الشركة"
              value={editingCompany?.name || ''}
              onChange={(e) =>
                setEditingCompany(
                  (prev) => prev && { ...prev, name: e.target.value }
                )
              }
            />
            <TextField
              fullWidth
              label="الوصف"
              multiline
              rows={4}
              value={editingCompany?.description || ''}
              onChange={(e) =>
                setEditingCompany(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
            <TextField
              fullWidth
              label="رابط الشعار"
              value={editingCompany?.logo || ''}
              onChange={(e) =>
                setEditingCompany(
                  (prev) => prev && { ...prev, logo: e.target.value }
                )
              }
            />
            <FormControl fullWidth>
              <InputLabel>التصنيفات</InputLabel>
              <Select
                multiple
                value={editingCompany?.categories || []}
                onChange={(e) =>
                  setEditingCompany(
                    (prev) =>
                      prev && {
                        ...prev,
                        categories: e.target.value as string[],
                      }
                  )
                }
                renderValue={(selected) => (
                  <Stack direction="row" spacing={1}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={categories[value]?.name || value}
                        size="small"
                      />
                    ))}
                  </Stack>
                )}
              >
                {Object.entries(categories).map(([id, category]) => (
                  <MenuItem key={id} value={id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography component="legend">التقييم</Typography>
              <Rating
                value={editingCompany?.rating || 0}
                onChange={(event, newValue) =>
                  setEditingCompany(
                    (prev) => prev && { ...prev, rating: newValue || 0 }
                  )
                }
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSaveCompany} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
