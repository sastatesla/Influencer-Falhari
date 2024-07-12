import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchProductById } from '../services/api';
import { IoShareSocialOutline, IoClose } from "react-icons/io5";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await fetchProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share feature is not supported in your browser.');
    }
  };

  const calculatePrice = (days) => {
    return (product.discountFees * days).toFixed(2);
  };

  const handleSubscriptionSelect = (days) => {
    const selectedSubscription = {
      days,
      price: calculatePrice(days),
    };
    // Navigate to the scheduling page with the selected subscription data
    navigate(`/schedule/${productId}`, { state: { selectedSubscription } });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 relative font-nunito mb-12">
      <div className="border-b pb-4 mb-4">
        <img src={product.images} alt={product.title} className="w-full h-64 object-cover mb-4 rounded border" />
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          </div>
          <button
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            onClick={handleShare}
          >
            <IoShareSocialOutline size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 line-through pb-1"> Rs {product.regularFees.toFixed(2)}</p>
        <p className="color font-bold text-xl leading-none"> Rs {product.discountFees.toFixed(2)}</p>
        <p className='text-gray-400 leading-none'>per unit</p>
      </div>

      <div className="mb-16 border rounded-md bg-sky">
        <div className="border-b mb-4">
          <button
            className={`p-2 ${activeTab === 'description' ? 'border-b-2 border-red-500 color' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`p-2 ml-4 ${activeTab === 'keyBenefits' ? 'border-b-2 border-red-500 color' : ''}`}
            onClick={() => setActiveTab('keyBenefits')}
          >
            Key Benefits
          </button>
        </div>
        {activeTab === 'description' && <p className='p-2'>{product.description}</p>}
        {activeTab === 'keyBenefits' && <p className='p-2'>{product.keyBenefits}</p>}
      </div>

      <div className="fixed bottom-0 py-2 border-t-2 bg-white w-full bg-white shadow-lg">
        <p className='w-5/6 text-center leading-none pb-2 text-gray-500'>Freshly prepared and quickly delivered by <span className='color'>Falhari</span></p>
        <button
          className="bg-theme  text-white py-2 px-28  rounded"
          onClick={() => setIsPopupVisible(true)}
        >
          Subscribe Now
        </button>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-white w-full p-4 rounded-t-lg shadow-lg slide-up">
            <button className="top-2 right-2 text-gray-600" onClick={() => setIsPopupVisible(false)}>
              <IoClose size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">Select Subscription</h2>
            <ul>
              <li className="p-2 border-b cursor-pointer " onClick={() => handleSubscriptionSelect(1)}>
                One day trial - Rs {calculatePrice(1)}
              </li>
              <li className="p-2 border-b cursor-pointer" onClick={() => handleSubscriptionSelect(7)}>
                1 week - Rs {calculatePrice(7)}
              </li>
              <li className="p-2 border-b cursor-pointer" onClick={() => handleSubscriptionSelect(14)}>
                2 weeks - Rs {calculatePrice(14)}
              </li>
              <li className="p-2 cursor-pointer" onClick={() => handleSubscriptionSelect(330)}>
                1 months - Rs {calculatePrice(30)}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
