import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [status, setStatus] = useState('');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
       
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, totalAmount })
            });
           
            if (response.ok) {
                setStatus('Order placed successfully! 🍰');
                clearCart();
            } else {
                setStatus('Checkout failed. Please try again.');
            }
        } catch (error) {
            setStatus('Error connecting to the server. Is the backend running?');
        }
    };

    return (
        <div className="discovery-section" style={{ maxWidth: '800px', minHeight: '60vh' }}>
            <h2>Your Cart</h2>
           
            {status && <p style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>{status}</p>}
           
            {cart.length === 0 && !status ? (
                <div>
                    <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Your cart is looking a bit empty.</p>
                    <Link to="/" className="cta-btn" style={{ textDecoration: 'none' }}>Go Back to Menu</Link>
                </div>
            ) : (
                cart.length > 0 && (
                    <div className="cart-container" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.06)' }}>
                        {cart.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                                    <p style={{ color: '#7a635c' }}>₹{item.price} x {item.quantity}</p>
                                </div>
                                <h4 style={{ color: '#a36b4f', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                                    ₹{item.price * item.quantity}
                                </h4>
                            </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '30px' }}>
                            <h2 style={{ marginBottom: '20px' }}>Total: ₹{totalAmount}</h2>
                            <button className="cta-btn" onClick={handleCheckout}>Place Order Securely</button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default CartPage;