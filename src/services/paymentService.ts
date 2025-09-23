// @ts-ignore - react-native-razorpay doesn't have TypeScript declarations
import RazorpayCheckout from 'react-native-razorpay';

const RAZORPAY_KEY_ID = 'rzp_test_vs76x2TTkva4t6';

export interface PaymentOptions {
  amount: number;
  currency: string;
  receipt: string;
  name: string;
  description: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface PaymentError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
}

export const initiatePayment = async (options: PaymentOptions): Promise<PaymentResponse> => {
  try {
    const paymentOptions = {
      description: options.description,
      image: 'https://your-logo-url.com/logo.png',
      currency: options.currency || 'INR',
      key: RAZORPAY_KEY_ID,
      amount: options.amount,
      name: options.name,
      order_id: '',
      prefill: {
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
        name: options.prefill?.name || '',
      },
      theme: {
        color: options.theme?.color || '#A20538',
      },
    };
    
    const response = await RazorpayCheckout.open(paymentOptions);
    return response as PaymentResponse;
    
  } catch (error: any) {
    console.log('❌ Payment failed:', error);
    if (error.code === 'BAD_REQUEST_ERROR') {
      throw new Error('Invalid payment request. Please check your details.');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.code === 'USER_CANCELLED') {
      throw new Error('Payment cancelled by user.');
    } else {
      throw new Error(error.description || error.message || 'Payment failed. Please try again.');
    }
  }
};


// Helper function to convert rupees to paise
export const convertToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

// Helper function to format amount for display
export const formatAmount = (paise: number): string => {
  return `₹${(paise / 100).toFixed(0)}`;
};

// Generate a unique receipt ID
export const generateReceiptId = (): string => {
  return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
