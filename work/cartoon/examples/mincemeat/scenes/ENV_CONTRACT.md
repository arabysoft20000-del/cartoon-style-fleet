# ENV_CONTRACT — Operation Mincemeat (Environment pass, drafted during Build 2026-11-28)

Hunyuan 3D builds the set models; Blender only decimates. Decimate target: 76,000 faces
per model (Jole, 2026-11-28 07:57 EET: «او 76 الوف»). Guard config decimate_target_faces: 76000. Layout is a contract: walls, doors, lanes, camera lines stay where
Build put them. Everything falls back to the kit previz while files are missing.

## HY3D generations planned: 10

Order = pieces most shots see first (shot counts from the Build cut: london 9, berlin 3,
shore 2, sub 2, cemetery 2, sicily 1).

| # | piece | place | seen in | why HY3D |
|---|---|---|---|---|
| 1 | briefcase with chain (hero prop) | shore/sub/london | lines 1,4,5,10 | the story object; built-in `bag` is a stand-in |
| 2 | map board with frame + pins | london | lines 5-12,16 (9 shots) | hero set piece behind the faces |
| 3 | submarine conning tower + deck section | sub | lines 3-4 | the flashback opener; kit boxes read flat |
| 4 | large map board | berlin | lines 13-15 | hero set piece, arrows move on it |
| 5 | landing craft (LCVP, bow ramp) | sicily | line 17 | the payoff shot |
| 6 | beached fishing boat | shore | lines 1-2 | foreground dressing near camera |
| 7 | lighthouse | shore | lines 1-2 | far-end practical, dawn beam |
| 8 | hero gravestone | cemetery | lines 18-19 | the closing image (sign text stays a decal) |
| 9 | cypress tree | cemetery | lines 18-19 | receding rows need verticals |
| 10 | MI5 office desk with drawers | london | lines 5-12 | modelled detail near camera |

## Free tier is 5/day (balance 0) — first five

1-5 above. The rest stay in-scene kit builds (the previz already in scenes/set.js):
fishing boat from kit boxes, lighthouse from kit cyl/boxes, gravestone = kit box + sign
(already reads "W. MARTIN"), cypress = kit trees, desk = kit counter. Environment still
owes those places depth, dressing and surfaces through the env-three track; only the
modelled hero pieces wait for a second day or a topped-up account.

## Keep-clear (from Build staging)

- Walking lanes: shore fisherman [−1.3,1.1]→policeman [3.4,1.6]→[1.3,1.25]; sub sailor
  deck lane x 399.4-401; london officers at desk z −402; berlin table z 401.5;
  sicily soldier1 walk to z 1.4; cemetery mourner at grave [−400.8,−400.6].
- Camera lines: every shot in scenes/film.js; no geometry within 1.5 D of a camera path.
- The covered shape (shore, sub stretcher) is a set box under a blanket colour — never
  modelled as a body, in any track.

## Crew organization (Jole, 2026-11-28 08:17 EET — applied exactly)

Crew split BY PLACE, not by tool. Each of the six places (shore, sub, london, berlin,
sicily, cemetery) gets its own crew of three: decimation, textures, three.js. Each crew
owns only its own place's files: its <place>.glb pieces, its textures, and its section
of the set. Nobody edits another place's files or scenes/set.js directly; Lead 1 merges
the places into scenes/set.js one at a time. The browser lead requests the Hunyuan
models and hands each one to the crew of the place that needs it. After the merge:
set bar + a fresh critic on the WHOLE set (not per place).

Piece ownership by place: shore — fishing_boat, lighthouse (+ briefcase is a shared hero
prop, first asset, Lead 1 owns its import); sub — submarine_deck; london — map_board,
office_desk; berlin — map_board; sicily — landing_craft; cemetery — gravestone, cypress.
