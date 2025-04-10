import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, getOrderDetails } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

// Base64 encoded default product image - a simple gray placeholder with a product icon
const DEFAULT_PRODUCT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNMTUwIDEyMEMxNjYuNTY5IDEyMCAxODAgMTA2LjU2OSAxODAgOTBDMTgwIDczLjQzMTUgMTY2LjU2OSA2MCAxNTAgNjBDMTMzLjQzMSA2MCAxMjAgNzMuNDMxNSAxMjAgOTBDMTIwIDEwNi41NjkgMTMzLjQzMSAxMjAgMTUwIDEyMFoiIGZpbGw9IiM5OTkiLz48cGF0aCBkPSJNMjEwIDI0MEgxODBDMTgwIDIwNi44NjMgMTUzLjEzNyAxODAgMTIwIDE4MEg5MEM1Ni44NjI5IDE4MCAzMCAyMDYuODYzIDMwIDI0MEgyMTBaIiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

const OrderDetails: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { orderId } = useParams<{ orderId: string }>();
    const { user } = useAuth();

    const getImageUrl = (imageUrl: string | undefined) => {
        if (!imageUrl) {
            return DEFAULT_PRODUCT_IMAGE;
        }
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'cancelled': return 'danger';
            default: return 'primary';
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError('Invalid order ID');
                setLoading(false);
                return;
            }

            try {
                const orderData = await getOrderDetails(parseInt(orderId));
                if (!orderData) {
                    setError('Order not found');
                    return;
                }
                setOrder(orderData);
            } catch (err) {
                setError('Failed to load order details');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mt-4 alert alert-danger">{error}</div>;
    }

    if (!order) {
        return <div className="container mt-4">Order not found.</div>;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Order Header */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="mb-1">Order #{order.orderID}</h2>
                                    <p className="text-muted mb-0">
                                        Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-end">
                                    {/* 
                                    <span className={`badge bg-${getStatusColor(order.orderStatus)} p-2 px-3 rounded-pill fs-6`}>
                                        {order.orderStatus}
                                    </span>
                                    */}
                                    <h4 className="mt-2 mb-0">&#8377; {order.totalAmount.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Customer Information */}
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body p-4">
                                    <h4 className="card-title mb-4">
                                        <i className="bi bi-person-circle me-2"></i>
                                        Customer Details
                                    </h4>
                                    <div className="ps-2">
                                        <p className="mb-2"><strong>Name:</strong> {order.user?.firstName} {order.user?.lastName}</p>
                                        <p className="mb-2"><strong>Email:</strong> {order.user?.email}</p>
                                        {order.user?.phoneNumber && (
                                            <p className="mb-2"><strong>Phone:</strong> {order.user.phoneNumber}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body p-4">
                                    <h4 className="card-title mb-4">
                                        <i className="bi bi-truck me-2"></i>
                                        Shipping Details
                                    </h4>
                                    <div className="ps-2">
                                        {order.user?.address ? (
                                            <p className="mb-0">{order.user.address}</p>
                                        ) : (
                                            <p className="text-muted mb-0">No shipping address provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h4 className="card-title mb-4">
                                <i className="bi bi-box-seam me-2"></i>
                                Order Items ({order.orderItems?.length || 0})
                            </h4>
                            {!order.orderItems || order.orderItems.length === 0 ? (
                                <div className="alert alert-info">No items in this order.</div>
                            ) : (
                                <div className="order-items-container">
                                    {order.orderItems.map((item) => (
                                        <div key={item.orderItemID} className="card mb-3 border shadow-sm">
                                            <div className="card-body p-3">
                                                <div className="row align-items-center g-3">
                                                    <div className="col-lg-6 col-md-4">
                                                        <h5 className="mb-1">{item.product?.name || 'Product Not Found'}</h5>
                                                        <small className="text-muted d-block">
                                                            Product ID: {item.product?.productID || 'N/A'}
                                                        </small>
                                                    </div>
                                                    <div className="col-lg-2 col-md-3 text-center">
                                                        <span className="badge bg-secondary p-2">
                                                            Quantity: {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="col-lg-2 col-md-2 text-center">
                                                        <div className="text-muted">Unit Price</div>
                                                        <strong>&#8377; {item.price.toFixed(2)}</strong>
                                                    </div>
                                                    <div className="col-lg-2 col-md-3 text-end">
                                                        <div className="text-muted">Subtotal</div>
                                                        <strong className="text-primary">
                                                            &#8377; {(item.quantity * item.price).toFixed(2)}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="card-footer bg-light mt-3 p-3 text-end">
                                        <div className="row justify-content-end">
                                            <div className="col-lg-4 col-md-6">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Subtotal:</span>
                                                    <strong>&#8377; {order.totalAmount.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Shipping:</span>
                                                    <strong>Free</strong>
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between">
                                                    <span className="h5">Total:</span>
                                                    <strong className="h5 text-primary">
                                                        &#8377; {order.totalAmount.toFixed(2)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-4">
                        <Link to="/" className="btn btn-dark me-3">
                            <i className="bi bi-shop me-2"></i>
                            Continue Shopping
                        </Link>
                        <Link to="/orders" className="btn btn-outline-dark">
                            <i className="bi bi-clock-history me-2"></i>
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;