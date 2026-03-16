import React from 'react';
import { products, categories } from '../data/mock';
import ProductCard from './ProductCard';

const ProductGrid = ({ selectedCountry }) => {
  // Group products by category
  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category === categoryId && !p.featured);
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Tüm Koleksiyon
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Her detayda özen, her sayışta huzur. Zikirmatik koleksiyonumuzu keşfedin.
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.id);
          
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="mb-20 last:mb-0">
              {/* Category Header */}
              <div className="mb-10">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                    {category.name}
                  </h3>
                  <span className="px-4 py-1 bg-burgundy-100 text-burgundy-700 rounded-full text-sm font-semibold">
                    {categoryProducts.length} Ürün
                  </span>
                </div>
                <p className="text-gray-600 text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {category.description}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} selectedCountry={selectedCountry} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
