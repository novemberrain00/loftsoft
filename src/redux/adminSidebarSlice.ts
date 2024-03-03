import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { SnackI } from '../interfaces';

interface AdminSidebarStateI {
  isOpened: boolean
}

const initialState: AdminSidebarStateI = {
    isOpened: false
}

export const AdminSidebarSlice = createSlice({
  name: 'adminSidebar',
  initialState,
  reducers: {
    opendSidebar: (state: AdminSidebarStateI) => {
      state.isOpened = true;
    },

    closeSidebar: (state: AdminSidebarStateI) => {
        state.isOpened = false;
      }
  },
})

export const {opendSidebar, closeSidebar} = AdminSidebarSlice.actions
export const isOpened = (state: RootState) => state.adminSidebar.isOpened
export default AdminSidebarSlice.reducer