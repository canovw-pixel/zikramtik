import React from 'react';
import { heroContent } from '../data/mock';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream-50 via-white to-burgundy-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-burgundy-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-gold-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 bg-burgundy-100 text-burgundy-800 rounded-full text-sm font-semibold">
                Craponia Atelier
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              {heroContent.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProducts}
                className="group px-8 py-4 bg-burgundy-700 text-white rounded-xl font-semibold hover:bg-burgundy-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>{heroContent.cta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="https://www.instagram.com/zikrazikirmatik/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-burgundy-700 text-burgundy-700 rounded-xl font-semibold hover:bg-burgundy-50 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png"
                alt="Zikra Zikirmatik"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden lg:block">
              <p className="text-sm text-gray-600 mb-2">Mücevher ustasından kalplere</p>
              <p className="text-burgundy-700 font-semibold">Bazı yolculuklar ellerle başlar…</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
