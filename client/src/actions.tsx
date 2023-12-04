import { createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean
}
export interface TicketData {
  id: number;
  name: string;
  department: string;
  priority: string;
  created_on: string;
  status: string;
  description: string;
  resolved_on?: string;
  assign_to: string;
  disable_comments: boolean;
}
export interface TicketState {
  alltickets: TicketData[] | undefined;
}
export const initialTicketState: TicketState = {
  alltickets: undefined,
};
const initialState: AuthState = {
  username: null,
  password: null,
  isAuthenticated: false,
  isAdmin: false,
  firstName: "",
  lastName: "",
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ username: string; password: string, isAdmin: boolean, firstName: string, lastName: string }>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.isAdmin = action.payload.isAdmin;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      // console.log("\n hello  ----- ",  action.payload.username, action.payload.isAdmin);
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      console.log("\n reached here");
      state.isAuthenticated = false;
      state.username = null;
      state.password = null;
    },
  },
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: initialTicketState,
  reducers: {
    setAllTickets: (state, action: PayloadAction<TicketData[]>) => {
      // console.log("\n i reached here --- ", action.payload);
      state.alltickets = action.payload;
    },

    clearAllTickets: (state) => {
      state.alltickets = [];
    },
  },
});

export const { setCredentials, loginSuccess, logout } = authSlice.actions;
export const { setAllTickets, clearAllTickets } = ticketSlice.actions;

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  tickets: ticketSlice.reducer,
});

export default rootReducer;
