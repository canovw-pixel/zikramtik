import React from 'react';
import { Link } from 'react-router-dom';
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
              M{'\u00fc'}cevher sanat{'\u0131'}n{'\u0131'}n manevi yolculukla bulu{'\u015f'}tu{'\u011f'}u yer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">H{'\u0131'}zl{'\u0131'} Eri{'\u015f'}im</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-burgundy-100 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="text-burgundy-100 hover:text-white transition-colors">
                  Hakk{'\u0131'}m{'\u0131'}zda
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-burgundy-100 hover:text-white transition-colors">
                  Sipari{'\u015f'} Takibi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Yasal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/teslimat-iade" className="text-burgundy-100 hover:text-white transition-colors" data-testid="footer-delivery-link">
                  Teslimat ve {'\u0130'}ade {'\u015e'}artlar{'\u0131'}
                </Link>
              </li>
              <li>
                <Link to="/gizlilik" className="text-burgundy-100 hover:text-white transition-colors" data-testid="footer-privacy-link">
                  Gizlilik S{'\u00f6'}zle{'\u015f'}mesi
                </Link>
              </li>
              <li>
                <Link to="/mesafeli-satis" className="text-burgundy-100 hover:text-white transition-colors" data-testid="footer-distance-sales-link">
                  Mesafeli Sat{'\u0131'}{'\u015f'} S{'\u00f6'}zle{'\u015f'}mesi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-lg font-semibold mb-4">{'\u0130'}leti{'\u015f'}im</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-burgundy-300 mt-0.5 flex-shrink-0" />
                <span className="text-burgundy-100 text-sm">info@zikramatik.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-burgundy-300 mt-0.5 flex-shrink-0" />
                <span className="text-burgundy-100 text-sm">+90 553 076 60 00</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-burgundy-300 mt-0.5 flex-shrink-0" />
                <span className="text-burgundy-100 text-sm">Alemdar Mah. Haci Tahsin Bey Sok. No:5/7 Fatih/Istanbul</span>
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

        {/* Payment Logos Section */}
        <div className="border-t border-burgundy-700 pt-8 mb-8">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-burgundy-300 text-xs uppercase tracking-wider font-medium">G{'\u00fc'}venli {'\u00d6'}deme</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Visa Logo */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center" data-testid="visa-logo">
                <svg viewBox="0 0 780 500" className="h-8 w-auto">
                  <path d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8h-53.4zM538.3 159.4c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.2 64.7-.3 28.2 26.5 43.9 46.8 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.6 10.2 59.6 10.5 56.2 0 92.7-26.3 93.1-67 .2-22.3-14-39.3-44.8-53.3-18.7-9.1-30.1-15.1-30-24.3 0-8.1 9.7-16.8 30.6-16.8 17.5-.3 30.1 3.5 40 7.5l4.8 2.3 7-42.7zM676.3 152.9h-41.3c-12.8 0-22.4 3.5-28 16.3l-79.4 179.5h56.2s9.2-24.2 11.3-29.5c6.1 0 60.9.1 68.7.1 1.6 6.9 6.5 29.4 6.5 29.4h49.7l-43.7-195.8zm-66.1 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47 12.4 56.6h-44.5zM232.8 152.9l-52.3 133.5-5.6-27.1c-9.7-31.2-39.9-65-73.7-82l47.9 171.2 56.6-.1 84.2-195.5h-57.1" fill="#1A1F71"/>
                  <path d="M124.7 152.9H38.2l-.7 4c67 16.2 111.3 55.4 129.7 102.5l-18.7-90.2c-3.2-12.4-12.8-15.9-24.8-16.3" fill="#F9A533"/>
                </svg>
              </div>
              {/* Mastercard Logo */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center" data-testid="mastercard-logo">
                <svg viewBox="0 0 780 500" className="h-8 w-auto">
                  <rect width="780" height="500" rx="40" fill="white"/>
                  <circle cx="312" cy="250" r="150" fill="#EB001B"/>
                  <circle cx="468" cy="250" r="150" fill="#F79E1B"/>
                  <path d="M390 130.7c38.6 31.3 63.3 78.6 63.3 131.3s-24.7 100-63.3 131.3c-38.6-31.3-63.3-78.6-63.3-131.3s24.7-100 63.3-131.3z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* iyzico Footer Logo */}
              <div className="flex items-center justify-center" data-testid="iyzico-footer-logo">
                <img 
                  src="/images/iyzico-footer-white.svg" 
                  alt="iyzico ile Ode" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-burgundy-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-burgundy-200 text-sm">
              &copy; {new Date().getFullYear()} Zikra - Craponia Atelier. T{'\u00fc'}m haklar{'\u0131'} sakl{'\u0131'}d{'\u0131'}r.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/gizlilik" className="text-burgundy-200 hover:text-white text-sm transition-colors">
                Gizlilik Sozlesmesi
              </Link>
              <Link to="/mesafeli-satis" className="text-burgundy-200 hover:text-white text-sm transition-colors">
                Mesafeli Satis Sozlesmesi
              </Link>
              <Link to="/teslimat-iade" className="text-burgundy-200 hover:text-white text-sm transition-colors">
                Teslimat ve {'\u0130'}ade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
