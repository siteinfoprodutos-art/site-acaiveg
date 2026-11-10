/**
 * Açaí Veg - Configurações Globais
 * Edite facilmente as variáveis abaixo para personalizar a sequência de frames,
 * contatos de WhatsApp, dados da loja e itens do cardápio.
 */

// ==========================================
// CONFIGURAÇÃO DOS FRAMES (SCROLL ANIMADO)
// ==========================================
export const FRAME_CONFIG = {
  // Caminho do vídeo oficial para extração de frames no navegador
  videoUrl: '/assets/aistudio/video-acai_ae0feae3.mp4',

  // Caminho da pasta onde os frames estão localizados (padrão '/frames' dentro de public/)
  dir: '/frames',
  
  // Regra dos frames: de 1 a 191 em números ímpares (passo de 2), totalizando 96 imagens
  startNumber: 1,
  endNumber: 191,
  step: 2,
  totalFrames: 96,
  digits: 5, // ex: frame00001.jpg
  prefix: 'frame',
  extension: '.jpg',
  
  // Resolução nativa dos frames do vídeo
  width: 720,
  height: 1280,
};

/**
 * Função utilitária que gera o nome do arquivo a partir do índice (0 a 95).
 * Ex: index 0 -> 'frame00001.jpg'
 *     index 1 -> 'frame00003.jpg'
 *     ...
 *     index 95 -> 'frame00191.jpg'
 */
export function getFrameFileName(index: number): string {
  const number = FRAME_CONFIG.startNumber + index * FRAME_CONFIG.step;
  const padded = String(number).padStart(FRAME_CONFIG.digits, '0');
  return `${FRAME_CONFIG.prefix}${padded}${FRAME_CONFIG.extension}`;
}

/**
 * Retorna o caminho completo da imagem
 */
export function getFrameUrl(index: number): string {
  return `${FRAME_CONFIG.dir}/${getFrameFileName(index)}`;
}

// ==========================================
// CONTATO E WHATSAPP
// ==========================================
export const CONTACT_CONFIG = {
  // Número internacional do WhatsApp (apenas números: DDI + DDD + Telefone)
  whatsappNumber: '5511942746745',
  
  // Formato visual para exibição
  whatsappDisplay: '(11) 94274-6745',
  
  // Mensagem padrão ao clicar no botão
  defaultMessage: 'Olá! Quero fazer um pedido de açaí.',
  
  // Informações da Unidade
  unitName: 'Unidade Laranjeiras',
  address: 'Rua das Laranjeiras, Unidade Laranjeiras - São Paulo, SP',
  openingHours: 'Terça a Domingo: 12h00 às 22h00',
  instagram: '@acaiveg.oficial',
};

/**
 * Gera o link direto para iniciar conversa no WhatsApp com texto codificado
 */
export function getWhatsAppLink(message?: string): string {
  const text = message || CONTACT_CONFIG.defaultMessage;
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// ==========================================
// CARDÁPIO DE DESTAQUE COM FOTOS OFICIAIS
// ==========================================
export interface MenuItem {
  id: string;
  name: string;
  size: string;
  volume: string;
  price: number;
  priceFormatted: string;
  description: string;
  ingredients: string[];
  image: string;
  badge?: string;
}

export const OFFICIAL_LOGO_URL = '/assets/aistudio/logo_acai_veg_circle.png';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'copo-300ml',
    name: 'Copo 300ml Açaí Veg',
    size: '300ml',
    volume: '300 ml',
    price: 13.0,
    priceFormatted: 'R$ 13,00',
    description: 'Açaí artesanal super cremoso montado em camadas equilibradas de leite em pó, leite condensado e pedaços crocantes de Kit Kat.',
    ingredients: ['Açaí Veg Especial', 'Leite em Pó', 'Leite Condensado', 'Kit Kat Crocante'],
    image: '/assets/aistudio/copo_1_7c36f858.jpeg',
    badge: 'Queridinho da Casa',
  },
  {
    id: 'copo-700ml',
    name: 'Copo 700ml Supremo Veg',
    size: '700ml',
    volume: '700 ml',
    price: 30.0,
    priceFormatted: 'R$ 30,00',
    description: 'Nossa criação mais espetacular: 700ml de camadas fartas de açaí puro, creme de avelã generoso, uvas frescas, leite em pó, paçoca e leite condensado.',
    ingredients: ['Açaí Veg Puro', 'Creme de Avelã', 'Uva Fresca Fatiada', 'Leite em Pó', 'Paçoca Artesanal', 'Leite Condensado'],
    image: '/assets/aistudio/copo_2_a47faa74.jpeg',
    badge: 'Super Gigante',
  },
];
