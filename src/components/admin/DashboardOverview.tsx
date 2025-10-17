import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  Edit,
  Trash2
} from "lucide-react";

interface DashboardOverviewProps {
  stats: {
    total_sales?: number;
    total_orders?: number;
    total_products?: number;
    total_customers?: number;
  };
  recentProducts?: any[];
  recentOrders?: any[];
}

export const DashboardOverview = ({ stats, recentProducts = [], recentOrders = [] }: DashboardOverviewProps) => {
  const statsCards = [
    {
      title: "Total Sales",
      value: `$${stats?.total_sales?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Orders",
      value: stats?.total_orders?.toLocaleString() || '0',
      icon: ShoppingBag,
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Products",
      value: stats?.total_products?.toLocaleString() || '0',
      icon: Package,
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Customers",
      value: stats?.total_customers?.toLocaleString() || '0',
      icon: Users,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Products</CardTitle>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              + Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                <div className="col-span-4">Product Name</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">Tags</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Products Data */}
              {recentProducts && recentProducts.length > 0 ? (
                recentProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="col-span-4 flex items-center gap-3">
                      <img 
                        src={product.images?.[0] || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-900 dark:text-white">
                      ${product.price}
                    </div>
                    <div className="col-span-2 text-gray-600 dark:text-gray-400">
                      {product.stock_quantity || 0}
                    </div>
                    <div className="col-span-2">
                      {product.badge && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-2 flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No products yet</p>
                  <p className="text-xs">Add your first product to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                <div className="col-span-3">Order ID</div>
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date</div>
              </div>

              {/* Recent Orders Data */}
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="col-span-3 font-mono text-sm text-blue-600 dark:text-blue-400">
                      #{order.id?.slice(0, 8) || 'N/A'}
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.customer_name || 'Unknown Customer'}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {order.customer_email || 'No email'}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-gray-900 dark:text-white">
                      ${order.total_amount || 0}
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant="secondary"
                        className={`${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No orders yet</p>
                  <p className="text-xs">Orders will appear here when customers make purchases</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};