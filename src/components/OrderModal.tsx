import React, { useState } from 'react';
import { X, MessageCircle, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MenuItem, MENU_ITEMS, getWhatsAppLink } from '../config';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: MenuItem | null;
}

const AVAILABLE_EXTRAS = [
  { name: 'Creme de Avelã (Nutella)', price: 4.0 },
  { name: 'Leite Ninho Extra', price: 2.5 },
  { name: 'Paçoca Artesanal', price: 2.0 },
  { name: 'Morangos Frescos', price: 3.5 },
  { name: 'Banana Fatiada', price: 2.0 },
  { name: 'Uva Roxa / Verde', price: 3.0 },
  { name: 'Granola Crocante', price: 2.0 },
  { name: 'Leite Condensado', price: 2.0 },
  { name: 'Mel Puro', price: 2.5 },
];

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, initialItem }) => {
  const [selectedCup, setSelectedCup] = useState<MenuItem>(initialItem || MENU_ITEMS[0]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'retirada'>('delivery');

  if (!isOpen) return null;

  const toggleExtra = (extraName: string) => {
    if (selectedExtras.includes(extraName)) {
      setSelectedExtras(selectedExtras.filter((e) => e !== extraName));
    } else {
      setSelectedExtras([...selectedExtras, extraName]);
    }
  };

  const extrasTotal = selectedExtras.reduce((acc, name) => {
    const extra = AVAILABLE_EXTRAS.find((e) => e.name === name);
    return acc + (extra ? extra.price : 0);
  }, 0);

  const grandTotal = selectedCup.price + extrasTotal;

  const handleSendOrder = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4B1D6B', '#3E9B3A', '#FFF4E0', '#E63946'],
    });

    const extrasText = selectedExtras.length > 0 ? selectedExtras.join(', ') : 'Nenhum adicional extra';

    const message = `🍨 *NOVO PEDIDO - AÇAÍ VEG* 🍨

*Item:* ${selectedCup.name} (${selectedCup.size}) - ${selectedCup.priceFormatted}
*Adicionais Extras:* ${extrasText}
*Tipo:* ${orderType === 'delivery' ? 'Entrega (Delivery)' : 'Retirada no Balcão (Unidade Laranjeiras)'}
${customerName ? `*Cliente:* ${customerName}` : ''}
${orderType === 'delivery' && customerAddress ? `*Endereço:* ${customerAddress}` : ''}
*Total Estimado:* R$ ${grandTotal.toFixed(2).replace('.', ',')}

Olá! Gostaria de confirmar esse pedido por gentileza.`;

    window.open(getWhatsAppLink(message), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1A0B2E] border border-[#3E9B3A]/30 rounded-[24px] shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#3E9B3A]/20 flex items-center justify-between bg-[#150824]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#3E9B3A]" />
            <h3 className="font-serif-title text-xl font-bold text-white tracking-tight">
              Personalize seu Açaí
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#FFF4E0]/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Cup selection */}
          <div>
            <label className="text-xs uppercase tracking-wider text-purple-300 font-bold block mb-3">
              1. Escolha o Copo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MENU_ITEMS.map((cup) => (
                <button
                  key={cup.id}
                  type="button"
                  onClick={() => setSelectedCup(cup)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    selectedCup.id === cup.id
                      ? 'bg-purple-900/60 border-[#3E9B3A] shadow-md shadow-emerald-950/40 ring-1 ring-[#3E9B3A]'
                      : 'bg-purple-950/40 border-purple-800/40 hover:border-purple-700/60'
                  }`}
                >
                  <div className="font-display font-bold text-white text-base">
                    {cup.size}
                  </div>
                  <div className="text-xs text-purple-200/80 mt-0.5">
                    {cup.name}
                  </div>
                  <div className="font-display font-bold text-[#3E9B3A] text-sm mt-2 tabular-nums">
                    {cup.priceFormatted}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider text-purple-300 font-bold">
                2. Adicionais Extras (Opcional)
              </label>
              <span className="text-[11px] text-purple-400">
                {selectedExtras.length} selecionado(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_EXTRAS.map((extra) => {
                const isSelected = selectedExtras.includes(extra.name);
                return (
                  <button
                    key={extra.name}
                    type="button"
                    onClick={() => toggleExtra(extra.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs border transition-all ${
                      isSelected
                        ? 'bg-[#3E9B3A]/20 border-[#3E9B3A] text-white'
                        : 'bg-purple-950/30 border-purple-900/40 text-purple-200 hover:border-purple-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#3E9B3A] text-white' : 'border border-purple-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{extra.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-300 tabular-nums shrink-0 ml-1">
                      +R${extra.price.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery or Pickup */}
          <div>
            <label className="text-xs uppercase tracking-wider text-purple-300 font-bold block mb-3">
              3. Forma de Atendimento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#3E9B3A] border-[#3E9B3A] text-white'
                    : 'bg-purple-950/40 border-purple-800/40 text-purple-300'
                }`}
              >
                🛵 Entrega (Delivery)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('retirada')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  orderType === 'retirada'
                    ? 'bg-[#3E9B3A] border-[#3E9B3A] text-white'
                    : 'bg-purple-950/40 border-purple-800/40 text-purple-300'
                }`}
              >
                🏪 Retirada no Balcão
              </button>
            </div>
          </div>

          {/* Customer fields */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-purple-300 font-medium block mb-1">
                Seu Nome (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Ana Souza"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/50 border border-purple-800/50 text-white placeholder-purple-400 text-sm focus:outline-none focus:border-[#3E9B3A]"
              />
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="text-xs text-purple-300 font-medium block mb-1">
                  Endereço de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Rua, número e bairro"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/50 border border-purple-800/50 text-white placeholder-purple-400 text-sm focus:outline-none focus:border-[#3E9B3A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Grand Total & Send CTA */}
        <div className="p-6 bg-[#170523] border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-purple-300/70 block">Total do Pedido</span>
            <span className="font-display text-2xl font-extrabold text-[#FFF4E0] tabular-nums">
              R$ {grandTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSendOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-4 px-7 rounded-full bg-[#3B1259] hover:bg-[#4C1873] border-2 border-[#3E9B3A] text-white font-display text-sm sm:text-base font-bold shadow-xl shadow-purple-950/70 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#3E9B3A] fill-[#3E9B3A]" />
            <span>Enviar Pedido no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
