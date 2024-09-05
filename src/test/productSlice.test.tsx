import productReducer, {
  setUserId,
  addProductToHistory,
  removeProductFromHistory,
  clearHistory,
  resetFilter,
} from '../redux/slices/productSlice';
import { IProductState } from '../utils/interface/types';
import { saveAdminHistoryToCookies } from '../utils/CookieUtils';

const initialState: IProductState = {
  products: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  adminProductsHistory: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  filterProducts: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  status: 'succeeded',
  error: null,
  id: '1',
};

jest.mock('../utils/CookieUtils', () => ({
  saveAdminHistoryToCookies: jest.fn(),
  getAdminHistoryFromCookies: jest.fn(() => []),
}));

describe('productReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('setUserId', () => {
    const action = setUserId('1');
    const state = productReducer(initialState, action);
    expect(state.id).toBe('1');
  });
  test('setUserId with empty string', () => {
    const action = setUserId('');
    const state = productReducer(initialState, action);

    expect(state.id).toBe('');
  });
  test('addProductToHistory', () => {
    const product = {
      id: '2',
      title: 'New Product',
      price: 59.99,
      image: 'https://example.com/image.jpg',
      description: 'A new product description',
      category: 'men clothing',
    };

    let state = productReducer(initialState, setUserId('1'));

    state = productReducer(state, addProductToHistory(product));

    expect(state.adminProductsHistory).toContainEqual(product);
    expect(state.adminProductsHistory.length).toBe(1);

    expect(saveAdminHistoryToCookies).toHaveBeenCalledWith(
      '1',
      state.adminProductsHistory
    );
  });
  test('removeProductFromHistory',()=>{
    let state = productReducer(initialState,setUserId('1'));
    state = productReducer(state,removeProductFromHistory('1'));
    expect(state.adminProductsHistory).toEqual([]);
  })
  test('clearHistory',()=>{
    let state = productReducer(initialState,setUserId('1'));
    state = productReducer(state,clearHistory());
    expect(state.adminProductsHistory).toEqual([]);
  })
  test('resetFilter',()=>{
    const state = productReducer(initialState,resetFilter());
    expect(state.filterProducts).toEqual(state.products);
  })
});
