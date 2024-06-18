import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartLength: 0,
  cart: [],
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newCartItem = action.payload
      state.cart.push(newCartItem)
      state.cartLength = state.cart.length
      state.totalPrice += newCartItem.price
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload
      const itemToRemove = state.cart.find((item) => item._id === itemId)
      if (itemToRemove) {
        state.cart = state.cart.filter((item) => item._id !== itemId)
        state.cartLength = state.cart.length
        state.totalPrice -= itemToRemove.price
      }
    },
    updateCart: (state, action) => {
      const updatedItem = action.payload
      const index = state.cart.findIndex((item) => item._id === updatedItem._id)
      if (index !== -1) {
        state.totalPrice -= state.cart[index].price
        state.cart[index] = { ...state.cart[index], ...updatedItem }
        state.totalPrice += updatedItem.price
      }
    },
    setCart: (state, action) => {
      const { cart } = action.payload
      state.cart = cart
      state.cartLength = cart.length
      state.totalPrice = cart.reduce((total, item) => total + item.price, 0)
    },
    resetCart: (state, action) => {
      state.cart = []
      state.cartLength = 0
      state.totalPrice = 0
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCart,
  setCart,
  resetCart,
} = cartSlice.actions

export default cartSlice.reducer
