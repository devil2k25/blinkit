import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import BoltIcon from '@mui/icons-material/Bolt';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@blinkit.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1a2035',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{ width: '100%', maxWidth: 440, borderRadius: 3, p: 4 }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, borderRadius: 2 }}>
            <BoltIcon sx={{ fontSize: 24, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Blinkit Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Control Panel
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            fullWidth
            required
            size="medium"
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            fullWidth
            required
            size="medium"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.5 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        {/* Demo credentials */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
            Demo Credentials
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Email: admin@blinkit.com
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Password: admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
