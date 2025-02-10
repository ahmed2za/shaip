import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  Save as SaveIcon,
  Publish as PublishIcon
} from '@mui/icons-material';

interface BlogPost {
  title: string;
  content: string;
  status: 'draft' | 'published';
  featuredImage?: string;
}

const BlogEditor = () => {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    status: 'draft'
  });
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeDialog, setYoutubeDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'blog-video',
        },
      }),
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      setPost(prev => ({ ...prev, content: editor.getHTML() }));
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (editor && typeof reader.result === 'string') {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(file);
    });
  }, [editor]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleYoutubeSubmit = () => {
    if (editor && youtubeUrl) {
      const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({
          src: `https://www.youtube.com/embed/${videoId}`,
          width: 640,
          height: 480,
        }).run();
      }
    }
    setYoutubeDialog(false);
    setYoutubeUrl('');
  };

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          status,
          content: editor?.getHTML()
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: status === 'published' ? 'تم نشر المقال بنجاح' : 'تم حفظ المسودة بنجاح',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'حدث خطأ أثناء الحفظ',
        severity: 'error'
      });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>محرر المدونة</Typography>

      <TextField
        fullWidth
        label="عنوان المقال"
        value={post.title}
        onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'contained' : 'outlined'}
          >
            <FormatBold />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'contained' : 'outlined'}
          >
            <FormatItalic />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
          >
            <FormatListBulleted />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
          >
            <FormatListNumbered />
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="contained" sx={{ ml: 2 }}>
          <Button {...getRootProps()}>
            <input {...getInputProps()} />
            <ImageIcon sx={{ mr: 1 }} />
            إضافة صورة
          </Button>
          <Button onClick={() => setYoutubeDialog(true)}>
            <YouTubeIcon sx={{ mr: 1 }} />
            إضافة فيديو
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 3, minHeight: 300 }}>
        <EditorContent editor={editor} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => handleSave('draft')}
        >
          حفظ كمسودة
        </Button>
        <Button
          variant="contained"
          startIcon={<PublishIcon />}
          onClick={() => handleSave('published')}
        >
          نشر
        </Button>
      </Box>

      <Dialog open={youtubeDialog} onClose={() => setYoutubeDialog(false)}>
        <DialogTitle>إضافة فيديو يوتيوب</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="رابط الفيديو"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYoutubeDialog(false)}>إلغاء</Button>
          <Button onClick={handleYoutubeSubmit} variant="contained">إضافة</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export { BlogEditor };
