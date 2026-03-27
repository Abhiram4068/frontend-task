import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login/`, creds);
    return data; // expects { access, refresh }
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/register/`, creds);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Registaration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken') || null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        const accessToken = a.payload?.tokens?.access || a.payload?.access || null;
        const refreshToken = a.payload?.tokens?.refresh || a.payload?.refresh || null;
        const user = a.payload?.user || null;
        s.user = user;
        s.accessToken = accessToken;
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.status = 'succeeded'; })
      .addCase(registerUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;