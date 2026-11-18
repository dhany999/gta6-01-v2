// STATE — the single game state every module reads and writes. Nothing else holds
// the truth about money, health, wanted stars, the clock, or the story.
import { TUNING } from './tuning.js';

export function createState() {
  return {
    screen: 'title',
    money: TUNING.startMoney,
    debtPaid: 0,
    health: TUNING.playerHealth,
    armor: 0,
    wanted: 0,
    heat: 0,
    clockMinutes: TUNING.startClockMinutes,
    weather: 'clear',
    rainAmount: 0,
    district: 'Centro Alba',
    missionIndex: 0,
    missionDone: [],
    missionStage: 'idle',
    objective: 'Buka briefing misi pertama — tekan Enter di menu.',
    waypoint: null,
    timer: 0,
    speedKmh: 0,
    inCar: false,
    vehicleType: null,
    vehicleDamage: 0,
    weapon: 'pistol',
    ammo: { pistol: 48, smg: 0, shotgun: 0 },
    ownedWeapons: ['pistol'],
    ownedCars: ['sedan'],
    garageMods: {},
    activity: null,
    raceCheckpoint: 0,
    taxiFare: 0,
    courierLeft: 0,
    kills: 0,
    arrests: 0,
    playTime: 0,
    muted: false,
    radio: 'Radio Alba 94.1',
  };
}

export function debtLeft(state) {
  return Math.max(0, TUNING.debtTotal - state.debtPaid);
}

export function clockText(state) {
  const h = Math.floor(state.clockMinutes / 60) % 24;
  const m = Math.floor(state.clockMinutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isNight(state) {
  const h = state.clockMinutes / 60;
  return h < 6 || h >= 18.5;
}
