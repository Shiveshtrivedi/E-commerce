import authReducer, { logout } from '../redux/slices/authSlice';

test('handleLogout', () => {
  const initialState = {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'shivesh',
      email: 'shivesh@gmail.com',
      password: 'Shivesh@123',
    },
    token: '1',
    error: null,
    isAdmin: false,
    userEmail: 'shivesh@gmail.com',
  };
  const action = logout();
  const state = authReducer(initialState, action);
  expect(state.isAuthenticated).toBe(false);
  expect(state.user).toBeNull();
  expect(state.token).toBeNull();
  expect(state.error).toBeNull();
  expect(state.isAdmin).toBe(false);
  expect(state.userEmail).toBeNull();
});

test('handleLogoutForAdmin', () => {
  const initialState = {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'shivesh',
      email: 'shivesh@intimetec.com',
      password: 'Shivesh@123',
    },
    token: '1',
    error: null,
    isAdmin: true,
    userEmail: 'shivesh@intimetec.com',
  };
  const action = logout();
  const state = authReducer(initialState, action);
  expect(state.isAuthenticated).toBe(false);
  expect(state.user).toBeNull();
  expect(state.token).toBeNull();
  expect(state.error).toBeNull();
  expect(state.isAdmin).toBe(false);
  expect(state.userEmail).toBeNull();
});
