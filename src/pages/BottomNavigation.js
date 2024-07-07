// BottomNavigation.js
import React, { useState, useEffect } from 'react';
import { RiHome2Line, RiUserLine, RiSettings2Line } from 'react-icons/ri';
import { RiKeyLine } from "react-icons/ri";
// import Blogs from '../images/Blogs.png';

import { LiaSellsy } from "react-icons/lia";
import { Link, useNavigate } from 'react-router-dom';

import { FaWhatsapp } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from "react-icons/io";
// import ContactForm from '../components/ContactForm';
// import Bot from '../images/bot.png';
// import Plans from '../images/Plans.png';





const BottomNavigation = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeItem, setActiveItem] = useState('home'); // State to track active item

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 
  
  const [showPopup, setShowPopup] = useState(false);
  const [launchShowPopup, setLaunchShowPopup] = useState(false);
  const [whatsappPopup, setWhatsappPopup] = useState(false);
  const [subscriptionPopup, setSubscriptionPopup] = useState(false);


  const handlePopupButtonClick = () => {
    setShowPopup(false); // Close the popup when a button inside it is clicked
    setWhatsappPopup(false)
    setSubscriptionPopup(false)

  
  }; 

  const ShowSubcriptionPopup = () =>{
    setSubscriptionPopup(!subscriptionPopup);
  };

  const LaunchingPopup = () =>{
    setLaunchShowPopup(!launchShowPopup);
  };

  const showWhatsappPopup = () =>{
    setWhatsappPopup(!whatsappPopup);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleItemClick = (item) => {
    setActiveItem(item); // Set the active item
  };

  if (!isMobile) {
    return null; 
  }

  return (
    <div>
    <nav className="z-10 border w-fit fixed bottom-2 right-0 right-0 bg-white px-4 py-2 flex justify-around items-center text-black border-t rounded-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      {/* <Link to='/'  className={`flex flex-col items-center ${activeItem === 'home' ? 'text-orange-600' : ''}`} onClick={() => handleItemClick('home')}>
        <RiHome2Line className="text-2xl" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to='/corporate' className={`flex flex-col items-center ${activeItem === 'corporate' ? 'text-orange-500' : ''}`} onClick={() => handleItemClick('corporate')}>
        <HiOutlineBuildingOffice2 className="text-2xl" />
        <span className="text-xs mt-1">Corporate</span>
      </Link> */}
      <Link to='/orders' className={`flex items-center ${activeItem === 'order' ? 'text-orange-500' : ''}`} >
        <IoBagHandleOutline className="text-2xl" />
        <span className="text-s mt-1">My Subscriptions</span>
      </Link>
      {/* <Link to='#' className={`flex flex-col items-center ${activeItem === 'settings' ? 'text-orange-500' : ''}`}  onClick={togglePopup}>
        <CiGrid41 className="text-2xl" />
        <span className="text-xs mt-1 ">More</span>
      </Link> */}
    </nav>

    
    </div>
  );
};

export default BottomNavigation;
