import React from 'react';
import { X } from 'lucide-react';
import { countries } from '../data/mock';

const CountrySelector = ({ selectedCountry, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-burgundy-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ülke Seçin</h2>
            <p className="text-burgundy-100 text-sm mt-1">Fiyatlar seçtiğiniz ülkeye göre gösterilecektir</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-burgundy-600 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Countries List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => onSelect(country)}
                className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                  selectedCountry.code === country.code
                    ? 'border-burgundy-600 bg-burgundy-50'
                    : 'border-gray-200 hover:border-burgundy-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{country.name}</p>
                    <p className="text-sm text-gray-600">
                      {country.currency} ({country.symbol})
                    </p>
                  </div>
                  {selectedCountry.code === country.code && (
                    <div className="w-6 h-6 bg-burgundy-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
