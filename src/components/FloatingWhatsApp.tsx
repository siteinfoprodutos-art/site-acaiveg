import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../config';

export const FloatingWhatsApp: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after user scrolls down a bit (past initial 100px)
    const handleScroll = () => {
      setVisible(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-5 sm:right-8 z-40 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp para fazer pedido na Açaí Veg"
        className="group relative flex items-center gap-3 px-5 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl animate-periodic-pulse hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
      >
        {/* Subtle animated ripple ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white shrink-0" />

        <span className="hidden sm:inline-block font-display font-bold text-sm tracking-wide text-white whitespace-nowrap">
          Pedir no WhatsApp
        </span>

        {/* Online Indicator Badge */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow-md">
          <span className="w-full h-full bg-[#3E9B3A] rounded-full block animate-pulse" />
        </span>
      </a>
    </div>
  );
};
