import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { withAuth } from '@/utils/auth';

interface Advertisement {
  id: string;
  name: string;
  code: string;
  location: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}

const locations = [
  { value: 'header', label: 'أعلى الصفحة' },
  { value: 'sidebar', label: 'الشريط الجانبي' },
  { value: 'content', label: 'داخل المحتوى' },
  { value: 'footer', label: 'أسفل الصفحة' },
];

function AdsPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const { data: ads, isLoading } = useQuery('ads', async () => {
    const res = await fetch('/api/admin/ads');
    return res.json();
  });

  const createMutation = useMutation(
    async (newAd: Omit<Advertisement, 'id'>) => {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd),
      });
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ads');
        toast.success('تم إضافة الإعلان بنجاح');
        setOpenDialog(false);
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إضافة الإعلان');
      },
    }
  );

  const updateMutation = useMutation(
    async (ad: Advertisement) => {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad),
      });
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ads');
        toast.success('تم تحديث الإعلان بنجاح');
        setOpenDialog(false);
      },
      onError: () => {
        toast.error('حدث خطأ أثناء تحديث الإعلان');
      },
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ads');
        toast.success('تم حذف الإعلان بنجاح');
      },
      onError: () => {
        toast.error('حدث خطأ أثناء حذف الإعلان');
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const adData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      location: formData.get('location') as string,
      active: formData.get('active') === 'true',
      startDate: formData.get('startDate')
        ? new Date(formData.get('startDate') as string)
        : undefined,
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
    };

    if (editingAd) {
      updateMutation.mutate({ ...adData, id: editingAd.id });
    } else {
      createMutation.mutate(adData);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            إدارة الإعلانات
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingAd(null);
              setOpenDialog(true);
            }}
          >
            إضافة إعلان جديد
          </Button>
        </Box>

        <Grid container spacing={3}>
          {ads?.map((ad: Advertisement) => (
            <Grid item xs={12} md={6} key={ad.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{ad.name}</Typography>
                    <Box>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditingAd(ad);
                          setOpenDialog(true);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
                            deleteMutation.mutate(ad.id);
                          }
                        }}
                      >
                        حذف
                      </Button>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    الموقع: {locations.find((l) => l.value === ad.location)?.label}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    الحالة: {ad.active ? 'نشط' : 'غير نشط'}
                  </Typography>

                  {ad.startDate && (
                    <Typography variant="body2" color="text.secondary">
                      تاريخ البداية:{' '}
                      {format(new Date(ad.startDate), 'dd/MM/yyyy', { locale: ar })}
                    </Typography>
                  )}

                  {ad.endDate && (
                    <Typography variant="body2" color="text.secondary">
                      تاريخ النهاية:{' '}
                      {format(new Date(ad.endDate), 'dd/MM/yyyy', { locale: ar })}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingAd ? 'تعديل إعلان' : 'إضافة إعلان جديد'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="اسم الإعلان"
                    fullWidth
                    required
                    defaultValue={editingAd?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="code"
                    label="كود الإعلان"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    defaultValue={editingAd?.code}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>موقع الإعلان</InputLabel>
                    <Select
                      name="location"
                      defaultValue={editingAd?.location || ''}
                      label="موقع الإعلان"
                    >
                      {locations.map((location) => (
                        <MenuItem key={location.value} value={location.value}>
                          {location.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="تاريخ البداية"
                    value={editingAd?.startDate}
                    onChange={(date) => {
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'startDate';
                      input.value = date?.toISOString() || '';
                      document.forms[0].appendChild(input);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="تاريخ النهاية"
                    value={editingAd?.endDate}
                    onChange={(date) => {
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'endDate';
                      input.value = date?.toISOString() || '';
                      document.forms[0].appendChild(input);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="active"
                        defaultChecked={editingAd?.active ?? true}
                      />
                    }
                    label="نشط"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
              <Button type="submit" variant="contained">
                {editingAd ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default withAuth(AdsPage, { requireAuth: true, requireAdmin: true });
