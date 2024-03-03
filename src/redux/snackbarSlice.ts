import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { SnackI } from '../interfaces';

interface SnackbarStateI {
  snacksArr: SnackI[]
}

const initialState: SnackbarStateI = {
    snacksArr: []
}

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    addSnack: (state: SnackbarStateI, action) => {
      state.snacksArr.push(action.payload)
    },

    removeLastSnack: (state: SnackbarStateI) => {
      state.snacksArr = state.snacksArr.slice(1, state.snacksArr.length);
    }
  },
})

export const {addSnack, removeLastSnack} = snackbarSlice.actions
export const snacksArr = (state: RootState) => state.snackbar.snacksArr
export default snackbarSlice.reducer