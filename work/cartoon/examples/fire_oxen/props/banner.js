// fire_oxen/props/banner.js: the Yan camp banner on its pole; it FALLS when the camp collapses (line 9, no gore:
// the banner falls, the commander falls). Origin = the pole base at ground centre.
// opts: fall (0 standing .. 1 fallen flat, eased in update), h (pole 4.2), cloth colour.
// userData.update(obj, opts) rotates the pole group about its base; the cloth lags behind the pole.
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// Dark camp cloth with a bold gold emblem (a ringed sun-disc over crossed strokes) and a gold border —
// print drawn in code, readable at distance, no lettering to fake.
function bannerTex() {
  return canvasTex(256, 384, (c, w, h) => {
    c.fillStyle = '#2e2a3a'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,.25)'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 6, h);   // cloth weave
    c.strokeStyle = '#c9a24a'; c.lineWidth = 8; c.strokeRect(10, 10, w - 20, h - 20);
    c.lineWidth = 3; c.strokeRect(24, 24, w - 48, h - 48);
    const cx = w / 2, cy = h * .34;
    c.fillStyle = '#c9a24a'; c.beginPath(); c.arc(cx, cy, 42, 0, 7); c.fill();                  // sun disc
    c.strokeStyle = '#3a2a33'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, 42, 0, 7); c.stroke();
    c.fillStyle = '#2e2a3a'; c.beginPath(); c.arc(cx, cy, 16, 0, 7); c.fill();
    c.strokeStyle = '#c9a24a'; c.lineWidth = 10; c.lineCap = 'round';                           // crossed strokes under the disc
    c.beginPath(); c.moveTo(cx - 52, cy + 84); c.lineTo(cx + 52, cy + 150); c.stroke();
    c.beginPath(); c.moveTo(cx + 52, cy + 84); c.lineTo(cx - 52, cy + 150); c.stroke();
    c.fillStyle = '#c9a24a';                                                                    // swallow-tail notch marks
    c.beginPath(); c.moveTo(w * .3, h - 24); c.lineTo(w * .5, h - 64); c.lineTo(w * .7, h - 24); c.closePath(); c.fill();
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.banner';
  const H = o.h ?? 4.2;
  const base = part(new THREE.CylinderGeometry(.34, .42, .22, 12), flat('#4a4238', '#332c24'), .014);
  base.position.y = .11; g.add(base);                                  // stone socket the pole stands in
  const poleG = new THREE.Group(); poleG.name = 'bannerPole'; poleG.position.y = .18; g.add(poleG);
  const pole = part(new THREE.CylinderGeometry(.05, .065, H, 10), flat(o.pole ?? '#5e4630', '#42301f'), .014);
  pole.position.y = H / 2; poleG.add(pole);
  const finial = part(new THREE.SphereGeometry(.09, 10, 8), flat('#c9a24a', '#9a7d3c'), .01);
  finial.position.y = H + .08; poleG.add(finial);
  const cross = part(new THREE.CylinderGeometry(.035, .035, 1.5, 8), flat('#5e4630', '#42301f'), .01);
  cross.rotation.z = Math.PI / 2; cross.position.y = H - .18; poleG.add(cross);
  const clothG = new THREE.Group(); clothG.name = 'bannerCloth'; clothG.position.y = H - .2; poleG.add(clothG);
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.1), basic('#ffffff', { map: bannerTex(), double: true }));
  cloth.position.y = -1.06; clothG.add(cloth);
  for (const sx of [-1, 1]) {                                          // hanging ties
    const tie = part(new THREE.BoxGeometry(.04, .16, .04), flat('#c9a24a'), .006);
    tie.position.set(sx * .62, -.06, 0); clothG.add(tie);
  }
  g.userData.parts = { poleG, clothG, H };
  g.userData.update = (obj, opts) => updateBanner(obj, opts);
  updateBanner(g, o);
  return finish(g, { top: [0, H + .2, 0], cloth: [0, H - 1.2, 0] });
}

export function updateBanner(obj, o = {}) {
  const P = obj.userData.parts; if (!P) return;
  const f = Math.max(0, Math.min(1, +o.fall || 0));
  const e = f * f * (3 - 2 * f);                                       // smoothstep: slow tip, fast drop, settle
  P.poleG.rotation.x = e * 1.52;                                       // falls forward (+Z) to flat
  P.poleG.position.y = .18 - e * .1;
  P.clothG.rotation.x = -e * .55;                                      // cloth lags, folds over the pole as it lands
  P.clothG.rotation.z = e * .18;
}
