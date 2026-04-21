import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { countries } from '../data/mock';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="payment-success-page">
      <Header selectedCountry={selectedCountry} />
      <main className="max-w-2xl mx-auto px-4 py-24 pt-32 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>
            {'\u00d6'}deme Ba{'\u015f'}ar{'\u0131'}l{'\u0131'}!
          </h1>
          <p className="text-gray-600 mb-8">
            Sipari{'\u015f'}iniz ba{'\u015f'}ar{'\u0131'}yla olu{'\u015f'}turuldu. Sipari{'\u015f'} onay{'\u0131'} e-posta adresinize g{'\u00f6'}nderildi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/order-tracking')} className="bg-burgundy-700 hover:bg-burgundy-800 text-white">
              Sipari{'\u015f'} Takibi
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="border-burgundy-700 text-burgundy-700">
              Al{'\u0131'}{'\u015f'}veri{'\u015f'}e Devam Et
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
