import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, getUserOrders } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setError('Please log in to view your orders');
                setLoading(false);
                return;
            }

            try {
                const orderData = await getUserOrders(user.userID);
                setOrders(orderData);
            } catch (err) {
                setError('Failed to load orders');
                console.error('Error loading orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-info shadow-sm border-0 rounded-3" style={{ 
                    borderLeft: '4px solid #2d4356',
                    backgroundColor: 'rgba(45, 67, 86, 0.05)'
                }}>
                    <i className="bi bi-info-circle me-2"></i>
                    Please log in to view your orders.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center">
                <div className="spinner-border" style={{ color: '#2d4356' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger shadow-sm border-0 rounded-3" style={{ 
                    borderLeft: '4px solid #dc3545'
                }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container py-5">
                <div className="card shadow-sm border-0 p-4 text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="py-4">
                        <i className="bi bi-bag text-secondary" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h4 className="mb-3 fw-bold" style={{ color: '#1e2a3a' }}>No Orders Yet</h4>
                    <p className="text-secondary mb-4">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                    <div className="text-center">
                        <Link to="/" className="btn btn-lg px-4 py-2" style={{
                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="bi bi-shop me-2"></i>
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold" style={{ 
                color: '#1e2a3a',
                borderBottom: '2px solid #2d4356',
                paddingBottom: '10px'
            }}>
                <i className="bi bi-clock-history me-2"></i>
                My Orders
            </h2>
            
            <div className="row">
                {orders.map((order) => (
                    <div key={order.orderID} className="col-12 mb-4">
                        <div className="card shadow-sm border-0 rounded-3 overflow-hidden" style={{
                            borderLeft: '4px solid #2d4356'
                        }}>
                            <div className="card-body p-4">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <h5 className="mb-0 fw-bold" style={{ color: '#2d4356' }}>
                                            <i className="bi bi-box me-2"></i>
                                            Order #{order.orderID}
                                        </h5>
                                        <p className="text-secondary mt-2 mb-0 small">
                                            <i className="bi bi-calendar3 me-2"></i>
                                            {new Date(order.orderDate).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                            <span className="mx-2">•</span>
                                            <i className="bi bi-clock me-1"></i>
                                            {new Date(order.orderDate).toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>
                                    {/*
                                    <div className="col-md-3 text-md-center my-3 my-md-0">
                                        <span className={`badge ${
                                            order.orderStatus === 'Completed' ? 'text-bg-success' :
                                            order.orderStatus === 'Pending' ? 'text-bg-warning' :
                                            'text-bg-primary'
                                        } p-2`} style={{ 
                                            opacity: '0.9',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            <i className={`bi ${
                                                order.orderStatus === 'Completed' ? 'bi-check-circle' :
                                                order.orderStatus === 'Pending' ? 'bi-hourglass-split' :
                                                'bi-box-seam'
                                            } me-1`}></i>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    */}
                                    <div className="col-md-4 text-md-center my-3 my-md-0">
                                        <span className="text-secondary small d-block d-md-inline mb-1 mb-md-0">Total Amount:</span>
                                        <span className="h5 mb-0 fw-bold ms-md-2" style={{ color: '#2d4356' }}>
                                            &#8377; {order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                        <Link 
                                            to={`/orders/${order.orderID}`}
                                            className="btn"
                                            style={{
                                                background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                                color: 'white',
                                                border: 'none',
                                                transition: 'all 0.1s ease'
                                            }}
                                        >
                                            <i className="bi bi-eye me-2"></i>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;