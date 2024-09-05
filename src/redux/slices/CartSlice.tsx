import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  saveCartToCookies,
  saveOrdersToCookies,
  getOrdersFromCookies,
} from '../../utils/CookieUtils';
import { ICartItem, ICartState, IOrder } from '../../utils/interface/types';

const loadCartFromStorage = (userId: string | null) => {
  if (userId) {
    const localStorageCart = localStorage.getItem(`cart_${userId}`);
    if (localStorageCart) {
      return JSON.parse(localStorageCart);
    }
  }
  return [];
};

const initialState: ICartState = {
  items: loadCartFromStorage(null),
  totalAmount: parseFloat(localStorage.getItem('totalAmount') ?? '0'),
  totalItems: 0,
  userId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
      state.items = loadCartFromStorage(action.payload);
      const localStorageCart = localStorage.getItem(`cart_${action.payload}`);
      if (localStorageCart) {
        state.items = JSON.parse(localStorageCart);
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    addToCart(state, action: PayloadAction<ICartItem>) {
      if (!state.userId) return;

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },

    removeToCart(state, action: PayloadAction<number>) {
      if (!state.userId) return;

      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        } else {
          existingItem.quantity--;
        }

        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        localStorage.setItem(
          `cart_${state.userId}`,
          JSON.stringify(state.items)
        );
      }
    },

    clearCart(state) {
      if (!state.userId) return;

      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;

      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },
    checkout(state) {
      if (!state.userId) return;

      const transformedItems = state.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orders = getOrdersFromCookies(state.userId) || [];
      const newOrder: IOrder = {
        id: Date.now().toString(),
        userId: state.userId,
        items: transformedItems,
        totalAmount: state.totalAmount,
        address: {
          name: '',
          pincode: '',
          phoneNumber: '',
          city: '',
          state: '',
        },
        createdAt: new Date().toISOString(),
      };

      orders.push(newOrder);
      saveOrdersToCookies(state.userId, orders);

      saveCartToCookies(state.userId, state.items);
      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },
    saveOrder(state, action: PayloadAction<IOrder>) {
      if (!state.userId) return;

      const orders = getOrdersFromCookies(state.userId) || [];
      orders.push(action.payload);
      saveOrdersToCookies(state.userId, orders);
    },
  },
});

export const { addToCart, removeToCart, clearCart, setUserId, checkout } =
  cartSlice.actions;
export default cartSlice.reducer;
