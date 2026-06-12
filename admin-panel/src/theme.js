import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    primary: { main: '#0c831f', contrastText: '#fff' },
    secondary: { main: '#f8c200', contrastText: '#1c1c1c' },
    background: { default: '#f5f6fa', paper: '#ffffff' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' } } },
    MuiDrawer: { styleOverrides: { paper: { borderRight: 'none', boxShadow: '2px 0 8px rgba(0,0,0,0.08)' } } },
  },
});
