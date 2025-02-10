import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/Layout';

// Mock blog posts data
const mockPosts = [
  {
    id: '1',
    title: 'كيف تختار الشركة المناسبة؟',
    content: 'محتوى المقال...',
    excerpt: 'دليل شامل لاختيار الشركة المناسبة لاحتياجاتك',
    status: 'published',
    publishDate: '2024-02-10',
    author: {
      name: 'أحمد محمد',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '2',
    title: 'أفضل الشركات الناشئة في 2024',
    content: 'محتوى المقال...',
    excerpt: 'تعرف على أبرز الشركات الناشئة في المملكة',
    status: 'draft',
    publishDate: '2024-02-11',
    author: {
      name: 'سارة أحمد',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  }
];

export default function ContentManagement() {
  const [posts, setPosts] = useState(mockPosts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDialog = (post?: any) => {
    setEditingPost(post || {
      id: String(Date.now()),
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      author: {
        name: 'أحمد محمد',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
  };

  const handleSavePost = () => {
    if (editingPost) {
      const newPosts = [...posts];
      const index = newPosts.findIndex((p) => p.id === editingPost.id);
      if (index > -1) {
        newPosts[index] = editingPost;
      } else {
        newPosts.push(editingPost);
      }
      setPosts(newPosts);
    }
    handleCloseDialog();
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Box p={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">إدارة المحتوى</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            إضافة مقال جديد
          </Button>
        </Stack>

        <TextField
          fullWidth
          label="بحث في المقالات"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">{post.title}</Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(post)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Typography color="text.secondary">
                      {post.excerpt}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Chip
                        label={post.status === 'published' ? 'منشور' : 'مسودة'}
                        color={post.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {post.publishDate}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPost?.id ? 'تعديل مقال' : 'إضافة مقال جديد'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="عنوان المقال"
                value={editingPost?.title || ''}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="مقتطف"
                multiline
                rows={2}
                value={editingPost?.excerpt || ''}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, excerpt: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="المحتوى"
                multiline
                rows={6}
                value={editingPost?.content || ''}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, content: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>إلغاء</Button>
            <Button onClick={handleSavePost} variant="contained">
              حفظ
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
