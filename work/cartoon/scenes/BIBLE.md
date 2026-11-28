# FILM BIBLE — Mincemeat (NEW film, made new from this voice)

Format: 9:16, 1080x1920, 30 fps. Voice: `audio/clean.wav` + `audio/clean.json` (138 words, 0.02–56.67 s).
All lines are narration (`who: null` in film.js): the voice tells the story, the cast acts and reacts on screen.
Made new from this voice only: cast, places, beats, props and opening below were written for this film.
Nothing was taken from any example film (method/bar only).

## Opening (frame 0)

Frame 0 is the fisherman's face, big (head 300 px+ on 9:16), scared/expressive, within ~60° of camera,
never cut by the frame edge, at dawn on the Spanish shore (Place A) with the beach and sea going on
behind him and the locked briefcase on the wet sand at his feet. Never an empty scene, never a back,
never the body as the opening face. The opening still has to be staged, lit and proven by a critic
round in Build (UNCHECKED — no suite tools in this environment, see lessons/build.md).

## Cast (invented for this film; specs still to write in scenes/cast/<id>.json)

| id | who | one sentence |
|---|---|---|
| narrator | the voice (no body, no lip sync) | Tells every line; captions carry the words. |
| fisherman | Spanish fisherman, 50s, weather-beaten | Finds the body at dawn; his scared face opens the film. |
| policeman | Spanish local policeman, 40s, uniform cap | Receives the report; opens the briefcase chain of custody. |
| british_officer | British intelligence officer, 30s, naval dress | Invents "William Martin", plants the pocket papers, orders the drop at sea. |
| german_officer | German intelligence officer, 40s, map room | Reads the planted papers, believes them, moves troops on the map. |
| allied_soldier | Allied soldier, 20s, landing craft | Lands in Sicily in July 1943; brief listener, reacts to the landing. |
| martin_body | the body of "William Martin" | NOT a speaking character: built as a prop (`scenes/props/`, a function of t — carried, laid down, buried), never lip-synced, never the opening face. Written here per topics.md non-human trap. |

## Lines as heard (every word of audio/clean.json, in order)

| line | words (as heard) | speaker, listeners | place | beat (what changes) | mood | the action word | the story prop that shows the words |
|---|---|---|---|---|---|---|---|
| 1 | جثة مرمية على شط إسبانيا ومعاها شنطة مقفولة | narrator; fisherman listens/reacts | A shore | A body and a locked briefcase are found | dawn dread | مرمية | locked briefcase chained to the body's wrist |
| 2 | صياد لقاها الصبح وبلغ البوليس | narrator; fisherman, policeman | A shore | The find is reported | alarm | بلغ | fisherman's lantern raised toward the village |
| 3 | الحكاية بدأت يوم 30 أبريل 1943 | narrator; british_officer | B submarine deck / sea | Flashback: the drop is dated | cold night | بدأت | calendar page / logbook date 30 April 1943 |
| 4 | لما غواصة بريطانية رمت الجثة دي في البحر | narrator; british_officer + sailors as listeners | B submarine deck / sea | The body goes into the sea | secret, heavy | رمت | body sliding off the deck into dark water |
| 5 | الأوراق اللي كانت معاها بتقول إنه ظابط بحري اسمه ويليام مارتن | narrator; policeman reads | D Spanish morgue / police office | A false identity is read out | official, puzzled | بتقول | identity papers with the name William Martin |
| 6 | بس الاسم ده كان وهمي تماماً | narrator; british_officer | C London intelligence office | The identity is invented | quiet conspiracy | وهمي | blank identity card being written on |
| 7 | البريطانيين اخترعوه عشان يخدعوا هتلر | narrator; british_officer | C London intelligence office | The purpose: deceive Hitler | conspiracy | يخدعوا | map of Europe with a pin moved away from Sicily |
| 8 | في جيب الجثة حطوا خطابات من خطيبته وإيصال سحب من البنك وتذاكر مسرح | narrator; british_officer plants | C London intelligence office | Pocket litter is planted | meticulous | حطوا | love letters, bank receipt, theatre tickets going into a pocket |
| 9 | تفاصيل تخلي أي حد يصدق اللعبة | narrator; british_officer, policeman (later reader) | C → D (cut on the word يصدق) | The details are meant to convince | tension | يصدق | the same pocket items laid out in a row |
| 10 | والشنطة اللي مربوطة في إيده فيها وثائق سرية بين قادة كبار | narrator; policeman | D Spanish morgue / police office | The briefcase holds secret documents | gravity | مربوطة | briefcase chain on the wrist, documents inside |
| 11 | بتقول إن الحلفاء هيهاجموا اليونان وسردينيا | narrator; german_officer reads | E German map room | The false landing plan is believed | false certainty | هيهاجموا | secret letter naming Greece and Sardinia |
| 12 | لكن الحقيقة إن الهدف كان صقلية | narrator; british_officer (knows), german_officer (does not) | E map room, Sicily marked small | The real target is revealed to the viewer only | irony | الحقيقة | Sicily on the map, unmarked by the Germans |
| 13 | إسبانيا كانت قريبة من الألمان فسمحوا لمخابراتهم يشوفوا الورق | narrator; policeman hands over, german_officer receives | D → E (handover on a cut) | The papers reach German intelligence | complicity | يشوفوا | documents changing hands across a desk |
| 14 | والألمان بلعوا الطعم ونقلوا قواتهم لليونان وسردينيا | narrator; german_officer | E German map room | Troops move the wrong way | triumph of the trick | بلعوا / نقلوا | troop counters sliding to Greece and Sardinia on the map |
| 15 | وده اللي كان مخطط له الإنجليز بالضبط | narrator; british_officer | C London intelligence office | The plan worked as designed | quiet satisfaction | مخطط | the London map, now matching the German map |
| 16 | وفي يوليو 1943 الحلفاء نزلوا صقلية | narrator; allied_soldier | F Sicily landing beach | The real landing happens | release, daylight | نزلوا | landing craft ramp dropping on Sicily sand |
| 17 | الجثة اتدفنت في إسبانيا باسم ويليام مارتن اللي ملوش وجود | narrator; fisherman + policeman at the grave | G Spanish cemetery | The invented man is buried under his false name | melancholy | اتدفنت | gravestone carved "William Martin" |
| 18 | وما حدش عرف الحقيقة غير بعد 50 سنة | narrator; fisherman (old, listening) | G Spanish cemetery | The secret outlives everyone in the film | elegy | عرف | the same gravestone, weathered, sea behind it |

Beats: (1) the find, lines 1–2; (2) the invention and the drop, lines 3–9; (3) the papers believed,
lines 10–15; (4) Sicily and the grave, lines 16–18. Every line has a place, a beat, an action word
and a story prop. Cuts every 1.5–3 s on a line start or an action word; listeners react 1–3 frames
after the trigger word (acting still to write in film.js).

## Places (one row each; D = real metres x 1.6; far end at least 25 D behind the faces, looked along)

| place | the real thing | size in D | far end from the main camera (D) | where its depth comes from | practicals you can see | colour mood | air and particles |
|---|---|---|---|---|---|---|
| A Spanish shore at dawn | Atlantic fishing beach, wet sand, small boats, 1943 | beach 120 D long, 25 D wide | 60 D along the shoreline | the shoreline itself, boats and nets receding, sea horizon in the upper third | dawn sun low over the sea, fisherman's oil lantern, a boat's stern lamp | cold dawn blue-grey warming at the horizon | sea spray, fine mist off the water, gulls crossing the sky |
| B British submarine deck at night | Surfaced submarine deck at sea, 30 April 1943 | deck 40 D long, 5 D wide | 35 D along the deck to the conning tower, sea beyond | the deck run plus open sea and moonlit horizon | conning-tower lamp, a shielded deck lantern, moon | deep sea teal / cobalt night | sea spray, breath-fog, moonlit foam |
| C London intelligence office | Small wartime office, map wall, desk lamps, blackout curtains | room 14 x 10 D | 28 D through the doorway into a lit corridor | doorway into a lit corridor and the map wall receding | two green desk lamps, corridor light through the doorway | warm amber against blackout blue | cigarette-free dust in lamp light (no smoke on faces), paper dust |
| D Spanish morgue / police office | Tiled provincial morgue office, steel table, paper files | room 16 x 11 D | 30 D down the tiled corridor past the office door | the corridor and a high window onto the street | ceiling panel lights in pools, desk lamp, window daylight | cold green-white, hard | fine dust in window light, no haze on faces |
| E German map room | Intelligence map room, big Europe table map, wall maps | room 22 x 16 D | 40 D along the map table to the far wall map | the map table's length and the far wall map | hanging map lamps in a row, wall-map spotlights | rusty amber, deep shadows | dust in lamp cones, low haze by distance |
| F Sicily landing beach | Landing beach, July 1943, landing craft, summer morning | beach 100 D long | 70 D along the beach past the craft | the beach run, craft and headland receding | morning sun, craft's signal lamp | bleached warm yellow, bright exterior | dust and sand in the air, heat shimmer (post), sea spray |
| G Spanish cemetery | Small walled cemetery above the sea, one new grave | 30 x 20 D | 45 D past the rows to the sea wall and horizon | rows of stones receding to the sea | low sun, a chapel window catching light | cold dawn again, quieter than A | pollen / seeds, light mist |

Sky trap (A, F, G): painted sky with cloud detail, horizon in the upper third, wires/boats/gulls/stones
crossing it — never a bare gradient over 40 % of the frame. Night trap (B): moonlit clouds, foam,
wet deck catching the lamps — never a black void.

## Colour script

- A shore dawn: cold blue-grey, warming only at the horizon; lantern amber on the fisherman's face.
- B submarine night: deep sea teal / cobalt, moon silver, one warm deck lantern.
- C London office: warm amber desk pools against blackout blue.
- D morgue office: cold green-white, hard window daylight.
- E map room: rusty amber, deep shadow between lamp pools.
- F Sicily morning: bleached warm yellow, bright exterior numbers.
- G cemetery: cold dawn, muted, sea light behind the stone.
One look per place and light state; a cut tells you where you are with the sound off.

## Before you hand the bible on (topics.md section 8)

- Every line has a place, a beat, an action word and a story prop: YES, table above (18 lines, 138 words).
- Every place has its real thing, size in D, far end in D, 2+ practicals, a colour mood and its air: YES, 7 places above.
- The opening's place is staged, lit and proven by a critic round: NO — still to do in Build
  (UNCHECKED: no suite tools / critics run yet; see lessons/build.md HANDOVER).
