import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  password: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean
}

const initialState: AuthState = {
  username: null,
  password: null,
  isAuthenticated: false,
  isAdmin: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ username: string; password: string, isAdmin: boolean }>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.isAdmin = action.payload.isAdmin;
      console.log("\n hello brother ----- ", action.payload.password, action.payload.username, action.payload.isAdmin);
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.password = null;
    },
  },
});

export const { setCredentials, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
