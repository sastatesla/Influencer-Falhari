import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);

  const changeHandler = ({ target: { name, value } }) => {
    if (name === 'phoneNumber') {
      // Restricting to 10 digits
      if (value.length > 10) return;
      // Ensure that value only contains numbers
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
   
  };

  const sendOtpHandler = async () => {
    const accountData = { 
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: '+91' + formData.phoneNumber 
    };

    console.log('CustomerData:',accountData )
    // const accountData = { ...formData, phoneNumber: '+91' + formData.phoneNumber };
    try {
      const res = await axios.post('http://localhost:4000/api/users/send-otp', accountData);
      toast.success('OTP Sent');
      setOtpSent(true);
      const token = res.data.token;
      console.log('Token:', token); 
      localStorage.setItem('token', token);   
      
    } catch (error) {
      toast.error('Failed to send OTP');
      console.error('Error sending OTP:', error);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const verificationData = {
        phoneNumber: '+91' + formData.phoneNumber,
        otp: formData.otp,
      };
      const response = await axios.post('http://localhost:4000/api/users/verify-otp', verificationData);
      toast.success('Account Created');
      const token = response.data.token;
      console.log('Token:', token); 
      localStorage.setItem('token', token);  
      navigate('/');
      return response.data;

    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        {/* First Name and Last Name */}
        <div className='flex gap-x-4 mt-5'>
          <label className='w-full'>
            <p className='text-sm mb-1 leading-6'>
              First Name <sup className='text-pink-200'>*</sup>
            </p>
            <input
              className='border-2 rounded-md w-full p-3'
              required
              type='text'
              name='firstName'
              onChange={changeHandler}
              placeholder='Enter first name'
              value={formData.firstName}
              aria-label='First Name'
            />
          </label>

          <label className='w-full'>
            <p className='text-sm mb-1 leading-6'>
              Last Name <sup className='text-pink-200'>*</sup>
            </p>
            <input
              className='border-2 rounded-md w-full p-3'
              required
              type='text'
              name='lastName'
              onChange={changeHandler}
              placeholder='Enter last name'
              value={formData.lastName}
              aria-label='Last Name'
            />
          </label>
        </div>

        {/* Mobile Number */}
        <div className='mt-5'>
          <label className='relative'>
            <p className='text-sm mb-1 leading-6'>
              Enter Mobile Number <sup>*</sup>
            </p>
            <div className='flex items-center'>
              <span className='rounded-md p-3 border-2 bg-gray-100'>+91</span>
              <input
                className='rounded-md w-full p-3 border-2'
                required
                type='tel'
                name='phoneNumber'
                onChange={changeHandler}
                placeholder='Enter mobile number'
                value={formData.phoneNumber}
                aria-label='Mobile Number'
                maxLength={10}
              />
            </div>
          </label>
        </div>

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            type='button'
            onClick={sendOtpHandler}
            className='w-full bg-green-200 rounded-md font-medium text-richblack-900 px-3 py-2 mt-7'
          >
            Send OTP
          </button>
        )}

        {/* OTP Input */}
        {otpSent && (
          <>
            <div className='flex w-full gap-x-4 mt-5'>
              <label className='w-full relative'>
                <p className='text-sm mb-1 leading-6'>
                  Enter OTP <sup>*</sup>
                </p>
                <input
                  className='rounded-md text-black w-full p-3 border-2'
                  required
                  type='number'
                  name='otp'
                  onChange={changeHandler}
                  placeholder='Enter otp'
                  value={formData.otp}
                  aria-label='otp'
                  pattern='[0-9]{10}'
                  maxLength={6}

                />
              </label>
            </div>

            <button
              type='submit'
              className='w-full bg-yellow-50 rounded-md font-medium text-richblack-900 px-3 py-2 mt-7'
            >
              Verify OTP
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
