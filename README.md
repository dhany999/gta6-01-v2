# VELA NEGRA — Puerto Cobalto

[![gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun)
[![rank](https://make.fun/badge/gta6-01/dhany999/gta6-01-v2/rank.svg)](https://make.fun)
[![reward](https://make.fun/badge/gta6-01/dhany999/gta6-01-v2/reward.svg)](https://make.fun)

An original open-world crime game for the make.fun **gta6-01** bounty ("Make GTA 6").
No Rockstar content: the city, names, characters, story, vehicles and art are all
invented for this game.

## The story

Teo Barros, 29, a former getaway driver, is done with that life — until his
19-year-old brother Dani borrows **$40,000** from Orlando Vasco, the polite owner
of a cold-storage company in Zona Puerto who never threatens anyone, only names
a date. Dani is held on Vasco's ship. Teo has until the tide to pay the debt,
steal cars, run jobs, and find the ledger with hundreds of names like Dani's.

## The city — Puerto Cobalto

Five districts with their own architecture and palette: colonial **Casco Viejo**,
industrial **Zona Puerto**, glass-towered **Centro Alba**, colourful **Barrio Sal**
and beachfront **Playa Brava**. Three named landmarks anchor the map: **Faro Alba**
(the lighthouse), **Jembatan Cobalto** (the cable bridge) and **Gran Muelle**
(the great pier). A full day-night cycle (~24 minutes) and dynamic rain turn the
same streets from golden hour to a neon-wet night.

## What is in the game

- **10 missions, 3 acts** — tailing, car chases, escort, warehouse infiltration,
  rooftop shootout, and the Gran Muelle finale — with briefings, dialogue and
  fail conditions
- **Two-way economy** — mission pay, street races, taxi fares and courier runs
  buy guns, ammo, armor, cars and garage mods; every dollar counts toward the
  $40,000 debt
- **6 vehicle types** — sedan, sport, bike, box truck, taxi, police cruiser —
  each with its own acceleration, grip and weight; visible damage, smoke, skid marks
- **Tiered police** — 1–5 wanted stars, cruiser pursuit, foot cops and arrests,
  **roadblocks + spike strips at 3 stars**, a **spotlight helicopter at 4–5 stars**,
  and a last-known-position search
- **3 weapons + armor** — pistol, SMG “Zumbido”, shotgun “Trueno”, bought ammo
- **Side activities** — 3 night street-race routes, taxi driving, timed courier runs
- **Garage customisation** — Cami Reyes's workshop: paint, wheels, spoiler,
  underglow, armour plating, saved per car
- **HUD v2** — money + debt, health + armor, stars, clock + weather, weapon + ammo,
  speed, district name, minimap with police search cones, mission tracker
- **Screens** — title, pause, full city map, mission briefing, gun shop, garage,
  game over; **save** via localStorage (safehouse sleep or pause menu)
- **Synthesised audio** — engine, gunshots, sirens, rain, cash chimes; no audio files

## Controls

| Key | Action |
|---|---|
| WASD / arrows | Walk / drive |
| Shift | Run |
| E | Enter–exit car, sleep at safehouse, open briefing |
| Mouse drag / wheel | Orbit camera / zoom, click to shoot on foot |
| 1 / 2 / 3 | Pistol / SMG / shotgun |
| Space | Handbrake |
| M | City map |
| G | Garage |
| B | Gun shop |
| P / Esc | Pause |
| H | Horn |

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: `game/index.html` opens in desktop Chrome
from any static server. Three.js is vendored under `game/vendor/`.

## Screenshots

Four programmed shots (fixed seed, frozen clock) via `game/src/capture.js`:

1. `1-golden-hour-chase.jpg` — 17:40, 4 stars, roadblock + helicopter, Centro Alba
2. `2-rain-neon-shootout.jpg` — 21:20, heavy rain, SMG firefight, Barrio Sal
3. `3-cami-garage.jpg` — 11:10, customised sport car on the lift, Casco Viejo
4. `4-cobalt-bridge-dusk.jpg` — 18:55, race start on Jembatan Cobalto at blue hour

## License

MIT — see [LICENSE](LICENSE).
