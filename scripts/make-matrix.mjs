#!/usr/bin/env node
// Matrix generator for the cartoon fleet render workflows.
//
// Splits frames 0..N-1 into `chunks` contiguous ranges whose sizes differ by at
// most 1 (the remainder goes +1 to the earliest chunks) — exactly the split used
// by .github/workflows/cartoon-fleet.yml for the backrooms film (N=974, 20 chunks:
// 14 chunks of 49 frames, then 6 chunks of 48).
//
// Usage:
//   node scripts/make-matrix.mjs <N> [chunks]      # YAML include entries -> stdout
//   node scripts/make-matrix.mjs --n=2283 --chunks=20
//   node scripts/make-matrix.mjs <N> [chunks] --json
//
// YAML mode prints only the `include:` entries on stdout (paste-safe); a summary
// (chunk count, size range, expected total for the assemble verify step) goes to
// stderr so it stays visible in the terminal without polluting the paste.
// JSON mode prints { N, chunks, expectedTotal, entries: [{chunk,start,end,size}] }.

const args = process.argv.slice(2);
let N = null, CHUNKS = 20, JSON_OUT = false;
const positional = [];
for (const a of args) {
  if (a === '--json') JSON_OUT = true;
  else if (a.startsWith('--n=')) N = +a.slice(4);
  else if (a.startsWith('--chunks=')) CHUNKS = +a.slice(9);
  else if (a.startsWith('--')) { console.error(`unknown flag: ${a}`); process.exit(2); }
  else positional.push(a);
}
if (positional.length > 0 && N === null) N = +positional[0];
if (positional.length > 1) CHUNKS = +positional[1];

if (!Number.isInteger(N) || N <= 0) {
  console.error('usage: node scripts/make-matrix.mjs <N> [chunks] [--json]');
  console.error('  N = total frames (from the film init: F.info.N), chunks defaults to 20');
  process.exit(2);
}
if (!Number.isInteger(CHUNKS) || CHUNKS <= 0 || CHUNKS > N) {
  console.error(`chunks must be a positive integer <= N (got ${CHUNKS})`);
  process.exit(2);
}

const base = Math.floor(N / CHUNKS);
const rem = N % CHUNKS; // first `rem` chunks get one extra frame
const width = Math.max(2, String(CHUNKS - 1).length);
const entries = [];
let start = 0;
for (let i = 0; i < CHUNKS; i++) {
  const size = base + (i < rem ? 1 : 0);
  entries.push({ chunk: String(i).padStart(width, '0'), start, end: start + size - 1, size });
  start += size;
}

// Self-check: contiguous, complete, sizes within 1 of each other.
const total = entries.reduce((s, e) => s + e.size, 0);
const sizes = entries.map(e => e.size);
if (total !== N || entries[0].start !== 0 || entries[entries.length - 1].end !== N - 1 ||
    Math.max(...sizes) - Math.min(...sizes) > 1 ||
    entries.some((e, i) => i > 0 && e.start !== entries[i - 1].end + 1)) {
  console.error('INTERNAL ERROR: generated matrix failed self-check');
  process.exit(1);
}

if (JSON_OUT) {
  console.log(JSON.stringify({ N, chunks: CHUNKS, expectedTotal: N, entries }, null, 2));
} else {
  for (const e of entries) console.log(`          - {chunk: "${e.chunk}", start: ${e.start}, end: ${e.end}}`);
  console.error(`# chunks=${CHUNKS}  sizes=${Math.min(...sizes)}..${Math.max(...sizes)}  frames 0..${N - 1}`);
  console.error(`# EXPECTED TOTAL (assemble verify step): ${N}`);
}
