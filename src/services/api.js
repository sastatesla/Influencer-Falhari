
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export const registerUser = async (userData) => {
  console.log('User Data:', userData); 

  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData);
    console.log(userData);
    const token = response.data.token;

    console.log('Token:', token); 
    localStorage.setItem('token', token); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, userData);
    const token = response.data.token;
    console.log('Token:', token); 
    localStorage.setItem('token', token); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/count`);
    return response.data.count;
  } catch (error) {
    throw error;
  }
};

// export const getAdmin = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/admin`);
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };



export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/categories/${categoryId}`, );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/products?categoryId=${categoryId}`);
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const fetchProductCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/count`);
    return response.data.count;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/count`);
    return response.data.count;
  } catch (error) {
    throw error;
  }
};



export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${BASE_URL}/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// New functions for orders

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/create`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderCount  = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/count`);
    return response.data.count;
  } catch (error) {
    throw error;
  }
};
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}


export const getOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axios.put(`${BASE_URL}/orders/updateStatus/${orderId}`, statusData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchUsersWithOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users-with-orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

