import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'

interface AdUnit {
  id: string
  name: string
  location: string
  code: string
  active: boolean
}

const adLocations = [
  { value: 'header', label: 'تحت الهيدر' },
  { value: 'footer', label: 'في الفوتر' },
  { value: 'sidebar', label: 'في الأطراف' },
  { value: 'article', label: 'داخل المقالات' },
  { value: 'comments', label: 'بين التعليقات' },
  { value: 'company', label: 'صفحات الشركات' }
]

function AdManager() {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([])
  const [newUnit, setNewUnit] = useState({
    name: '',
    location: '',
    code: ''
  })

  const handleAddUnit = () => {
    if (newUnit.name && newUnit.location && newUnit.code) {
      setAdUnits([
        ...adUnits,
        {
          id: Date.now().toString(),
          ...newUnit,
          active: true
        }
      ])
      setNewUnit({ name: '', location: '', code: '' })
    }
  }

  const toggleAdUnit = (id: string) => {
    setAdUnits(adUnits.map(unit =>
      unit.id === id ? { ...unit, active: !unit.active } : unit
    ))
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>إدارة الإعلانات</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>إضافة وحدة إعلانية جديدة</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="اسم الوحدة الإعلانية"
              value={newUnit.name}
              onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>موقع الإعلان</InputLabel>
              <Select
                value={newUnit.location}
                label="موقع الإعلان"
                onChange={(e) => setNewUnit({ ...newUnit, location: e.target.value })}
              >
                {adLocations.map(loc => (
                  <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="كود الإعلان"
              value={newUnit.code}
              onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value })}
              multiline
              rows={1}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAddUnit}>
              إضافة الوحدة الإعلانية
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>الوحدات الإعلانية الحالية</Typography>
      <Grid container spacing={2}>
        {adUnits.map(unit => (
          <Grid item xs={12} md={6} key={unit.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{unit.name}</Typography>
                <Typography color="textSecondary">
                  {adLocations.find(loc => loc.value === unit.location)?.label}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant={unit.active ? 'contained' : 'outlined'}
                    color={unit.active ? 'primary' : 'error'}
                    onClick={() => toggleAdUnit(unit.id)}
                  >
                    {unit.active ? 'نشط' : 'متوقف'}
                  </Button>
                  <Button variant="outlined" color="error">
                    حذف
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export { AdManager };
