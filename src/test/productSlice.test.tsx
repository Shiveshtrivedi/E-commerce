import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  setUserId,
  addProductToHistory,
  removeProductFromHistory,
  clearHistory,
  resetFilter,
} from '../redux/slices/productSlice';
import { saveAdminHistoryToCookies } from '../utils/cookie/cookieUtils';
import {
  initialProductState,
  mockProduct,
  newProduct,
} from './mockData/mockData';

jest.mock('../utils/cookie/cookieUtils', () => ({
  saveAdminHistoryToCookies: jest.fn(),
  getAdminHistoryFromCookies: jest.fn(() => []),
}));

describe('productReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const store = configureStore({ reducer: { product: productReducer } });

  test('set user id', () => {
    const action = setUserId('1');
    const state = productReducer(initialProductState, action);
    expect(state.id).toBe('1');
  });

  test('set user id with empty string', () => {
    const action = setUserId('');
    const state = productReducer(initialProductState, action);
    expect(state.id).toBe('');
  });

  test('add product to history', () => {
    let state = productReducer(initialProductState, setUserId('1'));
    state = productReducer(state, addProductToHistory(newProduct));

    expect(state.adminProductsHistory).toContainEqual(newProduct);
    expect(state.adminProductsHistory.length).toBe(1);

    expect(saveAdminHistoryToCookies).toHaveBeenCalledWith(
      '1',
      state.adminProductsHistory
    );
  });

  test('update product history', () => {
    store.dispatch(addProductToHistory(newProduct));
    const state = store.getState().product;
    expect(state.adminProductsHistory).toEqual([newProduct]);
  });

  test('remove product from history', () => {
    let state = productReducer(initialProductState, setUserId('1'));
    state = productReducer(state, removeProductFromHistory('1'));
    expect(state.adminProductsHistory).toEqual([]);
  });

  test('should not remove product if user ID is not set', () => {
    store.dispatch(setUserId(''));

    const action = removeProductFromHistory(mockProduct.id);
    const state = productReducer(store.getState().product, action);

    expect(state.adminProductsHistory).toEqual([]);
  });

  test('should not remove product if it does not exist in history', () => {
    store.dispatch(addProductToHistory(mockProduct));
    const action = removeProductFromHistory(mockProduct.id);
    const state = productReducer(store.getState().product, action);

    expect(state.adminProductsHistory).toEqual([mockProduct]);
  });

  test('clear history', () => {
    let state = productReducer(initialProductState, setUserId('1'));
    state = productReducer(state, clearHistory());
    expect(state.adminProductsHistory).toEqual([]);
  });

  test('reset filter', () => {
    const state = productReducer(initialProductState, resetFilter());
    expect(state.filterProducts).toEqual(state.products);
  });

  test('should ensure filtered products match original products after reset', () => {
    store.dispatch(resetFilter());
    const state = store.getState().product;
    expect(state.filterProducts).toEqual(state.products);
  });

  test('should handle multiple filtered products and matches to the  original products after reset', () => {
    store.dispatch(resetFilter());
    store.dispatch(resetFilter());
    const state = store.getState().product;
    expect(state.filterProducts).toEqual(state.products);
  });
});
