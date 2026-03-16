import React from 'react';
import { products } from '../data/mock';
import ProductCard from './ProductCard';

const ProductGrid = ({ selectedCountry }) => {
  const regularProducts = products.filter(p => !p.featured);

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tüm Koleksiyon
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Her detayda özen, her sayışta huzur. Zikirmatik koleksiyonumuzu keşfedin.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularProducts.map((product) => (
            <ProductCard key={product.id} product={product} selectedCountry={selectedCountry} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
