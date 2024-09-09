import authReducer, { logout } from '../redux/slices/authSlice';
import {
  emptyMockUser,
  initialAuthState,
  initialAuthStateForAdmin,
} from './mockData/mockData';

describe('authSlice', () => {
  test('handle logout', () => {
    const action = logout();
    const state = authReducer(initialAuthState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual(emptyMockUser);
    expect(state.token).toBe('');
    expect(state.error).toBe('');
    expect(state.isAdmin).toBe(false);
  });

  test('handle logout for admin', () => {
    const action = logout();
    const state = authReducer(initialAuthStateForAdmin, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual(emptyMockUser);
    expect(state.token).toBe('');
    expect(state.error).toBe('');
    expect(state.isAdmin).toBe(false);
    expect(state.userEmail).toBe('');
  });

  test('should not affect other state properties on logout', () => {
    const action = logout();
    const state = authReducer(initialAuthState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual(emptyMockUser);
    expect(state.token).toBe('');
    expect(state.error).toBe('');
    expect(state.isAdmin).toBe(false);
    expect(state.userEmail).toBe('');
  });
});
