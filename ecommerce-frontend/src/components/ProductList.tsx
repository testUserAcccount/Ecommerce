import React, { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Category } from 'types/category';
import { getCategories } from '../services/categoryService';
import { toast } from 'react-toastify';
import slide1 from '../assets/images/Ecommerce-banner1.png';
import slide3 from '../assets/images/Ecommerce-banner3.png';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const { user, isAuthenticated } = useAuth();
    // filter functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
    const [buyingNow, setBuyingNow] = useState<number | null>(null);
    const navigate = useNavigate();

    const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
        // Convert empty string to empty string, otherwise ensure non-negative number
        const processedValue = value === '' ? '' : Math.max(0, Number(value));
        setPriceRange(prev => ({ ...prev, [type]: processedValue }));
    };
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setProducts(productsData);
                setFilteredProducts(productsData);
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, priceRange, products]);

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by price range
        if (priceRange.min) {
            filtered = filtered.filter(product => product.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
            filtered = filtered.filter(product => product.price <= Number(priceRange.max));
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryID === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/300';
        }
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
    };

    const handleAddToCart = async (productId: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAddingToCart(productId);
        try {
            await addToCart(user!.userID, productId, 1);
            // Force refresh cart data by dispatching a custom event
            window.dispatchEvent(new CustomEvent('cart-updated'));
            
            // Get the product name for the toast message
            const product = products.find(p => p.productID === productId);
            toast.success(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="bi bi-cart-check me-2"></i>
                    <div>
                        <div className="fw-bold">{product?.name}</div>
                        <div className="small">Added to cart successfully</div>
                    </div>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                        color: 'white'
                    }
                }
            );
        } catch (err) {
            setError('Failed to add item to cart');
            console.error('Error adding to cart:', err);
            toast.error(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="bi bi-exclamation-circle me-2"></i>
                    <div>Failed to add item to cart</div>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 3000,
                    style: {
                        background: '#dc3545',
                        color: 'white'
                    }
                }
            );
        } finally {
            setAddingToCart(null);
        }
    };

    const handleBuyNow = async (productId: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setBuyingNow(productId);
        try {
            await addToCart(user!.userID, productId, 1);
            window.dispatchEvent(new CustomEvent('cart-updated'));
            navigate('/checkout');
        } catch (err) {
            setError('Failed to process buy now request');
            console.error('Error processing buy now:', err);
        } finally {
            setBuyingNow(null);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger m-3" role="alert">{error}</div>;
    }

    return (
        <div className="product-list-container">
            {/* Carousel Section */}
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ maxHeight: '450px' }}>
                        <img src={slide1} className="d-block w-100" alt="First slide" style={{ objectFit: 'cover', height: '450px' }} />
                    </div>
                    <div className="carousel-item" style={{ maxHeight: '450px' }}>
                        <img src={slide3} className="d-block w-100" alt="Third slide" style={{ objectFit: 'cover', height: '450px' }} />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="container mt-5">
                <div className="section-header mb-5">
                    <h2 className="text-center mb-4" style={{ 
                        color: '#1e2a3a',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        position: 'relative',
                        display: 'inline-block',
                        padding: '0 15px'
                    }}>
                        Our Products
                        <div style={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)'
                        }}></div>
                    </h2>
                </div>

                {/* Filter Section */}
                <div className="row mb-5 filter-section p-4" style={{
                    background: 'rgba(45, 67, 86, 0.05)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    <div className="col-md-3 mb-3 mb-md-0">
                        <div className="input-group">
                            <span className="input-group-text" style={{ background: '#1e2a3a', border: 'none' }}>
                                <i className="bi bi-search text-white"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderLeft: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 mb-3 mb-md-0">
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                            style={{
                                borderColor: '#dee2e6',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.categoryID} value={category.categoryID}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className="row g-2">
                            <div className="col">
                                <div className="input-group">
                                    <span className="input-group-text" style={{ background: '#1e2a3a', border: 'none', color: 'white' }}>₹</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Min Price"
                                        value={priceRange.min}
                                        min="0"
                                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <span className="input-group-text" style={{ background: '#1e2a3a', border: 'none', color: 'white' }}>₹</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Max Price"
                                        value={priceRange.max}
                                        min="0"
                                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <button
                            className="btn w-100"
                            onClick={() => {
                                setSearchTerm('');
                                setPriceRange({ min: '', max: '' });
                                setSelectedCategory('');
                            }}
                            style={{
                                background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                color: 'white',
                                border: 'none',
                                transition: 'opacity 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredProducts.map((product) => (
                        <div key={product.productID} className="col">
                            <div className="card h-100" style={{
                                border: 'none',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}>
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={getImageUrl(product.imageURL || '')}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/300';
                                        }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                                    <h5 className="card-title mb-2" style={{ 
                                        color: '#1e2a3a',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}>{product.name}</h5>
                                    <p className="card-text text-truncate mb-3" style={{ color: '#6c757d' }}>{product.description}</p>
                                    <p className="card-text mb-3">
                                        <span className="h5" style={{ color: '#2d4356' }}>&#8377; {product.price.toFixed(2)}</span>
                                    </p>
                                    <div className="mt-auto">
                                        <div className="d-flex flex-column gap-2">
                                            <button
                                                className="btn btn-outline-dark w-100"
                                                onClick={() => navigate(`/product/${product.productID}`)}
                                                style={{
                                                    borderColor: '#1e2a3a',
                                                    color: '#1e2a3a',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = '#1e2a3a';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#1e2a3a';
                                                }}
                                            >
                                                <i className="bi bi-eye me-2"></i>
                                                View Details
                                            </button>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn flex-grow-1"
                                                    onClick={() => handleAddToCart(product.productID)}
                                                    disabled={addingToCart === product.productID || buyingNow === product.productID || product.stockQuantity === 0}
                                                    style={{
                                                        background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                                        color: 'white',
                                                        border: 'none',
                                                        transition: 'opacity 0.3s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                                >
                                                    {addingToCart === product.productID ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-cart-plus me-2"></i>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="btn flex-grow-1"
                                                    onClick={() => handleBuyNow(product.productID)}
                                                    disabled={addingToCart === product.productID || buyingNow === product.productID || product.stockQuantity === 0}
                                                    style={{
                                                        background: '#2d4356',
                                                        color: 'white',
                                                        border: 'none',
                                                        transition: 'opacity 0.3s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                                >
                                                    {buyingNow === product.productID ? (
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-search" style={{ fontSize: '3rem', color: '#1e2a3a' }}></i>
                            <h3 className="mt-3" style={{ color: '#1e2a3a' }}>No products found</h3>
                            <p className="text-muted">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;