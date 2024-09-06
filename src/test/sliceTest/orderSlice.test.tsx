import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  initializeOrders,
  addOrder,
} from '../../redux/slices/orderSlice';
import * as CookieUtils from '../../utils/cookie/cookieUtils';
import { mockOrder } from '../mockData/mockData';

jest.mock('../../utils/cookie/cookieUtils');

describe('orderSlice', () => {
  const mockOrdersFromCookies = [mockOrder];

  const store = configureStore({ reducer: { order: orderReducer } });

  describe('initializeOrders', () => {
    test('should initialize orders from cookies', () => {
      (CookieUtils.getOrdersFromCookies as jest.Mock).mockReturnValue(
        mockOrdersFromCookies
      );

      store.dispatch(initializeOrders('user1'));

      const state = store.getState().order;
      expect(state.orders).toEqual(mockOrdersFromCookies);
    });

    test('should initialize orders to empty array if no orders in cookies', () => {
      (CookieUtils.getOrdersFromCookies as jest.Mock).mockReturnValue(null);

      store.dispatch(initializeOrders('user1'));

      const state = store.getState().order;
      expect(state.orders).toEqual([]);
    });
  });

  describe('addOrder', () => {
    test('should add an order to the state and save to cookies', () => {
      store.dispatch(addOrder(mockOrder));
      const state = store.getState().order;
      expect(state.orders).toContainEqual(mockOrder);
      expect(CookieUtils.saveOrdersToCookies).toHaveBeenCalledWith(
        mockOrder.userId,
        state.orders
      );
    });
  });
});
