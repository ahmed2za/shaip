import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from '@mui/icons-material';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <Box sx={{ mb: 2, direction: 'ltr' }}>
      <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
        <Tooltip title="تراجع">
          <IconButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="إعادة">
          <IconButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
        <Tooltip title="غامق">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>
        <Tooltip title="مائل">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
        <Tooltip title="قائمة نقطية">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>
        <Tooltip title="قائمة رقمية">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
        <Tooltip title="اقتباس">
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>
        <Tooltip title="رابط">
          <IconButton
            onClick={addLink}
            className={editor.isActive('link') ? 'is-active' : ''}
          >
            <LinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="صورة">
          <IconButton onClick={addImage}>
            <ImageIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none rtl',
        dir: 'rtl',
      },
    },
  });

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        '& .ProseMirror': {
          minHeight: '200px',
          outline: 'none',
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
        },
      }}
    >
      <MenuBar editor={editor} />
      <Divider sx={{ mb: 2 }} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default Editor;
