import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const productData = await getProductById(parseInt(id));
                    setProduct(productData);
                }
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/300';
        }
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!product) return;

        setAddingToCart(true);
        try {
            await addToCart(user!.userID, product.productID, 1);
            window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (err) {
            setError('Failed to add item to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!product) return;

        setBuyingNow(true);
        try {
            await addToCart(user!.userID, product.productID, 1);
            window.dispatchEvent(new CustomEvent('cart-updated'));
            navigate('/checkout');
        } catch (err) {
            setError('Failed to process buy now request');
        } finally {
            setBuyingNow(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return <div className="alert alert-danger m-3" role="alert">{error || 'Product not found'}</div>;
    }

    return (
        <div className="container py-5">
            <div className="card shadow border-0 rounded-3 overflow-hidden" style={{ borderBottom: '4px solid #2d4356' }}>
                <div className="row g-0">
                    {/* Product Image Section */}
                    <div className="col-md-6" style={{ borderRight: '1px solid rgba(0,0,0,0.08)' }}>
                        <div className="d-flex justify-content-center align-items-center p-4" 
                             style={{ 
                                minHeight: '500px', 
                                background: 'linear-gradient(to bottom right, #f9f9f9, #f1f1f1)'
                             }}>
                            <img
                                src={getImageUrl(product.imageURL || '')}
                                alt={product.name}
                                className="rounded img-fluid shadow"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '500px',
                                    objectFit: 'contain',
                                    transition: 'transform 0.3s ease',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    padding: '10px',
                                    backgroundColor: 'white'
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/500';
                                }}
                            />
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="col-md-6">
                        <div className="p-4 d-flex flex-column h-100" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="mb-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                <h1 className="h2 mb-3 fw-bold">{product.name}</h1>
                                <h2 className="h3 mb-4" style={{ 
                                    color: '#2d4356', 
                                    fontWeight: '600',
                                    fontSize: '1.8rem'
                                }}>&#8377; {product.price.toFixed(2)}</h2>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <span className={`badge ${product.stockQuantity > 0 ? 'text-bg-success' : 'text-bg-danger'} p-2 fs-6`}
                                          style={{ 
                                              opacity: '0.9',
                                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                          }}>
                                        <i className={`bi ${product.stockQuantity > 0 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {product.stockQuantity > 0 && (
                                        <span className="ms-3 text-secondary">
                                            {product.stockQuantity} units available
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="mb-4 p-3 bg-light rounded" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                <h3 className="h5 mb-3 fw-bold" style={{ color: '#1e2a3a' }}>Product Description</h3>
                                <p className="text-secondary">{product.description}</p>
                            </div>

                            {/* Product Highlights */}
                            <div className="mb-4 p-3 rounded" style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8f9fa' }}>
                                <h3 className="h5 mb-3 fw-bold" style={{ color: '#1e2a3a' }}>Product Highlights</h3>
                                <ul className="list-group list-group-flush border-0">
                                    <li className="list-group-item bg-transparent border-0 ps-0 py-2">
                                        <i className="bi bi-shield-check text-success me-2"></i>
                                        <span className="text-secondary">Quality Assured Product</span>
                                    </li>
                                    <li className="list-group-item bg-transparent border-0 ps-0 py-2">
                                        <i className="bi bi-truck text-primary me-2"></i>
                                        <span className="text-secondary">Fast Delivery</span>
                                    </li>
                                    <li className="list-group-item bg-transparent border-0 ps-0 py-2">
                                        <i className="bi bi-arrow-counterclockwise text-info me-2"></i>
                                        <span className="text-secondary">Easy Returns</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-lg"
                                        onClick={handleBuyNow}
                                        disabled={addingToCart || buyingNow || product.stockQuantity === 0}
                                        style={{
                                            background: 'linear-gradient(to right, #2d4356, #435B66)',
                                            color: 'white',
                                            border: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {buyingNow ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-lightning-fill me-2"></i>
                                                Buy Now
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-lg"
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || buyingNow || product.stockQuantity === 0}
                                        style={{
                                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                            color: 'white',
                                            border: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding to Cart...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-cart-plus me-2"></i>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(-1)}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            borderColor: '#2d4356',
                                            color: '#2d4356'
                                        }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;