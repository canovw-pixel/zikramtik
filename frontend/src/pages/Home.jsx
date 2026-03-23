import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductGrid from '../components/ProductGrid';
import About from '../components/About';
import Footer from '../components/Footer';
import { countries } from '../data/mock';
import { productsAPI, categoriesAPI } from '../services/api';
import { detectCountryByIP } from '../utils/geoip';

const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[1]); // Default: Turkey
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    detectCountryByIP().then(detected => {
      setSelectedCountry(detected);
    });
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty arrays if API fails
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        selectedCountry={selectedCountry} 
       
      />
      <Hero />
      <FeaturedProducts 
        selectedCountry={selectedCountry} 
        products={products}
      />
      <ProductGrid 
        selectedCountry={selectedCountry}
        products={products}
        categories={categories}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
