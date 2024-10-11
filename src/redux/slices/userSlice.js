/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id:'',
  name: '',
  phone: '',
  email: '',
  address:'',
  avatar:'',
  access_token: '',
  isAdmin: false,
  city: '',
  district: '',
  commune: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        const {_id, name, phone, email, address, avatar, access_token, isAdmin, city, district, commune} = action.payload
        state.id = _id
        state.name = name
        state.phone = phone
        state.email = email
        state.address = address
        state.avatar = avatar
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.city = city
        state.district = district
        state.commune = commune
    },
    clearUser: (state) => {
      state.id = ''
      state.name = ''
      state.phone = ''
      state.email = ''
      state.address = ''
      state.avatar = ''
      state.access_token = ''
      state.isAdmin = false
      state.city = ''
      state.district = ''
      state.commune = ''
      localStorage.removeItem('access_token')
  },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, clearUser } = userSlice.actions

export default userSlice.reducer