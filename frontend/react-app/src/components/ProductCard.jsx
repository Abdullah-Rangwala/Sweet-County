import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <div className="card-info">
        <span className="rating">⭐ {product.rating}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="card-footer">
          <h4>₹{product.price}</h4>
          <button onClick={() => addToCart(product)}>+ Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;