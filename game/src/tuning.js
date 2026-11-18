// TUNING — every balance number in one named table, so the outline sells the game.
// Prices in dollars, speeds in km/h, times in seconds, distances in metres.
export const TUNING = {
  debtTotal: 40000,
  dayMinutes: 24,
  startMoney: 850,
  startClockMinutes: 17 * 60 + 40,
  playerWalk: 5.2,
  playerRun: 8.6,
  playerHealth: 100,
  vehicleTopSpeed: { sedan: 132, sport: 198, bike: 176, truck: 96, taxi: 138, cruiser: 172 },
  vehicleAccel: { sedan: 14, sport: 22, bike: 26, truck: 9, taxi: 15, cruiser: 20 },
  vehicleGrip: { sedan: 1.0, sport: 0.86, bike: 0.72, truck: 1.15, taxi: 0.95, cruiser: 1.02 },
  rainGrip: 0.78,
  missionPay: [600, 900, 1200, 1500, 1800, 2200, 2600, 3200, 3800, 4500],
  racePay: 1500,
  taxiPay: 220,
  courierPay: 350,
  wantedDecay: 0.045,
  wantedHeat: { crime: 0.55, shoot: 0.9, kill: 1.4, steal: 0.35 },
  heliAtStars: 4,
  roadblockAtStars: 3,
  footCopsAtStars: 2,
  maxCruisers: 5,
  maxTraffic: 26,
  maxPeds: 34,
  safehouseHeal: 100,
};

export const DISTRICTS = [
  { id: 'casco', name: 'Casco Viejo', bounds: [-260, -260, -40, 40], palette: ['#e8b64c', '#d97b4f', '#f2e3c6', '#c65b4e'], height: [8, 16], density: 0.85, style: 'colonial' },
  { id: 'puerto', name: 'Zona Puerto', bounds: [40, -260, 260, -40], palette: ['#7a8894', '#5d6b78', '#a34d2d', '#3f4a55'], height: [10, 26], density: 0.6, style: 'industrial' },
  { id: 'centro', name: 'Centro Alba', bounds: [-40, -40, 90, 90], palette: ['#9fc3e0', '#6f9cc0', '#dfe9f2', '#4a6b8a'], height: [22, 58], density: 0.9, style: 'glass' },
  { id: 'sal', name: 'Barrio Sal', bounds: [-260, 40, -40, 260], palette: ['#e2607a', '#f2a541', '#4fae8d', '#e8e0b0'], height: [6, 13], density: 0.95, style: 'colorful' },
  { id: 'brava', name: 'Playa Brava', bounds: [90, 90, 260, 260], palette: ['#f7ead0', '#e8c88a', '#ffffff', '#d98a5f'], height: [8, 22], density: 0.55, style: 'beach' },
];

export const LANDMARKS = [
  { id: 'faro', name: 'Faro Alba', x: -248, z: 248, kind: 'lighthouse' },
  { id: 'puente', name: 'Jembatan Cobalto', x: 0, z: -262, kind: 'bridge' },
  { id: 'muelle', name: 'Gran Muelle', x: 238, z: -238, kind: 'port' },
];

export const VEHICLE_TYPES = {
  sedan: { label: 'Sedan Sipil', price: 2200, seats: 4, color: 0x8a97a5, body: 'box' },
  sport: { label: 'Sport “Vela GT”', price: 6800, seats: 2, color: 0xc2242a, body: 'low' },
  bike: { label: 'Motor “Brisa 400”', price: 1900, seats: 2, color: 0x1f6fb2, body: 'bike' },
  truck: { label: 'Truk Boks', price: 3400, seats: 2, color: 0xd8d3c3, body: 'truck' },
  taxi: { label: 'Taksi Kuning', price: 2600, seats: 4, color: 0xf2c200, body: 'box' },
  cruiser: { label: 'Cruiser Polisi', price: 0, seats: 4, color: 0x1c2f4a, body: 'box' },
};

export const WEAPONS = {
  pistol: { label: 'Pistol', icon: '🔫', price: 0, ammoPrice: 25, damage: 34, rate: 0.32, spread: 0.012, range: 70, mag: 12, auto: false },
  smg: { label: 'SMG “Zumbido”', icon: '🔫', price: 1200, ammoPrice: 60, damage: 16, rate: 0.09, spread: 0.05, range: 55, mag: 30, auto: true },
  shotgun: { label: 'Shotgun “Trueno”', icon: '💥', price: 1800, ammoPrice: 80, damage: 22, rate: 0.85, spread: 0.12, range: 26, mag: 6, auto: false, pellets: 6 },
};

export const GARAGE_MODS = [
  { id: 'paint', label: 'Cat dua warna “Negra”', price: 800, desc: 'Hitam + merah anggur, sulit dikenali polisi.' },
  { id: 'wheels', label: 'Velg gelap + ban lebar', price: 650, desc: 'Cengkeraman +8%, tampilan garang.' },
  { id: 'spoiler', label: 'Spoiler karbon', price: 500, desc: 'Stabil di kecepatan tinggi.' },
  { id: 'underglow', label: 'Lampu bawah ungu', price: 400, desc: 'Neon bawah bodi — ciri khas Vela Negra.' },
  { id: 'armor', label: 'Pelat bodi lapis', price: 1500, desc: 'Kendaraan tahan tabrakan +40%.' },
];

export const SHOP_ITEMS = [
  { id: 'smg', label: 'SMG “Zumbido”', price: 1200, desc: 'Tembakan cepat, 30 peluru per mag.' },
  { id: 'shotgun', label: 'Shotgun “Trueno”', price: 1800, desc: 'Jarak dekat, hentakan besar, 6 peluru.' },
  { id: 'ammo-smg', label: 'Amunisi SMG ×60', price: 60, desc: 'Isi ulang 60 peluru SMG.' },
  { id: 'ammo-shotgun', label: 'Amunisi Shotgun ×24', price: 80, desc: 'Isi ulang 24 peluru shotgun.' },
  { id: 'ammo-pistol', label: 'Amunisi Pistol ×24', price: 25, desc: 'Isi ulang 24 peluru pistol.' },
  { id: 'armor', label: 'Rompi antipeluru', price: 450, desc: 'Armor penuh 100 — menyerap sebagian kerusakan.' },
];

export const SKY_STOPS = [
  { t: 0, sky: 0x0a1026, fog: 0x0a1026, sun: 0x223366, amb: 0x2a3550 },
  { t: 360, sky: 0x1c2a52, fog: 0x1c2a52, sun: 0x3a4a7a, amb: 0x323e5c },
  { t: 420, sky: 0xff9a52, fog: 0xe88a5a, sun: 0xffb36b, amb: 0x6b5a52 },
  { t: 540, sky: 0x7ec0ee, fog: 0x9fd0f0, sun: 0xfff2cf, amb: 0x8a97a8 },
  { t: 780, sky: 0x87ceeb, fog: 0xa8d8f0, sun: 0xffffff, amb: 0x9aa5b0 },
  { t: 1020, sky: 0x9fd0f0, fog: 0xa8d8f0, sun: 0xffe9a8, amb: 0x8a97a8 },
  { t: 1060, sky: 0xff7e3d, fog: 0xe0703d, sun: 0xff8c3d, amb: 0x6b5248 },
  { t: 1115, sky: 0x2a2a5e, fog: 0x2a2a5e, sun: 0x4a3a7a, amb: 0x3a3a55 },
  { t: 1275, sky: 0x1a2350, fog: 0x1a2350, sun: 0x5a6ab0, amb: 0x2f3a58 },
  { t: 1440, sky: 0x0a1026, fog: 0x0a1026, sun: 0x223366, amb: 0x2a3550 },
];
