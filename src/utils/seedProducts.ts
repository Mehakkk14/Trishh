// Database Seeder for TRISHH Products
// This file contains product seeds - currently disabled for clean setup
// Uncomment and modify the productSeeds array below to add demo products

import { addProduct, getProducts } from '@/integrations/firebase/productService';

export interface ProductSeed {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock_quantity: number;
  badge?: string;
  rating: number;
}

// Product seeds are currently disabled for clean setup
// Uncomment the array below if you want to add demo products
const productSeeds: ProductSeed[] = [
  // Add your product seeds here when ready
];

export const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');
    
    if (productSeeds.length === 0) {
      console.log('📝 No products to seed. Add products to the productSeeds array first.');
      return { success: true, message: 'No products to seed' };
    }
    
    // Insert new products
    console.log('📦 Inserting new products...');
    
    for (const product of productSeeds) {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        discount_price: product.discount_price || null,
        category: product.category,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        stock_quantity: product.stock_quantity,
        badge: product.badge || null,
        rating: product.rating,
        review_count: Math.floor(Math.random() * 100) + 10,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      try {
        await addProduct(productData);
        console.log(`✅ Inserted: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error inserting ${product.name}:`, error);
      }
    }
    
    console.log('🎉 Product seeding completed!');
    return { success: true, message: 'Products seeded successfully' };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error };
  }
};

// Check if products exist
export const checkProductsExist = async () => {
  try {
    const products = await getProducts();
    return products && products.length > 0;
  } catch (error) {
    console.error('Error checking products:', error);
    return false;
  }
};

export default { seedProducts, checkProductsExist };