import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <>
      <Hero />
      <section className="discovery-section">
        <SearchBar 
            setSearchQuery={setSearchQuery} 
            category={category} 
            setCategory={setCategory} 
        />
        <ProductGrid 
            category={category} 
            searchQuery={searchQuery} 
        />
      </section>
    </>
  );
};

export default Home;
