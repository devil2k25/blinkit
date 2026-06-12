export const MOCK_DELIVERIES = [
  {
    id: 'del_001',
    orderId: '#BLK-3001',
    pickup: {
      storeName: 'Fresh Farms - Connaught Place',
      address: '14, Connaught Place, New Delhi - 110001',
      distance: '1.2 km'
    },
    delivery: {
      customerName: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: 'B-42, Rajouri Garden, New Delhi - 110027',
      distance: '3.5 km'
    },
    items: ['Amul Milk 1L x2', 'Britannia Bread x1', 'Lays Chips x3'],
    earnings: 45,
    status: 'available',
    distance: '4.7 km',
    estimatedTime: '18 mins',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'del_002',
    orderId: '#BLK-3002',
    pickup: {
      storeName: 'Blinkit Store - Karol Bagh',
      address: '88, Ajmal Khan Road, Karol Bagh, New Delhi - 110005',
      distance: '0.8 km'
    },
    delivery: {
      customerName: 'Amit Verma',
      phone: '+91 87654 32109',
      address: '45, Patel Nagar, New Delhi - 110008',
      distance: '2.1 km'
    },
    items: ['Maggi Noodles x4', 'Coca Cola 2L x1', 'Haldiram Bhujia x2'],
    earnings: 38,
    status: 'available',
    distance: '2.9 km',
    estimatedTime: '12 mins',
    createdAt: '2024-01-15T10:45:00Z'
  },
  {
    id: 'del_003',
    orderId: '#BLK-3003',
    pickup: {
      storeName: 'QuickMart - Lajpat Nagar',
      address: '23, Central Market, Lajpat Nagar, New Delhi - 110024',
      distance: '1.5 km'
    },
    delivery: {
      customerName: 'Sneha Gupta',
      phone: '+91 76543 21098',
      address: '67, Defence Colony, New Delhi - 110024',
      distance: '1.8 km'
    },
    items: ['Dettol Soap x3', 'Surf Excel 1kg x1', 'Colgate Toothpaste x2'],
    earnings: 32,
    status: 'available',
    distance: '3.3 km',
    estimatedTime: '14 mins',
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'del_004',
    orderId: '#BLK-3004',
    pickup: {
      storeName: 'Blinkit Express - Dwarka',
      address: 'Sector 12, Dwarka, New Delhi - 110075',
      distance: '0.5 km'
    },
    delivery: {
      customerName: 'Rohit Singh',
      phone: '+91 65432 10987',
      address: 'Sector 7, Dwarka, New Delhi - 110075',
      distance: '1.2 km'
    },
    items: ['Basmati Rice 5kg x1', 'Toor Dal 1kg x2', 'Cooking Oil 1L x1'],
    earnings: 55,
    status: 'available',
    distance: '1.7 km',
    estimatedTime: '8 mins',
    createdAt: '2024-01-15T11:15:00Z'
  },
  {
    id: 'del_005',
    orderId: '#BLK-3005',
    pickup: {
      storeName: 'Fresh Farms - Vasant Kunj',
      address: 'D-2, Vasant Kunj, New Delhi - 110070',
      distance: '2.0 km'
    },
    delivery: {
      customerName: 'Kavita Nair',
      phone: '+91 54321 09876',
      address: 'C-Block, Vasant Vihar, New Delhi - 110057',
      distance: '3.0 km'
    },
    items: ['Tomatoes 1kg x2', 'Onions 1kg x1', 'Paneer 200g x2', 'Curd 500g x1'],
    earnings: 42,
    status: 'available',
    distance: '5.0 km',
    estimatedTime: '20 mins',
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: 'del_006',
    orderId: '#BLK-3006',
    pickup: {
      storeName: 'Blinkit Store - Saket',
      address: 'Select CityWalk, Saket, New Delhi - 110017',
      distance: '0.3 km'
    },
    delivery: {
      customerName: 'Arjun Mehta',
      phone: '+91 99887 76655',
      address: '12, Green Park Extension, New Delhi - 110016',
      distance: '2.5 km'
    },
    items: ['Amul Butter 500g x1', 'Brown Bread x2', 'Orange Juice 1L x1', 'Eggs 12pcs x1'],
    earnings: 48,
    status: 'active',
    distance: '2.8 km',
    estimatedTime: '11 mins',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'del_007',
    orderId: '#BLK-2995',
    pickup: {
      storeName: 'Blinkit Express - Rohini',
      address: 'Sector 9, Rohini, New Delhi - 110085',
      distance: '0.9 km'
    },
    delivery: {
      customerName: 'Deepika Joshi',
      phone: '+91 43210 98765',
      address: 'Sector 11, Rohini, New Delhi - 110085',
      distance: '1.4 km'
    },
    items: ['Parle-G Biscuits x5', 'Tea Bags x1', 'Sugar 1kg x1'],
    earnings: 30,
    status: 'completed',
    distance: '2.3 km',
    estimatedTime: '10 mins',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'del_008',
    orderId: '#BLK-2990',
    pickup: {
      storeName: 'QuickMart - Janakpuri',
      address: 'District Centre, Janakpuri, New Delhi - 110058',
      distance: '1.1 km'
    },
    delivery: {
      customerName: 'Vikram Kapoor',
      phone: '+91 32109 87654',
      address: 'B-Block, Janakpuri, New Delhi - 110058',
      distance: '2.0 km'
    },
    items: ['Dove Shampoo x1', 'Lux Soap x3', 'Face Wash x1'],
    earnings: 35,
    status: 'completed',
    distance: '3.1 km',
    estimatedTime: '13 mins',
    createdAt: '2024-01-15T07:30:00Z'
  },
  {
    id: 'del_009',
    orderId: '#BLK-2985',
    pickup: {
      storeName: 'Fresh Farms - Pitampura',
      address: 'Aggarwal Cyber Plaza, Pitampura, New Delhi - 110034',
      distance: '0.7 km'
    },
    delivery: {
      customerName: 'Meena Agarwal',
      phone: '+91 21098 76543',
      address: 'TV Tower Road, Pitampura, New Delhi - 110034',
      distance: '1.8 km'
    },
    items: ['Apple 1kg x1', 'Banana Dozen x1', 'Grapes 500g x1', 'Mango Juice x2'],
    earnings: 52,
    status: 'completed',
    distance: '2.5 km',
    estimatedTime: '11 mins',
    createdAt: '2024-01-15T07:00:00Z'
  },
  {
    id: 'del_010',
    orderId: '#BLK-2980',
    pickup: {
      storeName: 'Blinkit Store - Greater Kailash',
      address: 'M-Block Market, GK-1, New Delhi - 110048',
      distance: '1.3 km'
    },
    delivery: {
      customerName: 'Suresh Patel',
      phone: '+91 10987 65432',
      address: 'N-Block, GK-2, New Delhi - 110048',
      distance: '2.2 km'
    },
    items: ['Chicken 500g x2', 'Curd 1kg x1', 'Green Chilli x1'],
    earnings: 60,
    status: 'completed',
    distance: '3.5 km',
    estimatedTime: '15 mins',
    createdAt: '2024-01-14T18:00:00Z'
  },
  {
    id: 'del_011',
    orderId: '#BLK-2975',
    pickup: {
      storeName: 'Blinkit Express - Mayur Vihar',
      address: 'Phase 1, Mayur Vihar, New Delhi - 110091',
      distance: '0.6 km'
    },
    delivery: {
      customerName: 'Nisha Tiwari',
      phone: '+91 09876 54321',
      address: 'Phase 3, Mayur Vihar, New Delhi - 110096',
      distance: '3.1 km'
    },
    items: ['Insulin Pen x1', 'Glucose Monitor x1', 'Cotton Rolls x2'],
    earnings: 70,
    status: 'completed',
    distance: '3.7 km',
    estimatedTime: '16 mins',
    createdAt: '2024-01-14T17:00:00Z'
  },
  {
    id: 'del_012',
    orderId: '#BLK-2970',
    pickup: {
      storeName: 'QuickMart - Shahdara',
      address: 'Near Metro Station, Shahdara, New Delhi - 110032',
      distance: '1.8 km'
    },
    delivery: {
      customerName: 'Ramesh Yadav',
      phone: '+91 98765 12345',
      address: 'Vivek Vihar, New Delhi - 110095',
      distance: '4.0 km'
    },
    items: ['Atta 10kg x1', 'Ghee 500g x1'],
    earnings: 65,
    status: 'cancelled',
    distance: '5.8 km',
    estimatedTime: '22 mins',
    createdAt: '2024-01-14T16:00:00Z'
  }
]

export const ACTIVE_DELIVERY = {
  ...MOCK_DELIVERIES.find(d => d.id === 'del_006'),
  currentStep: 1,
  otp: '4521'
}

export const WEEKLY_EARNINGS = [
  { day: 'Mon', amount: 420, deliveries: 6 },
  { day: 'Tue', amount: 580, deliveries: 8 },
  { day: 'Wed', amount: 390, deliveries: 5 },
  { day: 'Thu', amount: 710, deliveries: 10 },
  { day: 'Fri', amount: 650, deliveries: 9 },
  { day: 'Sat', amount: 850, deliveries: 12 },
  { day: 'Sun', amount: 240, deliveries: 3 }
]
