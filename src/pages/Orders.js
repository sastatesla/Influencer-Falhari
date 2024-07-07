import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  const BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const response = await axios.get(`${BASE_URL}/admin/getAdmin`, config);
          setUserName(response.data.firstName);
          setUserId(response.data._id); // Set the userId
          console.log('User ID:', response.data._id); // Debug log
        } else {
          navigate('/login'); // Redirect to login if no token
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login'); // Redirect to login if fetch fails
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const response = await axios.get(`${BASE_URL}/orders/${userId}`, config);
          setOrders(response.data);
          console.log('My Orders:', response.data);
        } else {
          navigate('/login'); // Redirect to login if no token
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // setErrorMessage('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  const openOrderPopup = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderPopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-4 font-nunito">
      <div className='py-4 shadow rounded mb-2 bg-red-100'>
        <div className="text-black text-lg font-medium mr-2 text-center">Hey {userName || 'My Dashboard'}!</div>
        <h2 className="text-lg font-bold font-nunito color text-center">Here Are Your Orders</h2>
      </div>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 transition"
              onClick={() => openOrderPopup(order)}
            >
              <p className="text-sm text-gray-400 pb-2">Order ID: {order._id}</p>
              <hr />
              {order.products.map((product, index) => (
                <div key={index} className="mb-4 flex justify-between">
                  <div className="flex justify-between items-center">
                    <div key={product.productId._id}>
                      <div className="font-bold">{product.productId?.title}</div>
                      <div>Rs {product.price}</div>
                    </div>
                  </div>
                  <div className="">
                    <p>{order.selectedDates.length} Days</p>
                    <p>Rs {order.totalAmount}</p>
                  </div>
                </div>
              ))}
              <span className={`rounded-full px-2 py-1 text-sm ${getStatusColor(order.status)} animate-blink`}>
                {order.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed  inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-96 overflow-y-auto max-w-md relative">
            <button
              className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
              onClick={closeOrderPopup}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p className="text-sm text-gray-400 pb-2">Order ID: {selectedOrder._id}</p>
            <hr />
            {selectedOrder.products.map((product, index) => (
              <div key={index} className="mb-4">
                <div key={product.productId._id} className="font-bold">
                  {product.productId?.title}
                </div>
                <div>Rs {product.price}</div>
              </div>
            ))}
            <p><strong>Total Amount:</strong> Rs {selectedOrder.totalAmount}</p>
            <p><strong>Delivery Days:</strong> {selectedOrder.selectedDates.length}</p>
            {/* <p><strong>Selected Dates:</strong></p> */}
            <div className="list-disc mb-2 flex overflow-x-auto gap-2">
  {selectedOrder.selectedDates.map((item, index) => (
    <div className="border py-2 rounded-lg w-fit px-2" key={index}>
      <div> {new Date(item.date).toLocaleDateString()}</div>
      <div className={`rounded-full px-2 py-1 text-sm ${getStatusColor(item.status)} animate-blink`}>{item.status}</div>
    </div>
  ))}
</div>


            {/* <h3 className="text-lg sm:text-xl font-semibold mt-4">Status History:</h3> */}
            <ul>
              {selectedOrder.statusHistory
                .slice() // Make a copy of the array to avoid mutating the original
                .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                .map((history, index) => (
                  <li key={index} className="mb-2 p-2 rounded" style={{
                    backgroundColor: history.status === 'pending' ? '#E6E6FF' :
                      history.status === 'shipped' ? '#E6F7FF' :
                        history.status === 'received' ? '#E6FFE6' :
                          history.status === 'cancel' ? '#FFE6E6' : '#FFFFFF'
                  }}>
                    <p>{history.status}</p>
                    <p> {format(new Date(history.changedAt), 'dd/MM/yyyy hh:mm:ss a')}</p>
                  </li>
                ))}
            </ul>
            <p><strong>Time Slot:</strong> {selectedOrder.timeSlot}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
            <span className={`rounded-full px-2 py-1 text-sm ${getStatusColor(selectedOrder.status)} animate-blink`}>
              {selectedOrder.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to determine status color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'received':
      return 'bg-green-500 text-white';
    case 'pending':
      return 'bg-gray-300 text-black';
    case 'shipped':
      return 'bg-green-500 text-white';
    case 'Cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export default Orders;
