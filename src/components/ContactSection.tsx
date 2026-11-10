import React, { useState } from 'react';
import { MessageCircle, MapPin, Clock, Copy, Check, PhoneCall, ExternalLink } from 'lucide-react';
import { CONTACT_CONFIG, getWhatsAppLink } from '../config';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(CONTACT_CONFIG.whatsappDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contato" className="py-24 sm:py-32 lg:py-36 bg-[#1A0B2E] relative overflow-hidden">
      {/* Hairline top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3E9B3A]/20 to-transparent" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="w-10 h-0.5 bg-[#3E9B3A] mx-auto mb-4 rounded-full" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#3E9B3A] font-semibold block mb-3">
            Atendimento Personalizado
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Contato & <span className="italic font-normal text-[#FFF4E0]">Localização</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#FFF4E0]/75 leading-relaxed tracking-wide font-normal">
            Peça agora mesmo pelo WhatsApp ou venha nos visitar na Unidade Laranjeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 max-w-5xl mx-auto items-stretch">
          {/* Main WhatsApp Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#25103E] md:bg-[#25103E]/85 md:backdrop-blur-md rounded-[24px] p-8 sm:p-10 border border-[#3E9B3A]/30 shadow-xl shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E9B3A]/15 border border-[#3E9B3A]/35 text-[#3E9B3A] text-xs font-semibold uppercase tracking-wider mb-6">
                Atendimento Direto
              </div>

              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Faça seu pedido diretamente no WhatsApp
              </h3>

              <p className="text-sm sm:text-base text-[#FFF4E0]/70 leading-relaxed mb-8 font-normal">
                Envie uma mensagem e nossa equipe monta seu copo na hora, sempre super gelado e bem recheado. Aceitamos Pix, cartões e dinheiro.
              </p>

              {/* Number presentation block */}
              <div className="bg-[#18092B]/90 rounded-2xl p-4 sm:p-5 border border-[#3E9B3A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#3E9B3A]/15 border border-[#3E9B3A]/30 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5 text-[#3E9B3A]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#FFF4E0]/60 uppercase tracking-[0.1em] block font-medium">
                      WhatsApp Oficial
                    </span>
                    <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFF4E0] tracking-wide">
                      {CONTACT_CONFIG.whatsappDisplay}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25103E] hover:bg-[#321550] text-[#FFF4E0]/85 hover:text-[#FFF4E0] text-xs font-medium border border-[#3E9B3A]/40 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3E9B3A]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar número</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Pill button: purple with green border */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-full bg-[#2D1248] hover:bg-[#3B175E] border border-[#3E9B3A] text-[#FFF4E0] hover:text-white font-sans text-sm sm:text-base font-semibold tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-[#3E9B3A]" />
              <span>Iniciar conversa no WhatsApp</span>
              <ExternalLink className="w-4 h-4 opacity-60" />
            </a>
          </div>

          {/* Store Info Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Address */}
            <div className="bg-[#25103E] md:bg-[#25103E]/85 md:backdrop-blur-md rounded-[24px] p-7 sm:p-8 border border-[#3E9B3A]/30 shadow-xl shadow-black/40 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-[#3E9B3A]/15 border border-[#3E9B3A]/30 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-[#3E9B3A]" />
              </div>
              <h4 className="font-serif-title text-xl font-bold text-white mb-2 tracking-tight">
                {CONTACT_CONFIG.unitName}
              </h4>
              <p className="text-sm text-[#FFF4E0]/70 leading-relaxed mb-4 font-normal">
                {CONTACT_CONFIG.address}
              </p>
              <span className="inline-block text-xs font-medium text-[#FFF4E0]/80 bg-[#18092B]/80 px-3.5 py-1.5 rounded-full border border-purple-800/40">
                Retirada no balcão & Delivery local
              </span>
            </div>

            {/* Opening Hours */}
            <div className="bg-[#25103E] md:bg-[#25103E]/85 md:backdrop-blur-md rounded-[24px] p-7 sm:p-8 border border-[#3E9B3A]/30 shadow-xl shadow-black/40 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-[#3E9B3A]/15 border border-[#3E9B3A]/30 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[#3E9B3A]" />
              </div>
              <h4 className="font-serif-title text-xl font-bold text-white mb-2 tracking-tight">
                Horário de Atendimento
              </h4>
              <p className="text-sm text-[#FFF4E0]/70 leading-relaxed mb-4 font-normal">
                {CONTACT_CONFIG.openingHours}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#3E9B3A]">
                <span className="w-2 h-2 rounded-full bg-[#3E9B3A] animate-pulse" />
                <span>Pronto para receber seu pedido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
