import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Editor from '@/components/blog/Editor';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';

interface BlogPostForm {
  title: string;
  content: string;
  metaDescription: string;
}

const BlogPosts = () => {
  const { control, handleSubmit, reset } = useForm<BlogPostForm>({
    defaultValues: {
      title: '',
      content: '',
      metaDescription: '',
    },
  });

  const onSubmit = async (data: BlogPostForm) => {
    try {
      await axios.post('/api/blog/posts', data);
      reset();
      // Show success message
    } catch (error) {
      logger.error('BlogPosts', 'Failed to create blog post', error);
      // Show error message
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            إدارة المقالات
          </Typography>

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: 'العنوان مطلوب' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="عنوان المقال"
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
                      rules={{ required: 'الوصف المختصر مطلوب' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="الوصف المختصر"
                          fullWidth
                          multiline
                          rows={2}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="content"
                      control={control}
                      rules={{ required: 'محتوى المقال مطلوب' }}
                      render={({ field }) => (
                        <Editor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => reset()}
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                      >
                        نشر المقال
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default BlogPosts;
