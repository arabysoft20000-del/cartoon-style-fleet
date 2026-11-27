// fire_oxen/props/torch.js: a hand torch for lighting the straw bundles. Origin = the grip (mid-handle), flame +Y.
// opts: lit (0/1, default 1), phase (0..1 flame flicker), handle colour. userData.update(obj, opts) re-poses the flame.
import { THREE, flat, part, finish } from '../../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.torch';
  const handle = part(new THREE.CylinderGeometry(.035, .045, .85, 10), flat(o.handle ?? '#5e4630', '#42301f'), .014);
  handle.position.y = -.1; g.add(handle);
  const wrap = part(new THREE.CylinderGeometry(.062, .052, .3, 10), flat('#2e2620', '#1e1812'), .012);
  wrap.position.y = .42; g.add(wrap);                                   // pitch-soaked rag head
  for (const y of [.32, .44, .54]) {                                    // binding rings
    const r = part(new THREE.TorusGeometry(.06, .012, 6, 14), flat('#7a5a33'), .006);
    r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r);
  }
  const flame = new THREE.Group(); flame.name = 'flame'; flame.position.y = .56; g.add(flame);
  const outer = new THREE.Mesh(new THREE.ConeGeometry(.11, .42, 10),
    new THREE.MeshBasicMaterial({ color: 0xff7a26, transparent: true, opacity: .88, depthWrite: false }));
  outer.position.y = .18; flame.add(outer);
  const inner = new THREE.Mesh(new THREE.ConeGeometry(.06, .28, 10),
    new THREE.MeshBasicMaterial({ color: 0xffd23c, transparent: true, opacity: .95, depthWrite: false }));
  inner.position.y = .12; flame.add(inner);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 9),
    new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.y = .16; flame.add(glow);
  g.userData.parts = { flame, glow };
  g.userData.update = (obj, opts) => updateTorch(obj, opts);
  updateTorch(g, o);
  return finish(g, { flame: [0, .8, 0], head: [0, .55, 0] });
}

export function updateTorch(obj, o = {}) {
  const P = obj.userData.parts; if (!P) return;
  const lit = o.lit === false || o.lit === 0 ? 0 : 1;
  const phase = ((+o.phase || 0) % 1 + 1) % 1;
  P.flame.visible = lit > 0;
  if (lit) {
    const s = .9 + .18 * Math.sin(phase * Math.PI * 6) + .07 * Math.sin(phase * Math.PI * 14 + 1.2);
    P.flame.scale.set(2 - s * .55, s, 2 - s * .55);
    P.flame.rotation.y = phase * Math.PI * 4;
    P.glow.material.opacity = .12 + .08 * Math.sin(phase * Math.PI * 6 + .5);
  }
}
