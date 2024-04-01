import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './redux/snackbarSlice';
import userReducer from './redux/userSlice';
import adminSidebar from './redux/adminSidebarSlice';
import orderPriceSlice from './redux/orderPriceSlice';
import replenishmentSlice from './redux/replenishmentSlice';
import straightOrder from './redux/straightOrderSlice';
import purchaseSlice from './redux/purchaseSlice';

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userReducer,
    adminSidebar: adminSidebar,
    order: orderPriceSlice,
    replenishment: replenishmentSlice,
    straightOrder: straightOrder,
    purchase: purchaseSlice
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;