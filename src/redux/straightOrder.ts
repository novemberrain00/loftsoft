import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { PaymentI } from '../interfaces';

interface StraightOrderStateI {
  straightOrder: {
    price: number
    promocode: string
    email: string
    payment_type: 'sbp' | 'balance_site'
    parameter_id: number
    count: number
  }
}

const initialState: StraightOrderStateI = {
  straightOrder: {
    price: -1,
    promocode: '',
    email: '',
    payment_type: 'sbp',
    parameter_id: -1,
    count: -1
  }
}

export const StraightOrderSlice = createSlice({
  name: 'straightOrder',
  initialState,
  reducers: {
    setOrder: (state: StraightOrderStateI, action) => {
      state.straightOrder = action.payload;
    },

    resetInputData: (state: StraightOrderStateI) => {
      state.straightOrder.email = '';
      state.straightOrder.count = -1;
      state.straightOrder.promocode = '';
    }
  },
})

export const {setOrder, resetInputData} = StraightOrderSlice.actions
export const replenishment = (state: RootState) => state.straightOrder
export default StraightOrderSlice.reducer