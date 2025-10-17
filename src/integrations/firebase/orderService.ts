import { db } from './firebaseConfig';
import { emailService } from '../../services/emailService';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDoc
} from 'firebase/firestore';

export async function getOrders() {
  const ordersCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCol);
  return orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addOrder(orderData: any) {
  const ordersCol = collection(db, 'orders');
  
  // Add timestamp and initial status
  const orderWithMetadata = {
    ...orderData,
    created_at: new Date().toISOString(),
    status: 'pending',
    order_number: `TR${Date.now().toString().slice(-6)}`
  };
  
  const docRef = await addDoc(ordersCol, orderWithMetadata);
  
  // Send order confirmation email
  try {
    const orderForEmail = {
      orderId: orderWithMetadata.order_number,
      customerName: orderData.customer_name || 'Customer',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping_cost || 0,
      tax: orderData.tax || 0,
      total: orderData.total_amount || 0,
      shippingAddress: orderData.shipping_address || {},
      estimatedDelivery: getEstimatedDelivery()
    };
    
    await emailService.sendOrderConfirmation(
      orderData.customer_email || orderData.user_email,
      orderForEmail
    );
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
  
  return docRef.id;
}

export async function updateOrder(orderId: string, updates: any) {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, updates);
}

export async function deleteOrder(orderId: string) {
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status,
    updated_at: new Date().toISOString()
  });

  // Send shipping notification email if status is 'shipped'
  if (status === 'shipped') {
    try {
      const orderDoc = await getDoc(orderRef);
      const orderData = orderDoc.data();
      
      if (orderData) {
        const shippingData = {
          orderId: orderData.order_number || orderId,
          customerName: orderData.customer_name || 'Customer',
          trackingNumber: generateTrackingNumber(),
          carrier: 'FedEx',
          estimatedDelivery: getEstimatedDelivery(),
          shippingAddress: orderData.shipping_address || {}
        };
        
        await emailService.sendShippingUpdate(
          orderData.customer_email || orderData.user_email,
          shippingData,
          shippingData.trackingNumber
        );
      }
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
    }
  }
}

// Helper functions
function getEstimatedDelivery(): string {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 business days
  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateTrackingNumber(): string {
  return `TR${Date.now().toString()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}
