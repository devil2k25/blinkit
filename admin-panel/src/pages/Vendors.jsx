import { useState } from 'react';
import { Search, CheckCircle, XCircle, Star } from 'lucide-react';
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

  const filtered = vendors.filter(v => v.storeName.toLowerCase().includes(search.toLowerCase()) || v.owner.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-gray-500 text-sm">{vendors.filter(v => !v.isApproved).length} pending approvals</p>
      </div>

      {vendors.filter(v => !v.isApproved).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">⚠ Pending Approvals</h3>
          <div className="space-y-3">
            {vendors.filter(v => !v.isApproved).map(v => (
              <div key={v.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div>
                  <p className="font-medium text-gray-800">{v.storeName}</p>
                  <p className="text-sm text-gray-500">{v.owner} · {v.location}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(v.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => reject(v.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="pb-3 pt-2 px-3 font-medium">Store</th>
                <th className="pb-3 pt-2 px-3 font-medium">Location</th>
                <th className="pb-3 pt-2 px-3 font-medium">Orders</th>
                <th className="pb-3 pt-2 px-3 font-medium">Rating</th>
                <th className="pb-3 pt-2 px-3 font-medium">Earnings</th>
                <th className="pb-3 pt-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.filter(v => v.isApproved).map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <p className="font-medium text-gray-800">{v.storeName}</p>
                    <p className="text-xs text-gray-500">{v.owner}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{v.location}</td>
                  <td className="py-3 px-3 font-medium">{v.totalOrders}</td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{v.rating}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-green-700">{v.earnings}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approved</span>
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
