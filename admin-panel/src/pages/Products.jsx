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
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import toast from 'react-hot-toast';

const mockProducts = [
  { id: 1, name: 'Bananas', category: 'Fruits & Vegetables', vendor: 'Fresh Mart', price: 49, discountPrice: 39, stock: 100, unit: '1 dozen', isActive: true },
  { id: 2, name: 'Red Apples', category: 'Fruits & Vegetables', vendor: 'Fresh Mart', price: 120, discountPrice: 99, stock: 80, unit: '1 kg', isActive: true },
  { id: 3, name: 'Amul Milk 1L', category: 'Dairy & Eggs', vendor: 'Fresh Mart', price: 68, discountPrice: 65, stock: 120, unit: '1L', isActive: true },
  { id: 4, name: 'Farm Fresh Eggs', category: 'Dairy & Eggs', vendor: 'Fresh Mart', price: 84, discountPrice: 79, stock: 90, unit: '6 pcs', isActive: true },
  { id: 5, name: 'Brown Bread', category: 'Bakery', vendor: 'Daily Needs', price: 45, discountPrice: 40, stock: 50, unit: '400g', isActive: true },
  { id: 6, name: 'Coca Cola', category: 'Beverages', vendor: 'Daily Needs', price: 65, discountPrice: 60, stock: 100, unit: '750ml', isActive: true },
  { id: 7, name: 'Lays Classic', category: 'Snacks', vendor: 'Fresh Mart', price: 30, discountPrice: 28, stock: 200, unit: '73g', isActive: true },
  { id: 8, name: 'Chicken Breast', category: 'Meat & Fish', vendor: 'Daily Needs', price: 280, discountPrice: 260, stock: 40, unit: '500g', isActive: false },
];

export default function Products() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const toggleActive = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Products</Typography>
          <Typography variant="body2" color="text.secondary">{products.length} products total</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <TextField
            size="small"
            placeholder="Search products..."
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
                {['Product', 'Category', 'Vendor', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'grey.100' }}>
                        <InventoryIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.unit}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{p.category}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{p.vendor}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>₹{p.discountPrice || p.price}</Typography>
                    {p.discountPrice && (
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>₹{p.price}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: p.stock < 20 ? 'error.main' : 'text.primary', fontWeight: p.stock < 20 ? 600 : 400 }}>
                      {p.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.isActive ? 'Active' : 'Inactive'}
                      color={p.isActive ? 'success' : 'default'}
                      size="small"
                      onClick={() => toggleActive(p.id)}
                      sx={{ fontWeight: 600, fontSize: 11, cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" color="info">
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteProduct(p.id)}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
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
