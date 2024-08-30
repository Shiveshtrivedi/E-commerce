import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setCookie, removeCookie } from '../../utils/CookieUtils';
import {
  IUser,
  IAuthState,
  IAuthResponse,
  ICredentials,
} from '../../utils/interface/Interface';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: IAuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  error: null,
  isAdmin: storedUser
    ? JSON.parse(storedUser).email.endsWith('@intimetec.com')
    : false,
  userEmail: storedUser ? JSON.parse(storedUser).email : null,
};

export const login = createAsyncThunk<
  IAuthResponse,
  ICredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}?email=${credentials.email}`, {
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
        cors: 'no-cors',
      },
    });
    const users = response.data as IUser[];

    if (users.length > 0) {
      const user = users[0];

      if (user.password === credentials.password) {
        localStorage.setItem('token', user.id);
        setCookie('token', user.id, { expires: 1 });
        return { user, token: user.id };
      } else {
        return rejectWithValue('Incorrect password');
      }
    } else {
      return rejectWithValue('User not found');
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Login failed'
    );
  }
});

export const signup = createAsyncThunk<
  IAuthResponse,
  ICredentials,
  { rejectValue: string }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}`, {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });
    const user = response.data as IUser;
    localStorage.setItem('token', user.id);
    setCookie('token', user.id, { expires: 1 });
    return { user, token: user.id };
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Signup failed'
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeCookie('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAdmin = false;
      state.userEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
          state.userEmail = action.payload.user.email;
          state.isAdmin = action.payload.user.email.endsWith('@intimetec.com');
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Login failed';
        }
      )
      .addCase(signup.pending, (state) => {
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
          state.userEmail = action.payload.user.email;
          state.isAdmin = action.payload.user.email.endsWith('@intimetec.com');
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        signup.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Signup failed';
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
