import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  saveAdminHistoryToCookies,
  getAdminHistoryFromCookies,
} from '../../utils/cookie/cookieUtils';
import { EStatus, IProduct, IProductState } from '../../utils/type/types';

const initialState: IProductState = {
  products: [],
  adminProductsHistory: [],
  filterProducts: [],
  status: 'idle',
  error: '',
  id: '',
};

export const fetchProducts = createAsyncThunk<IProduct[]>(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_PRODUCT_API_URL}`
    );
    return response.data;
  }
);

export const addProduct = createAsyncThunk<IProduct, IProduct>(
  'products/addProduct',
  async (newProduct) => {
    const response = await axios.post(
      `${process.env.REACT_APP_PRODUCT_API_URL}`,
      newProduct
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`${process.env.REACT_APP_PRODUCT_API_URL}/${productId}`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to delete product');
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  IProduct[],
  string,
  { rejectValue: string }
>('products/fetchProductsByCategory', async (category, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_PRODUCT_API_URL}/${category}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      state.adminProductsHistory = getAdminHistoryFromCookies(action.payload);
    },

    addProductToHistory(state, action: PayloadAction<IProduct>) {
      const updatedHistory = [...state.adminProductsHistory, action.payload];
      state.adminProductsHistory = updatedHistory;

      if (state.id !== '') {
        saveAdminHistoryToCookies(state.id, updatedHistory);
      }
    },

    removeProductFromHistory(state, action: PayloadAction<string>) {
      if (!state.id) return;
      const updatedHistory = state.adminProductsHistory.filter(
        (product) => product.id !== action.payload
      );
      state.adminProductsHistory = updatedHistory;
    },

    clearHistory(state) {
      if (state.id) {
        state.adminProductsHistory = [];
        saveAdminHistoryToCookies(state.id, []);
      }
    },

    resetFilter(state) {
      state.filterProducts = [...state.products];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = EStatus.Loading;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = EStatus.Succeeded;
          state.products = action.payload;
          state.filterProducts = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = EStatus.Failed;
        state.error = action.error.message ?? 'Failed to fetch products';
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.products.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add product';
      })
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to delete product';
        }
      )
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.meta.arg
        );
      })
      .addCase(
        fetchProductsByCategory.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = EStatus.Succeeded;
          state.products = action.payload;
          state.filterProducts = action.payload;
        }
      )
      .addCase(
        fetchProductsByCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = EStatus.Failed;
          state.error =
            action.payload ?? 'Failed to fetch products by category';
        }
      );
  },
});

export const {
  setUserId,
  addProductToHistory,
  removeProductFromHistory,
  clearHistory,
  resetFilter,
} = productSlice.actions;

export default productSlice.reducer;
