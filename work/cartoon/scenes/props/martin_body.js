// scenes/props/martin_body.js: the body of "William Martin" as a NON-SPEAKING prop (BIBLE cast note + lines 1, 4, 17).
// A covered human form lying flat under a grey blanket — head end covered, NO face, never a face.
// Origin = centre of the form. Length ~3.4 D lying along Z (+Z = head end), width ~.85, height ~.5.
// opts: covered true (default; grey blanket) | false (darker uniform shape under, still no face), blanket '#8a8d90'
// sockets: grip (centre), centre, head, feet
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.martin_body';
  const covered = o.covered ?? true;
  const cloth = covered ? flat(o.blanket ?? '#8a8d90', '#5f6266') : flat('#4c5257', '#33373b');
  const clothDark = covered ? flat('#76797d', '#52555a') : flat('#3d4247', '#282c30');

  // main form: a flattened capsule lying along Z
  const form = part(new THREE.CapsuleGeometry(.42, 2.5, 6, 14), cloth, .025);
  form.rotation.x = Math.PI / 2; form.scale.set(1, 1, .62); // capsule axis -> Z, squashed flat in Y after rotation
  g.add(form);

  // head-end bump under the cover (+Z end): a covered mound, no face
  const head = part(new THREE.SphereGeometry(.34, 14, 10), cloth, .025);
  head.position.set(0, .06, 1.42); head.scale.set(1, .78, 1.05); g.add(head);

  // shoulder width hint just behind the head bump
  const shoulders = part(new THREE.SphereGeometry(.4, 14, 10), cloth, .025);
  shoulders.position.set(0, .02, 1.05); shoulders.scale.set(1.12, .66, .8); g.add(shoulders);

  // blanket folds: three soft cross-bands so it reads as cloth over a form, not a slab
  [.55, -.15, -.85].forEach(z => {
    const fold = part(new THREE.TorusGeometry(.43, .045, 8, 18, Math.PI), clothDark, .018);
    fold.position.set(0, .02, z); fold.rotation.y = Math.PI / 2; fold.scale.set(1, .62, 1); g.add(fold);
  });

  // blanket edge hanging at the foot end
  const edge = part(new THREE.BoxGeometry(.8, .3, .05), clothDark, .02);
  edge.position.set(0, -.12, -1.62); edge.rotation.x = .25; g.add(edge);

  return finish(g, {
    centre: [0, 0, 0],
    head: [0, .1, 1.42],
    feet: [0, 0, -1.6],
  });
}
