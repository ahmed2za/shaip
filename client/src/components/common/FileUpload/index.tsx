import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import useTranslation from '@/hooks/useTranslation';
import { useNotification } from '@/hooks/useNotification';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  uploading?: boolean;
  uploadProgress?: number;
  existingFiles?: Array<{ name: string; url: string }>;
  onRemove?: (fileName: string) => Promise<void>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/*', 'application/pdf'],
  uploading = false,
  uploadProgress = 0,
  existingFiles = [],
  onRemove,
}) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        // Check file size
        if (file.size > maxSize) {
          showNotification(
            'error',
            t('fileUpload.errors.fileTooBig', { maxSize: maxSize / 1024 / 1024 })
          );
          return false;
        }
        return true;
      });

      if (files.length + newFiles.length > maxFiles) {
        showNotification(
          'error',
          t('fileUpload.errors.tooManyFiles', { maxFiles })
        );
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
      await onUpload(newFiles);
    },
    [files.length, maxFiles, maxSize, onUpload, showNotification, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  });

  const handleRemove = async (fileName: string) => {
    if (onRemove) {
      try {
        await onRemove(fileName);
        showNotification('success', t('fileUpload.fileRemoved'));
      } catch (error) {
        showNotification('error', t('fileUpload.errors.removeError'));
      }
    }
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UploadIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography align="center" color="textSecondary">
            {isDragActive
              ? t('fileUpload.dropHere')
              : t('fileUpload.dragAndDrop')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('fileUpload.maxSize', { maxSize: maxSize / 1024 / 1024 })}
          </Typography>
        </Box>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="textSecondary">
            {t('fileUpload.uploading', { progress: Math.round(uploadProgress) })}
          </Typography>
        </Box>
      )}

      {(files.length > 0 || existingFiles.length > 0) && (
        <List>
          {existingFiles.map((file) => (
            <ListItem
              key={file.name}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemove(file.name)}
                  disabled={uploading}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <FileIcon sx={{ mr: 2 }} />
              <ListItemText
                primary={file.name}
                secondary={
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('fileUpload.view')}
                  </a>
                }
              />
            </ListItem>
          ))}
          {files.map((file) => (
            <ListItem
              key={file.name}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => {
                    setFiles((prev) =>
                      prev.filter((f) => f.name !== file.name)
                    );
                  }}
                  disabled={uploading}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <FileIcon sx={{ mr: 2 }} />
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;
