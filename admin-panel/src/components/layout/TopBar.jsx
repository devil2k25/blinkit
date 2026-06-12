import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../context/AuthContext';

export default function TopBar({ onMenuClick }) {
  const { admin } = useAuth();
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        {/* Mobile menu button */}
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { lg: 'none' }, color: 'text.secondary' }}
          size="small"
        >
          <MenuIcon />
        </IconButton>

        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 1,
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 0.75,
            width: 260,
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          <InputBase placeholder="Search..." sx={{ fontSize: 14, flex: 1 }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Notifications */}
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <Badge variant="dot" color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* User info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}
          >
            {(admin?.avatar || admin?.name?.[0] || 'A').toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
              {admin?.name || 'Admin'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
