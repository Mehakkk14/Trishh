// Razorpay Payment Service
// Follow RAZORPAY_GUIDE.md for complete setup instructions

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentData {
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  orderId?: string;
  preferredMethod?: 'upi' | 'card' | 'wallet' | 'netbanking';
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export class RazorpayService {
  private keyId: string;

  constructor() {
    // Get Razorpay key from environment variables
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    
    if (!this.keyId) {
      console.warn('Razorpay Key ID not found. Please check RAZORPAY_GUIDE.md for setup instructions.');
    }
  }

  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    return new Promise((resolve, reject) => {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded. Please include the Razorpay script.'));
        return;
      }

      if (!this.keyId) {
        reject(new Error('Razorpay Key ID not configured. Please follow RAZORPAY_GUIDE.md for setup.'));
        return;
      }

      const options: any = {
        key: this.keyId,
        amount: Math.round(paymentData.amount * 100), // Convert to paise
        currency: paymentData.currency,
        name: "T'RISHH Desire Shop",
        description: `TRISHH Order - ${paymentData.amount} ${paymentData.currency}`,
        order_id: paymentData.orderId,
        handler: (response: PaymentResponse) => {
          resolve(response);
        },
        prefill: {
          name: paymentData.customerInfo.name,
          email: paymentData.customerInfo.email,
          contact: paymentData.customerInfo.phone || '',
        },
        theme: {
          color: '#0E0E52', // T'RISHH brand color
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      // Set preferred payment method if specified
      if (paymentData.preferredMethod) {
        switch (paymentData.preferredMethod) {
          case 'upi':
            options.method = ['upi'];
            break;
          case 'card':
            options.method = ['card'];
            break;
          case 'wallet':
            options.method = ['wallet'];
            break;
          case 'netbanking':
            options.method = ['netbanking'];
            break;
        }
      }

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    });
  }

  // Create order on backend (to be implemented when backend is ready)
  async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    // This would typically call your backend API to create a Razorpay order
    // For now, return a mock order ID
    console.log('Creating order for amount:', amount, currency);
    return `order_${Date.now()}`;
  }

  // Verify payment (to be implemented when backend is ready)
  async verifyPayment(paymentResponse: PaymentResponse): Promise<boolean> {
    // This would typically call your backend API to verify the payment signature
    console.log('Verifying payment:', paymentResponse);
    return true; // Mock verification
  }
}

export const razorpayService = new RazorpayService();