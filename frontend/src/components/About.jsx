import React from 'react';
import { brandContent } from '../data/mock';
import { Heart, Award, Shield, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Kalple Tasarım',
      description: 'Her parça, manevi bir yolculuğun başlangıcı olarak özenle tasarlanmıştır.'
    },
    {
      icon: Award,
      title: 'Mücevher Sanatı',
      description: 'Ustalık ve modern tasarımın mükemmel birleşimi, her detayda görülür.'
    },
    {
      icon: Shield,
      title: 'Kaliteli Malzeme',
      description: 'Sadece en kaliteli malzemelerle, uzun ömürlü kullanım için üretilir.'
    },
    {
      icon: Sparkles,
      title: 'Özel Ambalaj',
      description: 'Her ürün, lüks ambalajıyla kendinize veya sevdiklerinize mükemmel bir hediye.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-burgundy-100 text-burgundy-800 rounded-full text-sm font-semibold">
                {brandContent.name}
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              {brandContent.tagline}
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {brandContent.description}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Craponia Atelier olarak, mücevher sanatını manevi bir yolculukla birleştiriyoruz. 
              Zikra Zikirmatik koleksiyonumuz, modern tasarımın güzelliğiyle zikirmatik kullanımının anlamını bir araya getiriyor.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Her parça, sadece bir aksesuar değil; kalbinizi hatırlatan, niyetinizi tazeleten 
              ve maneviyatınızı güçlendiren bir yoldaştır.
            </p>

            <div className="pt-4">
              <a
                href="https://www.instagram.com/zikrazikirmatik/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-burgundy-700 text-white rounded-xl font-semibold hover:bg-burgundy-800 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Daha Fazlasını Keşfedin</span>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
                alt="About Zikra"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gold-200/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-burgundy-200"
              >
                <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-burgundy-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
