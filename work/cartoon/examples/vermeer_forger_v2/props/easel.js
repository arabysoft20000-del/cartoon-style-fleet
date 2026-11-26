// vermeer_forger_v2/props/easel.js: a wooden artist's easel with a STARTED canvas (pencil sketch visible).
// Origin = ground point between the feet, canvas front faces +Z. opts: w 1.7, h 2.1 (canvas), wood, canvas colour.
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// A pencil underdrawing for a Vermeer-style interior: window left, standing figure, table —
// drawn in visible graphite strokes so the canvas reads as work in progress, never a blank slab.
// Env fix round 2 (critic env2 fault 5, f1470): the thin outline read as a near-blank slab at
// 600x800, so the underdrawing is now FINISHED as a worked study — dark background mass, shaded
// dress/table blocks with hatching, window light block, wash tests. Texture only: prop geometry,
// placement and timings untouched.
function sketchTex() {
  return canvasTex(512, 640, (c, w, h) => {
    c.fillStyle = '#e3d5b2'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#8a7454'; c.fillRect(w * .03, h * .04, w * .94, h * .92);            // dark umber ground block
    c.fillStyle = '#6e5a3e'; c.fillRect(w * .03, h * .7, w * .94, h * .26);             // floor shadow mass
    c.strokeStyle = '#3a2c1c'; c.lineWidth = 8; c.lineCap = 'round';
    const line = (x0, y0, x1, y1) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
    // window (left): light block + frame + mullions + light shaft
    c.fillStyle = '#cbb98e'; c.fillRect(w * .08, h * .08, w * .3, h * .52);
    c.strokeRect(w * .08, h * .08, w * .3, h * .52);
    line(w * .23, h * .08, w * .23, h * .6); line(w * .08, h * .34, w * .38, h * .34);
    c.fillStyle = 'rgba(240,230,200,.5)'; c.beginPath(); c.moveTo(w * .1, h * .1); c.lineTo(w * .36, h * .1); c.lineTo(w * .82, h * .92); c.lineTo(w * .36, h * .92); c.closePath(); c.fill();
    // figure: shaded dress mass with hatching, bodice, head with cap, arms
    const fx = w * .56;
    c.fillStyle = '#4a3a26'; c.beginPath(); c.moveTo(fx - w * .15, h * .9); c.lineTo(fx - w * .055, h * .42); c.lineTo(fx + w * .055, h * .42); c.lineTo(fx + w * .16, h * .9); c.closePath(); c.fill();
    c.strokeStyle = '#241a10'; c.lineWidth = 4;
    for (let i = 0; i < 7; i++) line(fx - w * (.12 - i * .011), h * (.54 + i * .048), fx + w * (.04 + i * .009), h * (.57 + i * .048));  // dress hatching
    c.fillStyle = '#a8824a'; c.fillRect(fx - w * .06, h * .34, w * .12, h * .1);         // bodice block
    c.fillStyle = '#e8dcc0'; c.fillRect(fx - w * .05, h * .41, w * .1, h * .07);         // apron block
    c.fillStyle = '#d9c4a4'; c.beginPath(); c.arc(fx, h * .28, w * .058, 0, 7); c.fill();
    c.strokeStyle = '#3a2c1c'; c.lineWidth = 6; c.beginPath(); c.arc(fx, h * .28, w * .058, 0, 7); c.stroke();
    c.fillStyle = '#efe6d2'; c.beginPath(); c.arc(fx, h * .25, w * .064, Math.PI, 0); c.fill();  // cap
    c.strokeStyle = '#3a2c1c'; c.lineWidth = 8;
    line(fx + w * .045, h * .4, fx + w * .15, h * .56);                                  // arm to table
    line(fx - w * .045, h * .42, fx - w * .12, h * .58);                                 // far arm
    // table + jug + bread (shaded blocks)
    c.fillStyle = '#5e4630'; c.fillRect(w * .28, h * .62, w * .62, h * .05);
    c.fillRect(w * .32, h * .67, w * .045, h * .2); c.fillRect(w * .82, h * .67, w * .045, h * .2);
    c.fillStyle = '#9aa0a8'; c.fillRect(w * .7, h * .5, w * .09, h * .12);              // jug block
    c.fillStyle = '#b08a4e'; c.beginPath(); c.ellipse(w * .44, h * .6, w * .1, h * .033, 0, 0, 7); c.fill();  // bread block
    // chair study (right) + small seated figure (left)
    c.strokeStyle = '#2e2114'; c.lineWidth = 7;
    line(w * .84, h * .44, w * .84, h * .88); line(w * .84, h * .6, w * .94, h * .6); line(w * .94, h * .6, w * .94, h * .88);
    c.beginPath(); c.arc(w * .17, h * .64, w * .042, 0, 7); c.stroke();
    line(w * .14, h * .7, w * .11, h * .88); line(w * .2, h * .7, w * .25, h * .88);
    c.fillStyle = '#4a3826'; c.fillRect(w * .07, h * .77, w * .2, h * .04);             // bench block
    // floor line + construction grid + wash tests (darker, denser)
    c.strokeStyle = '#241a10'; c.lineWidth = 6; line(0, h * .88, w, h * .88);
    c.strokeStyle = 'rgba(40,30,18,.4)'; c.lineWidth = 2;
    for (let i = 1; i < 5; i++) { line(w * i / 5, 0, w * i / 5, h); line(0, h * i / 5, w, h * i / 5); }
    c.fillStyle = 'rgba(160,120,60,.55)'; c.fillRect(w * .64, h * .06, w * .3, h * .12);   // ochre wash
    c.fillStyle = 'rgba(46,74,138,.55)'; c.fillRect(w * .64, h * .19, w * .3, h * .09);    // blue wash
    c.fillStyle = 'rgba(122,46,46,.5)'; c.fillRect(w * .64, h * .29, w * .3, h * .07);     // red wash
    c.strokeStyle = '#241a10'; c.lineWidth = 5;
    line(w * .06, h * .92, w * .28, h * .92); line(w * .06, h * .95, w * .22, h * .95);    // signature strokes
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
  sketch.position.set(0, baseY + H / 2, .03); sketch.rotation.x = -.1; g.add(sketch);
  return finish(g, { canvas: [0, baseY + H / 2, 0], top: [0, baseY + H, 0] });
}
