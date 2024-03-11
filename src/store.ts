import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './redux/snackbarSlice';
import userReducer from './redux/userSlice';
import adminSidebar from './redux/adminSidebarSlice';
import orderPriceSlice from './redux/orderPriceSlice';

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userReducer,
    adminSidebar: adminSidebar,
    order: orderPriceSlice
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;