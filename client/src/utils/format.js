export function formatPrice(amount, lang = 'en', currency = 'ETB') {
  const locale = lang === 'am' ? 'am-ET' : 'en-ET';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const PAYMENT_METHOD_IDS = [
  { id: 'telebirr', logo: '/payment/telebirr.png' },
  { id: 'cbe', logo: '/payment/cbe.png' },
  { id: 'awash', logo: '/payment/awash.png' },
];

export function getPaymentMethods(t) {
  return PAYMENT_METHOD_IDS.map((p) => ({
    ...p,
    name: t(`payment.${p.id}.name`),
    description: t(`payment.${p.id}.desc`),
  }));
}
