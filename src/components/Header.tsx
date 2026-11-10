import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { CONTACT_CONFIG, getWhatsAppLink, OFFICIAL_LOGO_URL } from '../config';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1a0826]/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-purple-900/30 py-3'
          : 'bg-gradient-to-b from-[#1a0826]/90 via-[#1a0826]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark / Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E9B3A] rounded-xl"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#3E9B3A] shadow-md shadow-purple-950/60 bg-[#4B1D6B] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Logo Açaí Veg"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#FFF4E0] transition-colors leading-none">
              Açaí <span className="text-[#3E9B3A]">Veg</span>
            </span>
            <span className="text-[10px] text-purple-200/70 tracking-widest uppercase font-medium mt-0.5">
              Artesanal & Puro
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-purple-100/80">
          <a
            href="#inicio"
            className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#3E9B3A] after:transition-all"
          >
            Início
          </a>
          <a
            href="#cardapio"
            className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#3E9B3A] after:transition-all"
          >
            Cardápio
          </a>
          <a
            href="#como-funciona"
            className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#3E9B3A] after:transition-all"
          >
            Como Funciona
          </a>
          <a
            href="#contato"
            className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#3E9B3A] after:transition-all"
          >
            Contato
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#3B1259] hover:bg-[#4C1873] border border-[#3E9B3A] text-[#FFF4E0] hover:text-white text-xs font-bold tracking-wide shadow-md hover:shadow-emerald-950/40 active:scale-95 transition-all duration-200 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#3E9B3A] fill-[#3E9B3A]" />
            <span>Pedir no WhatsApp</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-purple-200 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E9B3A]"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f0a2f]/98 backdrop-blur-xl border-b border-purple-900/40 px-6 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-100 hover:text-[#3E9B3A] transition-colors py-1"
            >
              Início
            </a>
            <a
              href="#cardapio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-100 hover:text-[#3E9B3A] transition-colors py-1"
            >
              Cardápio Completo
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-100 hover:text-[#3E9B3A] transition-colors py-1"
            >
              Como Funciona
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-100 hover:text-[#3E9B3A] transition-colors py-1"
            >
              Contato & Localização
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#3E9B3A] text-white font-semibold text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Fazer Pedido no WhatsApp</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
