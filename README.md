# Blinkit Replica — Full Stack

A complete Blinkit (quick commerce grocery delivery) replica with four panels built with React + Node.js.

## Panels

| Panel | Port | Description |
|-------|------|-------------|
| 🛒 User Panel | 3000 | Customer-facing app — browse, cart, checkout, order tracking |
| ⚙️ Admin Panel | 3001 | Manage users, vendors, drivers, orders, analytics |
| 🏪 Vendor Panel | 3002 | Store management, inventory, order processing |
| 🚴 Driver Panel | 3003 | Delivery management, earnings, navigation |
| 🔌 Backend API | 5000 | REST API serving all panels |

## Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + React Router v6  
**Backend:** Node.js + Express + MongoDB (Mongoose) + JWT Auth  
**Charts:** Recharts  
**Icons:** Lucide React  

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### Install Dependencies
```bash
npm run install:all
```

### Setup Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret
```

### Seed Database (Optional)
```bash
npm run seed
```

### Run All Services
```bash
npm run dev
```

Or run individually:
```bash
npm run backend   # API server on :5000
npm run user      # User panel on :3000
npm run admin     # Admin panel on :3001
npm run vendor    # Vendor panel on :3002
npm run driver    # Driver panel on :3003
```

## Demo Credentials

### Admin Panel (localhost:3001)
- Email: `admin@blinkit.com`
- Password: `admin123`

### Vendor Panel (localhost:3002)
- Email: `vendor1@blinkit.com`
- Password: `vendor123`

### Driver Panel (localhost:3003)
- Email: `driver1@blinkit.com`
- Password: `driver123`

### User Panel (localhost:3000)
- Email: `user@blinkit.com`
- Password: `user123`
- Or register a new account

## Features

### User Panel
- Browse products by category
- Real-time search
- Add to cart / manage cart
- Multiple delivery addresses
- Order placement (COD & Online)
- Live order tracking with status timeline
- Order history
- Profile management

### Admin Panel
- Dashboard with revenue charts & KPIs
- User management (activate/deactivate)
- Vendor approval workflow
- Driver approval & management
- Product & category management
- All orders with status updates
- Analytics & reporting

### Vendor Panel
- Store online/offline toggle
- Incoming order notifications
- Order acceptance & status management
- Product/inventory management
- Low stock alerts
- Revenue & earnings charts
- Payout management

### Driver Panel
- Online/Offline availability toggle
- Available order pickup
- Step-by-step delivery workflow
- OTP-based delivery confirmation
- Navigation integration
- Daily/weekly earnings tracking
- Performance metrics

## Architecture

```
blinkit/
├── backend/           # Express API
│   ├── src/
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/    # API routes
│   │   ├── controllers/
│   │   ├── middleware/ # Auth, error handling
│   │   └── utils/     # Seed data
│   └── server.js
├── user-panel/        # Customer React app
├── admin-panel/       # Admin React dashboard
├── vendor-panel/      # Vendor React app
└── driver-panel/      # Driver React app (mobile-first)
```
