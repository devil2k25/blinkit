import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import toast from 'react-hot-toast';

const mockDrivers = [
  { id: 1, name: 'Rahul Kumar', phone: '9990001111', vehicle: 'Bike · DL01AB1234', isAvailable: true, isApproved: true, deliveries: 245, earnings: '₹15,925', rating: 4.8, joined: '5 Jan 2024' },
  { id: 2, name: 'Suresh Yadav', phone: '9990002222', vehicle: 'Scooter · DL02CD5678', isAvailable: false, isApproved: true, deliveries: 189, earnings: '₹12,285', rating: 4.6, joined: '12 Jan 2024' },
  { id: 3, name: 'Mohan Lal', phone: '9990003333', vehicle: 'Bike · DL03EF9012', isAvailable: true, isApproved: true, deliveries: 312, earnings: '₹20,280', rating: 4.9, joined: '2 Dec 2023' },
  { id: 4, name: 'Deepak Singh', phone: '9990004444', vehicle: 'Bike · DL04GH3456', isAvailable: false, isApproved: false, deliveries: 0, earnings: '₹0', rating: 0, joined: '1 Apr 2024' },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [search, setSearch] = useState('');

  const approve = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, isApproved: true } : d));
    toast.success('Driver approved!');
  };

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const pending = drivers.filter(d => !d.isApproved);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Drivers</Typography>
        <Typography variant="body2" color="text.secondary">{drivers.filter(d => d.isAvailable).length} currently available</Typography>
      </Box>

      {pending.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'warning.light', bgcolor: '#fffbeb', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="warning.dark" mb={1.5}>
            Pending Driver Approvals
          </Typography>
          {pending.map(d => (
            <Paper key={d.id} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, mb: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>{d.name}</Typography>
                <Typography variant="caption" color="text.secondary">{d.phone} · {d.vehicle}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => approve(d.id)}>
                  Approve
                </Button>
                <Button size="small" variant="outlined" color="error" startIcon={<CancelIcon />}>
                  Reject
                </Button>
              </Box>
            </Paper>
          ))}
        </Paper>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <TextField
            size="small"
            placeholder="Search drivers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 3, width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Driver', 'Vehicle', 'Status', 'Deliveries', 'Earnings', 'Rating'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.filter(d => d.isApproved).map(d => (
                <TableRow key={d.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#3b82f6', fontSize: 14, fontWeight: 700 }}>
                          {d.name[0]}
                        </Avatar>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -1,
                            right: -1,
                            width: 11,
                            height: 11,
                            borderRadius: '50%',
                            bgcolor: d.isAvailable ? 'success.main' : 'grey.400',
                            border: '2px solid white',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{d.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{d.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{d.vehicle}</TableCell>
                  <TableCell>
                    <Chip
                      label={d.isAvailable ? 'Available' : 'Offline'}
                      color={d.isAvailable ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{d.deliveries}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{d.earnings}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                      <Typography variant="body2">{d.rating}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
