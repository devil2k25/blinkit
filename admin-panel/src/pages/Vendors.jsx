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
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import toast from 'react-hot-toast';

const mockVendors = [
  { id: 1, storeName: 'Fresh Mart', owner: 'Ramesh Kumar', email: 'vendor1@blinkit.com', phone: '9900001111', location: 'Connaught Place, Delhi', isApproved: true, totalOrders: 320, rating: 4.5, earnings: '₹85,000', joined: '10 Jan 2024' },
  { id: 2, storeName: 'Daily Needs Store', owner: 'Suresh Yadav', email: 'vendor2@blinkit.com', phone: '9900002222', location: 'Karol Bagh, Delhi', isApproved: true, totalOrders: 210, rating: 4.3, earnings: '₹62,000', joined: '15 Jan 2024' },
  { id: 3, storeName: 'Green Basket', owner: 'Priya Verma', email: 'green@blinkit.com', phone: '9900003333', location: 'Lajpat Nagar, Delhi', isApproved: false, totalOrders: 0, rating: 0, earnings: '₹0', joined: '5 Apr 2024' },
  { id: 4, storeName: 'Super Saver Mart', owner: 'Anil Patel', email: 'saver@blinkit.com', phone: '9900004444', location: 'Dwarka, Delhi', isApproved: false, totalOrders: 0, rating: 0, earnings: '₹0', joined: '8 Apr 2024' },
];

export default function Vendors() {
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState('');

  const approve = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, isApproved: true } : v));
    toast.success('Vendor approved!');
  };

  const reject = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    toast.success('Vendor rejected');
  };

  const filtered = vendors.filter(v =>
    v.storeName.toLowerCase().includes(search.toLowerCase()) ||
    v.owner.toLowerCase().includes(search.toLowerCase())
  );

  const pending = vendors.filter(v => !v.isApproved);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Vendors</Typography>
        <Typography variant="body2" color="text.secondary">{pending.length} pending approvals</Typography>
      </Box>

      {pending.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'warning.light', bgcolor: '#fffbeb', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="warning.dark" mb={1.5}>
            Pending Approvals
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {pending.map(v => (
              <Paper key={v.id} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{v.storeName}</Typography>
                  <Typography variant="caption" color="text.secondary">{v.owner} · {v.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => approve(v.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => reject(v.id)}
                  >
                    Reject
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <TextField
            size="small"
            placeholder="Search vendors..."
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
                {['Store', 'Location', 'Orders', 'Rating', 'Earnings', 'Status'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.filter(v => v.isApproved).map(v => (
                <TableRow key={v.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{v.storeName}</Typography>
                    <Typography variant="caption" color="text.secondary">{v.owner}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{v.location}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{v.totalOrders}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                      <Typography variant="body2">{v.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{v.earnings}</TableCell>
                  <TableCell>
                    <Chip label="Approved" color="success" size="small" sx={{ fontWeight: 600, fontSize: 11 }} />
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
