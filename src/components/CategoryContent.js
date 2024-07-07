import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, deleteCategory } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const CategoryContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter((category) => category._id !== categoryId));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:space-y-4">
      <ToastContainer />

      <div className="bg-red-100 p-2 rounded shadow grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
      {categories.map((category) => {
        const { socialLinks } = category; // Assuming socialLinks is an array or object

          return (
            <div key={category._id} className="bg-white rounded-lg shadow-lg">
              <Link to={`/${category._id}`}>
                <div className="relative">
                  <img src={category.bannerUrl} alt="Banner" className="w-full h-48 object-cover rounded-t-lg" />
                  <img src={category.imageUrl} alt={category.name} className="w-24 h-24 rounded-full border-2 border-gray-200 absolute bottom-12 left-4 -mb-12 transform translate-y-1/2 object-cover" />
                </div>
                <div className="p-4 pt-12 font-nunito">
                  <h3 className="font-semibold text-xl font-nunito color">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </Link>
              <div className="p-4 pt-0">
                <div className="flex space-x-4 mt-4">
                {socialLinks && socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                      <FaInstagram size={24} />
                    </a>
                  )}
                  {socialLinks && socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                      <FaTwitter size={24} />
                    </a>
                  )}
                  {socialLinks && socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {socialLinks && socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                      <FaLinkedin size={24} />
                    </a>
                  )}
                </div>
                {/* Other actions like edit and delete */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryContent;
