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

## GENERATION REQUEST (browser lead — IMAGE-TO-3D route, Jole 09:07 EET)

Jole's order: «hy3d ابقي اعملي صور عندك وهو يحولها للمجسمات افضل من text» — make the pictures
at our end, HY3D converts them to models; better than text. So: reference IMAGES are generated
here (image generation, film's ink-outline look), then HY3D **image-to-3D** on those images.
The text-to-3D prompts below are superseded (kept only as the picture descriptions).

Reference images: assets/set/ref/<piece>.webp — ALL 10 GENERATED AND ON DISK (09:12 EET):
briefcase.webp, london_map_board.webp, submarine_deck.webp, berlin_map_board.webp,
landing_craft.webp, fishing_boat.webp, lighthouse.webp, gravestone.webp, cypress.webp,
office_desk.webp. Browser lead: upload each to HY3D image-to-3D in the order below, briefcase
first; download each .glb to assets/set/raw/<piece>.glb. (Qwen4-Max may refine a description
if a picture is off — snippets only.)
Accounts (both signed in, 0 credits, 5 free/day each): pal59@catgroup.uk (browser-task:ac997909)
and setmsfax@catgroup.uk (browser-task:16a83950). Generate in the order below, 5 per account.
FIRST = briefcase (assets/set/ref/media-generation-briefcase-0-*.webp) on one account; after it
is imported and decimated to 76,000 faces, STOP for Jole's first-asset approval (guard check 6)
before importing more. Download each .glb to assets/set/raw/<piece>.glb.

Picture descriptions (what each reference image shows):
1. briefcase — 1940s British officer's locked leather briefcase, worn brown leather, brass
   locks and corner protectors, short steel chain on the handle, closed, three-quarter view.
2. london_map_board — large wooden-framed war-room map board on a stand, blank pale map
   surface, a few coloured pins and string, no text.
3. submarine_deck — conning tower + forward deck of a 1940s British submarine, dark steel,
   deck lamp, railing, periscope mast, side-front view.
4. berlin_map_board — very large wall map board, wooden frame, blank grey-green surface,
   red arrow markers, no text.
5. landing_craft — WWII LCVP landing craft, bow ramp lowered, grey-green steel, beached on sand.
6. fishing_boat — small wooden Spanish fishing rowboat beached on sand, oars inside.
7. lighthouse — Spanish coastal lighthouse, white with red bands, lamp room on top.
8. gravestone — simple upright headstone, weathered grey stone, blank face.
9. cypress — tall dark Mediterranean cypress tree, column shape.
10. office_desk — 1940s British office desk with drawers, dark wood, green-shaded desk lamp,
    paper stacks on top.

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
