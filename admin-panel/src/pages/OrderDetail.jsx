import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Badge from '../components/ui/Badge';

const order = {
  id: '#BL10234',
  status: 'delivered',
  customer: { name: 'Priya Sharma', phone: '9876543210', email: 'priya@gmail.com' },
  vendor: { name: 'Fresh Mart', phone: '9900001111' },
  driver: { name: 'Rahul Kumar', phone: '9990001111', vehicle: 'Bike · DL01AB1234' },
  address: '42, Connaught Place, New Delhi - 110001',
  items: [
    { name: 'Bananas', unit: '1 dozen', qty: 2, price: 39 },
    { name: 'Amul Milk', unit: '1L', qty: 1, price: 65 },
    { name: 'Brown Bread', unit: '400g', qty: 1, price: 40 },
  ],
  subtotal: 183,
  deliveryFee: 20,
  discount: 0,
  total: 203,
  paymentMethod: 'COD',
  placedAt: '12 Jun 2024, 10:30 AM',
  deliveredAt: '12 Jun 2024, 10:42 AM',
};

const timeline = [
  { label: 'Order Placed', time: '10:30 AM', done: true },
  { label: 'Confirmed by Store', time: '10:31 AM', done: true },
  { label: 'Preparing', time: '10:33 AM', done: true },
  { label: 'Picked Up', time: '10:38 AM', done: true },
  { label: 'Out for Delivery', time: '10:40 AM', done: true },
  { label: 'Delivered', time: '10:42 AM', done: true },
];

export default function OrderDetail() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>Order {order.id}</Typography>
          <Typography variant="body2" color="text.secondary">Placed {order.placedAt}</Typography>
        </Box>
        <Badge status={order.status} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Order Items */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" fontWeight={600}>Order Items</Typography>
                </Box>
                {order.items.map((item, i) => (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.unit} × {item.qty}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>₹{item.price * item.qty}</Typography>
                    </Box>
                    {i < order.items.length - 1 && <Divider />}
                  </Box>
                ))}
                <Divider sx={{ mt: 1, mb: 1.5 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2">₹{order.subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Delivery Fee</Typography>
                    <Typography variant="body2">₹{order.deliveryFee}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
                    <Typography variant="subtitle2" fontWeight={700}>₹{order.total}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Order Timeline</Typography>
                {timeline.map((step, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: i < timeline.length - 1 ? 1.5 : 0 }}>
                    {step.done
                      ? <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 22, flexShrink: 0 }} />
                      : <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: 22, flexShrink: 0 }} />
                    }
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={step.done ? 500 : 400} color={step.done ? 'text.primary' : 'text.disabled'}>
                        {step.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{step.done ? step.time : ''}</Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Address */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" fontWeight={600}>Delivery Address</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">{order.address}</Typography>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Customer</Typography>
                <Typography variant="body2" fontWeight={500}>{order.customer.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{order.customer.phone}</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Driver */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocalShippingIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" fontWeight={600}>Driver</Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>{order.driver.name}</Typography>
                <Typography variant="body2" color="text.secondary">{order.driver.vehicle}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{order.driver.phone}</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Payment</Typography>
                <Typography variant="body2" color="text.secondary">{order.paymentMethod}</Typography>
                <Typography variant="body2" color="success.main" fontWeight={600} mt={0.5}>Paid ✓</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
