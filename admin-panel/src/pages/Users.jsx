import { useState } from 'react';
import { Search, Filter, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import Badge from '../components/ui/Badge';
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

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    toast.success('User status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{users.length} registered users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="pb-3 pt-2 px-3 font-medium">User</th>
                <th className="pb-3 pt-2 px-3 font-medium">Phone</th>
                <th className="pb-3 pt-2 px-3 font-medium">Orders</th>
                <th className="pb-3 pt-2 px-3 font-medium">Joined</th>
                <th className="pb-3 pt-2 px-3 font-medium">Status</th>
                <th className="pb-3 pt-2 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">{u.name[0]}</div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{u.phone}</td>
                  <td className="py-3 px-3 font-medium text-gray-800">{u.orders}</td>
                  <td className="py-3 px-3 text-gray-500">{u.joined}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={() => toggleStatus(u.id)} className={`p-1 rounded ${u.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                      {u.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
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
