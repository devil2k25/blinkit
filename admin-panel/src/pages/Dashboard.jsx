import { useState, useEffect } from 'react';
import { Users, Store, Truck, ShoppingBag, TrendingUp, DollarSign, Package, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

const revenueData = [
  { day: 'Mon', revenue: 42000 }, { day: 'Tue', revenue: 38000 }, { day: 'Wed', revenue: 55000 },
  { day: 'Thu', revenue: 47000 }, { day: 'Fri', revenue: 68000 }, { day: 'Sat', revenue: 82000 }, { day: 'Sun', revenue: 61000 },
];

const orderStatusData = [
  { name: 'Delivered', value: 342, color: '#0c831f' },
  { name: 'Pending', value: 45, color: '#f8c200' },
  { name: 'Preparing', value: 28, color: '#3b82f6' },
  { name: 'Cancelled', value: 19, color: '#ef4444' },
];

const recentOrders = [
  { id: '#BL10234', customer: 'Priya Sharma', amount: 485, status: 'delivered', time: '10 mins ago' },
  { id: '#BL10233', customer: 'Rahul Verma', amount: 320, status: 'preparing', time: '18 mins ago' },
  { id: '#BL10232', customer: 'Anita Singh', amount: 755, status: 'pending', time: '25 mins ago' },
  { id: '#BL10231', customer: 'Vikram Patel', amount: 220, status: 'out_for_delivery', time: '32 mins ago' },
  { id: '#BL10230', customer: 'Sneha Gupta', amount: 640, status: 'delivered', time: '45 mins ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="2,847" trend="+12%" color="blue" />
        <StatCard icon={Store} label="Vendors" value="48" trend="+3%" color="purple" />
        <StatCard icon={Truck} label="Active Drivers" value="23" trend="+8%" color="orange" />
        <StatCard icon={ShoppingBag} label="Total Orders" value="4,231" trend="+18%" color="green" />
        <StatCard icon={DollarSign} label="Today's Revenue" value="₹52,400" trend="+24%" color="green" />
        <StatCard icon={TrendingUp} label="Total Revenue" value="₹12.4L" trend="+31%" color="blue" />
        <StatCard icon={Package} label="Products" value="1,284" trend="+5%" color="purple" />
        <StatCard icon={CheckCircle} label="Delivered Today" value="186" trend="+14%" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c831f" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0c831f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0c831f" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <a href="/orders" className="text-sm text-green-600 hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-3 font-mono text-gray-700">{o.id}</td>
                  <td className="py-3 text-gray-800">{o.customer}</td>
                  <td className="py-3 font-medium">₹{o.amount}</td>
                  <td className="py-3"><Badge status={o.status} /></td>
                  <td className="py-3 text-gray-500">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
