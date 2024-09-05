import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  fetchProducts,
  addProduct,
  deleteProduct,
  fetchProductsByCategory,
} from '../redux/slices/productSlice';
import axios from 'axios';
import { IProduct } from '../utils/interface/types';

jest.mock('axios');

const API_URL = process.env.REACT_APP_PRODUCT_API_URL;

describe('productSliceAsync', () => {
  const mockProducts: IProduct[] = [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ];
  describe('fetchProducts', () => {
    test('should return all products', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockProducts });
      const store = configureStore({ reducer: { products: productReducer } });
      await store.dispatch(fetchProducts());
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}`);
      const state = store.getState().products;
      expect(state.products).toEqual(mockProducts);
    });
  });
  describe('addProduct', () => {
    test('should add a new product',async ()=>{
        (axios.post as jest.Mock).mockResolvedValue({data:mockProducts[0]});
        const store = configureStore({reducer:{products:productReducer}});
        await store.dispatch(addProduct(mockProducts[0]));
        expect(axios.post).toHaveBeenCalledWith(`${API_URL}`,mockProducts[0]);
        const state = store.getState().products;
        expect(state.products).toEqual([mockProducts[0]]);
    })
  });
    describe('deleteProduct', () => {
        test('should delete a product',async ()=>{
            (axios.delete as jest.Mock).mockResolvedValue({});
            const store = configureStore({reducer:{products:productReducer}});
            await store.dispatch(deleteProduct('1'));
            expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/1`);
            const state = store.getState().products;
            expect(state.products).toEqual([]);
        })
    });
    describe('fetchProductsByCategory',()=>{
        test('should return products by category',async ()=>{
            (axios.get as jest.Mock).mockResolvedValue({data:mockProducts});
            const store = configureStore({reducer:{products:productReducer}});
            const category = 'men\'s clothing';
            await store.dispatch(fetchProductsByCategory(category));
            expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${category}`)
            const state = store.getState().products;
            expect(state.products).toEqual(mockProducts)
    })
});
});
