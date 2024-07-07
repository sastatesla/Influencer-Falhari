import React from 'react';
import frameImage from '../Assets/authPhoto/Logo.svg';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

const Template = ({ title, desc1, desc2, image, formtype, setIsLoggedIn }) => {
  return (
    <div className='flex flex-col-reverse md:flex-row w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 justify-between gap-y-0 mb-16'>
      <div className='w-11/12 max-w-[450px]'>
        <h1 className='font-semibold text-[1.875rem] leading-[2.375rem]'>{title}</h1>
        <p className='text-[1.125rem] leading-[1.625rem] mt-4'>
          <span className='text-richblack-100'>{desc1}</span><br />
          <span className='text-blue-100 italic'>{desc2}</span>
        </p>
        {formtype === 'signup' ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
      <div className='relative w-11/12 max-w-[450px]'>
        <img src={frameImage} alt='pattern' width={558} height={504} loading='lazy' />
        <img className='md:absolute -top-4 right-4' src={image} alt='pattern' width={558} height={504} loading='lazy' />
      </div>
    </div>
  );
};

export default Template;
