import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const BASE_URL = 'http://localhost:4000/api'; // Replace with your backend API URL

const storeTokenInLocalStorage = (token) => {
  localStorage.setItem('token', token);
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

const verifyToken = async () => {
  try {
    const token = getTokenFromLocalStorage();
    if (!token) {
      return false; // No token found
    }

    // Verify token validity on the server side (example endpoint)
    const response = await axios.post(`${BASE_URL}/customerToken/verifyCustomerToken,`, { token });
    return response.data.valid;
    console.log('Token Verified', response.data);
  } catch (error) {
    console.error('Error verifying token:', error);
    return false; // Token verification failed
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const isAuthenticated = () => {
  const token = getTokenFromLocalStorage();
  if (!token) {
    return false; // No token found
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp > currentTime; // Check if token is expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Decoding error or expired token
  }
};

export { logout, isAuthenticated, verifyToken };
