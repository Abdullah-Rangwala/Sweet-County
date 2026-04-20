import React from 'react';

const SearchBar = ({ setSearchQuery, category, setCategory }) => {
  const categories = ['All', 'Cakes', 'Pastries', 'Donuts', 'Brownies'];

  return (
    <div className="search-container" id="menu">
      <h2>What are you craving today?</h2>
     
      <input
        type="text"
        placeholder="Search for 'Chocolate', 'Rasmalai'..."
        className="search-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;