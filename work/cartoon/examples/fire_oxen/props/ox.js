// fire_oxen/props/ox.js: THE OX (non-human actor, topics.md §6: built as a prop, acts as a pure function of opts).
// Origin = ground centre under the body, facing +Z. Units D (1 = a head). Stocky cartoon proportions:
// nose-to-rump ~3.2 D (torso 2.3 D + head), shoulder height ~2.2 D, head ~1.05 D wide for the opening close-up. The set instantiates the hero ox + herd (~28) and animates
// each per frame with userData.update(obj, opts) — legs swing, head turns, flame flickers, all from opts alone.
// opts: cloth (red silk with a PAINTED dragon — canvas texture, flat paint on cloth, NEVER a real dragon),
//       blades (daggers tied to the horns), straw (oil-soaked bundle on the tail), fire (0..1 or true: flame
//       cone + glow at the bundle, flicker from phase; also lights the warm eye-glint), phase (0..1 gait cycle),
//       gait (0 idle stand, 1 run), headYaw (rad, + = his left), graze (0..1 head down), eyes ('wide'|'rest'|'closed'),
//       hide ('#hex' coat colour, for herd variety).
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

const TAU = Math.PI * 2;
const clamp01 = v => Math.max(0, Math.min(1, v));

// The painted dragon: flat paint on red silk, drawn in code. Gold body with ink outline, scale arcs,
// legs with claws, whiskered head, dorsal fins, cloud swirls — a motif a painter puts on cloth, not a creature.
function dragonTex() {
  return canvasTex(512, 320, (c, w, h) => {
    c.fillStyle = '#b02020'; c.fillRect(0, 0, w, h);                       // red silk
    c.fillStyle = 'rgba(120,10,10,.35)';                                   // silk weave + fold shading
    for (let x = 0; x < w; x += 14) c.fillRect(x, 0, 5, h);
    c.fillStyle = 'rgba(255,120,80,.10)';
    for (let x = 7; x < w; x += 56) c.fillRect(x, 0, 18, h);
    c.strokeStyle = '#d9a83c'; c.lineWidth = 7; c.strokeRect(10, 10, w - 20, h - 20);   // gold double border
    c.lineWidth = 2.5; c.strokeRect(24, 24, w - 48, h - 48);
    const INK = '#3a2a33', GOLD = '#d9a83c', PALE = '#f2d488';
    // cloud swirls (flat ink + gold spirals in the corners)
    const cloud = (x, y, s) => { c.strokeStyle = INK; c.lineWidth = 5; c.beginPath(); c.arc(x, y, s, 0, 5.2); c.stroke();
      c.strokeStyle = GOLD; c.lineWidth = 3; c.beginPath(); c.arc(x, y, s * .55, .6, 5.8); c.stroke(); };
    cloud(w * .1, h * .16, 15); cloud(w * .9, h * .84, 15); cloud(w * .88, h * .14, 11); cloud(w * .12, h * .86, 11);
    // body: an S-curve, ink stroke under gold stroke (paint, not shading)
    const body = () => { c.beginPath(); c.moveTo(w * .16, h * .62);
      c.bezierCurveTo(w * .3, h * .3, w * .42, h * .78, w * .56, h * .52);
      c.bezierCurveTo(w * .66, h * .32, w * .74, h * .4, w * .8, h * .34); };
    c.lineCap = 'round';
    c.strokeStyle = INK; c.lineWidth = 40; body(); c.stroke();
    c.strokeStyle = GOLD; c.lineWidth = 30; body(); c.stroke();
    c.strokeStyle = PALE; c.lineWidth = 9;                                  // belly line
    c.beginPath(); c.moveTo(w * .18, h * .66); c.bezierCurveTo(w * .32, h * .36, w * .44, h * .8, w * .58, h * .56); c.stroke();
    // scale arcs along the back
    c.strokeStyle = INK; c.lineWidth = 3;
    const scales = [[.22, .52], [.3, .42], [.38, .5], [.46, .62], [.54, .56], [.62, .44], [.7, .38]];
    for (const [sx, sy] of scales) { c.beginPath(); c.arc(w * sx, h * sy, 9, .3, 2.8); c.stroke(); }
    // dorsal fins
    c.fillStyle = '#8a2a1e'; c.strokeStyle = INK; c.lineWidth = 2.5;
    for (const [fx, fy] of [[.26, .4], [.38, .44], [.5, .56], [.62, .4], [.72, .3]]) {
      c.beginPath(); c.moveTo(w * fx - 9, h * fy); c.lineTo(w * fx + 2, h * fy - 20); c.lineTo(w * fx + 11, h * fy - 2); c.closePath(); c.fill(); c.stroke(); }
    // legs with claws
    c.strokeStyle = INK; c.lineWidth = 11;
    const leg = (x, y, dx, dy) => { c.beginPath(); c.moveTo(w * x, h * y); c.lineTo(w * (x + dx), h * (y + dy)); c.stroke();
      c.lineWidth = 4; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(w * (x + dx), h * (y + dy)); c.lineTo(w * (x + dx) + i * 7, h * (y + dy) + 10); c.stroke(); } c.lineWidth = 11; };
    leg(.3, .58, -.02, .14); leg(.48, .66, .01, .13); leg(.62, .5, .03, .12); leg(.24, .5, -.04, .1);
    // tail flame fin (left end)
    c.fillStyle = '#8a2a1e';
    c.beginPath(); c.moveTo(w * .16, h * .62); c.lineTo(w * .07, h * .5); c.lineTo(w * .1, h * .66); c.lineTo(w * .06, h * .76); c.lineTo(w * .15, h * .74); c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke();
    // head (right end): skull, snout, horn, whiskers, eye, jaw
    const hx = w * .83, hy = h * .32;
    c.fillStyle = GOLD; c.strokeStyle = INK; c.lineWidth = 4;
    c.beginPath(); c.arc(hx, hy, 24, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(hx + 16, hy - 6); c.lineTo(hx + 44, hy + 2); c.lineTo(hx + 18, hy + 14); c.closePath(); c.fill(); c.stroke();  // snout
    c.beginPath(); c.moveTo(hx - 6, hy - 20); c.lineTo(hx - 20, hy - 42); c.lineTo(hx + 6, hy - 24); c.closePath(); c.fill(); c.stroke(); // horn
    c.fillStyle = INK; c.beginPath(); c.arc(hx + 6, hy - 6, 4.5, 0, 7); c.fill();                                                       // eye
    c.strokeStyle = INK; c.lineWidth = 3;
    c.beginPath(); c.moveTo(hx + 34, hy + 4); c.quadraticCurveTo(hx + 58, hy - 6, hx + 66, hy + 8); c.stroke();                           // whisker
    c.beginPath(); c.moveTo(hx + 32, hy + 10); c.quadraticCurveTo(hx + 52, hy + 22, hx + 60, hy + 16); c.stroke();
    c.beginPath(); c.moveTo(hx + 8, hy + 16); c.lineTo(hx + 30, hy + 20); c.stroke();                                                     // jaw
  });
}

function flameGroup(scale = 1) {
  const g = new THREE.Group(); g.name = 'flame';
  const outer = new THREE.Mesh(new THREE.ConeGeometry(.17 * scale, .58 * scale, 10),
    new THREE.MeshBasicMaterial({ color: 0xff7a26, transparent: true, opacity: .88, depthWrite: false }));
  outer.position.y = .26 * scale; g.add(outer);
  const inner = new THREE.Mesh(new THREE.ConeGeometry(.095 * scale, .4 * scale, 10),
    new THREE.MeshBasicMaterial({ color: 0xffd23c, transparent: true, opacity: .95, depthWrite: false }));
  inner.position.y = .18 * scale; g.add(inner);
  const core = new THREE.Mesh(new THREE.ConeGeometry(.045 * scale, .22 * scale, 8),
    new THREE.MeshBasicMaterial({ color: 0xfff3b0, depthWrite: false }));
  core.position.y = .1 * scale; g.add(core);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.34 * scale, 12, 9),
    new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.y = .22 * scale; g.add(glow);
  g.userData.parts = { outer, inner, core, glow };
  return g;
}

function dagger() {
  const g = new THREE.Group(); g.name = 'dagger';
  const blade = part(new THREE.ConeGeometry(.05, .22, 8), flat('#c8ccd2', '#8f959e'), .01);
  blade.scale.z = .35; blade.position.y = .14; g.add(blade);                    // flattened leaf blade, +Y
  const guard = part(new THREE.BoxGeometry(.16, .035, .06), flat('#8a6a2a'), 0); guard.position.y = .02; g.add(guard);
  const grip = part(new THREE.CylinderGeometry(.028, .03, .16, 8), flat('#4a3826'), 0); grip.position.y = -.08; g.add(grip);
  const wrap = part(new THREE.TorusGeometry(.055, .018, 6, 12), flat('#7a5a33'), 0);  // rope tying it to the horn
  wrap.rotation.x = Math.PI / 2; wrap.position.y = -.14; g.add(wrap);
  return g;
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.ox';
  const hide = flat(o.hide ?? '#6b5847', o.hideDark ?? '#4c3e32');
  const hidePale = flat('#9a8874', '#74624e');
  const hornM = flat('#d8cbb0', '#a89a7e');
  const hoofM = flat('#33291f', '#241c14');
  const P = {};   // animated parts, read by update()

  // ---- body (bobbed/pitched as one group in update) ----
  const bodyG = new THREE.Group(); bodyG.name = 'oxBody'; g.add(bodyG); P.bodyG = bodyG;
  const torso = part(new THREE.SphereGeometry(1, 14, 10), hide, .022);
  torso.scale.set(.62, .6, 1.15); torso.position.set(0, 1.62, 0); bodyG.add(torso);
  const hump = part(new THREE.SphereGeometry(1, 12, 9), hide, .02);
  hump.scale.set(.5, .34, .5); hump.position.set(0, 1.92, .62); bodyG.add(hump);       // shoulder hump -> top ~2.26, under the cloth
  const neck = part(new THREE.CylinderGeometry(.34, .44, .7, 12), hide, .02);
  neck.position.set(0, 1.86, .94); neck.rotation.x = .5; bodyG.add(neck);
  const dewlap = part(new THREE.SphereGeometry(1, 10, 8), hidePale, .015);
  dewlap.scale.set(.3, .42, .45); dewlap.position.set(0, 1.28, .82); bodyG.add(dewlap);

  // ---- painted-dragon cloth draped over the back (sides carry the motif) ----
  const clothG = new THREE.Group(); clothG.name = 'oxCloth'; bodyG.add(clothG); P.clothG = clothG;
  const dragon = dragonTex();
  for (const sx of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.PlaneGeometry(1.9, .98), basic('#ffffff', { map: dragon, double: true }));
    side.position.set(sx * .62, 1.78, -.02); side.rotation.y = sx * Math.PI / 2; clothG.add(side);
    const hem = part(new THREE.BoxGeometry(.03, .06, 1.9), flat('#8a1a1a'), 0);
    hem.position.set(sx * .63, 1.3, -.02); clothG.add(hem);
  }
  const top = part(new THREE.BoxGeometry(1.26, .05, 1.9), flat('#b02020', '#7d1414'), .012);
  top.position.set(0, 2.28, -.02); clothG.add(top);
  for (const sx of [-1, 1]) {  // tie straps under the belly
    const strap = part(new THREE.BoxGeometry(.05, .5, .1), flat('#7a5a33'), .008);
    strap.position.set(sx * .55, 1.05, .45); clothG.add(strap);
  }

  // ---- head (pivot at the neck joint; update turns/pitches it) ----
  const headG = new THREE.Group(); headG.name = 'oxHead'; headG.position.set(0, 1.95, 1.0); bodyG.add(headG); P.headG = headG;
  const skull = part(new THREE.SphereGeometry(1, 14, 10), hide, .022);
  skull.scale.set(.52, .5, .56); skull.position.set(0, .04, .34); headG.add(skull);
  const forehead = part(new THREE.SphereGeometry(1, 12, 9), hide, .018);
  forehead.scale.set(.44, .3, .3); forehead.position.set(0, .3, .42); headG.add(forehead);
  const muzzle = part(new THREE.SphereGeometry(1, 14, 10), hidePale, .02);
  muzzle.scale.set(.4, .31, .38); muzzle.position.set(0, -.2, .78); headG.add(muzzle);
  const noseBand = part(new THREE.SphereGeometry(1, 12, 9), flat('#7a6a58', '#5a4c3e'), .015);
  noseBand.scale.set(.34, .2, .16); noseBand.position.set(0, -.16, 1.08); headG.add(noseBand);
  for (const sx of [-1, 1]) {  // nostrils (dark discs on the muzzle front)
    const n = new THREE.Mesh(new THREE.CircleGeometry(.045, 10), basic('#2a2019'));
    n.position.set(sx * .14, -.14, 1.22); n.rotation.x = -.25; headG.add(n);
  }
  const mouth = part(new THREE.BoxGeometry(.3, .03, .03), flat('#3a2e22'), 0);
  mouth.position.set(0, -.42, .95); headG.add(mouth);
  // ears (drooping, flattened)
  P.ears = [];
  for (const sx of [-1, 1]) {
    const ear = part(new THREE.SphereGeometry(1, 10, 8), hide, .015);
    ear.scale.set(.3, .12, .18); ear.position.set(sx * .58, .16, .3); ear.rotation.z = sx * -.5; ear.rotation.y = sx * .3;
    headG.add(ear); P.ears.push(ear);
    const innerEar = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), basic('#8a7460'));
    innerEar.scale.set(.2, .07, .12); innerEar.position.set(sx * .6, .17, .36); innerEar.rotation.z = sx * -.5; headG.add(innerEar);
  }
  // horns: two cone segments each, curving out then up; a dagger tied at the bend when opts.blades
  P.bladesG = new THREE.Group(); P.bladesG.name = 'oxBlades'; headG.add(P.bladesG);
  for (const sx of [-1, 1]) {
    const h1 = part(new THREE.ConeGeometry(.075, .5, 10), hornM, .012);
    h1.position.set(sx * .52, .44, .3); h1.rotation.z = sx * -1.15; headG.add(h1);
    const h2 = part(new THREE.ConeGeometry(.045, .42, 10), hornM, .01);
    h2.position.set(sx * .74, .62, .3); h2.rotation.z = sx * -.35; headG.add(h2);
    const d = dagger(); d.position.set(sx * .7, .5, .3); d.rotation.z = sx * -.35; P.bladesG.add(d);
  }
  // eyes: big white + pupil + white highlight + warm fire glint (the opening frame is this eye)
  P.eyes = [];
  for (const sx of [-1, 1]) {
    const eyeG = new THREE.Group(); eyeG.position.set(sx * .36, .16, .72); eyeG.rotation.y = sx * .38; headG.add(eyeG);
    const white = part(new THREE.SphereGeometry(.115, 14, 10), basic('#f6f2ea'), .012);
    white.scale.set(1, 1.08, .55); eyeG.add(white);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(.056, 12, 9), basic('#241a12'));
    pupil.scale.set(1, 1.05, .5); pupil.position.z = .045; eyeG.add(pupil);
    const hi = new THREE.Mesh(new THREE.CircleGeometry(.028, 10), basic('#ffffff'));
    hi.position.set(.025, .04, .075); eyeG.add(hi);
    const glint = new THREE.Mesh(new THREE.CircleGeometry(.065, 12),
      new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: .9, depthWrite: false }));
    glint.position.set(-.01, -.015, .072); eyeG.add(glint);
    P.eyes.push({ eyeG, white, pupil, hi, glint });
  }

  // ---- legs: pivot groups at shoulder/hip, upper + lower + hoof ----
  P.legs = [];
  const legAt = (x, z, front) => {
    const hip = new THREE.Group(); hip.position.set(x, 1.32, z); bodyG.add(hip);
    const upper = part(new THREE.CylinderGeometry(.11, .085, .66, 10), hide, .015);
    upper.position.y = -.33; hip.add(upper);
    const knee = new THREE.Group(); knee.position.y = -.66; hip.add(knee);
    const lower = part(new THREE.CylinderGeometry(.07, .055, .56, 10), hide, .012);
    lower.position.y = -.28; knee.add(lower);
    const hoof = part(new THREE.BoxGeometry(.15, .11, .2), hoofM, .01);
    hoof.position.set(0, -.6, .02); knee.add(hoof);
    P.legs.push({ hip, knee, front, left: x < 0 });
    return hip;
  };
  legAt(-.42, .82, true); legAt(.42, .82, true); legAt(-.42, -.82, false); legAt(.42, -.82, false);

  // ---- tail + straw bundle + flame ----
  const tailG = new THREE.Group(); tailG.name = 'oxTail'; tailG.position.set(0, 1.98, -1.1); bodyG.add(tailG); P.tailG = tailG;
  const tail = part(new THREE.CylinderGeometry(.045, .03, 1.05, 8), hide, .01);
  tail.position.y = -.5; tail.rotation.x = .18; tailG.add(tail);
  const tuft = part(new THREE.ConeGeometry(.09, .3, 8), flat('#33291f'), .01);
  tuft.position.set(0, -1.08, -.1); tuft.rotation.x = Math.PI + .18; tailG.add(tuft);
  const strawG = new THREE.Group(); strawG.name = 'oxStraw'; strawG.position.set(0, -.95, -.08); tailG.add(strawG); P.strawG = strawG;
  const bundle = part(new THREE.CylinderGeometry(.13, .16, .5, 10), flat('#c8a84a', '#9a7d33'), .012);
  strawG.add(bundle);
  for (let i = 0; i < 6; i++) {  // straw strands sticking out of the bundle
    const s = part(new THREE.CylinderGeometry(.012, .012, .34, 5), flat('#d9bc62'), 0);
    const a = i / 6 * TAU; s.position.set(Math.cos(a) * .1, -.3, Math.sin(a) * .1); s.rotation.z = Math.cos(a) * .5; s.rotation.x = -Math.sin(a) * .5; strawG.add(s);
  }
  const tie = part(new THREE.TorusGeometry(.145, .025, 6, 14), flat('#7a5a33'), 0);
  tie.rotation.x = Math.PI / 2; tie.position.y = .12; strawG.add(tie);
  const flame = flameGroup(1.15); flame.position.set(0, -.05, 0); strawG.add(flame); P.flame = flame;

  g.userData.parts = P;
  g.userData.base = { ...o };
  g.userData.update = (obj, opts) => updateOx(obj, opts);
  updateOx(g, o);
  return finish(g, { head: [0, 2.0, 1.38], eyeL: [-.36, 2.11, 1.73], eyeR: [.36, 2.11, 1.73], back: [0, 2.3, 0], tail: [0, 1.05, -1.25] });
}

// Pure in opts: the same opts always give the same pose (no clock, no state between frames).
export function updateOx(obj, o = {}) {
  const P = obj.userData.parts; if (!P) return;
  const fireAmt = o.fire === true ? 1 : clamp01(+o.fire || 0);
  const phase = ((+o.phase || 0) % 1 + 1) % 1;
  const gait = clamp01(+o.gait || 0);
  const graze = clamp01(+o.graze || 0);
  const yaw = +o.headYaw || 0;
  const eyes = o.eyes || 'rest';
  const sw = Math.sin(phase * TAU), sw2 = Math.sin(phase * TAU * 2);

  P.clothG.visible = !!o.cloth;
  P.bladesG.visible = !!o.blades;
  P.strawG.visible = !!o.straw || fireAmt > 0;
  P.flame.visible = fireAmt > 0;

  // legs: diagonal pairs (LF+RH against RF+LH); idle = standing still
  for (const L of P.legs) {
    const diag = (L.front === L.left) ? 0 : Math.PI;
    const s = Math.sin(phase * TAU + diag);
    L.hip.rotation.x = gait * .58 * s;
    L.knee.rotation.x = gait * (.18 + .5 * Math.max(0, Math.sin(phase * TAU + diag + 1.1))) * (L.front ? 1 : .8);
  }
  // body bob + pitch while running
  P.bodyG.position.y = gait * .07 * sw2;
  P.bodyG.rotation.x = gait * .045 * sw;
  // head: yaw, graze pitch, run bob
  P.headG.rotation.y = yaw;
  P.headG.rotation.x = graze * .95 + gait * .07 * Math.sin(phase * TAU * 2 + .5) - graze * gait * .07;
  P.headG.position.y = 1.95 - graze * .38;
  P.headG.position.z = 1.0 + graze * .22;
  // ears flick back a touch at speed
  for (const e of P.ears) e.rotation.x = -gait * .25;
  // tail sway (driven by phase: hold phase, hold the tail)
  P.tailG.rotation.z = (.1 + .22 * gait) * Math.sin(phase * TAU * .5 + 1.3);
  P.tailG.rotation.x = gait * .3 + graze * .1;
  // eyes: state + pupils follow the head turn a little; fire glint rides the flame
  const flick = .8 + .2 * Math.sin(phase * TAU * 3) + .08 * Math.sin(phase * TAU * 11);
  for (const E of P.eyes) {
    const wide = eyes === 'wide', closed = eyes === 'closed';
    E.white.scale.set(wide ? 1.18 : 1, closed ? .14 : (wide ? 1.28 : 1.08), .55);
    E.pupil.visible = !closed; E.hi.visible = !closed;
    const ps = wide ? .8 : 1; E.pupil.scale.set(ps, ps * 1.05, .5);
    E.pupil.position.x = Math.max(-.04, Math.min(.04, yaw * .12));
    E.pupil.position.y = wide ? .03 : 0;
    E.glint.visible = fireAmt > .02 && !closed;
    const gs = (.6 + .6 * fireAmt) * flick; E.glint.scale.set(gs, gs, 1);
    E.glint.material.opacity = .55 + .4 * fireAmt;
  }
  // flame: scale + spin from phase alone
  if (P.flame.visible) {
    const fs = fireAmt * (0.88 + .22 * Math.sin(phase * TAU * 3) + .1 * Math.sin(phase * TAU * 7 + 1.7));
    P.flame.scale.set(2 - fs * .6, Math.max(.05, fs) * 1.15, 2 - fs * .6);
    P.flame.rotation.y = phase * TAU * 2;
    P.flame.rotation.z = .12 * Math.sin(phase * TAU * 2) - gait * .35;   // trails back at speed
    const fp = P.flame.userData.parts;
    fp.glow.material.opacity = .1 + .14 * fireAmt * flick;
  }
}
