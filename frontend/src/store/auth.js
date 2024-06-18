import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  user: {
    _id: null,
    username: '',
    email: '',
    address: '',
    avatar: '',
    role: 'user',
  },
  accessToken: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, accesstoken } = action.payload

      state.isLoggedIn = true
      state.user = user
      state.accessToken = accesstoken
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.user = initialState.user
      state.accessToken = ''
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    changeRole: (state, action) => {
      const role = action.payload
      state.user.role = role
    },
  },
})

export const {
  login,
  logout,
  changeRole,
  updateUser,
  updateAccessToken,
} = authSlice.actions

export default authSlice.reducer
