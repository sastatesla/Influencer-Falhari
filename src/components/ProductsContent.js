import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion } from 'framer-motion';
import bluebag from "../assets/bluebag.png";
import category from "../assets/category.png";
import secure from "../assets/secure.png";
import { fetchProductsByCategory, fetchCategories, fetchProductCount, fetchCategoryCount, updateProduct, deleteProduct } from '../services/api';
import { FaEye } from "react-icons/fa";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa6";

const ProductsContent = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [rowsToShow, setRowsToShow] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductDetails, setEditProductDetails] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, productCountData, categoryCountData] = await Promise.all([
          fetchProductsByCategory(id),
          fetchCategories(),
          fetchProductCount(),
          fetchCategoryCount()
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setProductCount(productCountData);
        setCategoryCount(categoryCountData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`); // Navigate to the product details page
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditProductDetails(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditProductDetails({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductDetails({ ...editProductDetails, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editProductDetails._id, editProductDetails);
      const updatedProducts = await fetchProductsByCategory(id);
      setProducts(updatedProducts);
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchInput]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteProduct(productId);
        const updatedProducts = await fetchProductsByCategory(id);
        setProducts(updatedProducts);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
      <ToastContainer />
      {/* <div className="col-span-1 sm:col-span-2 md:col-span-3 bg-gray-200 p-4 rounded-lg shadow-lg font-semibold md:text-lg text-md text-gray-800 tracking-wide">
        <div className="flex justify-between">
          <p>Product List</p>
          <p className="text-sm"><span className="text-blue-700">Home ~ Product ~ </span> Product List</p>
        </div>
      </div> */}

      {/* <motion.div
        className="relative p-4 mt-4 h-32 rounded-lg shadow-lg flex flex-col"
        style={{
          background: 'linear-gradient(117deg, rgba(50,199,236,1) 0%, rgba(46,172,226,1) 64%)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="text-3xl font-bold text-white">{productCount}</p>
        <p className="text-md text-white font-mono">Total Products</p>
        <img className="absolute right-1 -top-4 h-12 text-blue-300" src={bluebag} alt='truck' />
      </motion.div>

      <motion.div
        className="relative p-4 mt-4 h-32 rounded-lg shadow-lg flex flex-col"
        style={{
          background: 'linear-gradient(117deg, rgba(67,177,84,1) 10%, rgba(53,158,71,1) 84%)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="text-3xl font-bold text-white">{categoryCount}</p>
        <p className="text-md text-white font-mono">Total Categories</p>
        <img className="absolute right-1 -top-4 h-12 text-green-300" src={category} alt='bag' />
      </motion.div>

      <motion.div
        className="relative p-4 mt-4 h-32 rounded-lg shadow-lg flex flex-col"
        style={{
          background: 'linear-gradient(117deg, rgba(232,115,232,1) 2%, rgba(212,30,176,1) 92%)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="text-3xl font-bold text-white">12</p>
        <p className="text-md text-white font-mono">Total Devices</p>
        <img className="absolute right-1 -top-3 h-12 rounded-full bg-red-500" src={secure} alt='cancel' />
      </motion.div> */}

      <div className="col-span-1 sm:col-span-2 md:col-span-3  rounded-lg">
      <h1 className='font-semibold color font-nunito'>| Product made from My Recipie</h1>
      
        {/* <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-between">
            <div className="items-center">
              <label htmlFor="search-by" className="text-gray-700 w-full"></label>
              <input
                id="search-by"
                type="text"
                placeholder="Search"
                className="border bg-white w-full rounded-lg p-2"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="border border-gray-200 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={product.images} // Assuming you have an imageUrl in your product object
                alt={product.title}
                className="w-full h-40 object-cover p-2 rounded"
              />
              <div className='flex justify-between px-1'>
              <div>
              <div className="mb-1 font-bold text-md font-nunito leading-none">{product.title}</div>
              <div className=" text-sm font-nunito px-2 w-fit bg-theme rounded-full text-white font-semibold border">₹ {product.regularFees.toFixed(2)}</div>
              </div>
             
              </div>
              <div className='p-1'>
              <button
                className="border border-red-500 font-nunito text-black w-full rounded-lg hover:bg-blue-700"
                onClick={() => handleViewProduct(product)}
              >
               Subscribe Now
              </button>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 relative">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <p className="mb-2"><strong>Title:</strong> {selectedProduct.title}</p>
              <p className="mb-2"><strong>Category:</strong> {selectedProduct.category.name}</p>
              <p className="mb-2"><strong>Regular Fees:</strong> ₹ {selectedProduct.regularFees.toFixed(2)}</p>
              <p className="mb-2"><strong>Meta Title:</strong> {selectedProduct.metaTitle}</p>
              <p className="mb-2"><strong>Meta Description:</strong> {selectedProduct.metaDescription}</p>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseDetails}
              >
                &times;
              </button>
              <button
                className="bg-yellow-500 text-white py-1 px-4 rounded mt-2 hover:bg-yellow-600"
                onClick={() => handleEditProduct(selectedProduct)}
              >
                Edit Product
              </button>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 relative">
              <h3 className="text-xl font-bold mb-4">Edit Product</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label htmlFor="edit-title" className="block font-semibold">Title</label>
                  <input
                    id="edit-title"
                    type="text"
                    name="title"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={editProductDetails.title || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-regularFees" className="block font-semibold">Regular Fees</label>
                  <input
                    id="edit-regularFees"
                    type="number"
                    name="regularFees"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={editProductDetails.regularFees || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-metaTitle" className="block font-semibold">Meta Title</label>
                  <input
                    id="edit-metaTitle"
                    type="text"
                    name="metaTitle"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={editProductDetails.metaTitle || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-metaDescription" className="block font-semibold">Meta Description</label>
                  <textarea
                    id="edit-metaDescription"
                    name="metaDescription"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={editProductDetails.metaDescription || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white py-1 px-4 rounded ml-2 hover:bg-gray-700"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsContent;
