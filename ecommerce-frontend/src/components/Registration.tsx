import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { toast } from 'react-toastify';
import axios from 'axios';
import RegisterBgImage from '../assets/images/login-bg-image-2.jpg';
import RegisterSideImage from '../assets/images/registration-image.jpg';

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? `${name === 'firstName' ? 'First' : 'Last'} name is required` : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email format' : '';
      case 'password':
        if (value.trim() === '') return 'Password is required';
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'confirmPassword':
        if (value.trim() === '') return 'Please confirm your password';
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'phoneNumber':
        if (value.trim() === '') return 'Phone number is required';
        return !value.match(/^\d{10}$/) ? 'Phone number must be 10 digits' : '';
      case 'address':
        return value.trim() === '' ? 'Address is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      address: validateField('address', formData.address),
    };

    setFormErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Map form data to the API format expected by backend
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        passwordHash: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
      };
      
      await registerUser(userData);
      
      // Show success toast
      toast.success('Registration successful! Please log in.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Redirect to login with success message
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' } 
        });
      }, 500); // Small delay to ensure toast is visible
      
    } catch (err) {
      console.error('Registration error details:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = `Registration failed: ${err.response.data?.message || err.response.statusText}`;
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
        const errorMessage = 'Failed to register. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{
      minHeight: '100vh',
      backgroundImage: `url(${RegisterBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="row justify-content-center w-100 mx-0">
        <div className="col-md-9">
          <div className="card shadow-lg border-0 rounded overflow-hidden my-5">
            <div className="row g-0">
              {/* Left side - Image */}
              <div className="col-md-5 d-none d-md-block">
                <img 
                  src={RegisterSideImage} 
                  alt="Register" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              {/* Right side - Registration Form */}
              <div className="col-md-7">
                <div className="card-body p-5" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}>
                  <h3 className="text-center mb-4 fw-bold"><i>Register</i></h3>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label small fw-bold">First Name</label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formErrors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.firstName && (
                          <div className="invalid-feedback">
                            {formErrors.firstName}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label small fw-bold">Last Name</label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formErrors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.lastName && (
                          <div className="invalid-feedback">
                            {formErrors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label small fw-bold">Email</label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${formErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">
                          {formErrors.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label small fw-bold">Password</label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${formErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.password && (
                        <div className="invalid-feedback">
                          {formErrors.password}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label small fw-bold">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.confirmPassword && (
                        <div className="invalid-feedback">
                          {formErrors.confirmPassword}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label small fw-bold">Phone Number</label>
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.phoneNumber && (
                        <div className="invalid-feedback">
                          {formErrors.phoneNumber}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label small fw-bold">Address</label>
                      <textarea
                        className={`form-control form-control-lg ${formErrors.address ? 'is-invalid' : ''}`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        required
                      />
                      {formErrors.address && (
                        <div className="invalid-feedback">
                          {formErrors.address}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-dark btn-lg w-100 mt-4" 
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                        border: 'none'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <p className="mb-0">Already have an account? <Link to="/login" className="text-dark fw-bold">Login</Link></p>
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

export default Registration;