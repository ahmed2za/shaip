import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { client } from '@/lib/client';
import { useUser } from '@/hooks/useUser';
import { ImageUpload } from '@/components/common/ImageUpload';
import toast from 'react-hot-toast';

const categories = [
  'مطاعم',
  'فنادق',
  'سياحة',
  'تسوق',
  'صحة',
  'تعليم',
  'خدمات',
  'ترفيه',
  'رياضة',
  'عقارات',
  'سيارات',
  'تقنية',
  'أخرى',
];

const cities = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'تبوك',
  'أبها',
  'حائل',
  'جازان',
  'نجران',
  'الباحة',
  'سكاكا',
  'عرعر',
];

export default function CompanySetup() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [] as string[],
    location: '',
    website: '',
    phone: '',
    workingHours: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
    },
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = '';
      let coverImageUrl = '';
      const imageUrls: string[] = [];

      // 1. Upload images to local storage
      if (logo) {
        const { path, error: logoError } = await client.storage.uploadFile(
          'companies',
          `${Date.now()}-${logo.name}`,
          logo
        );
        if (logoError) throw logoError;
        logoUrl = client.storage.getPublicUrl(path).data.publicUrl;
      }

      if (coverImage) {
        const { path, error: coverError } = await client.storage.uploadFile(
          'companies',
          `${Date.now()}-${coverImage.name}`,
          coverImage
        );
        if (coverError) throw coverError;
        coverImageUrl = client.storage.getPublicUrl(path).data.publicUrl;
      }

      for (const image of images) {
        const { path, error: imageError } = await client.storage.uploadFile(
          'companies',
          `${Date.now()}-${image.name}`,
          image
        );
        if (imageError) throw imageError;
        imageUrls.push(client.storage.getPublicUrl(path).data.publicUrl);
      }

      // 2. Create company in database
      const { data: company, error: companyError } = await client.from('companies').insert({
        name: formData.name,
        description: formData.description,
        logo_url: logoUrl,
        cover_image_url: coverImageUrl,
        image_urls: imageUrls,
        categories: formData.categories,
        location: formData.location,
        contact_info: {
          phone: formData.phone,
          email: '',
          website: formData.website,
          social_media: {
            facebook: '',
            twitter: '',
            instagram: ''
          }
        },
        owner_id: user?.id
      });

      if (companyError) throw companyError;

      // 3. Update user role to company owner
      const { error: userError } = await client.from('users')
        .update({ role: 'company_owner' }, { returning: 'minimal' })
        await client.from('users')
        .eq('id', user?.id);

      if (userError) throw userError;

      router.push(`/company/${company.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء إنشاء الشركة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          إعداد الشركة
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                multiline
                rows={4}
                label="وصف الشركة"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={categories}
                value={formData.categories}
                onChange={(_, newValue) => setFormData({ ...formData, categories: newValue })}
                renderInput={(params) => (
                  <TextField {...params} label="التصنيفات" placeholder="اختر التصنيفات" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={cities}
                value={formData.location}
                onChange={(_, newValue) => setFormData({ ...formData, location: newValue || '' })}
                renderInput={(params) => (
                  <TextField {...params} label="المدينة" required />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الموقع الإلكتروني"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                ساعات العمل
              </Typography>
              {Object.entries(formData.workingHours).map(([day, hours]) => (
                <TextField
                  key={day}
                  fullWidth
                  label={day}
                  value={hours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHours: {
                        ...formData.workingHours,
                        [day]: e.target.value,
                      },
                    })
                  }
                  margin="normal"
                  placeholder="مثال: 9:00 - 17:00"
                />
              ))}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                الصور
              </Typography>
              <Box sx={{ mb: 2 }}>
                <ImageUpload
                  label="شعار الشركة"
                  onFileSelect={(files) => setLogo(files && files.length > 0 ? files[0] : null)}
                  preview={logo ? URL.createObjectURL(logo) : undefined}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <ImageUpload
                  label="صورة الغلاف"
                  onFileSelect={(files: FileList) => setCoverImage(files && files.length > 0 ? files[0] : null)}
                  preview={coverImage ? URL.createObjectURL(coverImage) : undefined}
                />
              </Box>
              <Box>
                <ImageUpload
                  label="صور إضافية"
                  multiple
                  onFileSelect={(files) => setImages(Array.from(files))}
                  previews={images.map(file => URL.createObjectURL(file))}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'إنشاء الشركة'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
