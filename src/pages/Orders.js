import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format,addDays } from 'date-fns';
import { updateOrderStatus } from '../services/api';

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

  const updateStatusForDate = async (orderId, dateIndex, newStatus) => {
    try {
      let updatedOrder;
      if (newStatus === 'skip') {
        const lastDate = selectedOrder.selectedDates[selectedOrder.selectedDates.length - 1].date;
        const newDate = addDays(new Date(lastDate), 1);
  
        // Send the new date with the update request
        updatedOrder = await updateOrderStatus(orderId, dateIndex, { status: 'skip', date: newDate });
  
        // Update selectedOrder with the updated order
        setSelectedOrder(updatedOrder);
      } else {
        updatedOrder = await updateOrderStatus(orderId, dateIndex, { status: newStatus });
        setSelectedOrder(updatedOrder);
      }
  
      // Update orders state with the updated order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
  
      console.log(`Order ${orderId} status updated for date ${dateIndex} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status for date:', error);
      alert('Failed to update order status for date. Please try again later.');
    }
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
        <div className="fixed h-screen bottom-0 overflow-y-auto inset-0 bg-gray-800 slide-up bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-white w-full p-4 rounded-t-lg shadow-lg  max-w-md">
            <button
              className=" top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
              onClick={closeOrderPopup}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Order Details</h2>
            <p className="text-sm text-gray-400 pb-2">Order ID: {selectedOrder._id}</p>
            <div className='flex justify-between pt-2 bg-red-100 p-2 rounded-md'>
              <div className=''>
                {selectedOrder.products.map((product, index) => (
                  <div key={index} className="">
                    <div key={product.productId._id} className="font-bold color">
                      {product.productId?.title}
                    </div>
                    <div>Rs {product.price}</div>
                  </div>
                ))}
              </div>
              <div className=''>
                <p><strong></strong> Rs {selectedOrder.totalAmount}</p>
                <p>{selectedOrder.selectedDates.length} Days</p>
              </div>
            </div>
            <div className="border mt-2 bg-sky rounded-md p-2 list-disc mb-2 h-44 overflow-y-auto gap-2">
  <p>Time Slot: {selectedOrder.timeSlot}</p>
  {selectedOrder.selectedDates.map((item, index) => (
  <div className="border bg-white flex justify-between py-2 rounded-lg w-full px-2" key={index}>
    <div>{new Date(item.date).toLocaleDateString()}</div>
    <div className={`rounded-full px-2 py-1 text-sm ${getStatusColor(item.status)} animate-blink`}>{item.status}</div>
    {item.status !== 'shipped' && item.status !== 'skip' && (
      <button
        className="border bg-white rounded-md px-2"
        onClick={() => updateStatusForDate(selectedOrder._id, index, 'skip')}
      >
        Skip
      </button>
    )}
  </div>
))}

</div>
            <div className='flex gap-2 overflow-x-auto'>
              {selectedOrder.statusHistory
                .slice() // Make a copy of the array to avoid mutating the original
                .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                .map((history, index) => (
                  <div key={index} className="mb-2 p-2 w-52 rounded" style={{
                    backgroundColor: history.status === 'pending' ? '#E6E6FF' :
                      history.status === 'shipped' ? '#E6F7FF' :
                        history.status === 'received' ? '#E6FFE6' :
                        history.status === 'skip' ? '#E6FFE8' :

                          history.status === 'cancel' ? '#FFE6E6' : '#FFFFFF'
                  }}>
                    <p>{history.status}</p>
                    <p className='text-sm text-gray-500 whitespace-nowrap'> {format(new Date(history.changedAt), 'dd/MM hh:mm a')}</p>
                  </div>
                ))}
            </div>
            <p className='text-s'>Delivery Address</p>
            <p className='font-semibold leading-none'>{selectedOrder.shippingAddress}</p>
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
      return 'bg-gray-300 text-white';
    case 'shipped':
      return 'bg-green-500 text-white';
    case 'cancelled':
      return 'bg-red-500 text-white';
    case 'skip':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export default Orders;
