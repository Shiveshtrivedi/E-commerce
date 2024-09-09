import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  fetchProducts,
  addProduct,
  deleteProduct,
  fetchProductsByCategory,
} from '../redux/slices/productSlice';
import axios from 'axios';
import { initialProductState, mockProduct } from './mockData/mockData';

jest.mock('axios');

const API_URL = process.env.REACT_APP_PRODUCT_API_URL;

describe('productSliceAsync', () => {
  describe('fetchProducts', () => {
    test('should return all products', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: initialProductState.products,
      });
      const store = configureStore({ reducer: { products: productReducer } });
      await store.dispatch(fetchProducts());
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}`);
      const state = store.getState().products;
      expect(state.products).toEqual(initialProductState.products);
    });

    test('should handle fetch failure', async () => {
      const errorMessage = 'Failed to fetch products';
      (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(fetchProducts());

      expect(axios.get).toHaveBeenCalledWith(`${API_URL}`);
      const state = store.getState().products;
      expect(state.products).toEqual([]);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
  describe('addProduct', () => {
    test('should add a new product', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: initialProductState.products[0],
      });
      const store = configureStore({ reducer: { products: productReducer } });
      await store.dispatch(addProduct(initialProductState.products[0]));
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}`,
        initialProductState.products[0]
      );
      const state = store.getState().products;
      expect(state.products).toEqual([initialProductState.products[0]]);
    });

    test('should handle add product failure', async () => {
      const errorMessage = 'Failed to add product';
      (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(addProduct(mockProduct));

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, mockProduct);
      const state = store.getState().products;
      expect(state.products).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
  describe('deleteProduct', () => {
    test('should delete a product', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});
      const store = configureStore({ reducer: { products: productReducer } });
      await store.dispatch(deleteProduct('1'));
      expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/1`);
      const state = store.getState().products;
      expect(state.products).toEqual([]);
    });

    test('should handle delete product failure', async () => {
      const errorMessage = 'Failed to delete product';
      (axios.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(deleteProduct('1'));

      expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/1`);
      const state = store.getState().products;
      expect(state.error).toBe(errorMessage);
    });
  });
  describe('fetchProductsByCategory', () => {
    test('should return products by category', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: initialProductState.products,
      });
      const store = configureStore({ reducer: { products: productReducer } });
      const category = "men's clothing";
      await store.dispatch(fetchProductsByCategory(category));
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${category}`);
      const state = store.getState().products;
      expect(state.products).toEqual(initialProductState.products);
    });
    test('should handle fetch products by category failure', async () => {
      const errorMessage = 'Failed to fetch products';
      (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(fetchProductsByCategory('electronics'));

      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/electronics`);
      const state = store.getState().products;

      expect(state.products).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
