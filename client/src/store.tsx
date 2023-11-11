import { configureStore } from '@reduxjs/toolkit';
import authReducer from './actions'; 

const store = configureStore({
  reducer: {
    auth: authReducer, 
  },
});

export default store;
