import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WHATSAPP_NUMBER = '905530766000'; // +90 553 076 60 00
const DEFAULT_MESSAGE = encodeURIComponent('Merhaba, Zikra ürünleri hakkında bilgi almak istiyorum.');

const WhatsAppFloat = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      data-testid="whatsapp-float-button"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110">
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="white" strokeWidth={1.5} />
        </div>
      </div>
      <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
        WhatsApp&apos;tan yazın
      </span>
    </a>
  );
};

export default WhatsAppFloat;
