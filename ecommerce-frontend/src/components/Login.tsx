import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoginBgImage from '../assets/images/login-bg-image-2.jpg'
import LoginSideImage from '../assets/images/login-side-image.jpg' // Add your side image

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);  
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login({ email, password });
      // Show toast before navigation
      toast.success('Successfully logged in!');
      setTimeout(() => {
        navigate('/');
      }, 500); // Small delay to ensure toast is visible
    } catch (err: any) {
      console.error('Login error details:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = `Login failed: ${err.response.data?.message || 'Invalid credentials'}`;
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (err.request) {
          const errorMessage = 'No response received from server. Please check your connection or try again later.';
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          const errorMessage = `Error setting up request: ${err.message}`;
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        const errorMessage = 'Failed to login. Please check your credentials.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };
  
  return (
    <div className="container-fluid p-0" style={{
      minHeight: '100vh',
      backgroundImage: `url(${LoginBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="row justify-content-center w-100 mx-0">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded overflow-hidden my-5">
            <div className="row g-0">
              <div className="col-md-6 d-none d-md-block">
                <img 
                  src={LoginSideImage} 
                  alt="Login" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              <div className="col-md-6">
                <div className="card-body p-5" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}>
                  <h3 className="text-center mb-4 fw-bold"><i>Welcome Back</i></h3>
                  {successMessage && (
                    <div className="alert alert-success" role="alert">
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label small fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label small fw-bold">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-dark btn-lg w-100 mt-2" 
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                        border: 'none'
                      }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <p className="mb-0">Don't have an account? <Link to="/register" className="text-dark fw-bold">Register now</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;