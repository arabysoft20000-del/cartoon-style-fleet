// vermeer_forger_v2/props/painting.js: a framed Dutch-style painting (gold frame + painted canvas texture).
// Origin = bottom-centre of the frame, front faces +Z. opts: w 1.9, h 2.3, frame colour, variant (texture seed).
import { THREE, flat, basic, part, finish, canvasTex } from '../../../engine/props/_kit.js';
export const free = true;

// Nineteen unique painted scenes, flat 2D shapes, Dutch Golden Age flavour. Variant 0 is the forged
// "Vermeer" (the story painting, props only); 1-18 dress the set so no two canvases in any view
// share a variant (5-7 Environment pass; 8-15 env fix round 1 — critic env1 fault 2: repeats;
// 16-18 env fix round 2 — critic env2 fault 4: house-row/map repeats read as reused assets).
// Variants 0-9, 11-15 drawings unchanged; v10 redrawn denser/darker in fix round 2 (fault 5:
// sketch read as a near-blank slab at 600x800).
export function vermeerTex(variant = 0) {
  return canvasTex(512, 640, (c, w, h) => {
    const v = ((variant % 19) + 19) % 19;
    if (v === 1) {  // milkmaid kitchen: window left, woman pouring at a table
      c.fillStyle = '#d8cfc0'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#c4b8a4'; c.fillRect(0, h * .7, w, h * .3);
      c.fillStyle = '#e8f0f2'; c.fillRect(w * .05, h * .06, w * .34, h * .5);
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .21, h * .06, w * .014, h * .5); c.fillRect(w * .05, h * .3, w * .34, h * .012);
      const fx = w * .6, fy = h * .34;
      c.fillStyle = '#7a4a2c'; c.beginPath(); c.moveTo(fx - w * .13, h * .9); c.lineTo(fx - w * .045, fy + h * .16); c.lineTo(fx + w * .045, fy + h * .16); c.lineTo(fx + w * .13, h * .9); c.closePath(); c.fill();  // skirt
      c.fillStyle = '#d9a83c'; c.fillRect(fx - w * .05, fy + h * .08, w * .1, h * .09);   // bodice
      c.fillStyle = '#f2ead8'; c.fillRect(fx - w * .045, fy + h * .12, w * .09, h * .05); // apron top
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(fx, fy + h * .04, w * .042, 0, 7); c.fill();
      c.fillStyle = '#f2ead8'; c.beginPath(); c.arc(fx, fy + h * .015, w * .047, Math.PI, 0); c.fill();
      c.fillStyle = '#6e4a2c'; c.fillRect(w * .24, h * .68, w * .62, h * .045);          // table
      c.fillStyle = '#a8824a'; c.beginPath(); c.ellipse(w * .42, h * .66, w * .09, h * .03, 0, 0, 7); c.fill(); // bread
      c.fillStyle = '#c8ccd2'; c.fillRect(w * .66, h * .56, w * .08, h * .12);            // jug
      c.fillStyle = '#e8e2d2'; c.fillRect(w * .66, h * .66, w * .08, h * .02);
      c.fillStyle = 'rgba(255,244,200,.14)'; c.beginPath(); c.moveTo(w * .08, h * .08); c.lineTo(w * .38, h * .08); c.lineTo(w * .8, h * .95); c.lineTo(w * .3, h * .95); c.closePath(); c.fill();
    } else if (v === 2) {  // church interior: tall columns, pale light, tiny figures
      c.fillStyle = '#e2dccf'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#cfc6b2'; c.fillRect(0, h * .72, w, h * .28);
      for (const cx of [.14, .36, .58, .8]) { c.fillStyle = '#b8ad94'; c.fillRect(w * cx, h * .1, w * .07, h * .62); c.fillStyle = '#a89c80'; c.fillRect(w * cx, h * .1, w * .07, h * .05); c.fillRect(w * cx - w * .01, h * .68, w * .09, h * .04); }
      c.fillStyle = '#f0f4f6'; c.fillRect(w * .44, h * .04, w * .12, h * .3);
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .49, h * .04, w * .012, h * .3); c.fillRect(w * .44, h * .18, w * .12, h * .012);
      c.fillStyle = '#3a3226'; for (const [fx, fh] of [[.3, .09], [.55, .07], [.68, .08]]) { c.fillRect(w * fx, h * (.72 - fh), w * .035, h * fh); c.beginPath(); c.arc(w * (fx + .017), h * (.7 - fh), w * .02, 0, 7); c.fill(); }
      c.fillStyle = 'rgba(255,244,200,.12)'; c.beginPath(); c.moveTo(w * .44, h * .06); c.lineTo(w * .56, h * .06); c.lineTo(w * .8, h * .9); c.lineTo(w * .3, h * .9); c.closePath(); c.fill();
    } else if (v === 3) {  // courtyard: brick house, doorway, woman with broom, child
      c.fillStyle = '#b8c4c8'; c.fillRect(0, 0, w, h * .3);
      c.fillStyle = '#9a6a4a'; c.fillRect(w * .08, h * .22, w * .62, h * .52);
      c.fillStyle = '#8a5c3e'; for (let r = 0; r < 8; r++) c.fillRect(w * .08, h * (.26 + r * .06), w * .62, 2);
      c.fillStyle = '#5e4630'; c.fillRect(w * .3, h * .44, w * .14, h * .3);              // door
      c.fillStyle = '#e8eef0'; c.fillRect(w * .5, h * .3, w * .14, h * .16);               // window
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .565, h * .3, w * .01, h * .16); c.fillRect(w * .5, h * .37, w * .14, h * .01);
      c.fillStyle = '#a89c80'; c.fillRect(0, h * .74, w, h * .26);
      const fx = w * .8;
      c.fillStyle = '#2e4a8a'; c.beginPath(); c.moveTo(fx - w * .09, h * .88); c.lineTo(fx - w * .035, h * .52); c.lineTo(fx + w * .035, h * .52); c.lineTo(fx + w * .09, h * .88); c.closePath(); c.fill();
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(fx, h * .48, w * .036, 0, 7); c.fill();
      c.strokeStyle = '#6e4a2c'; c.lineWidth = 5; c.beginPath(); c.moveTo(fx + w * .06, h * .56); c.lineTo(fx + w * .11, h * .86); c.stroke();
      c.fillStyle = '#c8b88a'; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(fx + w * .11, h * .86); c.lineTo(fx + w * (.09 + i * .012), h * .94); c.stroke(); }
    } else if (v === 4) {  // view of rooftops: gables, canal, church tower
      c.fillStyle = '#c2cdd2'; c.fillRect(0, 0, w, h * .42);
      c.fillStyle = '#dbe2e0'; c.fillRect(0, h * .1, w, h * .07); c.fillRect(0, h * .26, w, h * .05);
      c.fillStyle = '#8a6a52'; c.fillRect(w * .62, h * .14, w * .09, h * .3);              // tower
      c.fillStyle = '#6e5238'; c.beginPath(); c.moveTo(w * .6, h * .14); c.lineTo(w * .665, h * .04); c.lineTo(w * .73, h * .14); c.closePath(); c.fill();
      const gables = [.04, .18, .32, .46, .76];
      for (const gx of gables) { c.fillStyle = ['#9a6a4a', '#8a5c3e', '#a87a54'][Math.floor(gx * 10) % 3]; c.fillRect(w * gx, h * .44, w * .12, h * .2);
        c.beginPath(); c.moveTo(w * gx, h * .44); c.lineTo(w * (gx + .06), h * .36); c.lineTo(w * (gx + .12), h * .44); c.closePath(); c.fill();
        c.fillStyle = '#e8eef0'; c.fillRect(w * (gx + .02), h * .48, w * .03, h * .05); c.fillRect(w * (gx + .07), h * .48, w * .03, h * .05); }
      c.fillStyle = '#5e7078'; c.fillRect(0, h * .64, w, h * .36);
      c.fillStyle = '#e8ecea'; for (let i = 0; i < 10; i++) c.fillRect(w * (.04 + i * .1), h * (.68 + (i % 3) * .08), w * .06, 3);
      c.fillStyle = '#3e2f20'; c.beginPath(); c.moveTo(w * .3, h * .72); c.lineTo(w * .44, h * .72); c.lineTo(w * .41, h * .77); c.lineTo(w * .33, h * .77); c.closePath(); c.fill();
    } else if (v === 5) {  // still life: table with bread, jug, lemon, dark ground
      c.fillStyle = '#2e2620'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#3a2f24'; c.fillRect(0, h * .58, w, h * .42);
      c.fillStyle = '#5e4630'; c.fillRect(w * .12, h * .6, w * .76, h * .05);
      c.fillStyle = '#4a3826'; c.fillRect(w * .18, h * .65, w * .05, h * .24); c.fillRect(w * .77, h * .65, w * .05, h * .24);
      c.fillStyle = '#a8824a'; c.beginPath(); c.ellipse(w * .36, h * .57, w * .13, h * .045, 0, 0, 7); c.fill();  // bread loaf
      c.fillStyle = '#8a6a38'; c.beginPath(); c.ellipse(w * .52, h * .58, w * .08, h * .032, 0, 0, 7); c.fill();
      c.fillStyle = '#c8ccd2'; c.fillRect(w * .66, h * .44, w * .1, h * .16);            // pewter jug
      c.fillStyle = '#aab0b8'; c.fillRect(w * .66, h * .44, w * .1, h * .03);
      c.fillStyle = '#d9c84a'; c.beginPath(); c.arc(w * .28, h * .59, w * .035, 0, 7); c.fill();  // lemon
      c.fillStyle = '#e8e2d2'; c.fillRect(w * .14, h * .62, w * .3, h * .02);            // cloth edge
      c.fillStyle = 'rgba(255,244,200,.10)'; c.beginPath(); c.moveTo(w * .1, h * .05); c.lineTo(w * .4, h * .05); c.lineTo(w * .8, h * .9); c.lineTo(w * .35, h * .9); c.closePath(); c.fill();
    } else if (v === 6) {  // landscape: river, windmill, big sky
      c.fillStyle = '#c8d4d8'; c.fillRect(0, 0, w, h * .55);
      c.fillStyle = '#dfe6e2'; c.fillRect(0, h * .12, w, h * .08); c.fillRect(w * .2, h * .3, w * .6, h * .06);
      c.fillStyle = '#7a8a6a'; c.fillRect(0, h * .55, w, h * .12);
      c.fillStyle = '#5e7078'; c.fillRect(0, h * .67, w, h * .33);
      c.fillStyle = '#e8ecea'; for (let i = 0; i < 8; i++) c.fillRect(w * (.06 + i * .12), h * (.72 + (i % 3) * .07), w * .07, 3);
      const mx = w * .62; c.fillStyle = '#6e5238'; c.beginPath(); c.moveTo(mx - w * .05, h * .56); c.lineTo(mx - w * .03, h * .3); c.lineTo(mx + w * .03, h * .3); c.lineTo(mx + w * .05, h * .56); c.closePath(); c.fill();
      c.strokeStyle = '#4a3826'; c.lineWidth = 6; c.beginPath(); c.moveTo(mx, h * .32); c.lineTo(mx - w * .14, h * .2); c.moveTo(mx, h * .32); c.lineTo(mx + w * .13, h * .24); c.moveTo(mx, h * .32); c.lineTo(mx - w * .1, h * .42); c.moveTo(mx, h * .32); c.lineTo(mx + w * .12, h * .4); c.stroke();
      c.fillStyle = '#3e2f20'; c.beginPath(); c.moveTo(w * .22, h * .74); c.lineTo(w * .38, h * .74); c.lineTo(w * .35, h * .79); c.lineTo(w * .25, h * .79); c.closePath(); c.fill();  // boat
    } else if (v === 7) {  // portrait: bust against dark ground, white collar
      c.fillStyle = '#33291e'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#40342a'; c.beginPath(); c.ellipse(w * .5, h * .42, w * .3, h * .3, 0, 0, 7); c.fill();
      c.fillStyle = '#1e1a16'; c.beginPath(); c.moveTo(w * .28, h); c.lineTo(w * .36, h * .58); c.lineTo(w * .64, h * .58); c.lineTo(w * .72, h); c.closePath(); c.fill();  // coat
      c.fillStyle = '#f2ead8'; c.beginPath(); c.moveTo(w * .42, h * .56); c.lineTo(w * .58, h * .56); c.lineTo(w * .5, h * .72); c.closePath(); c.fill();  // collar
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(w * .5, h * .44, w * .085, 0, 7); c.fill();  // face
      c.fillStyle = '#2e2620'; c.beginPath(); c.arc(w * .5, h * .4, w * .09, Math.PI, 0); c.fill();  // hair
      c.fillStyle = '#2e2620'; c.fillRect(w * .44, h * .44, w * .03, 4); c.fillRect(w * .53, h * .44, w * .03, 4);  // eyes
      c.fillStyle = 'rgba(255,244,200,.10)'; c.beginPath(); c.moveTo(w * .15, h * .05); c.lineTo(w * .45, h * .05); c.lineTo(w * .8, h * .95); c.lineTo(w * .4, h * .95); c.closePath(); c.fill();
    } else if (v === 8) {  // Delft map: parchment, canal, town blocks, compass rose, cartouche
      c.fillStyle = '#e3d5b4'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#d5c49c'; c.fillRect(0, 0, w, h * .08); c.fillRect(0, h * .92, w, h * .08);
      c.fillStyle = '#7a94a0'; c.beginPath(); c.moveTo(w * .1, h); c.bezierCurveTo(w * .3, h * .6, w * .55, h * .5, w * .7, 0); c.lineTo(w * .84, 0); c.bezierCurveTo(w * .68, h * .5, w * .45, h * .62, w * .26, h); c.closePath(); c.fill();  // canal
      c.fillStyle = '#b89a6a'; for (let i = 0; i < 26; i++) { const bx = w * (.06 + (i % 6) * .075), by = h * (.14 + Math.floor(i / 6) * .1); c.fillRect(bx, by, w * .05, h * .05); }  // town blocks west
      c.fillStyle = '#a88a5c'; for (let i = 0; i < 18; i++) { const bx = w * (.62 + (i % 4) * .09), by = h * (.3 + Math.floor(i / 4) * .11); c.fillRect(bx, by, w * .06, h * .06); }  // town blocks east
      c.fillStyle = '#8a6a44'; c.fillRect(w * .2, h * .2, w * .05, h * .14); c.beginPath(); c.moveTo(w * .18, h * .2); c.lineTo(w * .225, h * .12); c.lineTo(w * .27, h * .2); c.closePath(); c.fill();  // church
      c.strokeStyle = '#6e5230'; c.lineWidth = 3; c.beginPath(); c.arc(w * .82, h * .16, w * .07, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(w * .82, h * .08); c.lineTo(w * .82, h * .24); c.moveTo(w * .74, h * .16); c.lineTo(w * .9, h * .16); c.stroke();  // compass
      c.fillStyle = '#efe4c4'; c.fillRect(w * .08, h * .78, w * .34, h * .12); c.strokeStyle = '#6e5230'; c.strokeRect(w * .08, h * .78, w * .34, h * .12);
      c.fillStyle = '#6e5230'; c.fillRect(w * .12, h * .82, w * .26, 4); c.fillRect(w * .12, h * .855, w * .2, 4);  // cartouche lines
    } else if (v === 9) {  // empty interior: wall map, chair, table, window right (no figure)
      c.fillStyle = '#d8cfc0'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#b8a888'; c.fillRect(0, h * .74, w, h * .26);
      c.fillStyle = '#e8f0f2'; c.fillRect(w * .68, h * .08, w * .26, h * .46);
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .8, h * .08, w * .014, h * .46); c.fillRect(w * .68, h * .3, w * .26, h * .012);
      c.fillStyle = '#e3d5b4'; c.fillRect(w * .1, h * .1, w * .42, h * .34); c.strokeStyle = '#6e5230'; c.lineWidth = 5; c.strokeRect(w * .1, h * .1, w * .42, h * .34);  // wall map
      c.fillStyle = '#7a94a0'; c.fillRect(w * .28, h * .1, w * .05, h * .34);
      c.fillStyle = '#6e4a2c'; c.fillRect(w * .16, h * .62, w * .5, h * .045); c.fillRect(w * .2, h * .665, w * .04, h * .22); c.fillRect(w * .58, h * .665, w * .04, h * .22);  // table
      c.fillStyle = '#54381f'; c.fillRect(w * .74, h * .58, w * .05, h * .3); c.fillRect(w * .74, h * .58, w * .16, h * .04); c.fillRect(w * .86, h * .62, w * .04, h * .26);  // chair
      c.fillStyle = '#c8ccd2'; c.fillRect(w * .38, h * .54, w * .07, h * .08);  // jug on table
      c.fillStyle = 'rgba(255,244,200,.12)'; c.beginPath(); c.moveTo(w * .7, h * .1); c.lineTo(w * .92, h * .1); c.lineTo(w * .6, h * .95); c.lineTo(w * .25, h * .95); c.closePath(); c.fill();
    } else if (v === 10) {  // sketch study, FINISHED (env fix 2, fault 5): full figure study with
      // shading blocks, dark background mass, window + table studies — reads as a worked canvas
      // at 600x800, never a near-blank slab. Darker primed ground so strokes carry.
      c.fillStyle = '#d9cba6'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#8a7454'; c.fillRect(w * .04, h * .05, w * .92, h * .9);          // dark umber ground block
      c.fillStyle = '#6e5a3e'; c.fillRect(w * .04, h * .68, w * .92, h * .27);          // floor shadow mass
      c.fillStyle = '#cbb98e'; c.fillRect(w * .08, h * .09, w * .3, h * .5);            // window light block
      c.strokeStyle = '#3a2c1c'; c.lineWidth = 7; c.strokeRect(w * .08, h * .09, w * .3, h * .5);
      c.beginPath(); c.moveTo(w * .23, h * .09); c.lineTo(w * .23, h * .59); c.moveTo(w * .08, h * .34); c.lineTo(w * .38, h * .34); c.stroke();  // mullions
      c.fillStyle = 'rgba(240,230,200,.5)'; c.beginPath(); c.moveTo(w * .1, h * .12); c.lineTo(w * .36, h * .12); c.lineTo(w * .78, h * .9); c.lineTo(w * .34, h * .9); c.closePath(); c.fill();  // light shaft
      // main figure: shaded dress (hatch blocks), bodice, head with cap, arm to table
      const fx = w * .58;
      c.fillStyle = '#4a3a26'; c.beginPath(); c.moveTo(fx - w * .16, h * .92); c.lineTo(fx - w * .06, h * .44); c.lineTo(fx + w * .06, h * .44); c.lineTo(fx + w * .17, h * .92); c.closePath(); c.fill();  // dress mass
      c.strokeStyle = '#241a10'; c.lineWidth = 4;
      for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(fx - w * (.13 - i * .012), h * (.55 + i * .05)); c.lineTo(fx + w * (.05 + i * .01), h * (.58 + i * .05)); c.stroke(); }  // dress hatching
      c.fillStyle = '#a8824a'; c.fillRect(fx - w * .065, h * .36, w * .13, h * .1);     // bodice block
      c.fillStyle = '#e8dcc0'; c.fillRect(fx - w * .055, h * .42, w * .11, h * .07);    // apron block
      c.fillStyle = '#d9c4a4'; c.beginPath(); c.arc(fx, h * .3, w * .062, 0, 7); c.fill();  // head
      c.strokeStyle = '#3a2c1c'; c.lineWidth = 6; c.beginPath(); c.arc(fx, h * .3, w * .062, 0, 7); c.stroke();
      c.fillStyle = '#efe6d2'; c.beginPath(); c.arc(fx, h * .27, w * .068, Math.PI, 0); c.fill();  // cap
      c.strokeStyle = '#3a2c1c'; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(fx + w * .05, h * .42); c.lineTo(fx + w * .16, h * .58); c.stroke();  // arm
      c.beginPath(); c.moveTo(fx - w * .05, h * .44); c.lineTo(fx - w * .13, h * .6); c.stroke();   // far arm
      // table + jug + bread studies (shaded blocks, right)
      c.fillStyle = '#5e4630'; c.fillRect(w * .3, h * .64, w * .6, h * .05);
      c.fillRect(w * .34, h * .69, w * .045, h * .2); c.fillRect(w * .82, h * .69, w * .045, h * .2);
      c.fillStyle = '#9aa0a8'; c.fillRect(w * .72, h * .52, w * .09, h * .12);          // jug block
      c.fillStyle = '#b08a4e'; c.beginPath(); c.ellipse(w * .46, h * .62, w * .1, h * .035, 0, 0, 7); c.fill();  // bread block
      // second small figure study (left, seated) + chair
      c.strokeStyle = '#2e2114'; c.lineWidth = 7;
      c.beginPath(); c.arc(w * .18, h * .66, w * .045, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(w * .15, h * .72); c.lineTo(w * .12, h * .9); c.moveTo(w * .21, h * .72); c.lineTo(w * .26, h * .9); c.stroke();
      c.fillStyle = '#4a3826'; c.fillRect(w * .08, h * .78, w * .2, h * .04);           // bench block
      // transfer grid + wash tests + notes (darker, denser)
      c.strokeStyle = 'rgba(40,30,18,.45)'; c.lineWidth = 2;
      for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(w * i / 5, 0); c.lineTo(w * i / 5, h); c.stroke(); c.beginPath(); c.moveTo(0, h * i / 5); c.lineTo(w, h * i / 5); c.stroke(); }
      c.fillStyle = 'rgba(160,120,60,.55)'; c.fillRect(w * .66, h * .07, w * .28, h * .13);   // ochre wash
      c.fillStyle = 'rgba(46,74,138,.55)'; c.fillRect(w * .66, h * .21, w * .28, h * .09);    // blue wash
      c.fillStyle = 'rgba(122,46,46,.5)'; c.fillRect(w * .66, h * .31, w * .28, h * .07);     // red wash
      c.strokeStyle = '#241a10'; c.lineWidth = 5;
      c.beginPath(); c.moveTo(w * .06, h * .9); c.lineTo(w * .3, h * .9); c.moveTo(w * .06, h * .93); c.lineTo(w * .24, h * .93); c.stroke();  // signature strokes
      c.fillStyle = '#241a10'; c.font = 'bold 30px serif'; c.fillText('studie', w * .62, h * .96);
    } else if (v === 11) {  // still life 2: pewter plate, grapes, bread, dark green ground
      c.fillStyle = '#26302a'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#2f3a30'; c.fillRect(0, h * .6, w, h * .4);
      c.fillStyle = '#4a3826'; c.fillRect(w * .1, h * .62, w * .8, h * .05);
      c.fillStyle = '#b8bcc2'; c.beginPath(); c.ellipse(w * .42, h * .6, w * .2, h * .045, 0, 0, 7); c.fill();  // pewter plate
      c.fillStyle = '#5a3a5e'; for (const [gx, gy] of [[.34, .56], [.4, .55], [.46, .56], [.37, .585], [.43, .585], [.4, .605]]) { c.beginPath(); c.arc(w * gx, h * gy, w * .032, 0, 7); c.fill(); }  // grapes
      c.fillStyle = '#a8824a'; c.beginPath(); c.ellipse(w * .72, h * .59, w * .11, h * .04, 0, 0, 7); c.fill();  // bread
      c.fillStyle = '#8a9a7a'; c.beginPath(); c.ellipse(w * .52, h * .52, w * .05, h * .02, -.6, 0, 7); c.fill();  // leaf
      c.fillStyle = '#d9c84a'; c.beginPath(); c.arc(w * .2, h * .6, w * .03, 0, 7); c.fill();  // lemon half
      c.fillStyle = 'rgba(255,244,200,.09)'; c.beginPath(); c.moveTo(w * .2, h * .05); c.lineTo(w * .5, h * .05); c.lineTo(w * .85, h * .9); c.lineTo(w * .45, h * .9); c.closePath(); c.fill();
    } else if (v === 12) {  // portrait woman: blue dress bust, pearl, dark ground (distinct from v7 man)
      c.fillStyle = '#2e2a24'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#3a342c'; c.beginPath(); c.ellipse(w * .5, h * .4, w * .3, h * .3, 0, 0, 7); c.fill();
      c.fillStyle = '#2e4a8a'; c.beginPath(); c.moveTo(w * .3, h); c.lineTo(w * .38, h * .56); c.lineTo(w * .62, h * .56); c.lineTo(w * .7, h); c.closePath(); c.fill();  // blue dress
      c.fillStyle = '#f2ead8'; c.fillRect(w * .44, h * .52, w * .12, h * .05);  // lace collar
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(w * .5, h * .42, w * .08, 0, 7); c.fill();  // face
      c.fillStyle = '#3a2c1c'; c.beginPath(); c.arc(w * .5, h * .38, w * .085, Math.PI, 0); c.fill();  // hair
      c.fillStyle = '#f4efe2'; c.beginPath(); c.arc(w * .56, h * .48, w * .014, 0, 7); c.fill();  // pearl
      c.fillStyle = '#2e2620'; c.fillRect(w * .45, h * .42, w * .028, 4); c.fillRect(w * .525, h * .42, w * .028, 4);  // eyes
      c.fillStyle = 'rgba(255,244,200,.10)'; c.beginPath(); c.moveTo(w * .6, h * .05); c.lineTo(w * .85, h * .05); c.lineTo(w * .55, h * .95); c.lineTo(w * .2, h * .95); c.closePath(); c.fill();
    } else if (v === 13) {  // colour study: sky blocked in, rooftops sketched, swatch strip
      c.fillStyle = '#c8d4d8'; c.fillRect(0, 0, w, h * .5);
      c.fillStyle = '#dfe6e2'; c.fillRect(w * .1, h * .1, w * .5, h * .07); c.fillRect(w * .3, h * .28, w * .45, h * .06);
      c.fillStyle = '#e8dfc8'; c.fillRect(0, h * .5, w, h * .5);  // unpainted primed lower half
      c.strokeStyle = '#54432c'; c.lineWidth = 5;
      for (const gx of [.08, .3, .52, .74]) { c.strokeRect(w * gx, h * .56, w * .16, h * .16); c.beginPath(); c.moveTo(w * gx, h * .56); c.lineTo(w * (gx + .08), h * .48); c.lineTo(w * (gx + .16), h * .56); c.stroke(); }  // sketched gables
      c.beginPath(); c.moveTo(0, h * .78); c.lineTo(w, h * .78); c.stroke();  // horizon sketch
      const sw = ['#2e4a8a', '#d9a83c', '#7a2e2e', '#4a6a4a', '#e8e2d2'];
      sw.forEach((col, i) => { c.fillStyle = col; c.fillRect(w * (.08 + i * .17), h * .86, w * .13, h * .08); });  // swatches
    } else if (v === 14) {  // primed board: mostly blank primed canvas, faint pencil horizon + figure ghost
      c.fillStyle = '#ece2cc'; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(180,160,120,.18)'; for (let i = 0; i < 5; i++) c.fillRect(0, h * (.12 + i * .18), w, 3);  // canvas weave bands
      c.strokeStyle = 'rgba(90,74,52,.5)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(w * .06, h * .62); c.lineTo(w * .94, h * .62); c.stroke();  // horizon
      c.beginPath(); c.arc(w * .55, h * .42, w * .045, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(w * .51, h * .48); c.lineTo(w * .46, h * .62); c.moveTo(w * .59, h * .48); c.lineTo(w * .64, h * .62); c.stroke();  // ghost figure
      c.strokeRect(w * .1, h * .2, w * .22, h * .42);  // ghost window
      c.fillStyle = 'rgba(120,100,70,.35)'; c.font = '20px serif'; c.fillText('grond', w * .08, h * .92);
    } else if (v === 15) {  // harbour: ships, quay, big sky (distinct from v6 windmill river)
      c.fillStyle = '#bcccd2'; c.fillRect(0, 0, w, h * .48);
      c.fillStyle = '#dbe2e0'; c.fillRect(w * .05, h * .12, w * .4, h * .06); c.fillRect(w * .45, h * .26, w * .4, h * .05);
      c.fillStyle = '#5e7078'; c.fillRect(0, h * .48, w, h * .34);
      c.fillStyle = '#e8ecea'; for (let i = 0; i < 9; i++) c.fillRect(w * (.05 + i * .105), h * (.55 + (i % 3) * .07), w * .06, 3);
      c.fillStyle = '#6e5238'; c.fillRect(0, h * .82, w, h * .18);  // quay
      c.fillStyle = '#3e2f20'; c.beginPath(); c.moveTo(w * .18, h * .62); c.lineTo(w * .46, h * .62); c.lineTo(w * .42, h * .7); c.lineTo(w * .22, h * .7); c.closePath(); c.fill();  // hull
      c.strokeStyle = '#3e2f20'; c.lineWidth = 5; c.beginPath(); c.moveTo(w * .3, h * .62); c.lineTo(w * .3, h * .3); c.moveTo(w * .4, h * .62); c.lineTo(w * .4, h * .38); c.stroke();  // masts
      c.fillStyle = '#f2ead8'; c.beginPath(); c.moveTo(w * .3, h * .32); c.lineTo(w * .3, h * .58); c.lineTo(w * .42, h * .58); c.closePath(); c.fill();  // sail
      c.fillStyle = '#8a6a52'; c.fillRect(w * .68, h * .2, w * .07, h * .28); c.fillStyle = '#6e5238'; c.beginPath(); c.moveTo(w * .66, h * .2); c.lineTo(w * .715, h * .12); c.lineTo(w * .77, h * .2); c.closePath(); c.fill();  // far tower
    } else if (v === 16) {  // canal scene (env fix 2): stepped gables along a canal, bridge, boat
      c.fillStyle = '#c2cdd2'; c.fillRect(0, 0, w, h * .34);
      c.fillStyle = '#dbe2e0'; c.fillRect(w * .08, h * .08, w * .45, h * .06); c.fillRect(w * .3, h * .2, w * .5, h * .05);
      const gables16 = [[.03, '#9a6a4a', .3], [.17, '#7a4a38', .38], [.31, '#a87a54', .34], [.45, '#8a5c3e', .42], [.59, '#9a6a4a', .36], [.73, '#7a4a38', .4], [.86, '#a87a54', .32]];
      for (const [gx, col, gh] of gables16) { c.fillStyle = col; c.fillRect(w * gx, h * (.62 - gh), w * .115, h * gh);
        c.beginPath(); c.moveTo(w * gx, h * (.62 - gh)); c.lineTo(w * (gx + .057), h * (.62 - gh - .07)); c.lineTo(w * (gx + .115), h * (.62 - gh)); c.closePath(); c.fill();
        c.fillStyle = '#e8eef0'; c.fillRect(w * (gx + .02), h * (.66 - gh), w * .03, h * .05); c.fillRect(w * (gx + .065), h * (.66 - gh), w * .03, h * .05); c.fillRect(w * (gx + .04), h * (.78 - gh), w * .03, h * .05); }
      c.fillStyle = '#4a6a72'; c.fillRect(0, h * .62, w, h * .38);  // canal water
      c.fillStyle = '#e8ecea'; for (let i = 0; i < 11; i++) c.fillRect(w * (.03 + i * .09), h * (.68 + (i % 3) * .08), w * .055, 3);
      c.fillStyle = '#6e5238'; c.fillRect(0, h * .6, w, h * .035);  // quay edge
      c.strokeStyle = '#54381f'; c.lineWidth = 7; c.beginPath(); c.arc(w * .5, h * .66, w * .16, Math.PI, 0); c.stroke();  // bridge arch
      c.fillStyle = '#3e2f20'; c.beginPath(); c.moveTo(w * .16, h * .8); c.lineTo(w * .34, h * .8); c.lineTo(w * .31, h * .86); c.lineTo(w * .19, h * .86); c.closePath(); c.fill();  // boat
      c.fillStyle = '#2e2620'; c.fillRect(w * .24, h * .72, w * .02, h * .08);  // boatman
    } else if (v === 17) {  // figure study 2 (env fix 2): standing man with hat, charcoal + wash
      c.fillStyle = '#ddd2b4'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#b8a888'; c.fillRect(0, h * .8, w, h * .2);  // ground shadow
      c.fillStyle = 'rgba(120,100,70,.3)'; c.fillRect(w * .06, h * .06, w * .3, h * .4);  // wash panel
      const mx = w * .52;
      c.fillStyle = '#3a3226'; c.beginPath(); c.moveTo(mx - w * .11, h * .9); c.lineTo(mx - w * .05, h * .42); c.lineTo(mx + w * .05, h * .42); c.lineTo(mx + w * .11, h * .9); c.closePath(); c.fill();  // coat mass
      c.strokeStyle = '#1e1810'; c.lineWidth = 4;
      for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(mx - w * (.08 - i * .008), h * (.52 + i * .055)); c.lineTo(mx + w * (.02 + i * .008), h * (.55 + i * .055)); c.stroke(); }  // coat hatching
      c.fillStyle = '#e8dcc0'; c.beginPath(); c.moveTo(mx - w * .04, h * .4); c.lineTo(mx + w * .04, h * .4); c.lineTo(mx, h * .54); c.closePath(); c.fill();  // shirt triangle
      c.fillStyle = '#d9c4a4'; c.beginPath(); c.arc(mx, h * .32, w * .058, 0, 7); c.fill();  // head
      c.strokeStyle = '#2e2114'; c.lineWidth = 6; c.beginPath(); c.arc(mx, h * .32, w * .058, 0, 7); c.stroke();
      c.fillStyle = '#241a10'; c.fillRect(mx - w * .09, h * .24, w * .18, h * .035);  // hat brim
      c.fillRect(mx - w * .055, h * .13, w * .11, h * .11);  // hat crown
      c.strokeStyle = '#2e2114'; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(mx + w * .05, h * .46); c.lineTo(mx + w * .15, h * .66); c.stroke();  // arm
      c.beginPath(); c.moveTo(mx - w * .05, h * .46); c.lineTo(mx - w * .12, h * .62); c.stroke();  // far arm
      c.strokeStyle = 'rgba(60,48,30,.5)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(w * .08, h * .9); c.lineTo(w * .92, h * .9); c.stroke();  // ground line
      c.beginPath(); c.arc(w * .82, h * .2, w * .06, 0, 7); c.stroke();  // head study top-right
      c.fillStyle = 'rgba(46,74,138,.45)'; c.fillRect(w * .08, h * .52, w * .2, h * .1);  // blue wash test
      c.fillStyle = 'rgba(160,120,60,.45)'; c.fillRect(w * .08, h * .64, w * .2, h * .08);  // ochre wash test
      c.fillStyle = '#3a2c1c'; c.font = 'bold 26px serif'; c.fillText('figuur', w * .08, h * .96);
    } else if (v === 18) {  // landscape 2 (env fix 2): polder meadow, cows, pollard trees, big sky
      c.fillStyle = '#c8d4d8'; c.fillRect(0, 0, w, h * .5);
      c.fillStyle = '#eef2ee'; c.fillRect(w * .06, h * .1, w * .5, h * .07); c.fillRect(w * .35, h * .26, w * .5, h * .06); c.fillRect(w * .1, h * .36, w * .35, h * .05);
      c.fillStyle = '#7a8a5e'; c.fillRect(0, h * .5, w, h * .5);  // meadow
      c.fillStyle = '#6a7a52'; c.fillRect(0, h * .5, w, h * .06);  // far bank
      c.fillStyle = '#5e7078'; c.beginPath(); c.moveTo(0, h * .78); c.bezierCurveTo(w * .3, h * .7, w * .6, h * .84, w, h * .76); c.lineTo(w, h * .84); c.bezierCurveTo(w * .6, h * .92, w * .3, h * .78, 0, h * .86); c.closePath(); c.fill();  // ditch
      for (const tx of [.14, .3, .78]) { c.fillStyle = '#54381f'; c.fillRect(w * tx, h * .42, w * .035, h * .14);
        c.fillStyle = '#4a6a3e'; c.beginPath(); c.arc(w * (tx + .017), h * .4, w * .055, 0, 7); c.fill(); }  // pollard trees
      for (const [cx2, cy2, col] of [[.42, .6, '#e8e2d2'], [.58, .64, '#3a3226'], [.68, .58, '#8a6a52']]) {  // cows
        c.fillStyle = col; c.fillRect(w * cx2, h * cy2, w * .11, h * .055);
        c.fillRect(w * (cx2 + .1), h * (cy2 - .02), w * .035, h * .045);
        c.fillRect(w * (cx2 + .015), h * (cy2 + .055), w * .014, h * .045); c.fillRect(w * (cx2 + .085), h * (cy2 + .055), w * .014, h * .045); }
      c.fillStyle = '#8a6a52'; c.fillRect(w * .86, h * .44, w * .06, h * .08);  // far barn
      c.fillStyle = '#6e5238'; c.beginPath(); c.moveTo(w * .845, h * .44); c.lineTo(w * .89, h * .39); c.lineTo(w * .935, h * .44); c.closePath(); c.fill();
    } else {  // v0: the forged Vermeer — woman reading a letter at a window (the story painting)
      c.fillStyle = '#3a3226'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#4a3f2c'; c.fillRect(0, h * .62, w, h * .38);
      c.fillStyle = '#d9e2e4'; c.fillRect(w * .06, h * .08, w * .3, h * .52);
      c.fillStyle = '#8fa5a8'; c.fillRect(w * .195, h * .08, w * .015, h * .52); c.fillRect(w * .06, h * .33, w * .3, h * .014);
      c.fillStyle = '#e8e2d2'; c.fillRect(w * .06, h * .08, w * .3, h * .06);
      const fx = w * .56, fy = h * .3;
      c.fillStyle = '#2e4a8a'; c.beginPath(); c.moveTo(fx - w * .13, h * .88); c.lineTo(fx - w * .05, fy + h * .18); c.lineTo(fx + w * .05, fy + h * .18); c.lineTo(fx + w * .14, h * .88); c.closePath(); c.fill();
      c.fillStyle = '#d9a83c'; c.fillRect(fx - w * .055, fy + h * .1, w * .11, h * .1);
      c.fillStyle = '#e8cdb4'; c.beginPath(); c.arc(fx, fy + h * .05, w * .045, 0, 7); c.fill();
      c.fillStyle = '#f2ead8'; c.beginPath(); c.arc(fx, fy + h * .02, w * .05, Math.PI, 0); c.fill();
      c.fillStyle = '#f4efe2'; c.fillRect(fx - w * .09, fy + h * .2, w * .13, h * .09);   // the letter
      c.fillStyle = '#6e4a2c'; c.fillRect(w * .3, h * .66, w * .5, h * .05);
      c.fillStyle = '#54381f'; c.fillRect(w * .34, h * .71, w * .04, h * .2); c.fillRect(w * .72, h * .71, w * .04, h * .2);
      c.fillStyle = '#c8ccd2'; c.fillRect(w * .62, h * .56, w * .07, h * .1);
      c.fillStyle = 'rgba(255,244,200,.16)'; c.beginPath(); c.moveTo(w * .1, h * .1); c.lineTo(w * .36, h * .1); c.lineTo(w * .75, h * .95); c.lineTo(w * .3, h * .95); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(20,16,10,.55)'; c.lineWidth = 10; c.strokeRect(0, 0, w, h);
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
