import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { MENU_ITEMS, getWhatsAppLink, MenuItem } from '../config';

interface MenuSectionProps {
  onSelectCup?: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectCup }) => {
  return (
    <section id="cardapio" className="relative py-24 sm:py-32 lg:py-36 bg-[#1A0B2E] overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -right-64 w-[500px] h-[500px] bg-[#3E9B3A]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header with fine green accent line */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="w-10 h-0.5 bg-[#3E9B3A] mx-auto mb-4 rounded-full" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#3E9B3A] font-semibold block mb-3">
            Cardápio Selecionado
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Nossos Copos de <span className="italic font-normal text-[#FFF4E0]">Destaque</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#FFF4E0]/75 leading-relaxed tracking-wide font-normal">
            Açaí artesanal super cremoso batido na consistência perfeita, frutas frescas e camadas generosas.
          </p>
        </div>

        {/* 2 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {MENU_ITEMS.map((item) => {
            const itemWhatsAppMsg = `Olá! Quero pedir o ${item.name} (${item.size}) por ${item.priceFormatted}.`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-[#25103E] md:bg-[#25103E]/85 md:backdrop-blur-md rounded-[24px] overflow-hidden border border-[#3E9B3A]/30 hover:border-[#3E9B3A]/70 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-2 active:scale-[0.99] transition-all duration-300"
              >
                {/* Photo taking prominent upper portion of the card */}
                <div className="relative h-80 sm:h-96 md:h-[420px] w-full overflow-hidden bg-[#180929]/90">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Subtle vignette gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#25103E] via-transparent to-black/25" />

                  {/* Volume Pill in discreet cream */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#180929] md:bg-black/60 md:backdrop-blur-md border border-white/15 text-[#FFF4E0] font-sans text-xs tracking-wider font-semibold shadow-md">
                      {item.volume}
                    </span>
                  </div>

                  {/* Subtle Badge */}
                  {item.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#3E9B3A] md:bg-[#3E9B3A]/90 md:backdrop-blur-sm text-white text-xs font-medium tracking-wide shadow-md">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-7 sm:p-9 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Title & Large Price in Cream */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 mb-3">
                      <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white group-hover:text-[#FFF4E0] transition-colors tracking-tight">
                        {item.name}
                      </h3>
                      {/* Big prominent price in cream */}
                      <span className="font-serif-title text-4xl sm:text-5xl font-bold text-[#FFF4E0] tabular-nums tracking-tight shrink-0 drop-shadow-sm">
                        {item.priceFormatted}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#FFF4E0]/70 mb-7 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Ingredients List */}
                    <div className="mb-8 pt-4 border-t border-[#3E9B3A]/15">
                      <span className="text-[11px] font-semibold text-[#FFF4E0]/60 uppercase tracking-[0.15em] block mb-3.5">
                        Camadas selecionadas:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#FFF4E0]/85">
                        {item.ingredients.map((ing, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-[#3E9B3A]/20 border border-[#3E9B3A]/40 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-[#3E9B3A]" />
                            </div>
                            <span>{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pill Action Buttons: Purple with green border and cream text */}
                  <div className="pt-5 border-t border-[#3E9B3A]/20 flex flex-col sm:flex-row gap-3">
                    <a
                      href={getWhatsAppLink(itemWhatsAppMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#2D1248] hover:bg-[#3B175E] border border-[#3E9B3A]/60 hover:border-[#3E9B3A] text-[#FFF4E0] hover:text-white font-sans text-sm font-semibold tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <MessageCircle className="w-4 h-4 text-[#3E9B3A]" />
                      <span>Pedir {item.size} no WhatsApp</span>
                    </a>

                    {onSelectCup && (
                      <button
                        type="button"
                        onClick={() => onSelectCup(item)}
                        className="sm:w-auto inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-[#1F0C35]/60 hover:bg-[#2D1248] text-[#FFF4E0]/80 hover:text-[#FFF4E0] text-xs font-medium border border-purple-800/40 hover:border-[#3E9B3A]/40 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                      >
                        Personalizar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customization Callout Banner with fine borders and translucent glass */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto rounded-[24px] bg-[#230F3B] md:bg-[#230F3B]/60 md:backdrop-blur-md p-7 sm:p-9 border border-[#3E9B3A]/25 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#3E9B3A]/15 border border-[#3E9B3A]/30 flex items-center justify-center shrink-0 text-xl">
              🥣
            </div>
            <div>
              <h4 className="font-serif-title text-xl font-bold text-white tracking-tight">
                Deseja montar seu açaí sob medida?
              </h4>
              <p className="text-xs sm:text-sm text-[#FFF4E0]/70 mt-1 leading-relaxed">
                Adicione Nutella, leite ninho, paçoca, uva, banana, Kit Kat, granola e calda à sua escolha.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppLink('Olá! Gostaria de montar um açaí personalizado com complementos extras.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#2D1248] hover:bg-[#3B175E] text-[#FFF4E0] hover:text-white border border-[#3E9B3A]/60 hover:border-[#3E9B3A] font-sans font-semibold text-xs tracking-wider shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
          >
            Personalizar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
