import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'products';

export interface ProductData {
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  category?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  stock_quantity?: number;
  badge?: string;
  rating?: number;
  is_active?: boolean;
  created_at?: string;
  [key: string]: any;
}

export async function addProduct(product: ProductData): Promise<string> {
  try {
    console.log('🔥 Adding product to Firebase:', product.name);
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: product.is_active !== false
    });
    console.log('✅ Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  }
}

export async function getProducts(): Promise<any[]> {
  try {
    console.log('🔍 Fetching products from Firebase...');
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    console.log(`✅ Fetched ${products.length} products from Firebase`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, product: Partial<ProductData>): Promise<void> {
  try {
    console.log('🔄 Updating product:', productId);
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      ...product,
      updated_at: new Date().toISOString()
    });
    console.log('✅ Product updated successfully');
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    console.log('🗑️ Deleting product:', productId);
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    console.log('✅ Product deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
}
