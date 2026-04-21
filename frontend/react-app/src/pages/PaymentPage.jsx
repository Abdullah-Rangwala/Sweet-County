import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const PaymentPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardName, setCardName] = useState('');
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [finalAmount, setFinalAmount] = useState(0);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentMethods = [
        { id: 'Credit Card', icon: '💳', label: 'Credit Card' },
        { id: 'Debit Card', icon: '🏧', label: 'Debit Card' },
        { id: 'UPI', icon: '📱', label: 'UPI' },
        { id: 'Net Banking', icon: '🏦', label: 'Net Banking' },
        { id: 'Cash on Delivery', icon: '💵', label: 'Cash on Delivery' },
    ];

    const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank'];

    const formatCardNumber = (value) => {
        const v = value.replace(/\D/g, '').slice(0, 16);
        return v.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
        return v;
    };

    const isFormValid = () => {
        if (!paymentMethod) return false;
        if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
            return cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCVV.length >= 3 && cardName.trim().length > 0;
        }
        if (paymentMethod === 'UPI') return upiId.includes('@');
        if (paymentMethod === 'Net Banking') return selectedBank !== '';
        if (paymentMethod === 'Cash on Delivery') return true;
        return false;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        setProcessing(true);
        setError('');

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    items: cart,
                    totalAmount,
                    paymentMethod
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Payment failed');
                setProcessing(false);
                return;
            }

            setOrderId(data.orderId);
            setFinalAmount(totalAmount);
            setSuccess(true);
            clearCart();
        } catch (err) {
            setError('Could not connect to the server.');
        }
        setProcessing(false);
    };

    if (cart.length === 0 && !success) {
        navigate('/cart');
        return null;
    }

    // Success screen
    if (success) {
        return (
            <div className="discovery-section" style={{ maxWidth: '600px', minHeight: '60vh', textAlign: 'center', paddingTop: '60px' }}>
                <div style={{
                    background: '#fff', padding: '50px 40px', borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#3d2b1f', marginBottom: '10px' }}>
                        {paymentMethod === 'Cash on Delivery' ? 'Order Placed!' : 'Payment Successful!'}
                    </h2>
                    <p style={{ color: '#7a635c', fontSize: '1.1rem', marginBottom: '8px' }}>
                        {paymentMethod === 'Cash on Delivery'
                            ? 'Your order is placed. Pay ₹' + finalAmount + ' on delivery.'
                            : '₹' + finalAmount + ' paid via ' + paymentMethod}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '30px' }}>
                        Order ID: #{orderId.slice(-8).toUpperCase()}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="cta-btn" onClick={() => navigate('/profile')}>View Orders</button>
                        <button className="cta-btn" style={{ background: '#4b3832', color: '#fff' }} onClick={() => navigate('/store')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="discovery-section" style={{ maxWidth: '900px', minHeight: '60vh' }}>
            <h2 style={{ marginBottom: '25px', color: '#3d2b1f' }}>💳 Payment</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px', alignItems: 'start' }}>
                {/* Left: Payment Methods */}
                <div>
                    {/* Payment Method Selection */}
                    <div style={{
                        background: '#fff', padding: '25px', borderRadius: '15px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.06)', marginBottom: '20px'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#3d2b1f' }}>Select Payment Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {paymentMethods.map(method => (
                                <label
                                    key={method.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                                        border: paymentMethod === method.id ? '2px solid #a36b4f' : '2px solid #f0ebe4',
                                        background: paymentMethod === method.id ? '#fdf6f0' : '#fff',
                                        transition: '0.2s'
                                    }}
                                >
                                    <input
                                        type="radio" name="payment" value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id)}
                                        style={{ accentColor: '#a36b4f', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '1.3rem' }}>{method.icon}</span>
                                    <span style={{ fontWeight: '600', color: '#3d2b1f' }}>{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details Form */}
                    {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                        <div style={{
                            background: '#fff', padding: '25px', borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#3d2b1f' }}>
                                {paymentMethod} Details
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="text" placeholder="Cardholder Name"
                                    value={cardName} onChange={e => setCardName(e.target.value)}
                                    className="search-input" style={{ marginBottom: 0 }}
                                />
                                <input
                                    type="text" placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                    maxLength={19}
                                    className="search-input" style={{ marginBottom: 0, letterSpacing: '2px' }}
                                />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="text" placeholder="MM/YY"
                                        value={cardExpiry}
                                        onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                                        maxLength={5}
                                        className="search-input" style={{ marginBottom: 0, flex: 1 }}
                                    />
                                    <input
                                        type="password" placeholder="CVV"
                                        value={cardCVV}
                                        onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        maxLength={4}
                                        className="search-input" style={{ marginBottom: 0, flex: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'UPI' && (
                        <div style={{
                            background: '#fff', padding: '25px', borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#3d2b1f' }}>UPI Payment</h3>
                            <input
                                type="text" placeholder="yourname@upi"
                                value={upiId} onChange={e => setUpiId(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#999' }}>
                                Supports: GPay, PhonePe, Paytm, BHIM UPI
                            </p>
                        </div>
                    )}

                    {paymentMethod === 'Net Banking' && (
                        <div style={{
                            background: '#fff', padding: '25px', borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#3d2b1f' }}>Select Your Bank</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {banks.map(bank => (
                                    <label key={bank} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                                        border: selectedBank === bank ? '2px solid #a36b4f' : '1px solid #eee',
                                        background: selectedBank === bank ? '#fdf6f0' : '#fff',
                                        transition: '0.2s'
                                    }}>
                                        <input
                                            type="radio" name="bank" value={bank}
                                            checked={selectedBank === bank}
                                            onChange={() => setSelectedBank(bank)}
                                            style={{ accentColor: '#a36b4f' }}
                                        />
                                        <span style={{ color: '#3d2b1f' }}>{bank}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'Cash on Delivery' && (
                        <div style={{
                            background: '#fff', padding: '25px', borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ marginBottom: '10px', color: '#3d2b1f' }}>Cash on Delivery</h3>
                            <p style={{ color: '#7a635c', lineHeight: '1.6' }}>
                                Pay <strong>₹{totalAmount}</strong> in cash when your order arrives.
                                Your order will remain in <strong>"Pending"</strong> status until delivered.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Order Summary */}
                <div style={{
                    background: '#fff', padding: '25px', borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.06)', position: 'sticky', top: '100px'
                }}>
                    <h3 style={{ marginBottom: '15px', color: '#3d2b1f', borderBottom: '1px solid #f0ebe4', paddingBottom: '10px' }}>
                        Order Summary
                    </h3>
                    {cart.map(item => (
                        <div key={item._id} style={{
                            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                            fontSize: '0.9rem', borderBottom: '1px solid #faf7f2'
                        }}>
                            <span style={{ color: '#4b3832' }}>
                                {item.name} <span style={{ color: '#999' }}>×{item.quantity}</span>
                            </span>
                            <span style={{ color: '#a36b4f', fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #f0ebe4' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                            <span style={{ color: '#7a635c' }}>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                            <span style={{ color: '#7a635c' }}>Delivery</span>
                            <span style={{ color: '#4CAF50' }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0ebe4' }}>
                            <h3 style={{ color: '#3d2b1f' }}>Total</h3>
                            <h3 style={{ color: '#a36b4f' }}>₹{totalAmount}</h3>
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: '#cc4444', fontSize: '0.9rem', marginTop: '10px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        className="cta-btn"
                        onClick={handlePayment}
                        disabled={!isFormValid() || processing}
                        style={{
                            width: '100%', marginTop: '20px',
                            background: isFormValid() ? (paymentMethod === 'Cash on Delivery' ? '#4b3832' : '#a36b4f') : '#ccc',
                            color: '#fff',
                            cursor: isFormValid() && !processing ? 'pointer' : 'not-allowed',
                            opacity: processing ? 0.7 : 1
                        }}
                    >
                        {processing
                            ? '⏳ Processing...'
                            : paymentMethod === 'Cash on Delivery'
                                ? `Place Order (₹${totalAmount})`
                                : `Pay ₹${totalAmount}`
                        }
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>
                        🔒 Your payment info is secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
