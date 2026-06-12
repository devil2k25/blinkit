import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    deliveryFee: 20,
    minOrderAmount: 99,
    maxDeliveryRadius: 5,
    estimatedDeliveryTime: 10,
    maintenanceMode: false,
    allowNewRegistrations: true,
  });

  const save = () => toast.success('Settings saved!');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Settings</Typography>
        <Typography variant="body2" color="text.secondary">Configure app-wide settings</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>Delivery Settings</Typography>
              <Divider sx={{ mb: 2.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  { key: 'deliveryFee', label: 'Delivery Fee (₹)' },
                  { key: 'minOrderAmount', label: 'Minimum Order Amount (₹)' },
                  { key: 'maxDeliveryRadius', label: 'Max Delivery Radius (km)' },
                  { key: 'estimatedDeliveryTime', label: 'Estimated Delivery Time (mins)' },
                ].map(({ key, label }) => (
                  <TextField
                    key={key}
                    label={label}
                    type="number"
                    value={settings[key]}
                    onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                    size="small"
                    fullWidth
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>App Settings</Typography>
              <Divider sx={{ mb: 2.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable the app for users' },
                  { key: 'allowNewRegistrations', label: 'Allow Registrations', desc: 'Allow new user signups' },
                ].map(({ key, label, desc }) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{label}</Typography>
                      <Typography variant="caption" color="text.secondary">{desc}</Typography>
                    </Box>
                    <Switch
                      checked={settings[key]}
                      onChange={() => setSettings({ ...settings, [key]: !settings[key] })}
                      color="primary"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Button variant="contained" size="large" onClick={save} sx={{ px: 4 }}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}
