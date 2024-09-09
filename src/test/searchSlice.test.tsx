import { configureStore } from '@reduxjs/toolkit';
import searchReducer, {
  setSearchTerm,
  setSearchResults,
  clearSearchResults,
} from '../redux/slices/searchSlice';
import { mockSearchResults } from './mockData/mockData';

describe('searchSlice', () => {
  const store = configureStore({ reducer: { search: searchReducer } });
  test('should set search term', () => {
    store.dispatch(setSearchTerm('test'));
    const state = store.getState().search;
    expect(state.searchTerm).toBe('test');
  });

  test('should set search results', () => {
    store.dispatch(setSearchResults(mockSearchResults));
    const state = store.getState().search;
    expect(state.searchResults).toEqual(mockSearchResults);
  });

  test('should clear search results', () => {
    store.dispatch(clearSearchResults());
    const state = store.getState().search;
    expect(state.searchTerm).toBe('');
    expect(state.searchResults).toEqual([]);
  });
});
