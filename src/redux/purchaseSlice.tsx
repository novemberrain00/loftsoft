import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { OrderI } from '../interfaces';

interface PurchaseStateI {
  purchase: OrderI | {}
}

const initialState: PurchaseStateI = {
  purchase: {}
}

export const StraightOrderSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setPurchase: (state: PurchaseStateI, action) => {
      state.purchase = action.payload;
    }
  },
})

export const {setPurchase} = StraightOrderSlice.actions
export const replenishment = (state: RootState) => state.straightOrder
export default StraightOrderSlice.reducer