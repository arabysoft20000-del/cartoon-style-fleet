// films/vermeer_forger/props/painting.js: a framed "Vermeer-style" painting (gold frame + painted canvas texture).
// Origin = bottom-centre of the frame, front faces +Z. opts: w 1.9, h 2.3, frame colour, variant (texture seed).
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// A stylised Vermeer-like interior painted with flat 2D shapes: window light left, blue-dress figure, table, jug.
export function vermeerTex(variant = 0) {
  return canvasTex(512, 640, (c, w, h) => {
    c.fillStyle = '#3a3226'; c.fillRect(0, 0, w, h);                       // dark warm room
    c.fillStyle = '#4a3f2c'; c.fillRect(0, h * .62, w, h * .38);          // floor band
    c.fillStyle = '#d9e2e4'; c.fillRect(w * .06, h * .08, w * .3, h * .52); // window light
    c.fillStyle = '#b9c8cc'; c.fillRect(w * .06, h * .08, w * .3, h * .52);
    c.fillStyle = '#8fa5a8';                                              // window mullions
    c.fillRect(w * .195, h * .08, w * .015, h * .52); c.fillRect(w * .06, h * .33, w * .3, h * .014);
    c.fillStyle = '#e8e2d2'; c.fillRect(w * .06, h * .08, w * .3, h * .06); // bright top pane
    const fx = w * (.52 + variant * .06), fy = h * .3;                    // figure
    c.fillStyle = '#2e4a8a';                                              // blue dress (ultramarine)
    c.beginPath(); c.moveTo(fx - w * .13, h * .88); c.lineTo(fx - w * .05, fy + h * .18); c.lineTo(fx + w * .05, fy + h * .18); c.lineTo(fx + w * .14, h * .88); c.closePath(); c.fill();
    c.fillStyle = '#d9a83c'; c.fillRect(fx - w * .055, fy + h * .1, w * .11, h * .1);   // yellow bodice
    c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(fx, fy + h * .05, w * .045, 0, 7); c.fill(); // head
    c.fillStyle = '#f2ead8'; c.beginPath(); c.arc(fx, fy + h * .02, w * .05, Math.PI, 0); c.fill(); // white cap
    c.fillStyle = '#6e4a2c'; c.fillRect(w * .3, h * .66, w * .5, h * .05); // table top
    c.fillStyle = '#54381f'; c.fillRect(w * .34, h * .71, w * .04, h * .2); c.fillRect(w * .72, h * .71, w * .04, h * .2);
    c.fillStyle = '#c8ccd2'; c.fillRect(w * .62, h * .56, w * .07, h * .1); // jug
    c.fillStyle = 'rgba(255,244,200,.16)';                                // light shaft
    c.beginPath(); c.moveTo(w * .1, h * .1); c.lineTo(w * .36, h * .1); c.lineTo(w * .75, h * .95); c.lineTo(w * .3, h * .95); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(20,16,10,.55)'; c.lineWidth = 10; c.strokeRect(0, 0, w, h); // inner shadow edge
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.painting';
  const W = o.w ?? 1.9, H = o.h ?? 2.3, gold = flat(o.frame ?? '#a8822f'), goldD = flat('#7d5f1e');
  const add = (geo, mat, x, y, z) => { const m = part(geo, mat, .02); m.position.set(x, y, z); g.add(m); return m; };
  add(new THREE.BoxGeometry(W, H, .07), goldD, 0, H / 2, -.02);                    // backing
  const fr = .14;                                                                  // frame rails
  add(new THREE.BoxGeometry(W, fr, .1), gold, 0, H - fr / 2, 0);
  add(new THREE.BoxGeometry(W, fr, .1), gold, 0, fr / 2, 0);
  add(new THREE.BoxGeometry(fr, H, .1), gold, -(W / 2 - fr / 2), H / 2, 0);
  add(new THREE.BoxGeometry(fr, H, .1), gold, (W / 2 - fr / 2), H / 2, 0);
  const cv = new THREE.Mesh(new THREE.PlaneGeometry(W - fr * 1.6, H - fr * 1.6), basic('#ffffff', { map: vermeerTex(o.variant ?? 0) }));
  cv.position.set(0, H / 2, .035); g.add(cv);
  return finish(g, { centre: [0, H / 2, 0], top: [0, H, 0] });
}
