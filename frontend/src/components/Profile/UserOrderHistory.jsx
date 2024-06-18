import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loading3 from '../Loading/Loading3'
import { Link } from 'react-router-dom'

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetched = async () => {
      const response = await axios.get(
        'http://localhost:4040/api/v1/order/get-all-order',
        {
          withCredentials: true,
        },
      )
      const { data, message, statusCode, sucess } = response.data
      if (statusCode < 400 && sucess) {
        const extractedOrders = data[0].orders
        setOrders(extractedOrders)
      } else {
        toast.error(message)
      }
    }
    fetched()
  }, [])
  return (
    <>
      {!orders && (
        <div className="h-[100%] flex items-center justify-center">
          <Loading3 />
        </div>
      )}
      {orders && orders?.length === 0 && (
        <div className="h-[80vh] p-4 text-zinc-100">
          <div className="h-[100%] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
              No Order History
            </h1>
            <img src="" alt="no-order" className="h-[20vh[ mb-8" />
          </div>
        </div>
      )}
      {orders && orders?.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:tet-5xl font-semibold text-zinc-500 mb-8">
            Your Order History
          </h1>
          <div className="mt-4 bg-zinc-800  w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1 className="">Books</h1>
            </div>
            <div className="w-[45%]">
              <h1 className="">Description</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="">Price</h1>
            </div>
            <div className="w-[16%]">
              <h1 className="">Status</h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block">
              <h1 className="">Model</h1>
            </div>
          </div>
          {orders.map((order, i) => (
            <div
              className="bg-zinc-800  w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer"
              key={i}
            >
              <div className="w-[3%]">
                <h1 className="text-center">{i + 1}</h1>
              </div>
              <div className="w-[22%]">
                <Link
                  to={`/view-book-details/${order.book._id}`}
                  className="hover:text-blue-300"
                >
                  {order.book.title}
                </Link>
              </div>
              <div className="w-[45%]">
                <h1 className="">{order.book.desc.slice(0, 50)} ...</h1>
              </div>
              <div className="w-[9%]">
                <h1 className="">₹ {order.book.price}</h1>
              </div>
              <div className="w-[16%]">
                <h1 className="font-semibold text-green-500">
                  {order.status === 'Order Placed' ? (
                    Link(<div className="text-yellow-500">{order.status}</div>)
                  ) : order.status === 'canceled' ? (
                    <div className="text-red-500">{order.status}</div>
                  ) : (
                    order.status
                  )}
                </h1>
              </div>
              <div className="w-none md:w-[5%] hidden md:block">
                <h1 className="">COD</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default UserOrderHistory
