import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendValue,
  iconBg = '#dcfce7',
  iconColor = '#0c831f',
}) {
  const isPositive = trend === 'up' || (typeof trend === 'string' && trend.startsWith('+'))

  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon sx={{ fontSize: 22, color: iconColor }} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700} noWrap sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {label}
          </Typography>
          {trendValue !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                color: isPositive ? 'success.main' : 'error.main',
              }}
            >
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              <Typography variant="caption" fontWeight={600}>
                {trendValue}% vs last week
              </Typography>
            </Box>
          )}
          {trend && trendValue === undefined && (
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: isPositive ? 'success.main' : 'error.main', display: 'block', mt: 0.5 }}
            >
              {trend}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
