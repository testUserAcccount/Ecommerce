import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkout } from '../services/orderService';
import { getUserCart } from '../services/cartService';
import { Cart as CartType } from '../types/cart';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

const Checkout: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/300';
        }
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
    };

    useEffect(() => {
        loadCart();
    }, [user]);

    const loadCart = async () => {
        if (!user) return;
        try {
            const cartData = await getUserCart(user.userID);
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
            setError('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            setError('Please login to checkout');
            return;
        }

        if (!user.address || !user.phoneNumber) {
            setError('Your profile is missing address or phone number information. Please update your profile first.');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            const { orderId } = await checkout(user.userID, 'cashOnDelivery');
            navigate(`/orders/${orderId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center">
                <div className="spinner-border" style={{ color: '#2d4356' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-info shadow-sm border-0 rounded-3" style={{ 
                    borderLeft: '4px solid #2d4356',
                    backgroundColor: 'rgba(45, 67, 86, 0.05)'
                }}>
                    Your cart is empty. Please add items before proceeding to checkout.
                </div>
                <button 
                    className="btn" 
                    onClick={() => navigate('/')}
                    style={{
                        background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                        color: 'white',
                        border: 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                </button>
            </div>
        );
    }

    const total = cart.cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold" style={{ 
                color: '#1e2a3a',
                borderBottom: '2px solid #2d4356',
                paddingBottom: '10px'
            }}>
                <i className="bi bi-credit-card me-2"></i>
                Checkout
            </h2>
            
            {error && (
                <div className="alert alert-danger mb-4 shadow-sm border-0 rounded-3" style={{
                    borderLeft: '4px solid #dc3545'
                }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}
            
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0 rounded-3 mb-4" style={{ borderBottom: '3px solid #2d4356' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h4 className="mb-0 fw-bold" style={{ color: '#1e2a3a' }}>Order Summary</h4>
                        </div>
                        <div className="card-body">
                            {cart.cartItems.map((item) => (
                                <div key={item.cartItemID} className="d-flex align-items-center mb-3 pb-3" 
                                     style={{ 
                                         borderBottom: '1px solid rgba(0,0,0,0.05)',
                                         padding: '8px'
                                     }}>
                                    <div className="me-3" style={{ width: '70px', height: '70px' }}>
                                        <img
                                            src={getImageUrl(item.product.imageURL || '')}
                                            alt={item.product.name}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                border: '1px solid #f0f0f0'
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/300';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-bold" style={{ color: '#2d4356' }}>{item.product.name}</h6>
                                        <div className="text-secondary small">
                                            <span className="me-2">Quantity: {item.quantity}</span>
                                            <span>Price: &#8377; {item.product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <span className="fw-bold text-primary">
                                            &#8377; {(item.quantity * item.product.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between mt-4 p-3" style={{ 
                                background: 'rgba(45, 67, 86, 0.05)', 
                                borderRadius: '6px',
                                border: '1px solid rgba(45, 67, 86, 0.1)'
                            }}>
                                <h5 className="mb-0 fw-bold" style={{ color: '#2d4356' }}>Total</h5>
                                <h5 className="mb-0 fw-bold" style={{ color: '#2d4356' }}>&#8377; {total.toFixed(2)}</h5>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mb-4" style={{ borderLeft: '3px solid #2d4356' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h4 className="mb-0 fw-bold" style={{ color: '#1e2a3a' }}>Delivery Address</h4>
                        </div>
                        <div className="card-body">
                            {user && (
                                <div className="p-3 rounded" style={{ 
                                    background: 'rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <p className="mb-3">
                                        <span className="d-block mb-1 text-secondary small">Address:</span>
                                        <span className="fw-medium">{user.address || 'No address provided'}</span>
                                    </p>
                                    <p className="mb-0">
                                        <span className="d-block mb-1 text-secondary small">Phone:</span>
                                        <span className="fw-medium">{user.phoneNumber || 'No phone number provided'}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-3 sticky-top" style={{ 
                        top: '20px',
                        borderBottom: '3px solid #2d4356'
                    }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h4 className="mb-0 fw-bold" style={{ color: '#1e2a3a' }}>Payment Method</h4>
                        </div>
                        <div className="card-body">
                            <div className="p-3 mb-4 rounded" style={{ 
                                background: 'rgba(0,0,0,0.02)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id="cashOnDelivery"
                                        checked={true}
                                        readOnly
                                    />
                                    <label className="form-check-label fw-medium" htmlFor="cashOnDelivery">
                                        Cash on Delivery
                                    </label>
                                    <div className="small text-secondary mt-1">
                                        Pay when your order is delivered
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{ 
                                background: 'rgba(45, 67, 86, 0.05)', 
                                border: '1px solid rgba(45, 67, 86, 0.1)'
                            }}>
                                <span className="fw-medium">Order Total:</span>
                                <span className="fw-bold" style={{ color: '#2d4356' }}>&#8377; {total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="btn btn-lg w-100"
                                style={{
                                    background: 'linear-gradient(to right, #2d4356, #435B66)',
                                    color: 'white',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-bag-check me-2"></i>
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;