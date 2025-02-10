import { useState } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
  cols?: number;
}

export function ImageGallery({ images, cols = 3 }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (!images.length) return null;

  return (
    <>
      <ImageList cols={isMobile ? 2 : cols} gap={8}>
        {images.map((image, index) => (
          <ImageListItem
            key={image}
            onClick={() => handleOpen(image, index)}
            sx={{ cursor: 'pointer' }}
          >
            <img
              src={image}
              alt={`صورة ${index + 1}`}
              loading="lazy"
              style={{
                borderRadius: '8px',
                height: '200px',
                objectFit: 'cover',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <NavigateBefore />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          <img
            src={selectedImage}
            alt="صورة مكبرة"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
