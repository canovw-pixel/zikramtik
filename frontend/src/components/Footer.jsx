import React from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                <img
                  src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/99jr70kx_logo.jpeg"
                  alt="Zikra Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Zikra</h3>
                <p className="text-sm text-burgundy-200">Craponia Atelier</p>
              </div>
            </div>
            <p className="text-burgundy-100 text-sm leading-relaxed">
              Mücevher sanatının manevi yolculukla buluştuğu yer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-burgundy-100 hover:text-white transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#products" className="text-burgundy-100 hover:text-white transition-colors">
                  Ürünler
                </a>
              </li>
              <li>
                <a href="#about" className="text-burgundy-100 hover:text-white transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#contact" className="text-burgundy-100 hover:text-white transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-burgundy-100 hover:text-white transition-colors">
                  Sipariş Takibi
                </a>
              </li>
              <li>
                <a href="#" className="text-burgundy-100 hover:text-white transition-colors">
                  İade & Değişim
                </a>
              </li>
              <li>
                <a href="#" className="text-burgundy-100 hover:text-white transition-colors">
                  SSS
                </a>
              </li>
              <li>
                <a href="#" className="text-burgundy-100 hover:text-white transition-colors">
                  Güvenli Ödeme
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-burgundy-300 mt-0.5" />
                <span className="text-burgundy-100 text-sm">info@zikra.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-burgundy-300 mt-0.5" />
                <span className="text-burgundy-100 text-sm">+90 XXX XXX XX XX</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-burgundy-300 mt-0.5" />
                <span className="text-burgundy-100 text-sm">İstanbul, Türkiye</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <a
                href="https://www.instagram.com/zikrazikirmatik/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-burgundy-700 hover:bg-burgundy-600 rounded-lg transition-all"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-burgundy-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-burgundy-200 text-sm">
              © {new Date().getFullYear()} Zikra - Craponia Atelier. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-burgundy-200 hover:text-white text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-burgundy-200 hover:text-white text-sm transition-colors">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
