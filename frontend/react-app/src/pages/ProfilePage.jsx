import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/orders/my`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError('Could not load your orders. Is the backend running?');
            }
            setLoading(false);
        };

        if (user?.token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#e8a317';
            case 'Confirmed': return '#2196F3';
            case 'Out for Delivery': return '#ff9800';
            case 'Delivered': return '#4CAF50';
            case 'Cancelled': return '#cc4444';
            default: return '#7a635c';
        }
    };

    const getPaymentColor = (ps) => {
        switch (ps) {
            case 'Paid': return '#4CAF50';
            case 'Refunded': return '#ff9800';
            case 'Pending': return '#e8a317';
            default: return '#7a635c';
        }
    };

    return (
        <div className="discovery-section" style={{ maxWidth: '900px', minHeight: '60vh' }}>
            {/* User Info Card */}
            <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h2 style={{ marginBottom: '5px', color: '#3d2b1f' }}>👋 Hello, {user?.name || 'Guest'}!</h2>
                    <p style={{ color: '#7a635c', fontSize: '1rem' }}>{user?.email}</p>
                    {user?.isAdmin && (
                        <span style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '4px 12px',
                            background: '#a36b4f',
                            color: '#fff',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>Admin</span>
                    )}
                </div>
                <button
                    className="cart-btn"
                    style={{ background: '#4b3832' }}
                    onClick={() => { logout(); window.location.href = '/'; }}
                >
                    Logout
                </button>
            </div>

            {/* Order History */}
            <h2 style={{ marginBottom: '20px', color: '#3d2b1f' }}>📦 Order History</h2>

            {loading && (
                <p style={{ textAlign: 'center', color: '#7a635c', fontSize: '1.1rem', marginTop: '30px' }}>
                    Loading your orders...
                </p>
            )}

            {error && (
                <p style={{ textAlign: 'center', color: '#cc4444', fontSize: '1rem', marginTop: '20px' }}>
                    {error}
                </p>
            )}

            {!loading && !error && orders.length === 0 && (
                <div style={{
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '1.1rem', color: '#7a635c', marginBottom: '20px' }}>
                        You haven't placed any orders yet.
                    </p>
                    <Link to="/store" className="cta-btn" style={{ textDecoration: 'none' }}>
                        Start Shopping 🍰
                    </Link>
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order._id} style={{
                            background: '#fff',
                            padding: '25px',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
                            transition: '0.3s'
                        }}>
                            {/* Order Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#7a635c' }}>
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '3px' }}>
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                    <span style={{
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        background: getStatusColor(order.status) + '20',
                                        color: getStatusColor(order.status)
                                    }}>
                                        {order.status}
                                    </span>
                                    {order.paymentStatus && (
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '15px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: getPaymentColor(order.paymentStatus) + '15',
                                            color: getPaymentColor(order.paymentStatus)
                                        }}>
                                            💳 {order.paymentMethod} — {order.paymentStatus}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: '15px' }}>
                                {order.items.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '8px 0',
                                        fontSize: '0.95rem'
                                    }}>
                                        <span style={{ color: '#4b3832' }}>
                                            {item.name} <span style={{ color: '#999' }}>×{item.quantity}</span>
                                        </span>
                                        <span style={{ color: '#a36b4f', fontWeight: 'bold' }}>
                                            ₹{item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total + Refund Notice */}
                            <div style={{
                                borderTop: '1px solid #f0ebe4',
                                marginTop: '10px',
                                paddingTop: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                {order.paymentStatus === 'Refunded' && (
                                    <p style={{
                                        color: '#ff9800',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        background: '#fff8e1',
                                        padding: '8px 14px',
                                        borderRadius: '8px'
                                    }}>
                                        💸 ₹{order.totalAmount} refunded to your account
                                    </p>
                                )}
                                <h3 style={{ color: '#3d2b1f', marginLeft: 'auto' }}>Total: ₹{order.totalAmount}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
