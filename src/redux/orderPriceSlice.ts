import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface OrderPriceStateI {
  id: number
  price: string
}

const initialState: OrderPriceStateI = {
    id: -1,
    price: ''
}

export const OrderPriceSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderId: (state: OrderPriceStateI, action) => {
        state.id = action.payload
    },

    setPrice: (state: OrderPriceStateI, action) => {
        state.price = action.payload;
    }
  },
})

export const {setPrice, setOrderId} = OrderPriceSlice.actions
export const price = (state: RootState) => state.order.price
export const id = (state: RootState) => state.order.id
export default OrderPriceSlice.reducer