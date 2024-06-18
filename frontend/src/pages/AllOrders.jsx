import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../components/Loader/Loader'
import { FaCheck, FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoOpenOutline } from 'react-icons/io5'
import UserData from './UserData'

const AllOrders = () => {
  const [orders, setOrders] = useState([])
  const [showOptions, setShowOptions] = useState(-1)
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [userDiv, setUserDiv] = useState('hidden')
  const [userDivData, setUserDivData] = useState(null)

  const UpdateStatus = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:4040/api/v1/order/update-status/${orderId}`,
        { status },
        { withCredentials: true },
      )
      toast.success('Status updated successfully')
      fetchOrders()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error updating the status'
      toast.error(errorMessage)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4040/api/v1/order/get-order-history',
        { withCredentials: true },
      )

      const { data, message, statusCode, sucess } = response.data
      if (statusCode < 400 && sucess) {
        setOrders(data)
      } else {
        toast.error(message)
      }
    } catch (error) {
      toast.error('Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="h-[100%] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {orders && orders.length > 0 ? (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:tet-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>
          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[40%] md:w-[22%]">
              <h1 className="">Books</h1>
            </div>
            <div className="w-0 md:w-[45%] hidden md:block">
              <h1 className="">Description</h1>
            </div>
            <div className="w-[17%] md:w-[9%]">
              <h1 className="">Price</h1>
            </div>
            <div className="w-[30%] md:w-[16%]">
              <h1 className="">Status</h1>
            </div>
            <div className="w-[10%] md:w-[5%]">
              <h1 className="">
                <FaUserAlt />
              </h1>
            </div>
          </div>
          {orders.map((order, i) => (
            <div
              key={order._id}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
            >
              <div className="w-[3%]">
                <h1 className="text-center">{i + 1}</h1>
              </div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${order.bookDetails._id}`}
                  className="hover:text-blue-300"
                >
                  {order.bookDetails.title}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1 className="">{order.bookDetails.desc.slice(0, 50)}...</h1>
              </div>
              <div className="w-[17%] md:w-[9%]">
                <h1 className="">{order.bookDetails.price}</h1>
              </div>
              <div className="w-[30%] md:w-[16%]">
                <h1 className="font-semibold">
                  <button
                    className="hover:scale=105 transition-all duration-300"
                    onClick={() => setShowOptions(i)}
                  >
                    {order.status === 'Order Placed' ? (
                      <div className="text-yellow-500">{order.status}</div>
                    ) : order.status === 'canceled' ? (
                      <div className="text-red-500">{order.status}</div>
                    ) : (
                      <div className="text-green-500">{order.status}</div>
                    )}
                  </button>

                  {showOptions === i && (
                    <div className={`${showOptions === i ? 'flex' : 'hidden'}`}>
                      <select
                        name="status"
                        id=""
                        className="bg-gray-800"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {[
                          'pending',
                          'Order Placed',
                          'canceled',
                          'Out for delivery',
                          'delivered',
                        ].map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          UpdateStatus(order._id)
                          setShowOptions(-1)
                        }}
                        className="text-green-500 hover:text-pink-600 mx-2"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  )}
                </h1>
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  onClick={() => {
                    setUserDiv('fixed')
                    setUserDivData(order.userDetails)
                  }}
                  className="text-xl hover:text-orange-500"
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[100%] flex items-center justify-center">
          <p>No orders found.</p>
        </div>
      )}

      {userDivData && (
        <UserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  )
}

export default AllOrders
