import React from 'react';
import { useState } from 'react';
 
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import CategoryContent from './components/CategoryContent';
import CategoryPage from './pages/CategoryPage';
import ProductsContent from './components/ProductsContent';
import ProductDetails from './components/ProductDetails';
import ScheduleOrder from './components/ScheduleOrder';
import ProtectedRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import BottomNavigation from './pages/BottomNavigation';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className='mb-12'>
    <Router>
      <Routes>
        <Route exact path="/" element={<CategoryContent/>} />
        <Route path="/:id" element={<CategoryPage/>} />
        <Route path="/products/:categoryId" element={<ProductsContent/>} />
        <Route path="/product/:productId" element={<ProductDetails/>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/schedule/:productId' element={
           <ProtectedRoute isLoggedIn={isLoggedIn}>
        <ScheduleOrder/>
          </ProtectedRoute>
        }/>
      <Route path="/orders" element={
                   <ProtectedRoute isLoggedIn={isLoggedIn}>

        <Orders/>
        </ProtectedRoute>
     }/>   

        
        
      </Routes>
      {/* <BottomNavigation/> */}
    </Router>
    
    </div>
  );
};

export default App;
