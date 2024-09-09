import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, IOrderState } from '../../utils/type/types';
import {
  saveOrdersToCookies,
  getOrdersFromCookies,
} from '../../utils/cookie/cookieUtils';

const initialState: IOrderState = {
  orders: [],
  userId: '',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    initializeOrders(state, action: PayloadAction<string>) {
      const orders1 = getOrdersFromCookies(action.payload);
      state.orders = orders1 || [];
    },
    addOrder(state, action: PayloadAction<IOrder>) {
      state.orders = [...state.orders, action.payload];
      const userId = action.payload.userId;
      saveOrdersToCookies(userId, state.orders);
    },
  },
});

export const { initializeOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
