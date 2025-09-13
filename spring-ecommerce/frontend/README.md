# E-Commerce Frontend

A React + TypeScript frontend for the E-Commerce application built with Vite.

## Features

- **Customer Features:**
  - Browse products
  - Add products to cart
  - Place orders
  - View order history

- **Vendor Features:**
  - Upload new products
  - Manage product inventory
  - View and manage customer orders
  - Update order status

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # User authentication
│   ├── Register.tsx    # User registration
│   ├── ProductList.tsx # Product catalog
│   ├── Cart.tsx        # Shopping cart
│   ├── Orders.tsx      # Order history
│   └── ...            # Other components
├── services/           # API services
│   └── api.ts         # Axios configuration and API calls
├── types/             # TypeScript type definitions
│   └── index.ts       # Common interfaces
├── App.tsx            # Main application component
├── App.css            # Global styles
└── main.tsx           # Application entry point
```

## API Integration

The frontend communicates with the Spring Boot backend through REST APIs:

- **Base URL:** `http://localhost:8080/api`
- **Authentication:** JWT tokens stored in localStorage
- **Image serving:** Static images served from backend

## User Types

1. **Customer:** Can browse products, manage cart, and place orders
2. **Vendor:** Can manage products and view/update order status

## Technologies Used

- React 19
- TypeScript
- Vite
- Axios for HTTP requests
- CSS3 for styling