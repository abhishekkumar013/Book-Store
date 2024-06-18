import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete } from 'react-icons/ai'
import { setCart, removeFromCart, resetCart } from '../store/cart'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Loading3 from '../components/Loading/Loading3'

const Cart = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)
  const cartLength = useSelector((state) => state.cart.cartLength)
  const totalPrice = useSelector((state) => state.cart.totalPrice)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4040/api/v1/cart/get-userCart',
          {
            withCredentials: true,
          },
        )
        const { data, statusCode, message, sucess } = response.data

        if (statusCode < 400 && sucess) {
          const cartItems = data[0].cart
          dispatch(setCart({ cart: cartItems }))
        } else {
          toast.error(message)
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Error getting the Cart'
        toast.error(errorMessage)
      }
    }

    fetchCart()
  }, [dispatch])

  const handleRemove = async (id) => {
    await axios.patch(
      'http://localhost:4040/api/v1/cart/remove-from-cart',
      {
        bookId: id,
      },
      { withCredentials: true },
    )
    // remove-from-cart
    dispatch(removeFromCart(id))
  }
  const placeOrder = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4040/api/v1/order/',
        {},
        {
          withCredentials: true,
        },
      )

      const { message, statusCode, sucess, data } = response.data
      if (statusCode < 400 && sucess) {
        toast.success(message)
        dispatch(resetCart())
        navigate('/profile/orderHistory')
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error in OrderPlace'
      toast.error(errorMessage)
    }
  }

  if (!cart && !cartLength) {
    return (
      <div className="bg-zinc-900 px-12 h-screen py-8">
        <div className="w-ull h-[100%] items-center justify-center">
          <Loading3 />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 px-12 h-screen py-8">
      {cartLength === 0 && (
        <div className="h-screen">
          <div className="h-full flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
            <img src="" alt="empty cart" className="lg:h-[50vh]" />
          </div>
        </div>
      )}

      {cartLength > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {cart.map((item) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={item._id}
            >
              <img
                src={item.bookImg}
                alt={item.title}
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {item.title}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
                  {item.desc
                    ? item.desc.slice(0, 100)
                    : 'No description available'}
                  ....
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {item.desc
                    ? item.desc.slice(0, 65)
                    : 'No description available'}
                  ....
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {item.desc
                    ? item.desc.slice(0, 100)
                    : 'No description available'}
                  ....
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex">
                  ₹ {item.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => handleRemove(item._id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {cartLength > 0 && (
        <div className="mt-4 w-full flex items-center justify-end">
          <div className="p-4 bg-zinc-800 rounded">
            <h1 className="text-3xl text-zinc-200 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between gap-4 text-xl text-zinc-200">
              <h2>{cartLength} books</h2>
              <h2>₹ {totalPrice}</h2>
            </div>
            <div className="w-[100%] mt-3">
              <button
                className="bg-zinc-100 rounded px-4py-2 flex justify-center w-full font-semibold hover:bg-zinc-300 p-2"
                onClick={placeOrder}
              >
                Place your Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
