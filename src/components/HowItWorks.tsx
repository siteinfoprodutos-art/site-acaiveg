import React from 'react';
import { CupSoda, Layers, Bike } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Escolha o copo',
      desc: '300ml para matar aquela vontade no dia a dia ou 700ml para uma experiência épica e super recheada.',
      icon: CupSoda,
    },
    {
      number: '02',
      title: 'Escolha as camadas',
      desc: 'Combine o nosso açaí cremoso artesanal com frutas frescas selecionadas, cremes nobres e complementos crocantes.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Receba ou retire',
      desc: 'Entregamos rapidinho na sua casa ou você retira direto no balcão da unidade Laranjeiras, sempre no ponto gelado ideal.',
      icon: Bike,
    },
  ];

  return (
    <section id="como-funciona" className="py-24 sm:py-32 lg:py-36 bg-[#1A0B2E] relative overflow-hidden">
      {/* Subtle hairline divider at the top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3E9B3A]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Heading with fine green accent line */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="w-10 h-0.5 bg-[#3E9B3A] mx-auto mb-4 rounded-full" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#3E9B3A] font-semibold block mb-3">
            Passo a Passo
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Como <span className="italic font-normal text-[#FFF4E0]">Funciona</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#FFF4E0]/75 leading-relaxed tracking-wide font-normal">
            Três passos simples para você saborear o açaí perfeito hoje mesmo.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-9 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className="relative bg-[#25103E] md:bg-[#25103E]/80 md:backdrop-blur-md rounded-[24px] p-8 sm:p-9 border border-[#3E9B3A]/25 hover:border-[#3E9B3A]/60 shadow-xl shadow-black/35 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-2 active:scale-[0.99] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Top row with icon & editorial serif number */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#3E9B3A]/15 border border-[#3E9B3A]/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#3E9B3A]" />
                    </div>
                    <span className="font-serif-title text-3xl sm:text-4xl font-bold text-[#FFF4E0]/30 tabular-nums">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-serif-title text-2xl font-bold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#FFF4E0]/70 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#3E9B3A]/15 flex items-center gap-2 text-xs font-semibold text-[#FFF4E0]/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E9B3A]" />
                  <span>Etapa {step.number} de 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
