// CITY-LIGHTING — headlights, brake lights, neon glow and the light budget:
// one shadow sun, emissive windows, lamp glows, and two real headlight spots
// on the player's vehicle. Nothing else gets a live light.
import * as THREE from 'three';

export function createCityLighting(game) {
  const head = new THREE.SpotLight(0xfff2cf, 0, 55, 0.55, 0.4, 1.2);
  head.castShadow = false;
  game.scene.add(head);
  game.scene.add(head.target);

  function update() {
    const v = game.vehicle;
    const night = game.isNight || game.state.rainAmount > 0.4;
    if (v && v.mesh) {
      head.intensity = night ? 260 : 0;
      const forward = new THREE.Vector3(Math.sin(v.heading), 0, Math.cos(v.heading));
      head.position.copy(v.mesh.position).add(new THREE.Vector3(0, 1.4, 0));
      head.target.position.copy(v.mesh.position).add(forward.clone().multiplyScalar(24));
      head.target.position.y = 0.4;
    } else {
      head.intensity = 0;
    }
    for (const sign of game.neonSigns) {
      sign.material.opacity = 1;
      sign.visible = true;
    }
  }

  return { update, head };
}
