import { createTheme } from '@mui/material/styles';
import { red, green, orange } from '@mui/material/colors';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#00b67a',
      light: '#42c692',
      dark: '#008055',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2b3445',
      light: '#535c6d',
      dark: '#1e2532',
      contrastText: '#ffffff',
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[700],
    },
    warning: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
    },
    success: {
      main: green[500],
      light: green[300],
      dark: green[700],
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2b3445',
      secondary: '#677487',
    },
  },
  typography: {
    fontFamily: [
      'Cairo',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
