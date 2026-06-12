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
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import toast from 'react-hot-toast';

const mockUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876543210', role: 'user', isActive: true, joined: '12 Jan 2024', orders: 23 },
  { id: 2, name: 'Rahul Verma', email: 'rahul@gmail.com', phone: '9876543211', role: 'user', isActive: true, joined: '18 Jan 2024', orders: 15 },
  { id: 3, name: 'Anita Singh', email: 'anita@gmail.com', phone: '9876543212', role: 'user', isActive: false, joined: '2 Feb 2024', orders: 8 },
  { id: 4, name: 'Vikram Patel', email: 'vikram@gmail.com', phone: '9876543213', role: 'user', isActive: true, joined: '14 Feb 2024', orders: 31 },
  { id: 5, name: 'Sneha Gupta', email: 'sneha@gmail.com', phone: '9876543214', role: 'user', isActive: true, joined: '28 Feb 2024', orders: 12 },
  { id: 6, name: 'Arjun Nair', email: 'arjun@gmail.com', phone: '9876543215', role: 'user', isActive: true, joined: '5 Mar 2024', orders: 45 },
  { id: 7, name: 'Kavya Reddy', email: 'kavya@gmail.com', phone: '9876543216', role: 'user', isActive: false, joined: '10 Mar 2024', orders: 6 },
  { id: 8, name: 'Suresh Mehta', email: 'suresh@gmail.com', phone: '9876543217', role: 'user', isActive: true, joined: '22 Mar 2024', orders: 19 },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    toast.success('User status updated');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Users</Typography>
        <Typography variant="body2" color="text.secondary">{users.length} registered users</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <TextField
            size="small"
            placeholder="Search users..."
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
                {['User', 'Phone', 'Orders', 'Joined', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(u => (
                <TableRow key={u.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                        {u.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{u.phone}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{u.orders}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{u.joined}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'Active' : 'Inactive'}
                      color={u.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleStatus(u.id)}
                      color={u.isActive ? 'success' : 'default'}
                    >
                      {u.isActive ? <ToggleOnIcon sx={{ fontSize: 26 }} /> : <ToggleOffIcon sx={{ fontSize: 26 }} />}
                    </IconButton>
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
