import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';
import { Coupon } from '../../app/all-coupons';
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
import { convertToPaise, generateReceiptId, initiatePayment } from '../../services/paymentService';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  pricePaise: number;
  quantity: number;
  image?: ImageSourcePropType;
  description?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  paymentLoading: boolean;
  paymentSuccess: boolean;
  paymentError: string | null;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  orderStatus: string | null;
  orderId: number | null;
  checkingOrderStatus: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentSuccess: false,
  paymentError: null,
  appliedCoupon: null,
  discountAmount: 0,
  orderStatus: null,
  orderId: null,
  checkingOrderStatus: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.pricePaise * item.quantity), 0);
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.pricePaise * item.quantity), 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.pricePaise * item.quantity), 0);
    },
    
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      state.total = action.payload.reduce((sum, item) => sum + (item.pricePaise * item.quantity), 0);
    },
    
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.paymentLoading = action.payload;
    },
    
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.paymentError = action.payload;
    },
    
    resetPaymentState: (state) => {
      state.paymentLoading = false;
      state.paymentSuccess = false;
      state.paymentError = null;
      state.orderStatus = null;
      state.orderId = null;
      state.checkingOrderStatus = false;
    },
    
    setOrderStatus: (state, action: PayloadAction<string | null>) => {
      state.orderStatus = action.payload;
    },
    
    setOrderId: (state, action: PayloadAction<number | null>) => {
      state.orderId = action.payload;
    },
    
    setCheckingOrderStatus: (state, action: PayloadAction<boolean>) => {
      state.checkingOrderStatus = action.payload;
    },
    
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      const coupon = action.payload;
      const subtotal = state.total;
      
      // Check if coupon is applicable
      if (subtotal >= coupon.minOrderPaise) {
        state.appliedCoupon = coupon;
        
        // Calculate discount amount
        const discountPercent = coupon.discountPercent / 100;
        const calculatedDiscount = subtotal * discountPercent;
        const maxDiscount = coupon.maxDiscountPaise;
        
        state.discountAmount = Math.min(calculatedDiscount, maxDiscount);
      }
    },
    
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCart,
  clearCart,
  setLoading,
  setError,
  setTotal,
  setPaymentLoading,
  setPaymentSuccess,
  setPaymentError,
  resetPaymentState,
  applyCoupon,
  removeCoupon,
  setOrderStatus,
  setOrderId,
  setCheckingOrderStatus,
} = cartSlice.actions;

export const fetchCart = (token: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  const apiCall = useApiPort({
    intent: "intent_get_cart",
    port: betterwayApiCall({
      method: "GET",
      url: "GET_CART",
      auth: token,
    }),
    success: (response: any) => {
      if (response && response.cartItems && Array.isArray(response.cartItems)) {
        const cartItems: CartItem[] = response.cartItems.map((item: any) => {
          // Handle image - use URL if available, otherwise fallback to local image
          const imageUrl = item.dish?.image || item.image;
          let imageSource;
          if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            imageSource = { uri: imageUrl };
          } else if (typeof imageUrl === 'object') {
            // Already an object (from addToCart), keep as is
            imageSource = imageUrl;
          } else {
            imageSource = require('@/assets/images/bowl.png');
          }

          return {
            id: item.dishId || item.id,
            name: item.dish?.name || item.name || item.itemName,
            price: `₹${((item.dish?.pricePaise || item.pricePaise || item.price) / 100).toFixed(0)}`,
            pricePaise: item.dish?.pricePaise || item.pricePaise || item.price || 0,
            quantity: item.quantity || 1,
            image: imageSource,
            description: item.dish?.description || item.description || '',
          };
        });
        const totalPaise = response.totalPaise || cartItems.reduce((sum, item) => sum + (item.pricePaise * item.quantity), 0);
        dispatch(setCart(cartItems));
        dispatch(setTotal(totalPaise));
      }
      dispatch(setLoading(false));
    },
    failure: (error: any) => {
      dispatch(setError(error?.message || 'Failed to fetch cart'));
      dispatch(setLoading(false));
    },
  });

  try {
    await apiCall();
  } catch {
    dispatch(setError('Failed to fetch cart'));
    dispatch(setLoading(false));
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>, token: string) => async (dispatch: any) => {
  dispatch(addItem(item));
  const apiCall = useApiPort({
    intent: "intent_add_to_cart",
    port: betterwayApiCall({
      method: "POST",
      url: "ADD_TO_CART",
      auth: token,
      body: {
        itemId: item.id,
        quantity: 1,
      },
    }),
    success: (_response: any) => {
      // Item added successfully
    },
    failure: (_error: any) => {
      // Handle error silently for add to cart
    },
  });

  try {
    await apiCall();
  } catch {
    // Handle error silently
  }
};

export const updateCartItem = (dishId: string, quantity: number, token: string) => async (dispatch: any) => {
  dispatch(updateQuantity({ id: dishId, quantity }));
  
  if (quantity <= 0) {
    // Call the remove API when quantity becomes 0
    await dispatch(removeCartItemAPI(dishId, token));
    return;
  }
  
  const apiCall = useApiPort({
    intent: "intent_update_cart",
    port: betterwayApiCall({
      method: "PATCH",
      url: "UPDATE_CART",
      auth: token,
      body: {
        itemId: dishId,
        quantity: quantity,
      },
    }),
    success: (_response: any) => {
    },
    failure: (_error: any) => {
    },
  });

  try {
    await apiCall();
  } catch {
  }
};

export const removeCartItemAPI = (itemId: string, token: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  
  const apiCall = useApiPort({
    intent: "intent_remove_cart_item",
    port: betterwayApiCall({
      method: "DELETE",
      url: "REMOVE_CART_ITEM",
      auth: token,
      body: {
        itemId: itemId,
      },
    }),
    success: (_response: any) => {
      dispatch(removeItem(itemId));
      dispatch(setLoading(false));
    },
    failure: (error: any) => {
      dispatch(setError(error?.message || 'Failed to remove cart item'));
      dispatch(setLoading(false));
    },
  });

  try {
    await apiCall();
  } catch {
    dispatch(setError('Failed to remove cart item'));
    dispatch(setLoading(false));
  }
};

export const verifyPayment = (orderId: number, paymentData: { razorpay_order_id?: string; razorpay_payment_id: string; razorpay_signature?: string }, token: string) => async (_dispatch: any) => {
  try {
    const payload: any = {
      orderId: orderId,
      razorpay_payment_id: paymentData.razorpay_payment_id,
    };

    if (paymentData.razorpay_order_id && paymentData.razorpay_order_id.trim().length > 0) {
      payload.razorpay_order_id = paymentData.razorpay_order_id;
    }

    if (paymentData.razorpay_signature && paymentData.razorpay_signature.trim().length > 0) {
      payload.razorpay_signature = paymentData.razorpay_signature;
    }

    const response = await betterwayApiCall({
      method: "POST",
      url: "VERIFY_PAYMENT",
      auth: token,
      body: payload,
    });

    const responseData = response?.data || response;
    
    if (responseData?.success === true || responseData?.data?.success === true) {
      return true;
    }
    
    throw new Error(responseData?.message || responseData?.data?.message || 'Payment verification failed');
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Payment verification failed. Please try again.';
    throw new Error(errorMessage);
  }
};

export const clearCartAPI = (token: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  
  const apiCall = useApiPort({
    intent: "intent_clear_cart",
    port: betterwayApiCall({
      method: "DELETE",
      url: "CLEAR_CART",
      auth: token,
    }),
    success: (_response: any) => {
      dispatch(clearCart());
      dispatch(setLoading(false));
    },
    failure: (error: any) => {
      dispatch(setError(error?.message || 'Failed to clear cart'));
      dispatch(setLoading(false));
    },
  });

  try {
    await apiCall();
  } catch {
    dispatch(setError('Failed to clear cart'));
    dispatch(setLoading(false));
  }
};

export const pushBillingToPetPooja = (orderType: string, deliveryAddress: string, token: string) => async (dispatch: any) => {
  try {    
    const response = await betterwayApiCall({
      method: "POST",
      url: "BILLING_PUSH",
      auth: token,
      body: {
        orderType: orderType,
        deliveryAddress: deliveryAddress,
      },
    });

    // Extract orderId from response
    let orderId: number | null = null;
    const responseData = response?.data || response;
    
    if (responseData?.data?.order?.id) {
      orderId = responseData.data.order.id;
      dispatch(setOrderId(orderId));
    } else if (responseData?.order?.id) {
      orderId = responseData.order.id;
      dispatch(setOrderId(orderId));
    }

    if (!orderId) {
      throw new Error('Failed to get order ID from billing push response.');
    }

    return orderId; 
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to process billing. Please try again.';
    throw new Error(errorMessage);
  }
};

export const getOrderStatus = (orderId: number, token: string) => async (dispatch: any) => {
  try {
    const response = await betterwayApiCall({
      method: "POST",
      url: "GET_ORDER_STATUS",
      auth: token,
      body: {
        orderId: orderId,
      },
    });

    let orderStatus: string | null = null;
    const responseData = response?.data || response;
    
    if (responseData?.data?.data?.order?.status) {
      orderStatus = responseData.data.data.order.status;
      dispatch(setOrderStatus(orderStatus));
    } else if (responseData?.data?.order?.status) {
      orderStatus = responseData.data.order.status;
      dispatch(setOrderStatus(orderStatus));
    } else if (responseData?.order?.status) {
      orderStatus = responseData.order.status;
      dispatch(setOrderStatus(orderStatus));
    }

    return orderStatus;
    
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to get order status.');
  }
};

export const pollOrderStatusUntilAccepted = (orderId: number, token: string, onStatusUpdate?: (status: string) => void) => async (dispatch: any) => {
  dispatch(setCheckingOrderStatus(true));
  
  const pollInterval = 3000;
  const maxAttempts = 60;
  let attempts = 0;
  
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        attempts++;
        const status = await dispatch(getOrderStatus(orderId, token));
        
        if (onStatusUpdate && status) {
          onStatusUpdate(status);
        }
        
        const statusLower = status?.toLowerCase();
        
        if (statusLower === 'preparing') {
          dispatch(setCheckingOrderStatus(false));
          resolve(status);
          return;
        }
        
        if (statusLower === 'rejected' || statusLower === 'cancelled') {
          dispatch(setCheckingOrderStatus(false));
          reject(new Error(`Order was ${statusLower}`));
          return;
        }
        
        if (attempts >= maxAttempts) {
          dispatch(setCheckingOrderStatus(false));
          reject(new Error('Order status check timeout. Please try again.'));
          return;
        }
        
        setTimeout(poll, pollInterval);
        
      } catch (error: any) {
        dispatch(setCheckingOrderStatus(false));
        reject(error);
      }
    };
    
    poll();
  });
};

export const processPayment = (userDetails: { name?: string; email?: string; contact?: string }, orderType: string, deliveryAddress: string, token: string, onStatusUpdate?: (status: string) => void) => async (dispatch: any, getState: any) => {
  try {
    dispatch(setPaymentError(null));
    
    const state = getState();
    const cartTotal = state.cart.total;
    
    if (cartTotal <= 0) {
      throw new Error('Cart is empty. Cannot process payment.');
    }
    
    const orderId = await dispatch(pushBillingToPetPooja(orderType, deliveryAddress, token));
    
    if (!orderId) {
      throw new Error('Failed to get order ID from billing push response.');
    }
    
    await dispatch(pollOrderStatusUntilAccepted(orderId, token, onStatusUpdate));
    
    dispatch(setPaymentLoading(true));
    
    const amountInPaise = convertToPaise(cartTotal / 100);
    const receiptId = generateReceiptId();
    
    const paymentOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      name: 'Food Court App',
      description: `Payment for ${state.cart.itemCount} items`,
      prefill: {
        name: userDetails.name || 'Customer',
        email: userDetails.email || '',
        contact: userDetails.contact || '',
      },
      theme: {
        color: '#A20538',
      },
    };
    
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
    
    let paymentResponse;
    try {
      paymentResponse = await initiatePayment(paymentOptions);
      
      if (!paymentResponse?.razorpay_payment_id) {
        throw new Error('Payment was not completed. Please try again.');
      }
      
    } catch (paymentError: any) {
      dispatch(setPaymentLoading(false));
      dispatch(setCheckingOrderStatus(false));
      
      if (paymentError?.code === 'USER_CANCELLED' || paymentError?.message?.includes('cancelled')) {
        throw new Error('Payment cancelled by user.');
      }
      
      const errorMessage = paymentError?.message || paymentError?.description || 'Failed to open payment gateway. Please try again.';
      throw new Error(errorMessage);
    }
    
    dispatch(setPaymentLoading(false));
    
    try {
      const verifyResult = await dispatch(verifyPayment(orderId, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id || '',
        razorpay_signature: paymentResponse.razorpay_signature,
      }, token));
      
      if (!verifyResult) {
        throw new Error('Payment verification failed. Please contact support.');
      }
    } catch (verifyError: any) {
      dispatch(setPaymentLoading(false));
      dispatch(setCheckingOrderStatus(false));
      const errorMsg = verifyError?.message || 'Payment verification failed. Please contact support.';
      dispatch(setPaymentError(errorMsg));
      throw new Error(errorMsg);
    }
    
    await dispatch(clearCartAPI(token));
    
    dispatch(setPaymentSuccess(true));
    
    setTimeout(() => {
      dispatch(resetPaymentState());
    }, 2000);
    
    return paymentResponse;
    
  } catch (error: any) {
    dispatch(setPaymentError(error.message || 'Payment failed. Please try again.'));
    dispatch(setPaymentLoading(false));
    dispatch(setCheckingOrderStatus(false));
    
    throw error;
  }
};

export default cartSlice.reducer;
