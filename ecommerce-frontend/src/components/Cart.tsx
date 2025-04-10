import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserCart, updateCartItem, removeFromCart } from '../services/cartService';
import { Cart as CartType, CartItem } from '../types/cart';
import CartImg from '../assets/images/cart-empty.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

const Cart: React.FC = () => {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/300';
        }
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
    };

    useEffect(() => {
        if (user) {
            loadCart();
        }
    }, [user]);

    const loadCart = async () => {
        if (!user) return;
        try {
            const cartData = await getUserCart(user.userID);
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
        try {
            await updateCartItem(cartItemId, quantity);
            await loadCart(); // Reload cart after update
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        try {
            await removeFromCart(cartItemId);
            await loadCart(); // Reload cart after removal
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-info shadow-sm">Please log in to view your cart.</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <img
                        src={CartImg}
                        alt="Empty Cart"
                        className="mx-auto mb-4"
                        style={{ maxWidth: '250px', height: 'auto' }}
                    />
                    <h4 className="mb-3 fw-bold" style={{ color: '#1e2a3a' }}>Your cart is empty</h4>
                    <p className="text-secondary mb-4">Browse products and add items to your cart.</p>
                    <div className="text-center">
                        <Link to="/" className="btn btn-lg px-4 py-2" style={{
                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="bi bi-shop me-2"></i>
                            Shop Now
                        </Link>
                    </div>
                </div>
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
                <i className="bi bi-cart3 me-2"></i>
                Shopping Cart
            </h2>
            <div className="row">
                <div className="col-lg-8 mb-4">
                    {cart.cartItems.map((item: CartItem) => (
                        <div key={item.cartItemID} className="card mb-3 shadow-sm rounded-3 overflow-hidden" 
                             style={{ 
                                 border: '1px solid rgba(45, 67, 86, 0.1)',
                                 borderLeft: '4px solid #2d4356'
                             }}>
                            <div className="card-body p-3">
                                <div className="row align-items-center">
                                    <div className="col-md-2 col-3 text-center">
                                        {item.product.imageURL && (
                                            <img
                                                src={getImageUrl(item.product.imageURL)}
                                                alt={item.product.name}
                                                className="img-fluid rounded shadow-sm"
                                                style={{ 
                                                    width: '80px', 
                                                    height: '80px', 
                                                    objectFit: 'cover',
                                                    border: '1px solid #f0f0f0'
                                                }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://via.placeholder.com/300';
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-5 col-9">
                                        <h5 className="card-title fw-bold mb-1" style={{ color: '#2d4356' }}>
                                            {item.product.name}
                                        </h5>
                                        <p className="text-primary fw-semibold mb-0">
                                            &#8377; {item.product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="col-md-3 col-6 mt-3 mt-md-0">
                                        <div className="input-group shadow-sm rounded overflow-hidden">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cartItemID, Math.max(1, item.quantity - 1))}
                                                className="btn btn-sm"
                                                style={{
                                                    background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <span className="input-group-text bg-white border-0 text-center" style={{minWidth: '40px'}}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cartItemID, item.quantity + 1)}
                                                className="btn btn-sm"
                                                style={{
                                                    background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-2 col-6 text-end mt-3 mt-md-0">
                                        <button
                                            onClick={() => handleRemoveItem(item.cartItemID)}
                                            className="btn btn-outline-danger btn-sm"
                                            style={{ borderRadius: '50px', transition: 'all 0.3s ease' }}
                                        >
                                            <i className="bi bi-trash me-1"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-lg-4">
                    <div className="card sticky-top" 
                         style={{ 
                             top: '20px', 
                             borderRadius: '8px', 
                             boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                             border: '1px solid rgba(45, 67, 86, 0.1)',
                             borderBottom: '4px solid #2d4356',
                             overflow: 'hidden'
                         }}>
                        <div className="card-header bg-white py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <h5 className="mb-0 fw-bold" style={{ color: '#1e2a3a' }}>Order Summary</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Subtotal</span>
                                <span className="fw-semibold">&#8377; {total.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Shipping</span>
                                <span className="fw-semibold">Free</span>
                            </div>
                            <hr className="my-3" style={{ borderColor: 'rgba(0,0,0,0.1)', borderWidth: '2px' }} />
                            <div className="d-flex justify-content-between align-items-center mb-4 p-2" 
                                 style={{ 
                                     background: 'rgba(45, 67, 86, 0.05)', 
                                     borderRadius: '6px',
                                     border: '1px solid rgba(45, 67, 86, 0.1)' 
                                 }}>
                                <span className="h5 mb-0 fw-bold" style={{ color: '#2d4356' }}>Total:</span>
                                <span className="h5 mb-0 fw-bold" style={{ color: '#2d4356' }}>&#8377; {total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="btn btn-lg w-100"
                                style={{
                                    background: 'linear-gradient(to right, #2d4356, #435B66)',
                                    color: 'white',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-credit-card me-2"></i>
                                Proceed to Checkout
                            </button>
                            <div className="mt-3 text-center pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <Link to="/" className="text-secondary">
                                    <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;