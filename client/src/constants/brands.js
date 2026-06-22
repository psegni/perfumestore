export const PERFUME_BRANDS = [
  'Christian Dior',
  'Dolce & Gabbana',
  'Hugo Boss',
  'Lattafa',
  'Chanel',
  'Versace',
  'Giorgio Armani',
  'YSL',
  'Tom Ford',
  'Gucci',
  'Calvin Klein',
  'Paco Rabanne',
  'Creed',
  'Carolina Herrera',
  'Montale',
  'Rasasi',
  'Other',
];

const LUXURY_BRANDS = new Set([
  'Christian Dior',
  'Chanel',
  'Tom Ford',
  'Creed',
  'Dolce & Gabbana',
  'Gucci',
]);

const MEN_BRANDS = new Set([
  'Hugo Boss',
  'Paco Rabanne',
  'Calvin Klein',
  'Giorgio Armani',
  'Versace',
]);

const WOMEN_BRANDS = new Set(['YSL', 'Carolina Herrera']);

export function getPerfumeCategory(brand) {
  if (LUXURY_BRANDS.has(brand)) return 'luxury';
  if (MEN_BRANDS.has(brand) && !WOMEN_BRANDS.has(brand)) return 'men';
  if (WOMEN_BRANDS.has(brand) && !MEN_BRANDS.has(brand)) return 'women';
  if (brand === 'Lattafa' || brand === 'Montale' || brand === 'Rasasi') return 'unisex';
  return 'unisex';
}
