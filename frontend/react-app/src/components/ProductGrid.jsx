import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; 

const ProductGrid = ({ category, searchQuery, setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?`;
        if (category !== 'All') url += `category=${category}&`;
        if (searchQuery) url += `search=${searchQuery}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, searchQuery]);

  if (loading) return <div className="loader">Baking your results...</div>;

  return (
    <div className="product-container">
      {products.length === 0 ? (
        <p className="no-results">Oops! We couldn't find any treats matching that.</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            setCartCount={setCartCount}
          />
        ))
      )}
    </div>
  );
};

export default ProductGrid;