import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/toast.css';
import './App.css';
import Logo from './assets/images/shop-logo.png'; // Add your logo image here
import ProductList from './components/ProductList';
import AdminProductList from './components/AdminProductList';
import ProductForm from './components/ProductForm';
import AdminCategoryList from './components/AdminCategoryList';
import CategoryForm from './components/CategoryForm';
import Login from './components/Login';
import Registration from './components/Registration';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderDetails from './components/OrderDetails';
import OrderHistory from './components/OrderHistory';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { getUserCart } from './services/cartService';
import Footer from 'components/Footer';
import ProductDetails from './components/ProductDetails';
import EcommerceLogo from 'assets/images/Ecommerce-logo.png';

const Navigation = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = async () => {
    if (user && isAuthenticated && !isAdmin) {
      try {
        const cart = await getUserCart(user.userID);
        const count = cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartItemCount(count);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [user, isAuthenticated, isAdmin]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to={isAdmin ? "/admin/products" : "/"}>
          <img 
            src={EcommerceLogo} 
            alt="ShopEasy Logo" 
            height="30" 
            className="me-2"
          />
          <i><b>ShopEasy</b></i>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/*
            {!isAdmin && (
              <li className="nav-item">
                <Link className="nav-link nav-bar-menu" to="/">Store</Link>
              </li>
            )}
              */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-bar-menu" to="/admin/products">
                    Manage Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-bar-menu" to="/admin/categories">
                    Manage Categories
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <li className="nav-item">
                      <span className="nav-link nav-bar-menu">Welcome, {user?.firstName}</span>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link nav-bar-menu" to="/">Store</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link position-relative nav-bar-menu" to="/cart">
                        <i className="bi bi-cart3 "></i>
                        Cart
                        {cartItemCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link nav-bar-menu" to="/orders">
                        <i className="bi bi-clock-history me-1"></i>
                        Orders
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item nav-bar-menu">
                  <div>
                    <button className="btn btn-link nav-link nav-bar-menu" onClick={logout}>Logout</button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-bar-menu" to="/">Store</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-bar-menu" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-bar-menu" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

function AppContent() {
  const { isAdmin } = useAuth();
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      />
      <div className='page-wrapper'>
        <Navigation />
        <Routes>
          {!isAdmin && (
            <>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/orders/:orderId" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />
            </>
          )}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProductList />
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <AdminCategoryList />
            </AdminRoute>
          } />
          <Route path="/admin/products/add" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
          <Route path="/admin/categories/add" element={<CategoryForm />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

          {/* Redirect admin to admin products page if they try to access store page */}
          {isAdmin && <Route path="/" element={<AdminRoute><AdminProductList /></AdminRoute>} />}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;