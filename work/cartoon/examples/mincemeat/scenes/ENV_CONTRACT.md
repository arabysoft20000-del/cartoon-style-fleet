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

## GENERATION REQUEST (browser lead — start now, parallel to Build/Camera)

Accounts (both signed in, 0 credits, 5 free/day each): pal59@catgroup.uk (browser-task:ac997909)
and setmsfax@catgroup.uk (browser-task:16a83950). Generate in the order below, 5 per account.
FIRST = briefcase on one account; after it is imported and decimated, STOP for Jole's
first-asset approval (guard check 6) before importing more. Download each .glb to
assets/set/raw/<piece>.glb. Prompts drafted by the coordinator from .suite/qwen_hy3d_packet.md
(the team can describe the pieces; Qwen4-Max verification optional, snippets only).
Shared style in every prompt: "thick dark ink outlines, flat bold colours, clean cartoon
surfaces, chunky stylised proportions, not photorealistic, single object, no people, no text
or letters, neutral pose, full object visible, plain background."
Negative (every piece): "photorealistic, fine texture noise, people, text, letters, watermark, multiple objects"

1. briefcase — "A 1940s British officer's locked leather briefcase, worn brown leather, brass
   locks and corner protectors, a short steel chain attached to the handle, closed, three-quarter view."
2. london_map_board — "A large wooden-framed war-room map board on a wooden stand, blank pale
   map surface with a few coloured pins and string lines, no text."
3. submarine_deck — "The conning tower and forward deck section of a 1940s British submarine,
   dark steel hull, small deck lamp, railing, periscope mast, seen from the side-front."
4. berlin_map_board — "A very large wall-mounted map board in a wooden frame, blank grey-green
   map surface with red arrow markers, no text."
5. landing_craft — "A WWII LCVP landing craft with its bow ramp lowered, grey-green steel,
   boxy hull, beached on sand, seen from front-side."
6. fishing_boat — "A small wooden Spanish fishing rowboat beached on sand, worn planks, oars
   resting inside, seen from the side."
7. lighthouse — "A Spanish coastal lighthouse, white tower with red bands, small lamp room with
   glass top, rocky base."
8. gravestone — "A simple upright cemetery headstone, weathered grey stone, blank smooth face,
   slight rounded top, standing on a small base."
9. cypress — "A tall dark Mediterranean cypress tree, narrow column shape, dense dark green foliage."
10. office_desk — "A 1940s British office desk with drawers, dark wood, a green-shaded desk lamp
    and neat stacks of paper on top, seen from front-side."

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
