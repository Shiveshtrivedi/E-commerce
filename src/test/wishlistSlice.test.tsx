import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer, {
  addToWishList,
  removeToWishList,
  setUserId,
} from '../redux/slices/wishlistSlice';
import { mockWishListItem } from './mockData/mockData';

describe('wishlistSlice', () => {
  const store = configureStore({ reducer: { wishlist: wishlistReducer } });
  test('should add item to wishlist when user id is set', () => {
    store.dispatch(setUserId('1'));
    store.dispatch(addToWishList(mockWishListItem));
    const state = store.getState().wishlist;
    expect(state.items).toContainEqual(mockWishListItem);
  });

  test("don't add duplicate in wishlist", () => {
    store.dispatch(setUserId('1'));
    store.dispatch(addToWishList(mockWishListItem));
    store.dispatch(addToWishList(mockWishListItem));
    const state = store.getState().wishlist;
    expect(state.items.length).toBe(1);
  });

  test("shouldn't add item to wishlist when user id is not set", () => {
    store.dispatch(setUserId(''));
    store.dispatch(addToWishList(mockWishListItem));
    const state = store.getState().wishlist;
    expect(state.items).toEqual([]);
  });

  test('should remove item from wishlist', () => {
    store.dispatch(setUserId('1'));
    store.dispatch(addToWishList(mockWishListItem));
    store.dispatch(removeToWishList(1));
    const state = store.getState().wishlist;
    expect(state.items).toEqual([]);
  });

  test('should not remove item if it does not exist in the wishlist', () => {
    store.dispatch(removeToWishList(666));
    store.dispatch(addToWishList(mockWishListItem));
    const state = store.getState().wishlist;
    expect(state.items).toContainEqual(mockWishListItem);
  });
});
