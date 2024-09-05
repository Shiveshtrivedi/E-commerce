import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import authReducer, { login, signup } from '../redux/slices/authSlice';
import { IAuthState } from '../utils/interface/types';

jest.mock('axios');

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

describe('authSliceAsync', () => {
  describe('login', () => {
    test('should return user and token when login is successful', async () => {
      const mockUser = {
        id: '1',
        name: 'Shivesh',
        email: 'shivesh@gmail.com',
        password: 'shivesh@123',
        isAuthenticated: true,
        token: '1',
        idAdmin: false,
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: 'shivesh@gmail.com', password: 'shivesh@123' })
      );

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}?email=shivesh@gmail.com`,
        {
          headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
            cors: 'no-cors',
          },
        }
      );

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});

describe('authSliceAsync', () => {
  describe('login', () => {
    test('should return user and token when login is successful as admin', async () => {
      const mockUser = {
        id: '2',
        name: 'Shivesh',
        email: 'shivesh@intimetec.com',
        password: 'shivesh@123',
        isAuthenticated: true,
        token: '2',
        idAdmin: true,
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const store = configureStore({ reducer: { auth: authReducer } });

      await store.dispatch(
        login({ email: 'shivesh@intimetec.com', password: 'shivesh@123' })
      );

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}?email=shivesh@intimetec.com`,
        {
          headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
            cors: 'no-cors',
          },
        }
      );

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});

describe('authSliceAsync', () => {
  describe('signup', () => {
    test('should return user and token when signup is successful', async () => {
      const mockUser = {
        id: '3',
        name: 'hardik',
        email: 'hardik@gmail.com',
        password: 'hardik@123',
        isAuthenticated: true,
        token: '3',
        idAdmin: false,
      };
      (axios.post as jest.Mock).mockResolvedValue({ data: mockUser });
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: 'hardik',
          email: 'hardik@gmail.com',
          password: 'hardik@123',
        })
      );
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, {
        name: 'hardik',
        email: 'hardik@gmail.com',
        password: 'hardik@123',
      });
      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});

describe('authSliceAsync', () => {
  describe('signup', () => {
    test('should return user and token when signup is successful', async () => {
      const mockUser = {
        id: '4',
        name: 'hardik',
        email: 'hardik@intimetec.com',
        password: 'hardik@123',
        isAuthenticated: true,
        token: '4',
        idAdmin: true,
      };
      (axios.post as jest.Mock).mockResolvedValue({ data: mockUser });
      const store = configureStore({ reducer: { auth: authReducer } });
      await store.dispatch(
        signup({
          name: 'hardik',
          email: 'hardik@intimetec.com',
          password: 'hardik@123',
        })
      );
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, {
        name: 'hardik',
        email: 'hardik@intimetec.com',
        password: 'hardik@123',
      });
      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockUser.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});
