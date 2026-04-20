import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Freshly Baked Happiness</h1>
        <p>Crafting artisanal cakes, pastries, and donuts with 100% premium ingredients. Baked fresh daily in our local kitchen, just for you.</p>
        <button className="cta-btn" onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}>
          Explore the Menu
        </button>
      </div>
    </section>
  );
};

export default Hero;
