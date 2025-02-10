import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  Stack,
  Rating,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Company } from '@/types';

interface CompanyProfileProps {
  company: Company;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ company }) => {
  const socialMedia = company.socialMedia ? JSON.parse(company.socialMedia as string) : {};

  const renderSocialMediaLinks = () => {
    const links = [];

    if (socialMedia.facebook) {
      links.push(
        <IconButton
          key="facebook"
          href={socialMedia.facebook}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#3b5998' }}
        >
          <FacebookIcon />
        </IconButton>
      );
    }

    if (socialMedia.twitter) {
      links.push(
        <IconButton
          key="twitter"
          href={socialMedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#1da1f2' }}
        >
          <TwitterIcon />
        </IconButton>
      );
    }

    if (socialMedia.linkedin) {
      links.push(
        <IconButton
          key="linkedin"
          href={socialMedia.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#0077b5' }}
        >
          <LinkedInIcon />
        </IconButton>
      );
    }

    if (socialMedia.instagram) {
      links.push(
        <IconButton
          key="instagram"
          href={socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#e4405f' }}
        >
          <InstagramIcon />
        </IconButton>
      );
    }

    return links;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', height: 200, mb: 2 }}>
                <Image
                  src={company.logo || '/company-placeholder.png'}
                  alt={company.name}
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {company.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <Rating value={company.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({company.reviewCount || 0} تقييم)
                </Typography>
              </Stack>

              {company.industry && (
                <Chip
                  label={company.industry}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}

              <Typography variant="body1" paragraph>
                {company.description}
              </Typography>

              <Box sx={{ mt: 2 }}>
                {company.website && (
                  <IconButton
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mr: 1 }}
                  >
                    <WebsiteIcon />
                  </IconButton>
                )}
                {renderSocialMediaLinks()}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {company.address && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationIcon color="action" />
                  <Typography variant="body2">{company.address}</Typography>
                </Stack>
              </Grid>
            )}

            {company.phoneNumber && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon color="action" />
                  <Typography variant="body2">{company.phoneNumber}</Typography>
                </Stack>
              </Grid>
            )}

            {company.email && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="action" />
                  <Typography variant="body2">{company.email}</Typography>
                </Stack>
              </Grid>
            )}
          </Grid>

          {company.services && company.services.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                الخدمات
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {company.services.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompanyProfile;
