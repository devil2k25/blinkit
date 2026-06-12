import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

const mockCategories = [
  { id: 1, name: 'Fruits & Vegetables', emoji: '🥦', products: 48, isActive: true },
  { id: 2, name: 'Dairy & Eggs', emoji: '🥛', products: 32, isActive: true },
  { id: 3, name: 'Bakery', emoji: '🍞', products: 24, isActive: true },
  { id: 4, name: 'Beverages', emoji: '🥤', products: 56, isActive: true },
  { id: 5, name: 'Snacks', emoji: '🍿', products: 89, isActive: true },
  { id: 6, name: 'Meat & Fish', emoji: '🍗', products: 22, isActive: true },
  { id: 7, name: 'Personal Care', emoji: '🧴', products: 110, isActive: true },
  { id: 8, name: 'Home & Kitchen', emoji: '🏠', products: 145, isActive: true },
  { id: 9, name: 'Baby Care', emoji: '👶', products: 67, isActive: true },
  { id: 10, name: 'Pet Food', emoji: '🐾', products: 38, isActive: false },
];

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', emoji: '' });

  const addCategory = () => {
    if (!newCat.name) return;
    setCategories([...categories, { id: Date.now(), ...newCat, products: 0, isActive: true }]);
    setNewCat({ name: '', emoji: '' });
    setShowForm(false);
    toast.success('Category added!');
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Categories</Typography>
          <Typography variant="body2" color="text.secondary">{categories.length} categories</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
          Add Category
        </Button>
      </Box>

      {showForm && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Add New Category</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Emoji"
                value={newCat.emoji}
                onChange={e => setNewCat({ ...newCat, emoji: e.target.value })}
                sx={{ width: 90 }}
                inputProps={{ style: { textAlign: 'center', fontSize: 22 } }}
              />
              <TextField
                size="small"
                placeholder="Category name"
                value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                sx={{ flex: 1 }}
              />
              <Button variant="contained" onClick={addCategory}>Add</Button>
              <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        {categories.map(c => (
          <Grid item xs={6} sm={4} lg={2.4} key={c.id}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                opacity: c.isActive ? 1 : 0.5,
                position: 'relative',
                '&:hover .cat-actions': { display: 'flex' },
                cursor: 'default',
              }}
            >
              <Typography sx={{ fontSize: 36, lineHeight: 1, mb: 1 }}>{c.emoji}</Typography>
              <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
              <Typography variant="caption" color="text.secondary">{c.products} products</Typography>
              <Box
                className="cat-actions"
                sx={{
                  display: 'none',
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  gap: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 0.25,
                  boxShadow: 1,
                }}
              >
                <IconButton size="small" color="info" sx={{ p: 0.25 }}>
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton size="small" color="error" sx={{ p: 0.25 }} onClick={() => deleteCategory(c.id)}>
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
