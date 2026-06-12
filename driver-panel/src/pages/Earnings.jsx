import React, { useState } from 'react'
import { MOCK_DELIVERIES, WEEKLY_EARNINGS } from '../utils/mockData'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InventoryIcon from '@mui/icons-material/Inventory'
import toast from 'react-hot-toast'

const TABS = ['Today', 'This Week', 'This Month']

const completedDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'completed')

export default function Earnings() {
  const [tabIndex, setTabIndex] = useState(0)
  const [withdrawing, setWithdrawing] = useState(false)

  const tab = TABS[tabIndex]
  const todayEarnings = 650
  const weekEarnings = WEEKLY_EARNINGS.reduce((s, d) => s + d.amount, 0)
  const monthEarnings = 18240

  const displayEarnings = tab === 'Today' ? todayEarnings : tab === 'This Week' ? weekEarnings : monthEarnings
  const displayDeliveries = tab === 'Today' ? 8 : tab === 'This Week' ? WEEKLY_EARNINGS.reduce((s, d) => s + d.deliveries, 0) : 245

  const handleWithdraw = () => {
    setWithdrawing(true)
    setTimeout(() => {
      setWithdrawing(false)
      toast.success('Withdrawal request submitted!')
    }, 1500)
  }

  const STAT_ITEMS = [
    { label: 'Earnings', value: `₹${displayEarnings.toLocaleString()}`, icon: <CurrencyRupeeIcon sx={{ color: '#0c831f' }} />, color: '#0c831f' },
    { label: 'Deliveries', value: displayDeliveries, icon: <InventoryIcon sx={{ color: '#2563eb' }} />, color: '#2563eb' },
    { label: 'Avg/Delivery', value: `₹${Math.round(displayEarnings / displayDeliveries)}`, icon: <TrendingUpIcon sx={{ color: '#7c3aed' }} />, color: '#7c3aed' },
  ]

  return (
    <Box sx={{ p: 2, pb: '80px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>Earnings</Typography>

      {/* Balance Card */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0c831f, #166534)',
          borderRadius: 3,
          p: 2.5,
          color: '#fff',
          boxShadow: '0 4px 16px rgba(12,131,31,0.3)',
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Total Balance</Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5 }}>₹2,450</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Available for withdrawal</Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleWithdraw}
            disabled={withdrawing}
            sx={{
              bgcolor: '#fff',
              color: '#0c831f',
              fontWeight: 700,
              '&:hover': { bgcolor: '#f0fdf4' },
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.5)', color: '#0c831f' },
            }}
          >
            {withdrawing ? 'Processing...' : 'Withdraw to Bank'}
          </Button>
        </Box>
      </Box>

      {/* Period Tabs */}
      <Box sx={{ bgcolor: '#f3f4f6', borderRadius: 2, p: 0.5 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{
            minHeight: 36,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              flex: 1,
              borderRadius: 1.5,
              fontSize: 13,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: '#1f2937 !important',
              bgcolor: '#fff',
              borderRadius: 1.5,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            },
          }}
        >
          {TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      {/* Period Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
        {STAT_ITEMS.map(({ label, value, icon, color }) => (
          <Card key={label}>
            <CardContent sx={{ p: '10px !important', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>{icon}</Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1f2937' }}>{value}</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>{label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Chart */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>Weekly Earnings</Typography>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_EARNINGS} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`₹${v}`, 'Earnings']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" fill="#0c831f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>Recent Deliveries</Typography>
          {completedDeliveries.map((d, index) => (
            <Box key={d.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <InventoryIcon sx={{ fontSize: 16, color: '#0c831f' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>{d.orderId}</Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>{d.delivery.customerName} · {d.distance}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0c831f' }}>+₹{d.earnings}</Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>{d.estimatedTime}</Typography>
                </Box>
              </Box>
              {index < completedDeliveries.length - 1 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}
