import { useState, useEffect } from 'react';
import { getProducts } from '@/integrations/firebase/productService';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock_quantity: number;
  is_active: boolean;
  badge?: string;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products from Firebase
        const fetchedProducts = await getProducts();
        
        // Transform Firebase data to match our Product interface
        const transformedProducts = fetchedProducts.map((product: any) => ({
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          discount_price: product.discount_price,
          category_id: product.category || product.category_id,
          images: Array.isArray(product.images) ? product.images : [product.image || '/placeholder.svg'],
          colors: Array.isArray(product.colors) ? product.colors : ['Black'],
          sizes: Array.isArray(product.sizes) ? product.sizes : ['M', 'L', 'XL'],
          stock_quantity: product.stock_quantity || product.stock || 0,
          is_active: product.is_active !== false,
          badge: product.badge || product.tags?.[0],
          rating: product.rating || 4.5,
          review_count: product.review_count || Math.floor(Math.random() * 50) + 10,
          created_at: product.created_at || new Date().toISOString(),
          updated_at: product.updated_at || new Date().toISOString()
        }));
        
        // Filter only active products
        const activeProducts = transformedProducts.filter(product => product.is_active);
        
        setProducts(activeProducts);
        console.log(`✅ Loaded ${activeProducts.length} products from Firebase`);
        
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to refetch products (useful after adding/updating)
  const refetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      const transformedProducts = fetchedProducts.map((product: any) => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        discount_price: product.discount_price,
        category_id: product.category || product.category_id,
        images: Array.isArray(product.images) ? product.images : [product.image || '/placeholder.svg'],
        colors: Array.isArray(product.colors) ? product.colors : ['Black'],
        sizes: Array.isArray(product.sizes) ? product.sizes : ['M', 'L', 'XL'],
        stock_quantity: product.stock_quantity || product.stock || 0,
        is_active: product.is_active !== false,
        badge: product.badge || product.tags?.[0],
        rating: product.rating || 4.5,
        review_count: product.review_count || Math.floor(Math.random() * 50) + 10,
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString()
      }));
      
      const activeProducts = transformedProducts.filter(product => product.is_active);
      setProducts(activeProducts);
      
      return activeProducts;
    } catch (err) {
      console.error('❌ Error refetching products:', err);
      throw err;
    }
  };

  return { products, loading, error, refetchProducts };
};