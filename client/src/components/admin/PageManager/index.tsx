import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Editor from '@/components/blog/Editor';
import { useForm, Controller } from 'react-hook-form';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  lastModified: string;
}

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
}

export const PageManager = () => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<PageFormData>();

  const loadPages = async () => {
    try {
      const { data } = await axios.get('/api/pages');
      setPages(data);
    } catch (error) {
      logger.error('PageManager', 'Failed to load pages', error);
    }
  };

  React.useEffect(() => {
    loadPages();
  }, []);

  const handleEdit = (page: StaticPage) => {
    setSelectedPage(page);
    setValue('title', page.title);
    setValue('slug', page.slug);
    setValue('content', page.content);
    setValue('metaDescription', page.metaDescription);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      try {
        await axios.delete(`/api/pages/${id}`);
        loadPages();
      } catch (error) {
        logger.error('PageManager', 'Failed to delete page', error);
      }
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      if (selectedPage) {
        await axios.put(`/api/pages/${selectedPage.id}`, data);
      } else {
        await axios.post('/api/pages', data);
      }
      setIsDialogOpen(false);
      loadPages();
      reset();
    } catch (error) {
      logger.error('PageManager', 'Failed to save page', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'العنوان', flex: 1 },
    { field: 'slug', headerName: 'الرابط', flex: 1 },
    {
      field: 'lastModified',
      headerName: 'آخر تعديل',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString('ar'),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedPage(null);
            reset();
            setIsDialogOpen(true);
          }}
        >
          إضافة صفحة جديدة
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={pages}
            columns={columns}
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {selectedPage ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'العنوان مطلوب' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="العنوان"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: 'الرابط مطلوب' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="الرابط"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="metaDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="وصف ميتا"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  المحتوى
                </Typography>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'المحتوى مطلوب' }}
                  render={({ field }) => (
                    <Editor content={field.value} onChange={field.onChange} />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              حفظ
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PageManager;
