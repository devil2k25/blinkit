import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
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

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="pb-3 pt-2 px-3 font-medium">Product</th>
                <th className="pb-3 pt-2 px-3 font-medium">Category</th>
                <th className="pb-3 pt-2 px-3 font-medium">Vendor</th>
                <th className="pb-3 pt-2 px-3 font-medium">Price</th>
                <th className="pb-3 pt-2 px-3 font-medium">Stock</th>
                <th className="pb-3 pt-2 px-3 font-medium">Status</th>
                <th className="pb-3 pt-2 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{p.category}</td>
                  <td className="py-3 px-3 text-gray-600">{p.vendor}</td>
                  <td className="py-3 px-3">
                    <span className="font-medium">₹{p.discountPrice || p.price}</span>
                    {p.discountPrice && <span className="text-xs text-gray-400 line-through ml-1">₹{p.price}</span>}
                  </td>
                  <td className="py-3 px-3">
                    <span className={p.stock < 20 ? 'text-red-600 font-medium' : 'text-gray-700'}>{p.stock}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={() => toggleActive(p.id)} className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={15} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
