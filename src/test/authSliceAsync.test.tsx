import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import authReducer, { login, signup } from '../redux/slices/authSlice';
import { mockAdminUser, mockSignupUser, mockUser } from './mockData/mockData';

jest.mock('axios');

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';
describe('authSliceAsync', () => {
  describe('login and signup', () => {
    test('should return user and token when login is successful', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: mockUser.email, password: mockUser.password })
      );
    });

    test('should return user and token when login is successful as admin', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockAdminUser] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: mockAdminUser.email, password: mockAdminUser.password })
      );

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}?email=${mockAdminUser.email}`,
        {
          headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
            cors: 'no-cors',
          },
        }
      );

      const state = store.getState().auth;
      expect(state.user).toEqual(mockAdminUser);
      expect(state.token).toEqual(mockAdminUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe('');
    });

    test('should return error when login fails due to incorrect password', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: mockUser.email, password: 'wrongpassword' })
      );

      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Incorrect password');
    });

    test('should return error when login fails due to user not found', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: 'abx@gmail.com', password: 'wrongpassword' })
      );
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('User not found');
    });

    test('should return user and token when signup is successful', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: mockSignupUser });
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: mockSignupUser.name,
          email: mockSignupUser.email,
          password: mockSignupUser.password,
        })
      );
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, {
        name: mockSignupUser.name,
        email: mockSignupUser.email,
        password: mockSignupUser.password,
      });
      const state = store.getState().auth;
      expect(state.user).toEqual(mockSignupUser);
      expect(state.token).toEqual(mockSignupUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe('');
    });

    test('should return user and token when signup is successful', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: mockUser });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        signup({
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
        })
      );

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });

      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe('');
    });

    test('should return error when user already exists', async () => {
      (axios.post as jest.Mock).mockRejectedValue({
        response: { data: 'User already exists' },
      });
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: mockSignupUser.name,
          email: mockSignupUser.email,
          password: mockSignupUser.password,
        })
      );
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('User already exists');
    });

    test('should return error when signup fails', async () => {
      (axios.post as jest.Mock).mockRejectedValue({
        response: { data: 'Validation failed' },
      });
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: mockSignupUser.name,
          email: mockSignupUser.email,
          password: mockSignupUser.password,
        })
      );
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Validation failed');
    });

    test('should return error when signup fails due to network error', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: mockSignupUser.name,
          email: mockSignupUser.email,
          password: mockSignupUser.password,
        })
      );
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Signup failed');
    });
  });
});
