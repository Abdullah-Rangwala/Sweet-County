import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: '#a36b4f' }}>Sweet County 🍰</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">
          <button className="cart-btn">🛒 Cart ({cartCount})</button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;