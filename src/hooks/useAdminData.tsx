import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../integrations/firebase/productService';
import { getOrders, updateOrderStatus as fbUpdateOrderStatus } from '../integrations/firebase/orderService';
import { db } from '../integrations/firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface AdminStats {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_products: number;
  newsletter_subscribers: number;
  pending_orders: number;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  profiles?: {
    full_name: string | null;
  } | null;
  order_items?: {
    quantity: number;
    products?: {
      name: string;
    } | null;
  }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  images: string[];
  description: string;
  colors: string[];
  sizes: string[];
  badge?: string;
}

interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  created_at: string;
  orders_count: number;
  total_spent: number;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const orders = ordersSnap.docs.map(doc => doc.data());
      // Products
      const productsSnap = await getDocs(collection(db, 'products'));
      const products = productsSnap.docs.map(doc => doc.data());
      // Customers (profiles)
      const profilesSnap = await getDocs(collection(db, 'profiles'));
      const customers = profilesSnap.docs.map(doc => doc.data());
      // Newsletter subscribers
      const newsletterSnap = await getDocs(collection(db, 'newsletter'));
      // Pending orders
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

      setStats({
        total_orders: orders.length,
        total_revenue: orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0),
        total_customers: customers.length,
        total_products: products.length,
        newsletter_subscribers: newsletterSnap.size,
        pending_orders: pendingOrders,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch dashboard stats');
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersRaw = await getOrders();
      const orders: Order[] = (ordersRaw || []).map((o: any) => ({
        id: o.id,
        user_id: o.user_id || '',
        total_amount: o.total_amount || 0,
        status: o.status || '',
        created_at: o.created_at || '',
        shipping_address: o.shipping_address || {},
        profiles: o.profiles || null,
        order_items: o.order_items || [],
      }));
      setOrders(orders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRaw = await getProducts();
      const products: Product[] = (productsRaw || []).map((p: any) => ({
        id: p.id,
        name: p.name || '',
        price: p.price || 0,
        discount_price: p.discount_price,
        stock_quantity: p.stock_quantity || 0,
        is_active: p.is_active ?? true,
        created_at: p.created_at || '',
        images: p.images || [],
        description: p.description || '',
        colors: p.colors || [],
        sizes: p.sizes || [],
        badge: p.badge,
      }));
      setProducts(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const fetchCustomers = async () => {
    try {
  const profilesSnap = await getDocs(collection(db, 'profiles'));
  const profiles = profilesSnap.docs.map(doc => doc.data());
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const orders = ordersSnap.docs.map(doc => doc.data());
      const customers: Customer[] = profiles.map(profile => {
        // Ensure all required fields are present
        const user_id = profile.user_id || '';
        const full_name = profile.full_name || '';
        const created_at = profile.created_at || '';
        const userOrders = orders.filter((order: any) => order.user_id === user_id);
        return {
          id: profile.id,
          user_id,
          full_name,
          created_at,
          orders_count: userOrders.length,
          total_spent: userOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)
        };
      });
      setCustomers(customers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fbUpdateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      await fetchOrders();
      await fetchStats();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const updateProductFn = async (productId: string, updates: Partial<Product>) => {
    try {
      await updateProduct(productId, updates);
      toast.success('Product updated successfully');
      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const createProductFn = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      await addProduct(productData);
      toast.success('Product created successfully');
      await fetchProducts();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const deleteProductFn = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const grantAdminRole = async (userEmail: string) => {
    toast.error('Granting admin role is not implemented in Firebase.');
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchProducts(),
        fetchCustomers()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    stats,
    orders,
    products,
    customers,
    loading,
    updateOrderStatus,
    updateProduct: updateProductFn,
    createProduct: createProductFn,
    deleteProduct: deleteProductFn,
    grantAdminRole,
    refetch: {
      stats: fetchStats,
      orders: fetchOrders,
      products: fetchProducts,
      customers: fetchCustomers
    }
  };
};