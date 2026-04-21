import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { countries } from '../data/mock';

const PaymentFail = () => {
  const navigate = useNavigate();
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="payment-fail-page">
      <Header selectedCountry={selectedCountry} />
      <main className="max-w-2xl mx-auto px-4 py-24 pt-32 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>
            {'\u00d6'}deme Ba{'\u015f'}ar{'\u0131'}s{'\u0131'}z
          </h1>
          <p className="text-gray-600 mb-8">
            {'\u00d6'}deme i{'\u015f'}lemi tamamlanamad{'\u0131'}. L{'\u00fc'}tfen tekrar deneyin veya farkl{'\u0131'} bir kart kullan{'\u0131'}n.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/cart')} className="bg-burgundy-700 hover:bg-burgundy-800 text-white">
              Sepete D{'\u00f6'}n
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="border-burgundy-700 text-burgundy-700">
              Ana Sayfaya D{'\u00f6'}n
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFail;
