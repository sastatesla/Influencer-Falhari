import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchCategoryById } from '../services/api';
import { IoShareSocialOutline } from "react-icons/io5";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

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
      // Fallback for browsers that do not support the Web Share API
      alert('Share feature is not supported in your browser.');
    }
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

      

      <Link
        to={`/schedule/${productId}`}
        
      >
      <div className="bg-white w-full text-white px-2 py-2 border-t shadow-lg  hover:bg-blue-700 fixed bottom-0 right-0">
      <p className='text-gray-400 text-sm text-center'>Freshly Prepared and Quickly Delivered by <span className='color'>Falhari</span></p>
        <div className='text-center bg-theme rounded py-2'>
        Schedule Now
        </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductDetails;
