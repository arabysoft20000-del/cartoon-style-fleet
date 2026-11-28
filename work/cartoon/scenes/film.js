// Mincemeat (NEW film) — Build pass film.js, made new from this voice only.
// All 18 lines are narration (who: null); the cast acts and reacts on screen.
// Places (400 D apart): A shore [0,0]  B submarine [400,0]  C London office [800,0]
//                        D morgue [0,-400]  E map room [400,-400]  F Sicily beach [800,-400]  G cemetery [0,400]
// Pure in t: seeded randomness only, no wall clock, no cross-frame state anywhere in scenes/.
//
// MOVEMENT REBUILD (member rejected the first Build render: "nobody moves, only the camera"):
// every shot now carries real character movement — walks through the places (engine walk: paths,
// pure in t) and whole-body actions (recoil, lean, kneel-free shove, turns). Walks end before the
// line/word that needs the character standing; no walk/clip/turn starts within 3 frames of a cut.
// Camera orbits track the walkers (orbit center = root(t)); `facing` is set per shot where the walk
// heading differs from the standing ry at the cut, so faces stay within ~60 deg of camera.

export default {
  fps: 30,
  size: [1080, 1920],
  tail: 1.6,
  world: { set: 'own', setOpts: { countersT0: 42.2, countersT1: 43.9 } },

  cast: {
    fisherman:       { spec: 'cast/fisherman.json',       at: [-1.2, 1.0],    ry: 25 },
    policeman:       { spec: 'cast/policeman.json',       at: [-1.2, -399.8], ry: 30 },
    british_officer: { spec: 'cast/british_officer.json', at: [799, 1.0],     ry: 35 },
    german_officer:  { spec: 'cast/german_officer.json',  at: [400, -393.5],  ry: 15 },
    allied_soldier:  { spec: 'cast/allied_soldier.json',  at: [800, -399],    ry: 15 },
  },

  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'جثة مرمية على شط إسبانيا ومعاها شنطة مقفولة' },
      { who: null, text: 'صياد لقاها الصبح وبلغ البوليس' },
      { who: null, text: 'الحكاية بدأت يوم 30 أبريل 1943' },
      { who: null, text: 'لما غواصة بريطانية رمت الجثة دي في البحر' },
      { who: null, text: 'الأوراق اللي كانت معاها بتقول إنه ظابط بحري اسمه ويليام مارتن' },
      { who: null, text: 'بس الاسم ده كان وهمي تماماً' },
      { who: null, text: 'البريطانيين اخترعوه عشان يخدعوا هتلر' },
      { who: null, text: 'في جيب الجثة حطوا خطابات من خطيبته وإيصال سحب من البنك وتذاكر مسرح' },
      { who: null, text: 'تفاصيل تخلي أي حد يصدق اللعبة' },
      { who: null, text: 'والشنطة اللي مربوطة في إيده فيها وثائق سرية بين قادة كبار' },
      { who: null, text: 'بتقول إن الحلفاء هيهاجموا اليونان وسردينيا' },
      { who: null, text: 'لكن الحقيقة إن الهدف كان صقلية' },
      { who: null, text: 'إسبانيا كانت قريبة من الألمان فسمحوا لمخابراتهم يشوفوا الورق' },
      { who: null, text: 'والألمان بلعوا الطعم ونقلوا قواتهم لليونان وسردينيا' },
      { who: null, text: 'وده اللي كان مخطط له الإنجليز بالضبط' },
      { who: null, text: 'وفي يوليو 1943 الحلفاء نزلوا صقلية' },
      { who: null, text: 'الجثة اتدفنت في إسبانيا باسم ويليام مارتن اللي ملوش وجود' },
      { who: null, text: 'وما حدش عرف الحقيقة غير بعد 50 سنة' },
    ],
  },

  acts: {
    fisherman: {
      place: [{ t: 'line:17.start', at: [-4.8, 400.2], ry: 40 }],
      face: [
        { t: 0, expr: 'fear' },                                   // frame 0: scared face, big, dawn shore behind
        { t: 'line:1.word:2+0.07', expr: 'horror', react: 'recoil' }, // مرمية — he sees what it is, body recoils
        { t: 'line:2.word:4+0.12', expr: 'dread' },               // وبلغ — he must report it
        { t: 'line:17.start+0.12', expr: 'stare' },               // at the grave, decades on
        { t: 'line:18.word:3+0.07', expr: 'blank' },              // عرف — the truth outlived him
      ],
      walk: [
        // creeps along the shore toward the body, stops short of it (head turns down at it)
        { t0: 'line:1.word:5+0.15', path: [[-0.4, 1.5], [0.5, 1.3]], face: 15, speed: 1.5, slow: true },
        // recoils and RUNS off toward the village to report (lantern in hand)
        { t0: 'line:2.start+0.2', path: [[-0.5, 2.1], [-3.2, 3.9]], face: [-4.5, 5.2], gait: 'run' },
        // cemetery: walks in along the path to the grave
        { t0: 'line:17.start+0.3', path: [[-3.4, 401.2], [-1.1, 402.4]], face: 25, speed: 2.2, slow: true },
        // walks away from the grave toward camera as the film ends
        { t0: 'line:18.word:5+0.2', path: [[-1.8, 404.2]], face: 10, speed: 1.5, slow: true },
      ],
      clips: [
        { clip: 'carry', t0: 0, params: { side: 'R' } },          // lantern already in hand on frame 0 (settled)
        { clip: 'point', at: 'line:1.word:2+0.1', params: { side: 'L', dir: [.6, 0, .3] }, hold: 1.0, out: 6 },
        { clip: 'raise_prop', at: 'line:2.word:5+0.25', params: { prop: 'lantern1', side: 'R', to: 'chest' }, hold: 1.2, out: 6 },
        { clip: 'hand_to_temple', at: 'line:18.word:3+0.1', params: { side: 'L' }, hold: 1.5, out: 8 },
      ],
      look: [
        { t: 'line:1.word:2+0.07', at: [1.2, 0.3, 2.2] },         // down at the body on the sand
        { t: 'line:2.word:4+0.07', at: [-3, 1.5, 4] },            // toward the village (camera side, cheated)
        { t: 'line:17.start+0.07', at: [0, 0.9, 399.5] },         // at the gravestone
      ],
    },

    policeman: {
      place: [{ t: 'line:17.start', at: [4.8, 400.6], ry: -40 }],
      face: [
        { t: 'line:5.start+0.12', expr: 'confused' },             // reading the papers
        { t: 'line:5.word:10+0.07', expr: 'dawning' },            // ويليام — a name, an officer
        { t: 'line:10.start+0.12', expr: 'dread' },               // the chained briefcase
        { t: 'line:13.start+0.12', expr: 'stare' },               // handing the papers over
        { t: 'line:17.start+0.12', expr: 'blank' },               // at the grave
      ],
      walk: [
        // from the desk to the examination table, reading as he walks
        { t0: 'line:5.start+0.3', path: [[-0.2, -399.3], [0.7, -399.2]], face: 90, speed: 1.8, slow: true },
        // steps up to the briefcase on the table's front corner, turning to face it
        { t0: 'line:9.word:5+0.2', path: [[1.35, -400.1]], face: -117, speed: 1.8, slow: true },
        // steps back from the table holding the secret letter up
        { t0: 'line:10.word:8+0.2', path: [[0.5, -399.3]], face: 0, speed: 1.8, slow: true },
        // carries the papers across to the desk and puts them down (handover happens on the cut to E)
        { t0: 'line:13.start+0.12', path: [[-0.2, -398.9], [-0.9, -400.1], [-1.2, -400.45]], face: -30, speed: 3.2, slow: true },
        // cemetery: walks in along the path to the grave
        { t0: 'line:17.word:2+0.15', path: [[3.4, 401.4], [1.2, 402.5]], face: -25, speed: 2.3, slow: true },
      ],
      clips: [
        { clip: 'raise_prop', at: 'line:5.word:5+0.13', params: { prop: 'docs1', side: 'R', to: 'chest' }, hold: 2.0, out: 6 },
        { clip: 'lean_over', at: 'line:10.word:3+0.1', params: { deg: 28 } },
        { clip: 'pick_up', at: 'line:10.word:6+0.1', params: { prop: 'briefcase1', side: 'R' } },
        { clip: 'raise_prop', at: 'line:10.word:7+0.13', params: { prop: 'secret1', side: 'L', to: 'chest' }, hold: 1.5, out: 6 },
        { clip: 'put_down', at: 'line:13.word:8-0.15', params: { prop: 'docs1', side: 'R', at: [-1.2, 1.35, -400.95] } },
      ],
      look: [
        { t: 'line:5.word:5+0.07', at: [0, 1.4, -397.5] },        // at the papers in his hand (in front)
        { t: 'line:10.word:6+0.07', at: [0.55, 1.5, -400.2] },    // down at the briefcase (cheated toward camera)
        { t: 'line:17.start+0.07', at: [0, 0.9, 399.5] },         // at the gravestone
      ],
    },

    british_officer: {
      place: [
        { t: 'line:3.start', at: [399.1, -4.0], ry: 5 },          // flashback: submarine deck, far end
        { t: 'line:6.start', at: [803.4, -8.4], ry: -30 },        // back to London: enters from the corridor
        { t: 'line:15.start', at: [800.6, -0.35], ry: 25 },       // at the desk again for the payoff beat
      ],
      face: [
        { t: 'line:3.start+0.12', expr: 'stare' },                // cold night, the date is set
        { t: 'line:4.word:4+0.12', expr: 'dread' },               // رمت — the body goes over
        { t: 'line:6.word:5+0.07', expr: 'stare' },               // وهمي — the name is invented
        { t: 'line:7.word:4+0.12', eyes: 'open', brow: 'down', mouth: 'tight' },  // يخدعوا — resolve
        { t: 'line:8.word:4+0.12', expr: 'stare' },               // حطوا — planting the litter
        { t: 'line:9.word:5+0.12', expr: 'relief' },              // يصدق — it will convince
        { t: 'line:15.word:4+0.07', expr: 'relief' },             // مخطط — exactly as planned
      ],
      walk: [
        // walks the deck toward the body at the rail
        { t0: 'line:3.start+0.3', path: [[399.5, -1.0], [399.9, 1.2]], face: 40, speed: 2.6, slow: true },
        // steps in and shoves the body over (lean_over clip on رمت)
        { t0: 'line:4.start+0.15', path: [[400.6, 0.9]], face: 20, speed: 2.0, slow: true },
        // walks back along the deck, watching it drift
        { t0: 'line:4.word:6+0.15', path: [[399.8, 2.8], [399.5, 4.6]], face: 15, speed: 2.6, slow: true },
        // London: walks in from the corridor, around the map table, to the desk's west end
        { t0: 'line:6.start+0.3', path: [[802.0, -8.2], [800.6, -7.4], [800.4, -3.4], [799.7, -2.7], [799.4, -1.6], [799.4, -0.2]], face: 15, speed: 3.2, slow: true },
        // steps east along the desk front, laying out the pocket litter (put_down on من)
        { t0: 'line:8.start+0.25', path: [[800.6, -0.35]], face: 20, speed: 1.6, slow: true },
        // paces toward camera, thinking
        { t0: 'line:8.word:11+0.15', path: [[800.0, 1.4], [799.5, 2.6]], face: -15, speed: 1.8, slow: true },
        // payoff: walks from the desk toward camera, satisfied (akimbo on مخطط)
        { t0: 'line:15.word:2+0.15', path: [[800.0, 1.5], [799.6, 2.4]], face: 5, speed: 1.9, slow: true },
      ],
      clips: [
        { clip: 'lean_over', at: 'line:4.word:4+0.13', params: { deg: 26 } },
        { clip: 'point', at: 'line:4.word:4+0.13', params: { side: 'R', dir: [.5, 0, .2] }, hold: 1.2, out: 6 },
        { clip: 'point', at: 'line:6.word:5+0.1', params: { side: 'R', dir: [.4, .1, .2] }, hold: 1.0, out: 6 },
        { clip: 'point', at: 'line:7.word:4+0.13', params: { side: 'R', dir: [-.6, .1, .2] }, hold: 1.2, out: 6 },
        { clip: 'put_down', at: 'line:8.word:7+0.1', params: { prop: 'litter1', side: 'L', at: [800.6, 1.4, -0.85] } },
        { clip: 'akimbo', at: 'line:15.word:4+0.1' },
      ],
      look: [
        { t: 'line:3.start+0.07', at: [401.5, 0.4, 0.5] },        // at the body on the deck
        { t: 'line:7.word:4+0.07', at: [800.5, 1.6, 0.5] },       // at the map (cheated in front)
        { t: 'line:15.word:4+0.07', at: [800.5, 1.6, 0.5] },      // at the London map again
      ],
    },

    german_officer: {
      face: [
        { t: 'line:11.start+0.12', expr: 'stare' },               // reading the secret letter
        { t: 'line:11.word:4+0.12', expr: 'hope' },               // هيهاجموا — false certainty
        { t: 'line:12.word:2+0.07', expr: 'confused' },           // الحقيقة — he cannot know it
        { t: 'line:14.word:2+0.07', expr: 'relief' },             // بلعوا — the bait is taken
        { t: 'line:14.word:4+0.12', expr: 'hope' },               // نقلوا — troops on the move
      ],
      walk: [
        // walks along the map table reading the letter
        { t0: 'line:11.start+0.3', path: [[401.8, -393.2], [403.2, -393.6]], face: -10, speed: 1.6, slow: true },
        // paces back a step, puzzling over it
        { t0: 'line:12.word:3+0.15', path: [[402.2, -393.0]], face: -20, speed: 1.7, slow: true },
        // walks back along the table as the counters slide
        { t0: 'line:13.word:8+0.3', path: [[401.2, -393.3], [399.6, -393.7]], face: -10, speed: 2.0, slow: true },
        // steps along the table front, pointing at the counters as they slide
        { t0: 'line:14.word:4+0.3', path: [[401.0, -392.6]], face: 35, speed: 1.8, slow: true },
      ],
      clips: [
        { clip: 'raise_prop', at: 'line:11.word:1+0.1', params: { prop: 'secret1', side: 'R', to: 'chest' }, hold: 2.0, out: 6 },
        { clip: 'point', at: 'line:11.word:5+0.1', params: { side: 'L', dir: [-.5, .1, .2] }, hold: 1.2, out: 6 },
        { clip: 'point', at: 'line:14.word:4+0.13', params: { side: 'R', dir: [.5, .1, .2] }, hold: 1.5, out: 6 },
      ],
      look: [
        { t: 'line:11.word:1+0.07', at: [401, 1.4, -391] },       // at the letter (in front, cheated)
        { t: 'line:14.word:4+0.07', at: [402, 1.3, -392] },       // at the map table (cheated toward camera)
      ],
    },

    allied_soldier: {
      place: [{ t: 'line:16.start', at: [797.8, -400.6], ry: 20 }],   // at the landing-craft ramp foot
      face: [
        { t: 'line:16.start+0.12', expr: 'hope' },                // July 1943, the real landing
        { t: 'line:16.word:5+0.12', expr: 'relief' },             // نزلوا — ashore in Sicily
      ],
      walk: [
        // RUNS up the beach from the ramp
        { t0: 'line:16.word:3+0.15', path: [[798.6, -399.0], [799.6, -397.4]], face: 10, gait: 'run' },
        // walks on up the beach, looking inland
        { t0: 'line:16.word:5+0.5', path: [[800.4, -395.6]], face: 15, speed: 2.0, slow: true },
      ],
      clips: [
        { clip: 'brace', at: 'line:16.word:1+0.15', hold: 1.0, out: 6 },
        { clip: 'point', at: 'line:16.word:5+0.1', params: { side: 'R', dir: [.4, .2, .2] }, hold: 1.5, out: 8 },
      ],
      look: [
        { t: 'line:16.word:1+0.07', at: [799, 1.5, -397] },       // up the beach (cheated in front)
      ],
    },
  },

  props: [
    // The body: a non-speaking prop. Shore (A) -> deck slide (B, on رمت) -> morgue table (D) -> buried (G).
    { id: 'body1', kind: 'martin_body', owner: 'fisherman', in: 'world', at: [1.2, 0.2, 2.2],
      keys: [
        { t: 'line:3.start', in: 'world', at: [401.5, 0.35, 0.5] },
        { t: 'line:4.word:4', in: 'world', at: [401.5, 0.35, -2.5], pass: 1.0 },
        { t: 'line:5.start', in: 'world', at: [1.5, 1.45, -401.0] },   // on the morgue table (set D_table surface y 1.21)
        { t: 'line:17.start', in: 'hidden' },
      ] },
    // The locked briefcase: beside the body (A) -> morgue table front corner (D, on the cut) -> picked up, opened.
    { id: 'briefcase1', kind: 'briefcase', owner: 'fisherman', in: 'world', at: [1.9, 0.25, 1.6], open: 0,
      keys: [
        { t: 'line:5.start', in: 'world', at: [0.55, 1.91, -400.65], owner: 'policeman' },
        { t: 'line:10.word:7', open: 1, ease: 0.2 },
        { t: 'line:17.start', in: 'hidden' },
      ] },
    // Identity papers: read by the policeman (D), put down on the desk before the cut to E.
    { id: 'docs1', kind: 'documents', owner: 'policeman', in: 'hand:R', form: 'id',
      keys: [
        { t: 'line:14.start', in: 'hidden' },
      ] },
    // Secret letter: out of the briefcase (D) -> read in the map room (E), every switch on a cut.
    { id: 'secret1', kind: 'documents', owner: 'policeman', in: 'hidden', form: 'secret',
      keys: [
        { t: 'line:10.word:7', in: 'hand:L', snap: true },
        { t: 'line:11.start', owner: 'german_officer', in: 'hand:R' },
        { t: 'line:15.start', in: 'hidden' },
      ] },
    // Pocket litter: planted on the London desk (C) -> laid out on the morgue table (D, cut on يصدق).
    { id: 'litter1', kind: 'pocket_litter', owner: 'british_officer', in: 'hand:L',
      keys: [
        { t: 'line:9.word:5', in: 'world', at: [1.5, 1.28, -400.6], owner: 'policeman' },   // laid out on the morgue table
      ] },
    // The fisherman's lantern: in hand from frame 0, raised as he runs to report.
    { id: 'lantern1', kind: 'lantern', owner: 'fisherman', in: 'hand:R',
      keys: [
        { t: 'line:17.start', in: 'hidden' },
      ] },
  ],

  // No handovers[] entries: every owner switch above lands on a hard cut (PROP GUARD: cuts are not judged).
  handovers: [],

  // Camera: low (height 2.2 aim, el -5), fov 26 (30 on the one establishing wide per place), always moving.
  // Orbit centers track the walkers; `facing` per shot keeps the camera on the walker's front 3/4.
  shots: [
    { t0: 0,                  t1: 'line:1.word:4',  hard: true, camera: { move: 'orbit', who: 'fisherman', az0: -6, az1: 6,  el: -5, dist: 11, height: 2.2, fov: 26, roll: [2, 3] } },
    { t0: 'line:1.word:4',    t1: 'line:2.start',   hard: true, camera: { move: 'orbit', who: 'fisherman', facing: 55, az0: -10, az1: 6, el: -4, dist: 12, height: 1.8, fov: 26, roll: [-2, -1] } },
    { t0: 'line:2.start',     t1: 'line:2.word:4',  hard: true, camera: { move: 'orbit', who: 'fisherman', facing: -30, az0: -8, az1: 4,  el: -5, dist: 12, height: 2.2, fov: 26, roll: [1, 2] } },
    { t0: 'line:2.word:4',    t1: 'line:3.start',   hard: true, camera: { move: 'orbit', who: 'fisherman', facing: -40, az0: 6,  az1: -6, el: -6, dist: 11, height: 2.2, fov: 26, roll: [3, 2] } },
    { t0: 'line:3.start',     t1: 'line:4.start',   hard: true, camera: { move: 'orbit', who: 'british_officer', az0: -8, az1: 6, el: -4, dist: 16, height: 2.0, fov: 30, roll: [-2, -3] } },
    { t0: 'line:4.start',     t1: 'line:4.word:4',  hard: true, camera: { move: 'orbit', who: 'british_officer', facing: 75, az0: -6, az1: 6, el: -5, dist: 12, height: 2.2, fov: 26, roll: [2, 1] } },
    { t0: 'line:4.word:4',    t1: 'line:5.start',   hard: true, camera: { move: 'orbit', who: 'british_officer', facing: 10, az0: -4, az1: 8,  el: -5, dist: 13, height: 2.0, fov: 26, roll: [-1, -2] } },
    { t0: 'line:5.start',     t1: 'line:5.word:5',  hard: true, camera: { move: 'orbit', who: 'policeman', az0: -8, az1: 2, el: -4, dist: 13, height: 2.0, fov: 30, roll: [2, 3] } },
    { t0: 'line:5.word:5',    t1: 'line:6.start',   hard: true, camera: { move: 'orbit', who: 'policeman', facing: 45, az0: 0,  az1: -8, el: -5, dist: 10.5, height: 2.2, fov: 26, roll: [-3, -2] } },
    { t0: 'line:6.start',     t1: 'line:7.start',   hard: true, camera: { move: 'orbit', who: 'british_officer', facing: -55, az0: -8, az1: 10, el: -4, dist: 10, height: 2.0, fov: 30, roll: [1, 2] } },
    { t0: 'line:7.start',     t1: 'line:7.word:4',  hard: true, camera: { move: 'orbit', who: 'british_officer', facing: -25, az0: 8,  az1: -4, el: -5, dist: 12, height: 2.2, fov: 26, roll: [-2, -1] } },
    { t0: 'line:7.word:4',    t1: 'line:8.start',   hard: true, camera: { move: 'orbit', who: 'british_officer', facing: 0, az0: -6, az1: 6,  el: -5, dist: 11, height: 2.2, fov: 26, roll: [2, 3] } },
    { t0: 'line:8.start',     t1: 'line:8.word:4',  hard: true, camera: { move: 'orbit', who: 'british_officer', facing: 45, az0: 0,  az1: -8, el: -5, dist: 10, height: 2.2, fov: 26, roll: [-1, -2] } },
    { t0: 'line:8.word:4',    t1: 'line:9.start',   hard: true, camera: { move: 'orbit', who: 'british_officer', facing: 40, az0: -8, az1: 4,  el: -6, dist: 10, height: 2.2, fov: 26, roll: [3, 2] } },
    { t0: 'line:9.start',     t1: 'line:9.word:5',  hard: true, camera: { move: 'orbit', who: 'british_officer', az0: 8,  az1: -4, el: -5, dist: 12, height: 2.2, fov: 26, roll: [-2, -3] } },
    { t0: 'line:9.word:5',    t1: 'line:10.start',  hard: true, camera: { move: 'orbit', who: 'policeman', facing: 145, az0: -6, az1: 6,  el: -5, dist: 7, height: 2.2, fov: 26, roll: [2, 1] } },
    { t0: 'line:10.start',    t1: 'line:10.word:7', hard: true, camera: { move: 'orbit', who: 'policeman', facing: -117, az0: -30, az1: 6, el: -5, dist: 7.5, height: 2.2, fov: 26, roll: [-3, -2] } },
    { t0: 'line:10.word:7',   t1: 'line:11.start',  hard: true, camera: { move: 'orbit', who: 'policeman', facing: -70, az0: -5, az1: 5, el: -6, dist: 9, height: 2.2, fov: 26, roll: [1, 2] } },
    { t0: 'line:11.start',    t1: 'line:11.word:4', hard: true, camera: { move: 'orbit', who: 'german_officer', facing: 55, az0: -8, az1: 4, el: -4, dist: 10, height: 2.0, fov: 30, roll: [-2, -1] } },
    { t0: 'line:11.word:4',   t1: 'line:12.start',  hard: true, camera: { move: 'orbit', who: 'german_officer', facing: 55, az0: 6,  az1: -6, el: -5, dist: 10, height: 2.2, fov: 26, roll: [2, 3] } },
    { t0: 'line:12.start',    t1: 'line:13.start',  hard: true, camera: { move: 'orbit', who: 'german_officer', facing: -30, az0: -8, az1: 6,  el: -5, dist: 11, height: 2.2, fov: 26, roll: [-1, -2] } },
    { t0: 'line:13.start',    t1: 'line:13.word:8', hard: true, camera: { move: 'orbit', who: 'policeman', facing: -105, az0: -8, az1: 6,  el: -5, dist: 7, height: 2.2, fov: 26, roll: [3, 2] } },
    { t0: 'line:13.word:8',   t1: 'line:14.start',  hard: true, camera: { move: 'orbit', who: 'german_officer', facing: -70, az0: -8, az1: 4,  el: -5, dist: 11, height: 2.2, fov: 26, roll: [-2, -3] } },
    { t0: 'line:14.start',    t1: 'line:14.word:4', hard: true, camera: { move: 'orbit', who: 'german_officer', facing: -70, az0: 6,  az1: -6, el: -5, dist: 11, height: 2.2, fov: 26, roll: [2, 1] } },
    { t0: 'line:14.word:4',   t1: 'line:15.start',  hard: true, camera: { move: 'orbit', who: 'german_officer', facing: 45, az0: -10, az1: 4, el: -4, dist: 10, height: 2.0, fov: 26, roll: [-3, -2] } },
    { t0: 'line:15.start',    t1: 'line:16.start',  hard: true, camera: { move: 'orbit', who: 'british_officer', az0: -8, az1: 6,  el: -5, dist: 12, height: 2.2, fov: 26, roll: [1, 2] } },
    { t0: 'line:16.start',    t1: 'line:16.word:5', hard: true, camera: { move: 'orbit', who: 'allied_soldier', az0: -8, az1: 6, el: -4, dist: 16, height: 2.0, fov: 30, roll: [-2, -1] } },
    { t0: 'line:16.word:5',   t1: 'line:17.start',  hard: true, camera: { move: 'orbit', who: 'allied_soldier', az0: 6,  az1: -6, el: -5, dist: 11, height: 2.2, fov: 26, roll: [2, 3] } },
    { t0: 'line:17.start',    t1: 'line:17.word:4', hard: true, camera: { move: 'orbit', whos: ['fisherman', 'policeman'], az0: -6, az1: 6, el: -4, dist: 16, height: 2.0, fov: 30, roll: [-2, -3] } },
    { t0: 'line:17.word:4',   t1: 'line:18.start',  hard: true, camera: { move: 'orbit', who: 'fisherman', az0: 6,  az1: -6, el: -5, dist: 12, height: 2.2, fov: 26, roll: [1, 2] } },
    { t0: 'line:18.start',    t1: 'line:18.end+1.6', hard: true, camera: { move: 'orbit', who: 'fisherman', az0: -4, az1: 4, el: -6, dist: 11, height: 2.2, fov: 26, roll: [-1, -2] } },
  ],

  captions: 'words',
};
