import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { PaymentI } from '../interfaces';

interface RepllenishmentStateI<T> {
  replenishment: T
}

const initialState: RepllenishmentStateI<PaymentI> = {
    replenishment: {
      number: '',
      result_price: '',
      payment_type: 'sbp',
      status: '',
      created_datetime: ''
    }
}

export const replenishmentSlice = createSlice({
  name: 'replenishment',
  initialState,
  reducers: {
    setReplenishment: (state: RepllenishmentStateI<PaymentI>, action) => {
      state.replenishment = action.payload;
    },
  },
})

export const {setReplenishment} = replenishmentSlice.actions
export const replenishment = (state: RootState) => state.replenishment
export default replenishmentSlice.reducer