const PALETTE = [
  '#F4D8CD',
  '#D8E2DC',
  '#FFE5D9',
  '#E8E1EF',
  '#DDEBF7',
  '#FDF1C8',
];

export const createPlaceholderImage = (seed: number, label = 'DearObjet') => {
  const color = PALETTE[seed % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="${color}"/><text x="300" y="310" font-family="sans-serif" font-size="40" text-anchor="middle" fill="#555555">${label}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
