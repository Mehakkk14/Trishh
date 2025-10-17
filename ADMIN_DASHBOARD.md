# Admin Dashboard

A comprehensive admin dashboard for TRISHH store management with all the features shown in the provided design.

## Features

### 🏠 Dashboard Overview
- **Stats Cards**: Display Total Sales ($24,350), Total Orders (1,250), Products (85), and Customers (642)
- **Products Section**: Quick view of products with images, prices, stock, and tags
- **Recent Orders**: List of recent orders with customer info, amounts, status, and dates

### 📦 Products Management
- **Product List**: View all products with search and filter capabilities
- **Add Product**: Create new products with images, descriptions, pricing, and tags
- **Edit/Delete**: Modify or remove products
- **Tag Management**: Assign tags like "Limited", "Sale", "Newly Launched", "Fresh"
- **Stock Tracking**: Monitor inventory levels

### 📋 Orders Management
- **Order List**: View all orders with filtering by status
- **Order Details**: Detailed view of individual orders
- **Status Updates**: Change order status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Customer Information**: Access customer details and shipping addresses

### 👥 Customers Management
- **Customer List**: View all registered customers
- **Customer Profiles**: Detailed customer information and order history
- **Customer Stats**: Track customer activity and purchase history
- **Customer Status**: Active, Inactive, and VIP customer management

### 🏷️ Tags Management
- **Tag Creation**: Create and manage product tags
- **Tag Categories**: Organize tags by Product, Promotion, Performance
- **Color Coding**: Assign colors to tags for better visual organization
- **Usage Tracking**: See how many products use each tag

### ⚙️ Settings Management
- **Store Configuration**: Basic store information and settings
- **Notification Settings**: Email and alert preferences
- **Security Settings**: Two-factor authentication and session management
- **Payment Options**: Configure accepted payment methods
- **Email Configuration**: SMTP settings for email notifications
- **SEO Settings**: Meta tags and search optimization

## Design Features

### 🎨 UI/UX
- **Clean Interface**: Modern, professional design matching the provided mockup
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Support for both themes
- **Intuitive Navigation**: Sidebar navigation with clear icons and labels

### 🔧 Technical Features
- **React Components**: Modular, reusable component architecture
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first styling for consistent design
- **Lucide Icons**: Modern, clean icons throughout the interface
- **Form Validation**: Proper validation for all forms and inputs

## Navigation Structure

```
📊 Dashboard     - Overview and quick stats
📦 Products      - Product management and inventory
🛒 Orders        - Order processing and fulfillment
👥 Customers     - Customer relationship management
🏷️ Tags          - Tag and category management
⚙️ Settings      - Store configuration and preferences
```

## Component Structure

```
src/components/admin/
├── AdminSidebar.tsx          - Navigation sidebar
├── DashboardOverview.tsx     - Main dashboard with stats
├── ProductsManagement.tsx    - Product CRUD operations
├── OrdersManagement.tsx      - Order management
├── CustomersManagement.tsx   - Customer management
├── TagsManagement.tsx        - Tag management
├── SettingsManagement.tsx    - Store settings
└── index.ts                  - Component exports
```

## Sample Data

The dashboard includes realistic sample data that matches the design:

- **Products**: Urban Hoodie Black ($89), Classic Hoodie White ($79), Sophisticated Gray Hoodie ($95)
- **Orders**: Recent orders with customer information and status
- **Tags**: Limited, Sale, Newly Launched, Fresh, Bestseller
- **Customers**: Sample customer profiles with order history

## Admin Access

The admin dashboard is protected and only accessible to authorized users (trishhna.studio@gmail.com by default).

## Getting Started

1. Navigate to `/admin` in your application
2. Login with admin credentials
3. Access all dashboard features through the sidebar navigation
4. Manage your store efficiently with the comprehensive tools provided

The dashboard provides a complete store management solution with professional design and robust functionality.