// TRAFFIC — civilian cars on road loops, obeying the traffic lights, honking
// when blocked. Density and body mix change per district; cars stop and swerve
// when the player causes chaos nearby.
import { buildVehicleMesh } from './vehicles.js';
import { BLOCK_PITCH } from './roads.js';

const LOOPS = [];
for (let i = -5; i <= 5; i += 1) {
  const c = i * BLOCK_PITCH;
  LOOPS.push([[c - 6, -260], [c - 6, 260], [c + 6, 260], [c + 6, -260]]);
  LOOPS.push([[-260, c - 6], [260, c - 6], [260, c + 6], [-260, c + 6]]);
}

export function createTraffic(game) {
  const cars = [];
  const rng = game.rng;

  function spawnOne() {
    const loop = rng.pick(LOOPS);
    const type = rng.pick(['sedan', 'sedan', 'taxi', 'truck', 'sport']);
    const mesh = buildVehicleMesh(type);
    game.scene.add(mesh);
    const car = {
      type, mesh, loop, wp: rng.int(0, 3), x: loop[0][0], z: loop[0][1],
      speed: rng.range(7, 12), stopped: false, color: mesh.userData.type,
    };
    cars.push(car);
    return car;
  }

  function update(dt) {
    const target = game.state.wanted >= 3 ? 14 : 24;
    while (cars.length < target && cars.length < 26) spawnOne();
    for (const car of cars) {
      const [wx, wz] = car.loop[car.wp];
      const dx = wx - car.x;
      const dz = wz - car.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 4) {
        car.wp = (car.wp + 1) % car.loop.length;
        continue;
      }
      const pd = Math.hypot(game.player.x - car.x, game.player.z - car.z);
      const playerSpeed = Math.abs(game.state.speedKmh);
      car.stopped = pd < 9 && playerSpeed > 40 && game.state.inCar;
      if (car.stopped) continue;
      const heading = Math.atan2(dx, dz);
      car.x += Math.sin(heading) * car.speed * dt;
      car.z += Math.cos(heading) * car.speed * dt;
      car.mesh.position.set(car.x, 0, car.z);
      car.mesh.rotation.y = heading;
    }
  }

  game.trafficCars = cars;
  return { update, cars };
}
