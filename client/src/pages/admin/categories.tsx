import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/Layout';
import { categories } from '@/data/categories';
import { mockCompanies } from '@/data/mockCompanies';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  companies: string[];
  features: string[];
}

export default function CategoriesManagement() {
  const [categoriesList, setCategoriesList] = useState<{ [key: string]: Category }>(categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newFeature, setNewFeature] = useState('');

  const handleOpenDialog = (categoryId?: string) => {
    if (categoryId) {
      setEditingCategory({ ...categoriesList[categoryId], id: categoryId });
    } else {
      setEditingCategory({
        id: '',
        name: '',
        description: '',
        image: '',
        icon: '',
        companies: [],
        features: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setNewFeature('');
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      const { id, ...categoryData } = editingCategory;
      setCategoriesList((prev) => ({
        ...prev,
        [id || String(Date.now())]: categoryData,
      }));
    }
    handleCloseDialog();
  };

  const handleDeleteCategory = (id: string) => {
    setCategoriesList((prev) => {
      const newCategories = { ...prev };
      delete newCategories[id];
      return newCategories;
    });
  };

  const handleAddFeature = () => {
    if (newFeature && editingCategory) {
      setEditingCategory({
        ...editingCategory,
        features: [...editingCategory.features, newFeature],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (editingCategory) {
      const newFeatures = [...editingCategory.features];
      newFeatures.splice(index, 1);
      setEditingCategory({
        ...editingCategory,
        features: newFeatures,
      });
    }
  };

  const getCompanyCount = (categoryId: string) => {
    return Object.values(mockCompanies).filter(
      (company) => company.categories.includes(categoryId)
    ).length;
  };

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4">إدارة التصنيفات</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            إضافة تصنيف جديد
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {Object.entries(categoriesList).map(([id, category]) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: alpha('#000', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {category.image ? (
                    <Box
                      component="img"
                      src={category.image}
                      alt={category.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <CategoryIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                  )}
                </CardMedia>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {category.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCategory(id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={`${getCompanyCount(id)} شركة`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${category.features.length} ميزة`}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCategory?.id ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="اسم التصنيف"
              value={editingCategory?.name || ''}
              onChange={(e) =>
                setEditingCategory(
                  (prev) => prev && { ...prev, name: e.target.value }
                )
              }
            />
            <TextField
              fullWidth
              label="الوصف"
              multiline
              rows={4}
              value={editingCategory?.description || ''}
              onChange={(e) =>
                setEditingCategory(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
            <TextField
              fullWidth
              label="رابط الصورة"
              value={editingCategory?.image || ''}
              onChange={(e) =>
                setEditingCategory(
                  (prev) => prev && { ...prev, image: e.target.value }
                )
              }
            />
            <TextField
              fullWidth
              label="أيقونة (اسم أيقونة Material-UI)"
              value={editingCategory?.icon || ''}
              onChange={(e) =>
                setEditingCategory(
                  (prev) => prev && { ...prev, icon: e.target.value }
                )
              }
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                المميزات
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="ميزة جديدة"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleAddFeature}
                  disabled={!newFeature}
                >
                  إضافة
                </Button>
              </Stack>
              <List>
                {editingCategory?.features.map((feature, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
