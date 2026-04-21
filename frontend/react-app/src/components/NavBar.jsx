import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Hide navbar on login page
  if (location.pathname === '/') return null;

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/store" style={{ textDecoration: 'none', color: '#a36b4f' }}>Sweet County 🍰</Link>
      </div>
      <nav>
        <Link to="/store">Store</Link>
        <Link to="/profile">Profile</Link>
        {user && user.isAdmin && <Link to="/admin">Admin</Link>}
        <Link to="/cart">
          <button className="cart-btn">🛒 Cart ({cartCount})</button>
        </Link>
        {user && (
          <button className="cart-btn" style={{ marginLeft: '10px', background: '#4b3832' }} onClick={() => { logout(); window.location.href = '/'; }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;