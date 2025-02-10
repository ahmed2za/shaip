import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/common/Editor'), { ssr: false });

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  createdAt: string;
  status: 'draft' | 'published';
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    image: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/company/blog');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch blog posts');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary,
      image: post.image,
      status: post.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      try {
        await fetch(`/api/company/blog/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف المنشور بنجاح');
        fetchPosts();
      } catch (err) {
        setError('Failed to delete blog post');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPost) {
        // Update existing post
        await fetch(`/api/company/blog/${selectedPost._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم تحديث المنشور بنجاح');
      } else {
        // Create new post
        await fetch('/api/company/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم إضافة المنشور بنجاح');
      }
      setDialogOpen(false);
      setSelectedPost(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        image: '',
        status: 'draft',
      });
      fetchPosts();
    } catch (err) {
      setError('Failed to save blog post');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">إدارة المدونة</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPost(null);
            setFormData({
              title: '',
              content: '',
              summary: '',
              image: '',
              status: 'draft',
            });
            setDialogOpen(true);
          }}
        >
          إضافة منشور
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

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {post.summary}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="caption"
                  color={post.status === 'published' ? 'success.main' : 'warning.main'}
                >
                  {post.status === 'published' ? 'منشور' : 'مسودة'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(post)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(post._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedPost ? 'تعديل منشور' : 'إضافة منشور جديد'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                label="عنوان المنشور"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="ملخص المنشور"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="رابط الصورة"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                محتوى المنشور
              </Typography>
              <Editor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button
              type="submit"
              variant="contained"
              color={formData.status === 'published' ? 'primary' : 'warning'}
            >
              {formData.status === 'published' ? 'نشر' : 'حفظ كمسودة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
