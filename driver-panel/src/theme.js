import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    primary: { main: '#0c831f', contrastText: '#fff' },
    secondary: { main: '#f8c200', contrastText: '#1c1c1c' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 12, fontWeight: 600 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } } },
    MuiBottomNavigation: { styleOverrides: { root: { borderTop: '1px solid #e0e0e0', height: 64 } } },
  },
});
