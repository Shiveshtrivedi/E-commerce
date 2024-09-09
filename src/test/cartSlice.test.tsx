import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeToCart,
  clearCart,
  setUserId,
} from '../redux/slices/cartSlice';
import {
  initialCartState,
  mockCartItem,
  newCartItem,
} from './mockData/mockData';

jest.mock('../utils/cookie/cookieUtils', () => ({
  saveOrdersToCookies: jest.fn(),
  saveCartToCookies: jest.fn(),
  getOrdersFromCookies: jest.fn(() => []),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
describe('cartSlice', () => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  beforeEach(() => {
    store.dispatch(setUserId('user1'));
  });

  test('handle add to cart', () => {
    const action = addToCart(newCartItem);
    const state = cartReducer(initialCartState, action);

    expect(state.items).toEqual(mockCartItem);
  });

  test('increase quantity of existing item', () => {
    store.dispatch(addToCart(newCartItem));
    const action = addToCart(newCartItem);
    const state = cartReducer(store.getState().cart, action);
    expect(state.items).toEqual(mockCartItem);
  });

  test('should not add item if user id is not set', () => {
    store.dispatch(clearCart());
    store.dispatch(setUserId(''));
    const action = addToCart(newCartItem);
    const state = cartReducer(store.getState().cart, action);
    expect(state.items).toEqual([]);
  });

  test('should update total amount and items', () => {
    store.dispatch(clearCart());
    const action = addToCart(newCartItem);
    const state = cartReducer(store.getState().cart, action);
    expect(state.totalAmount).toBe(109.95);
    expect(state.totalItems).toBe(1);
  });

  test('handle remove from cart', () => {
    const action = removeToCart(1);
    const state = cartReducer(initialCartState, action);
    expect(state.items).toEqual([]);
  });

  test('should remove item  if it is  greater than 1', () => {
    store.dispatch(addToCart(newCartItem));
    const action = removeToCart(1);
    const state = cartReducer(store.getState().cart, action);
    expect(state.items).toEqual([]);
  });

  test('should decrease item if it is greater than 1', () => {
    store.dispatch(addToCart(newCartItem));
    store.dispatch(addToCart(newCartItem));
    const action = removeToCart(1);
    const state = cartReducer(store.getState().cart, action);
    expect(state.items).toEqual([newCartItem]);
  });

  test('updating total amount and items while removing from cart', () => {
    store.dispatch(addToCart(newCartItem));
    const action = removeToCart(1);
    const state = cartReducer(store.getState().cart, action);
    expect(state.totalAmount).toBe(0);
    expect(state.totalItems).toBe(0);
  });

  test('handle clear cart', () => {
    const action = clearCart();
    const state = cartReducer(initialCartState, action);
    expect(state.items).toEqual([]);
  });

  test('handle set user id', () => {
    const action = setUserId('1');
    const state = cartReducer(initialCartState, action);
    expect(state.userId).toEqual('1');
  });
});
