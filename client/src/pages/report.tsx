import { Container, Typography, Paper, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

const ReportProblem = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        الإبلاغ عن مشكلة
      </Typography>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="problem-type-label">نوع المشكلة</InputLabel>
            <Select
              labelId="problem-type-label"
              name="type"
              value={formData.type}
              label="نوع المشكلة"
              onChange={handleChange}
              required
            >
              <MenuItem value="technical">مشكلة تقنية</MenuItem>
              <MenuItem value="content">محتوى غير لائق</MenuItem>
              <MenuItem value="spam">بريد مزعج أو احتيال</MenuItem>
              <MenuItem value="other">مشكلة أخرى</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label="وصف المشكلة"
            value={formData.description}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            type="email"
            name="email"
            label="البريد الإلكتروني للتواصل"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ py: 1.5 }}
          >
            إرسال البلاغ
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          سنقوم بمراجعة بلاغك والرد عليك في أقرب وقت ممكن
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          للحالات العاجلة، يمكنك التواصل معنا مباشرة عبر البريد الإلكتروني: support@misdaqia.com
        </Typography>
      </Box>
    </Container>
  );
};

export default ReportProblem;
