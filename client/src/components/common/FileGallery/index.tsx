import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import { FileManager } from '@/utils/fileManager';

interface FileItem {
  id: string;
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
}

interface FileGalleryProps {
  files: FileItem[];
  onDelete?: (file: FileItem) => Promise<void>;
  onDownload?: (file: FileItem) => void;
  gridCols?: number;
}

export const FileGallery: React.FC<FileGalleryProps> = ({
  files,
  onDelete,
  onDownload,
  gridCols = 4,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const handlePreview = (file: FileItem) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  const handleDownload = async (file: FileItem) => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Default download behavior
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const isImage = (contentType: string) => contentType.startsWith('image/');

  return (
    <>
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={12 / gridCols} key={file.id}>
            <Card>
              {isImage(file.contentType) ? (
                <CardMedia
                  component="div"
                  sx={{
                    position: 'relative',
                    height: 200,
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePreview(file)}
                >
                  <Image
                    src={file.url}
                    alt={file.filename}
                    layout="fill"
                    objectFit="cover"
                  />
                </CardMedia>
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                  }}
                >
                  <FileIcon sx={{ fontSize: 64, color: 'grey.500' }} />
                </Box>
              )}
              <CardContent>
                <Typography noWrap variant="subtitle2">
                  {file.filename}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {FileManager.formatFileSize(file.size)}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handlePreview(file)}
                    title={t('fileGallery.view')}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(file)}
                    title={t('fileGallery.download')}
                  >
                    <DownloadIcon />
                  </IconButton>
                  {onDelete && (
                    <IconButton
                      size="small"
                      onClick={() => onDelete(file)}
                      title={t('fileGallery.delete')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          {selectedFile && (
            <>
              {isImage(selectedFile.contentType) ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '70vh',
                  }}
                >
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.filename}
                    layout="fill"
                    objectFit="contain"
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    py: 4,
                  }}
                >
                  <FileIcon sx={{ fontSize: 96, color: 'grey.500' }} />
                  <Typography variant="h6">{selectedFile.filename}</Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(selectedFile)}
                  >
                    {t('fileGallery.download')}
                  </Button>
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileGallery;
