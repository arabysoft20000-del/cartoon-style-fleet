// films/vermeer_forger/props/easel.js: a wooden artist's easel with a STARTED canvas (pencil sketch visible).
// Origin = ground point between the feet, canvas front faces +Z. opts: w 1.7, h 2.1 (canvas), wood, canvas colour.
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// A pencil underdrawing for a Vermeer-style interior: window left, standing figure, table —
// drawn in visible graphite strokes so the canvas reads as work in progress, never a blank slab.
function sketchTex() {
  return canvasTex(512, 640, (c, w, h) => {
    c.fillStyle = '#efe6d2'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#54432c'; c.lineWidth = 8; c.lineCap = 'round';
    const line = (x0, y0, x1, y1) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
    // window (left): frame + mullions + light shaft
    c.strokeRect(w * .08, h * .08, w * .3, h * .52);
    line(w * .23, h * .08, w * .23, h * .6); line(w * .08, h * .34, w * .38, h * .34);
    c.strokeStyle = '#9a8a6e'; line(w * .1, h * .1, w * .72, h * .94); line(w * .36, h * .1, w * .9, h * .9);
    // figure: head, dress triangle, arm to table
    c.strokeStyle = '#54432c';
    c.beginPath(); c.arc(w * .56, h * .34, w * .05, 0, 7); c.stroke();
    line(w * .52, h * .4, w * .46, h * .88); line(w * .6, h * .4, w * .68, h * .88); line(w * .46, h * .88, w * .68, h * .88);
    line(w * .58, h * .48, w * .72, h * .62);
    // table + jug
    line(w * .3, h * .66, w * .82, h * .66); line(w * .34, h * .66, w * .34, h * .8); line(w * .78, h * .66, w * .78, h * .8);
    c.strokeRect(w * .62, h * .56, w * .08, h * .1);
    // floor line + a few construction strokes
    line(0, h * .88, w, h * .88);
    c.strokeStyle = '#a89a7e'; c.lineWidth = 3;
    line(w * .44, h * .2, w * .7, h * .2); line(w * .56, h * .12, w * .56, h * .3);
  });
}

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.easel';
  const wood = flat(o.wood ?? '#8a5a33'), woodD = flat(o.woodDark ?? '#6e4525');
  const W = o.w ?? 1.7, H = o.h ?? 2.1, baseY = .95;            // canvas bottom height
  const add = (geo, mat, x, y, z, rx = 0, rz = 0) => { const m = part(geo, mat, .02); m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz; g.add(m); return m; };
  // front uprights (slight lean back)
  for (const sx of [-1, 1]) { add(new THREE.BoxGeometry(.17, 3.5, .17), wood, sx * (W / 2 - .12), 1.72, -.12, -.1, sx * .02);
    add(new THREE.BoxGeometry(.5, .09, .34), woodD, sx * (W / 2 - .12), .05, .02); }   // foot bar
  // back leg
  add(new THREE.BoxGeometry(.16, 3.3, .16), woodD, 0, 1.6, -.85, .42);
  // crossbar / shelf the canvas rests on
  add(new THREE.BoxGeometry(W + .25, .1, .34), wood, 0, baseY - .05, .04);
  add(new THREE.BoxGeometry(W + .25, .07, .05), woodD, 0, baseY + .02, .2);   // tray lip
  add(new THREE.BoxGeometry(W - .1, .09, .09), woodD, 0, .45, -.1);          // lower stretcher
  add(new THREE.CylinderGeometry(.07, .06, .14, 10), flat('#7a2e2e'), W / 2 - .3, baseY + .06, .1);  // brush cup on tray
  // top clamp
  add(new THREE.BoxGeometry(.5, .12, .18), woodD, 0, baseY + H + .12, -.2);
  // started canvas: board + pencil underdrawing on the front (visible graphite, never a blank slab)
  const cv = add(new THREE.BoxGeometry(W, H, .14), flat(o.canvas ?? '#efe6d2'), 0, baseY + H / 2, -.05, -.1);
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.07, H, .16), woodD, sx * (W / 2 - .03), baseY + H / 2, -.05, -.1);  // canvas edge frame
  add(new THREE.BoxGeometry(W, .07, .16), woodD, 0, baseY + H - .03, -.05, -.1);
  cv.material = flat(o.canvas ?? '#efe6d2');
  const sketch = new THREE.Mesh(new THREE.PlaneGeometry(W * .92, H * .92), basic('#ffffff', { map: sketchTex() }));
  sketch.position.set(0, baseY + H / 2, -.005); sketch.rotation.x = -.1; g.add(sketch);
  return finish(g, { canvas: [0, baseY + H / 2, 0], top: [0, baseY + H, 0] });
}
