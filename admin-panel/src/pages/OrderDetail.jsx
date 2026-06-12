import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Package, Truck } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
          <p className="text-gray-500 text-sm">Placed {order.placedAt}</p>
        </div>
        <div className="ml-auto"><Badge status={order.status} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Package size={16} />Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit} × {item.qty}</p>
                  </div>
                  <p className="font-medium">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>₹{order.deliveryFee}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>₹{order.total}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Order Timeline</h3>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-600' : 'bg-gray-200'}`}>
                    {step.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className={`text-sm ${step.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                    <span className="text-xs text-gray-500">{step.done ? step.time : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={16} />Delivery Address</h3>
            <p className="text-sm text-gray-600">{order.address}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Customer</h3>
            <p className="text-sm font-medium text-gray-800">{order.customer.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} />{order.customer.phone}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Truck size={16} />Driver</h3>
            <p className="text-sm font-medium text-gray-800">{order.driver.name}</p>
            <p className="text-sm text-gray-500">{order.driver.vehicle}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} />{order.driver.phone}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Payment</h3>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            <p className="text-sm text-green-600 font-medium mt-1">Paid ✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}
