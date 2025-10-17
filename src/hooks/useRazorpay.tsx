import { useState } from 'react';
import { razorpayService, PaymentData, PaymentResponse } from '@/services/razorpayService';
import { toast } from 'sonner';

interface PaymentHookResult {
  isProcessing: boolean;
  processPayment: (paymentData: PaymentData) => Promise<PaymentResponse | null>;
  createOrder: (amount: number, currency?: string) => Promise<string | null>;
}

export const useRazorpay = (): PaymentHookResult => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async (amount: number, currency: string = 'INR'): Promise<string | null> => {
    try {
      setIsProcessing(true);
      const orderId = await razorpayService.createOrder(amount, currency);
      toast.success('Order created successfully!');
      return orderId;
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResponse | null> => {
    try {
      setIsProcessing(true);
      toast.info('Opening payment gateway...');
      const response = await razorpayService.initializePayment(paymentData);
      toast.success('Payment completed successfully!');
      return response;
    } catch (error: any) {
      console.error('Payment failed:', error);
      if (error.message !== 'Payment cancelled by user') {
        toast.error(`Payment failed: ${error.message}`);
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processPayment,
    createOrder,
  };
};
