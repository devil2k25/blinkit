import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badge from '../components/ui/Badge';

const statuses = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const mockOrders = [
  { id: '#BL10234', customer: 'Priya Sharma', vendor: 'Fresh Mart', items: 4, amount: 485, status: 'delivered', driver: 'Rahul K.', date: '12 Jun 2024, 10:30' },
  { id: '#BL10233', customer: 'Rahul Verma', vendor: 'Daily Needs', items: 2, amount: 320, status: 'preparing', driver: '—', date: '12 Jun 2024, 10:15' },
  { id: '#BL10232', customer: 'Anita Singh', vendor: 'Fresh Mart', items: 6, amount: 755, status: 'pending', driver: '—', date: '12 Jun 2024, 10:05' },
  { id: '#BL10231', customer: 'Vikram Patel', vendor: 'Fresh Mart', items: 3, amount: 220, status: 'out_for_delivery', driver: 'Suresh Y.', date: '12 Jun 2024, 09:50' },
  { id: '#BL10230', customer: 'Sneha Gupta', vendor: 'Daily Needs', items: 5, amount: 640, status: 'delivered', driver: 'Mohan L.', date: '12 Jun 2024, 09:30' },
  { id: '#BL10229', customer: 'Arjun Nair', vendor: 'Fresh Mart', items: 1, amount: 120, status: 'cancelled', driver: '—', date: '12 Jun 2024, 09:10' },
  { id: '#BL10228', customer: 'Kavya Reddy', vendor: 'Daily Needs', items: 7, amount: 890, status: 'confirmed', driver: '—', date: '12 Jun 2024, 09:00' },
  { id: '#BL10227', customer: 'Suresh Mehta', vendor: 'Fresh Mart', items: 3, amount: 365, status: 'delivered', driver: 'Rahul K.', date: '12 Jun 2024, 08:45' },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = mockOrders.filter(o => {
    const matchStatus = activeTab === 'all' || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Orders</Typography>
        <Typography variant="body2" color="text.secondary">{mockOrders.length} orders today</Typography>
      </Box>

      {/* Status tabs */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
        {statuses.map(s => (
          <Button
            key={s}
            variant={activeTab === s ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setActiveTab(s)}
            sx={{ whiteSpace: 'nowrap', borderRadius: 5, textTransform: 'capitalize', flexShrink: 0 }}
          >
            {s.replace(/_/g, ' ')}
            <Box component="span" sx={{ ml: 0.75, opacity: 0.7, fontSize: 11 }}>
              ({mockOrders.filter(o => s === 'all' || o.status === s).length})
            </Box>
          </Button>
        ))}
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <TextField
            size="small"
            placeholder="Search orders..."
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
                {['Order ID', 'Customer', 'Vendor', 'Items', 'Amount', 'Status', 'Driver', 'Date', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{o.vendor}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{o.items} items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{o.amount}</TableCell>
                  <TableCell><Badge status={o.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{o.driver}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{o.date}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="info" onClick={() => navigate(`/orders/${o.id}`)}>
                      <VisibilityIcon sx={{ fontSize: 16 }} />
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
