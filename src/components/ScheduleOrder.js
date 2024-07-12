import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays  } from 'date-fns';
import './ScheduleOrder.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MdAddLocationAlt } from "react-icons/md";
import { fetchProductById, createOrder } from '../services/api';
import { IoCashOutline } from "react-icons/io5";

const ScheduleOrder = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [product, setProduct] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to Cash on Delivery
  const [selectedSubscription, setSelectedSubscription] = useState(null); // State to hold selected subscription
  const [endDate, setEndDate] = useState(null);

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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const location = useLocation();

  useEffect(() => {
    // Load selected subscription from location state on component mount
    const { selectedSubscription } = location.state || {};
    setSelectedSubscription(selectedSubscription);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedSubscription && selectedSubscription.days) {
      const endDate = addDays(date, selectedSubscription.days - 1); 
      setEndDate(endDate);
    }
  };

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot); // Directly set the selected time slot
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      setErrorMessage('Please enter a valid address to place the order.');
      return;
    }
    if (!userId) {
      setErrorMessage('User ID is missing.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const datesArray = [];
      let currentDate = new Date(selectedDate);
      while (currentDate <= endDate) {
        datesArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const orderData = {
        userId,
        shippingAddress: address,
        products: [{
          productId: product._id,
          quantity: 1, 
          price: product.discountFees || product.regularFees,
        }],
        selectedDates: datesArray,
        timeSlot: selectedTimeSlot,
        totalAmount: calculateTotalPrice(),
        paymentMethod: paymentMethod // Include payment method in order data
      };

      const response = await createOrder(orderData);

      alert('Order placed successfully', response);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  const updateAddress = () => {
    if (newAddress.trim()) {
      setAddress(newAddress);
      setNewAddress('');
      setErrorMessage('');
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedSubscription || !selectedDate) {
      return 0; // No subscription or date selected
    }

    const pricePerDay = selectedSubscription.price;
     // Calculate days difference + 1 for inclusive range

    return (pricePerDay)  // +20 is the fixed shipping fee
  };

  return (
    <div className="mb-20 font-nunito">
      <div className='px-2 py-4 shadow rounded m-3 bg-red-100'>
        <div className="text-black text-lg font-medium mr-2 text-center">Hey {userName || 'My Dashboard'}!</div>

        <div>
          {selectedSubscription ? (
            <div className='text-center bg-sky color px-2 rounded-md font-bold border-2 flex justify-between w-4/5 m-auto'>
              <p>{selectedSubscription.days} day trial</p>
              <p>Rs {selectedSubscription.price}</p>
            </div>
          ) : (
            <p>No subscription selected.</p>
          )}
        </div>
      </div>

      <div className="mb-4 w-full mt-2 px-3 font-nunito">
        <p className="font-semibold text-lg ">Select preferred day</p>
        <p className='leading-none text-gray-400 mb-4'>Choose the date on which you want to get delivery</p>
        <div>
          <div className='w-full font-nunito'>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              dayClassName={date =>
                selectedDate && selectedDate.toDateString() === date.toDateString()
                  ? 'bg-red-500 text-white'
                  : undefined
              }
            />
          </div>
          <div className="mt-4 font-nunito">
            <h3 className="font-semibold font-lg mb-2">Selected Date</h3>
            {selectedDate && (
              <div className='color border text-center px-1 rounded-lg py-2 border-red-500'>
                {format(selectedDate, 'EE dd MMM')}
              </div>
            )}
            {endDate && (
              <p className="text-sm text-gray-500 mt-1">No delivery from {format(endDate, 'EE dd MMM')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 ml-3 p-2 rounded font-nunito bg-sky">
        <p className="font-semibold text-lg ">Select preferred delivery time slot:</p>
        <p className='leading-none text-gray-400 mb-4'>Product will be delivered in the choosen time slot</p>

        <div className='grid grid-cols-2 gap-y-2'>
          {['07AM - 09AM', '09AM - 12AM', '12AM - 02AM', '02PM - 05PM', '06PM-09PM'].map((slot, index) => (
            <div
              key={index}
              className={`mr-2 px-4 py-2 rounded-lg ${selectedTimeSlot === slot ? 'border border-red-500 color' : 'bg-gray-200'}`}
              onClick={() => handleTimeSlotSelection(slot)}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      <div className='bg-sky m-3 border shadow rounded-lg'> 
        <p className='pt-2 pl-2'>Enter Address</p> 
        <div className='mx-4 bg-white border-slate-200 mt-2 flex flex-row justify-between border-2 rounded-md px-2 items-center'>
          <input 
            className='items-center text-xl w-full h-full' 
            placeholder='Enter address' 
            value={newAddress}
            onChange={handleAddressChange}
          />
          <div className='hidden md:block w-44 h-full place-content-center px-4 border-l-2'>
            <button 
              className='text-center text-[#F2971F] text-lg flex flex-row gap-2 font-semibold items-center' 
              onClick={updateAddress}
            >
              <span>Add Address</span>
              <MdAddLocationAlt className='text-xl' />
            </button>
          </div>
          <div className='block md:hidden'>
            <button className='text-3xl p-2' onClick={updateAddress}>
              <MdAddLocationAlt />
            </button>
          </div>
        </div>
        <p className='text-lg  m-4'>{address}</p>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </div>

      <div className=' flex flex-col m-3'>
        <p className='text-lg font-semibold'>Price details</p>
        <div className='bg-[#f5f4f4] p-3 mt-2 mb-6 flex flex-col gap-3'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-700 text-base'>Subtotal</div>
            <div className='color'>{calculateTotalPrice()}</div>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-700 text-base'>Shipping Fee</div>
            <div>20</div>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-gray-700 text-base'>including Tax</div>
          </div>
        </div>
      </div>

      <div className="mb-4 ml-3 font-nunito">
        <p className="font-semibold mb-2">Select payment method:</p>
        <div className='grid grid-cols-1 gap-y-2'>
          <div
            className={`flex gap-32 px-4 py-2 whitspace-none rounded-lg ${paymentMethod === 'COD' ? 'border border-red-500 color' : 'bg-gray-200'}`}
            onClick={() => setPaymentMethod('COD')}
          >
            Cash on Delivery <IoCashOutline size={24}/>
          </div>
          
          {/* Add more payment method options as needed */}
        </div>
      </div>

      <div className='z-40 fixed bottom-0 left-0 w-full bg-white border-t shadow-t-lg'>
        <div
          className="text-center m-2 mx-4 bg-theme text-white py-2 rounded hover:bg-red"
          onClick={handleSubmit}
        >
          Proceed to Checkout
        </div>
      </div>
    </div>
  );
};

export default ScheduleOrder;
