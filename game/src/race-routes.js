// RACE-ROUTES — the three night street-race routes: start line, checkpoints and
// a rival count. Each route crosses at least two districts so the race shows
// the city, not one empty street.
export const RACE_ROUTES = [
  {
    id: 'puente',
    name: 'Jembatan Cobalto',
    start: [0, -240],
    checkpoints: [[0, -180], [60, -120], [120, -40], [60, 40], [0, 100]],
    rivals: 3,
    desc: 'Lurus panjang di atas teluk — kecepatan murni.',
  },
  {
    id: 'casco',
    name: 'Gang Casco Viejo',
    start: [-200, -20],
    checkpoints: [[-160, 0], [-120, -60], [-80, -20], [-60, 40], [-100, 60]],
    rivals: 3,
    desc: 'Gang sempit kolonial — rem adalah temanmu.',
  },
  {
    id: 'brava',
    name: 'Pantai Brava',
    start: [120, 200],
    checkpoints: [[160, 160], [200, 120], [220, 180], [160, 220], [120, 200]],
    rivals: 2,
    desc: 'Pesisir senja — licin saat hujan, indah saat menang.',
  },
];

export function routeById(id) {
  return RACE_ROUTES.find((r) => r.id === id) || RACE_ROUTES[0];
}
