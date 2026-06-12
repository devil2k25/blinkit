import { useState } from 'react';
import { Search, CheckCircle, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const mockDrivers = [
  { id: 1, name: 'Rahul Kumar', phone: '9990001111', vehicle: 'Bike · DL01AB1234', isAvailable: true, isApproved: true, deliveries: 245, earnings: '₹15,925', rating: 4.8, joined: '5 Jan 2024' },
  { id: 2, name: 'Suresh Yadav', phone: '9990002222', vehicle: 'Scooter · DL02CD5678', isAvailable: false, isApproved: true, deliveries: 189, earnings: '₹12,285', rating: 4.6, joined: '12 Jan 2024' },
  { id: 3, name: 'Mohan Lal', phone: '9990003333', vehicle: 'Bike · DL03EF9012', isAvailable: true, isApproved: true, deliveries: 312, earnings: '₹20,280', rating: 4.9, joined: '2 Dec 2023' },
  { id: 4, name: 'Deepak Singh', phone: '9990004444', vehicle: 'Bike · DL04GH3456', isAvailable: false, isApproved: false, deliveries: 0, earnings: '₹0', rating: 0, joined: '1 Apr 2024' },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [search, setSearch] = useState('');

  const approve = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, isApproved: true } : d));
    toast.success('Driver approved!');
  };

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
        <p className="text-gray-500 text-sm">{drivers.filter(d => d.isAvailable).length} currently available</p>
      </div>

      {drivers.filter(d => !d.isApproved).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">⚠ Pending Driver Approvals</h3>
          {drivers.filter(d => !d.isApproved).map(d => (
            <div key={d.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <div>
                <p className="font-medium text-gray-800">{d.name}</p>
                <p className="text-sm text-gray-500">{d.phone} · {d.vehicle}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(d.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  <CheckCircle size={14} /> Approve
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="pb-3 pt-2 px-3 font-medium">Driver</th>
                <th className="pb-3 pt-2 px-3 font-medium">Vehicle</th>
                <th className="pb-3 pt-2 px-3 font-medium">Status</th>
                <th className="pb-3 pt-2 px-3 font-medium">Deliveries</th>
                <th className="pb-3 pt-2 px-3 font-medium">Earnings</th>
                <th className="pb-3 pt-2 px-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.filter(d => d.isApproved).map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">{d.name[0]}</div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${d.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{d.vehicle}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {d.isAvailable ? '● Available' : '○ Offline'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium">{d.deliveries}</td>
                  <td className="py-3 px-3 font-medium text-green-700">{d.earnings}</td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{d.rating}</span>
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
