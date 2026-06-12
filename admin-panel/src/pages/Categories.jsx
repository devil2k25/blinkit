import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Add New Category</h3>
          <div className="flex gap-3">
            <input placeholder="Emoji (e.g. 🛒)" value={newCat.emoji} onChange={e => setNewCat({ ...newCat, emoji: e.target.value })} className="border rounded-lg px-3 py-2 w-24 text-center text-xl" />
            <input placeholder="Category name" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="border rounded-lg px-3 py-2 flex-1" />
            <button onClick={addCategory} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Add</button>
            <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(c => (
          <div key={c.id} className={`bg-white rounded-xl shadow-sm p-4 text-center relative group ${!c.isActive ? 'opacity-60' : ''}`}>
            <div className="text-4xl mb-2">{c.emoji}</div>
            <p className="font-medium text-gray-800 text-sm">{c.name}</p>
            <p className="text-xs text-gray-500 mt-1">{c.products} products</p>
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <button className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Edit size={12} /></button>
              <button onClick={() => deleteCategory(c.id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
