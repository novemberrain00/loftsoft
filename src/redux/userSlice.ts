import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { UserI } from '../interfaces';

interface UserStateI {
    userInfo: UserI
}

const initialState: UserStateI = {
    userInfo: {
        id: null,
        balance: '0',
        email: '',
        is_active: false,
        is_admin: false,
        is_anonymous: true,
        photo: '',
        reg_datetime: '',
        shop_cart: [],
        username: ''
    }
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state: UserStateI, action) => {
      state.userInfo = action.payload 
    }
  },
})

export const {setUserInfo} = UserSlice.actions;
export const userInfo = (state: RootState) => state.user.userInfo;
export default UserSlice.reducer;