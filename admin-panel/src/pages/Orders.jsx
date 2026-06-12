import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">{mockOrders.length} orders today</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map(s => (
          <button key={s} onClick={() => setActiveTab(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeTab === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            {s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            <span className="ml-1 text-xs opacity-70">({mockOrders.filter(o => s === 'all' || o.status === s).length})</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="pb-3 pt-2 px-3 font-medium">Order ID</th>
                <th className="pb-3 pt-2 px-3 font-medium">Customer</th>
                <th className="pb-3 pt-2 px-3 font-medium">Vendor</th>
                <th className="pb-3 pt-2 px-3 font-medium">Items</th>
                <th className="pb-3 pt-2 px-3 font-medium">Amount</th>
                <th className="pb-3 pt-2 px-3 font-medium">Status</th>
                <th className="pb-3 pt-2 px-3 font-medium">Driver</th>
                <th className="pb-3 pt-2 px-3 font-medium">Date</th>
                <th className="pb-3 pt-2 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-xs text-gray-700">{o.id}</td>
                  <td className="py-3 px-3 text-gray-800">{o.customer}</td>
                  <td className="py-3 px-3 text-gray-600">{o.vendor}</td>
                  <td className="py-3 px-3 text-gray-700">{o.items} items</td>
                  <td className="py-3 px-3 font-medium">₹{o.amount}</td>
                  <td className="py-3 px-3"><Badge status={o.status} /></td>
                  <td className="py-3 px-3 text-gray-600">{o.driver}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{o.date}</td>
                  <td className="py-3 px-3">
                    <button onClick={() => navigate(`/orders/${o.id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye size={15} /></button>
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
