
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { CustomersManagement } from "@/components/admin/CustomersManagement";
import { TagsManagement } from "@/components/admin/TagsManagement";
import { EmailManagement } from "@/components/admin/EmailManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const {
    stats,
    products,
    orders,
    updateProduct,
    createProduct,
    deleteProduct,
    updateOrderStatus,
    refetch
  } = useAdminData();

  const handleCreateProduct = async (product: any) => {
    await createProduct(product);
    if (refetch?.products) refetch.products();
    if (refetch?.stats) refetch.stats();
  };

  const handleUpdateProduct = async (id: string, product: any) => {
    await updateProduct(id, product);
    if (refetch?.products) refetch.products();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    if (refetch?.products) refetch.products();
    if (refetch?.stats) refetch.stats();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    if (refetch?.orders) refetch.orders();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            stats={{
              total_sales: stats?.total_revenue || 0,
              total_orders: stats?.total_orders || 0,
              total_products: stats?.total_products || 0,
              total_customers: stats?.total_customers || 0
            }}
            recentProducts={products?.slice(0, 3)}
            recentOrders={orders?.slice(0, 5)}
          />
        );
      case 'products':
        return (
          <ProductsManagement 
            products={products}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'orders':
        return (
          <OrdersManagement 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'customers':
        return <CustomersManagement />;
      case 'tags':
        return <TagsManagement />;
      case 'emails':
        return <EmailManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return (
          <DashboardOverview 
            stats={{
              total_sales: 0,
              total_orders: 0,
              total_products: 0,
              total_customers: 0
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          user={user}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;

