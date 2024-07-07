import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategoryById, fetchProductsByCategory } from '../services/api'; // Make sure to implement this API call
import ProductsContent from '../components/ProductsContent';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import BottomNavigation from './BottomNavigation';
import { IoShareSocialOutline } from "react-icons/io5";

const CategoryPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const [categoryData, productsData] = await Promise.all([
          fetchCategoryById(id),
          fetchProductsByCategory(id),
        ]);
        setCategory(categoryData);
        setProducts(productsData);
        setSocialLinks(categoryData.socialLinks || []);
      } catch (error) {
        console.error('Error fetching category details and products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: category.name,
          text: category.description,
          url: window.location.href,
        });
        console.log('Shared successfully');
      } else {
        console.log('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="">
      {/* Floating Share Button */}
      <button
        onClick={handleShare}
        className="z-40 fixed top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-red-500 focus:outline-none"
      >
        <IoShareSocialOutline/>
      </button>

      <div className='bg-red-100 p-2 rounded-b-xl'>
        <div className='bg-white rounded-lg'>
          <div className="relative">
            <img src={category.bannerUrl} alt="Banner" className="w-full h-32 object-cover rounded-t-lg" />
            <img src={category.imageUrl} alt={category.name} className="w-24 h-24 rounded-full border-2 border-gray-200 absolute bottom-12 left-4 -mb-12 transform translate-y-1/2 object-cover" />
          </div>
          <div className="px-4 pt-12">
            <h3 className="font-bold text-2xl font-nunito">{category.name}</h3>
            <div className="p-0 pt-0">
              <div className="flex space-x-2">
                <div className='border border-red-500 p-2 rounded-full'>
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-blue-500">
                      <FaInstagram size={20} />
                    </a>
                  )}
                </div>
                <div className='border border-blue-500 p-2 rounded-full'>
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                      <FaTwitter size={20} />
                    </a>
                  )}
                </div>
                <div className='border border-blue-500 p-2 rounded-full'>
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                      <FaFacebook size={20} />
                    </a>
                  )}
                </div>
                <div className='border border-blue-800 p-2 rounded-full'>
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-500">
                      <FaLinkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-nunito pb-4">{truncateText(category.description, 180)}</p>
          </div>
        </div>
      </div>
      <ProductsContent products={products} />

      <BottomNavigation />
    </div>
  );
};

export default CategoryPage;
