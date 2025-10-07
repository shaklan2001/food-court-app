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

export const pushBillingToPetPooja = (orderType: string, deliveryAddress: string, token: string) => async (_dispatch: any) => {
  try {    
    const apiCall = useApiPort({
      intent: "intent_billing_push",
      port: betterwayApiCall({
        method: "POST",
        url: "BILLING_PUSH",
        auth: token,
        body: {
          orderType: orderType,
          deliveryAddress: deliveryAddress,
        },
      }),
      success: (_response: any) => {
        // Billing pushed successfully
      },
      failure: (error: any) => {
        throw new Error(error?.message || 'Failed to process billing. Please try again.');
      },
    });

    await apiCall();
    return true; 
    
  } catch (error: any) {
    throw error;
  }
};

export const processPayment = (userDetails: { name?: string; email?: string; contact?: string }, orderType: string, deliveryAddress: string, token: string) => async (dispatch: any, getState: any) => {
  try {
    dispatch(setPaymentLoading(true));
    dispatch(setPaymentError(null));
    
    const state = getState();
    const cartTotal = state.cart.total;
    
    if (cartTotal <= 0) {
      throw new Error('Cart is empty. Cannot process payment.');
    }
    
    // Step 1: First push billing to PetPooja
    await dispatch(pushBillingToPetPooja(orderType, deliveryAddress, token));
    
    // Step 2: Only if billing is successful, proceed with Razorpay payment
    
    // Convert total to paise for Razorpay
    const amountInPaise = convertToPaise(cartTotal / 100);
    const receiptId = generateReceiptId();
    
    // Processing payment
    
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
    
    const paymentResponse = await initiatePayment(paymentOptions);
    
    // Payment successful
    
    // Update payment state
    dispatch(setPaymentSuccess(true));
    dispatch(setPaymentLoading(false));
    
    // Clear the cart via API call
    await dispatch(clearCartAPI(token));
    
    // Reset payment state after a short delay to show success
    setTimeout(() => {
      dispatch(resetPaymentState());
    }, 2000);
    
    return paymentResponse;
    
  } catch (error: any) {
    dispatch(setPaymentError(error.message || 'Payment failed. Please try again.'));
    dispatch(setPaymentLoading(false));
    
    throw error;
  }
};

export default cartSlice.reducer;
