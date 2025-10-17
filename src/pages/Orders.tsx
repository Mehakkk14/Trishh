import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  products: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  shipping_address: any;
  payment_status: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch user's orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { db } = await import('@/integrations/firebase/firebaseConfig');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('user_id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            status: data.status || '',
            total_amount: data.total_amount || 0,
            shipping_amount: data.shipping_amount || 0,
            tax_amount: data.tax_amount || 0,
            shipping_address: data.shipping_address || {},
            payment_status: data.payment_status || '',
            payment_method: data.payment_method || '',
            created_at: data.created_at || '',
            order_items: (data.order_items || []).map((item: any) => ({
              id: item.id || '',
              product_id: item.product_id || '',
              quantity: item.quantity || 0,
              price: item.price || 0,
              size: item.size,
              color: item.color,
              products: {
                name: item.products?.name || '',
                images: item.products?.images || [],
              },
            })),
          };
        });
        setOrders(ordersData);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'shipped':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Orders Yet</CardTitle>
            <CardDescription className="mb-6">
              Start shopping to see your orders here
            </CardDescription>
            <Button asChild>
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(order.created_at), 'PPP')}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold">
                      ₹{order.total_amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <img
                        src={item.products.images[0] || '/placeholder.svg'}
                        alt={item.products.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.products.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span> • </span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium mb-1">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        {order.shipping_address.street}<br />
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                        {order.shipping_address.country}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{(order.total_amount - order.shipping_amount - order.tax_amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{order.shipping_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{order.tax_amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total:</span>
                        <span>₹{order.total_amount.toLocaleString()}</span>
                      </div>
                      {order.payment_method && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Payment: {order.payment_method}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}