import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);

  const changeHandler = ({ target: { name, value } }) => {
    if (name === 'phoneNumber') {
      if (value.length > 10) return;
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendOtpHandler = async () => {
    const accountData = { phoneNumber: '+91' + formData.phoneNumber };
    try {
      await axios.post('http://localhost:4000/api/users/send-otp', accountData);
      toast.success('OTP Sent');
      setOtpSent(true);
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
      const token = response.data.token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      toast.success('Logged In');
      navigate('/');
    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4 mt-6'>
      <label className='w-full'>
        <p className='text-[0.875rem] mb-1 leading-[1.375rem]'>
          Enter Mobile No.<sup className='text-pink-200'>*</sup>
        </p>
        <div className='flex items-center'>
          <span className='rounded-md p-3 border-2 bg-gray-100'>+91</span>
          <input
            className='border-2 border-gray-400 rounded-[0.5rem] w-full p-[12px]'
            required
            type='tel'
            value={formData.phoneNumber}
            onChange={changeHandler}
            placeholder='Enter Mobile Number'
            name='phoneNumber'
            pattern='[0-9]{10}'
            maxLength={10}
          />
        </div>
      </label>
      {otpSent && (
        <label className='relative w-full'>
          <p className='text-[0.875rem] mb-1 leading-[1.375rem]'>
            Enter OTP<sup className='text-pink-200'>*</sup>
          </p>
          <input
            className='border-2 border-gray-400 rounded-[0.5rem] w-full p-[12px]'
            required
            value={formData.otp}
            onChange={changeHandler}
            placeholder='Enter OTP'
            name='otp'
          />
        </label>
      )}
      {!otpSent ? (
        <button
          type='button'
          onClick={sendOtpHandler}
          className='bg-green-200 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-7'
        >
          Send OTP
        </button>
      ) : (
        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-7'>
          Sign In
        </button>
      )}
    </form>
  );
}

export default LoginForm;
