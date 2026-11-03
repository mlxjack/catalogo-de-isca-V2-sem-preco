// Black November 2026 (01/11 a 30/11) -- versao SEM precos: so mostra os selos de % e as
// cores fora de padrao. A janela de datas vive em public/black-november/bn.js, que expoe
// window.BLACK_NOVEMBER_ACTIVE (mesma fonte da verdade do tema preto e do carrossel).
//  - 30% OFF: pares isca+cor da planilha de estoque (blackNovember30.js)
//  - 12% OFF: Vermelho Holografico, Veu da Noite, Pastel e Preto Brilhante
// Se o par esta nas duas regras, vale o de 30%.
import { BLACK_NOVEMBER_30 } from './blackNovember30';

const normalize = (str) =>
  (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

const COLORS_12 = new Set(['Vermelho Holográfico', 'Véu da Noite', 'Pastel', 'Chá/Pastel', 'Preto Brilhante'].map(normalize));
const BN_30_NORM = Object.fromEntries(
  Object.entries(BLACK_NOVEMBER_30).map(([h, cs]) => [h, new Set(cs.map(normalize))])
);
// As 13 cores padrao do seletor (ver csvParser.js); as demais da lista de 30% sao "fora de padrao".
const STANDARD_COLORS = new Set(
  ['Branco Perola', 'Glow', 'Rapadura', 'Roxo Estrelar', 'Vermelho Holográfico', 'Véu Da Noite', 'Amarelo Neon',
    'Laranja Neon', 'Preto Brilhante', 'Capim Rubi', 'Verde Neon', 'Pastel', 'Chá', 'Chá/Pastel'].map(normalize)
);

export const isBlackNovemberActive = () =>
  typeof window !== 'undefined' && window.BLACK_NOVEMBER_ACTIVE === true;

// 0, 12 ou 30 (percentual) para a cor de um produto.
export const getColorDiscountPct = (colorName, productId) => {
  if (!isBlackNovemberActive()) return 0;
  const n = normalize(colorName);
  // 'Chá/Pastel' (cor unificada na loja) herda a regra de 'Chá' e de 'Pastel'.
  const keys = n === 'chapastel' ? ['chapastel', 'pastel', 'cha'] : [n];
  if (productId && BN_30_NORM[productId] && keys.some((k) => BN_30_NORM[productId].has(k))) return 30;
  return COLORS_12.has(n) ? 12 : 0;
};

export const getProductMaxDiscountPct = (productId, colors = []) => {
  if (!isBlackNovemberActive()) return 0;
  let best = BN_30_NORM[productId] ? 30 : 0;
  colors.forEach((c) => { best = Math.max(best, getColorDiscountPct(c, productId)); });
  return best;
};

export const getOffPatternColors = (productId) =>
  !isBlackNovemberActive() || !BLACK_NOVEMBER_30[productId]
    ? []
    : BLACK_NOVEMBER_30[productId].filter((c) => !STANDARD_COLORS.has(normalize(c)));
