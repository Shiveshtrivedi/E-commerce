import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/ProductSlice';
import authReducer from './slices/AuthSlice';
import cartReducer from './slices/CartSlice';
import wishListReducer from './slices/WishlistSlice';
import reviewReducer from './slices/UserReviewSlice';
import searchReducer from './slices/SearchSlice';
import orderReducer from './slices/OrderSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    wishList: wishListReducer,
    reviews: reviewReducer,
    search: searchReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
