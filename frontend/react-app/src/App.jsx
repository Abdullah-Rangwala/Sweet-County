import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import CartPage from './components/CartPage';
import { CartProvider } from './context/CartContext';
import './index.css';

function Home() {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
 
  return (
    <>
      <Hero />
      <section className="discovery-section">
        <SearchBar setSearchQuery={setSearchQuery} category={category} setCategory={setCategory} />
        <ProductGrid category={category} searchQuery={searchQuery} />
      </section>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;