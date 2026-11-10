import React from 'react';
import { MessageCircle, MapPin } from 'lucide-react';
import { CONTACT_CONFIG, getWhatsAppLink, OFFICIAL_LOGO_URL } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#140824] border-t border-[#3E9B3A]/20 text-[#FFF4E0]/70 py-14 sm:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-purple-900/30">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#3E9B3A]/50 bg-[#25103E] p-0.5 shrink-0 shadow-md">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Logo Açaí Veg"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif-title text-xl font-bold text-white tracking-tight block">
                Açaí <span className="font-sans text-[#3E9B3A] font-semibold">Veg</span>
              </span>
              <span className="text-xs text-[#FFF4E0]/60 tracking-wider">
                Açaiteria Artesanal
              </span>
            </div>
          </div>

          {/* Minimalist Details: Unidade Laranjeiras & WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-xs sm:text-sm text-[#FFF4E0]/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3E9B3A]" />
              <span>{CONTACT_CONFIG.unitName}</span>
            </div>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25103E] hover:bg-[#321550] border border-[#3E9B3A]/50 hover:border-[#3E9B3A] text-[#FFF4E0] font-sans font-medium text-xs tracking-wider transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#3E9B3A]" />
              <span>{CONTACT_CONFIG.whatsappDisplay}</span>
            </a>
          </div>
        </div>

        {/* Minimalist Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF4E0]/50 font-normal">
          <p>© {new Date().getFullYear()} Açaí Veg. Todos os direitos reservados.</p>
          <p>Monte seu momento de felicidade.</p>
        </div>
      </div>
    </footer>
  );
};
