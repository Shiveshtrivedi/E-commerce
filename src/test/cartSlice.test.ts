import exp from 'constants';
import cartReducer, {
  addToCart,
  removeToCart,
  clearCart,
  checkout,
  setUserId,
} from '../redux/slices/cartSlice';
import { ICartState, IOrder } from '../utils/interface/types';
import * as CookieUtils from '../utils/CookieUtils';

jest.mock('../utils/CookieUtils', () => ({
  saveOrdersToCookies: jest.fn(),
  saveCartToCookies: jest.fn(),
  getOrdersFromCookies: jest.fn(() => []),
}));

const initialState: ICartState = {
  items: [
    {
      id: 1,
      name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      quantity: 1,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
  ],
  totalAmount: 109.95,
  userId: '1',
  totalItems: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('cartSlice', () => {
  test('handleAddToCart', () => {
    const action = addToCart({
      id: 1,
      name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      quantity: 1,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    });

    const state = cartReducer(initialState, action);

    expect(state.items).toEqual([
      {
        id: 1,
        name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
        price: 109.95,
        quantity: 2,
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      },
    ]);
  });

  test('handleRemoveToCart', () => {
    const action = removeToCart(1);
    const state = cartReducer(initialState, action);
    expect(state.items).toEqual([]);
  });

  test('handleClearCart', () => {
    const action = clearCart();
    const state = cartReducer(initialState, action);
    expect(state.items).toEqual([]);
  });

  test('handleSetUserId', () => {
    const action = setUserId('1');
    const state = cartReducer(initialState, action);
    expect(state.userId).toEqual('1');
  });
});
