import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductGrid from '../components/ProductGrid';
import About from '../components/About';
import Footer from '../components/Footer';
import { countries } from '../data/mock';

const Home = () => {
  const [cart, setCart] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]); // Default: Turkey

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cart={cart} 
        selectedCountry={selectedCountry} 
        onCountryChange={setSelectedCountry}
      />
      <Hero />
      <FeaturedProducts selectedCountry={selectedCountry} />
      <ProductGrid selectedCountry={selectedCountry} />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
