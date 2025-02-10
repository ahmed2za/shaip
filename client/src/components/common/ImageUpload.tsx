import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

interface ImageUploadProps {
  label: string;
  onFileSelect: (files: FileList) => void;
  preview?: string;
  previews?: string[];
  multiple?: boolean;
  accept?: string;
}

export function ImageUpload({
  label,
  onFileSelect,
  preview,
  previews,
  multiple = false,
  accept = 'image/*',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>

      <Box
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography>
          اسحب وأفلت الصور هنا أو انقر للاختيار
        </Typography>
      </Box>

      {preview && (
        <Box sx={{ mt: 2, position: 'relative' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        </Box>
      )}

      {previews && previews.length > 0 && (
        <ImageList sx={{ mt: 2 }} cols={3} rowHeight={164}>
          {previews.map((previewUrl, index) => (
            <ImageListItem key={index}>
              <img
                src={previewUrl}
                alt={`Preview ${index + 1}`}
                loading="lazy"
                style={{ objectFit: 'cover', height: '100%' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
