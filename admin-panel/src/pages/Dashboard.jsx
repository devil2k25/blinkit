import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Link from '@mui/material/Link';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Welcome back! Here's what's happening today.</Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { icon: PeopleIcon, label: 'Total Users', value: '2,847', trend: '+12%', iconBg: '#dbeafe', iconColor: '#2563eb' },
          { icon: StoreIcon, label: 'Vendors', value: '48', trend: '+3%', iconBg: '#ede9fe', iconColor: '#7c3aed' },
          { icon: LocalShippingIcon, label: 'Active Drivers', value: '23', trend: '+8%', iconBg: '#ffedd5', iconColor: '#ea580c' },
          { icon: ShoppingBagIcon, label: 'Total Orders', value: '4,231', trend: '+18%', iconBg: '#dcfce7', iconColor: '#0c831f' },
          { icon: AttachMoneyIcon, label: "Today's Revenue", value: '₹52,400', trend: '+24%', iconBg: '#dcfce7', iconColor: '#0c831f' },
          { icon: TrendingUpIcon, label: 'Total Revenue', value: '₹12.4L', trend: '+31%', iconBg: '#dbeafe', iconColor: '#2563eb' },
          { icon: InventoryIcon, label: 'Products', value: '1,284', trend: '+5%', iconBg: '#ede9fe', iconColor: '#7c3aed' },
          { icon: CheckCircleIcon, label: 'Delivered Today', value: '186', trend: '+14%', iconBg: '#ffedd5', iconColor: '#ea580c' },
        ].map((card) => (
          <Grid item xs={6} lg={3} key={card.label}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Revenue (Last 7 Days)</Typography>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Orders by Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Recent Orders</Typography>
            <Link href="/orders" underline="hover" color="primary" variant="body2">View all</Link>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Time'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map(o => (
                <TableRow key={o.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{o.amount}</TableCell>
                  <TableCell><Badge status={o.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{o.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
