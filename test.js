/* Imtihan — smoke test. Run: node test.js (must exit 0). */
const assert = require("assert");
const L = require("./logic.js");
const { PAPERS, FOCUS_SECONDS } = require("./data.js");

let n = 0;
function ok(cond, msg) { n++; assert.ok(cond, msg); }
function eq(a, b, msg) { n++; assert.strictEqual(a, b, msg); }

const now = new Date(2026, 9, 28); // 28 Oct 2026, local midnight
const ds = PAPERS[0]; // Data Structures, +5 days

/* countdown maths (8) */
eq(L.daysUntil(ds, now), 5, "DS is 5 days away");
eq(L.daysUntil(PAPERS[1], now), 7, "SE is 7 days away");
eq(L.daysUntil(PAPERS[5], now), 16, "MVC is 16 days away");
eq(L.daysLabel(0), "Today", "0 -> Today");
eq(L.daysLabel(1), "Tomorrow", "1 -> Tomorrow");
eq(L.daysLabel(5), "5 days", "5 -> 5 days");
eq(L.daysLabel(-1), "Done", "past -> Done");
eq(L.urgency(3), "soon", "3 days is soon");
eq(L.urgency(8), "near", "8 days is near");
eq(L.urgency(14), "later", "14 days is later");

/* ordering + next paper (3) */
const next = L.nextPaper(PAPERS, now);
eq(next.paper.id, "ds", "next paper is Data Structures");
eq(next.days, 5, "next paper in 5 days");
const pastOnly = [{ daysFromToday: -2, topics: [] }];
eq(L.nextPaper(pastOnly, now), null, "no upcoming paper -> null");

/* progress percent (4) */
eq(L.progressPercent(ds, [0, 1, 2]), 43, "3 of 7 topics = 43%");
eq(L.progressPercent(ds, []), 0, "none done = 0%");
eq(L.progressPercent(ds, [0, 1, 2, 3, 4, 5, 6]), 100, "all done = 100%");
eq(L.progressPercent(PAPERS[5], []), 0, "MVC none done = 0%");

/* filters (7) */
eq(L.filterPapers(PAPERS, "").length, 6, "empty query returns all 6");
eq(L.filterPapers(PAPERS, "data").length, 1, "search 'data' matches 1");
eq(L.filterPapers(PAPERS, "DATA").length, 1, "search is case-insensitive");
eq(L.filterPapers(PAPERS, "xyz").length, 0, "no match returns empty");
eq(L.filterPapers(PAPERS, "  automata ").length, 1, "query is trimmed");
eq(L.filterPastPapers(ds, "").length, 3, "DS has 3 past papers");
eq(L.filterPastPapers(ds, "2024").length, 1, "year filter matches 1");
eq(L.filterPastPapers(ds, "1999").length, 0, "unknown year returns empty");

/* timer logic (6) */
eq(L.formatTime(1500), "25:00", "1500s formats to 25:00");
eq(L.formatTime(61), "01:01", "61s formats to 01:01");
eq(L.formatTime(0), "00:00", "0s formats to 00:00");
eq(L.formatTime(-5), "00:00", "negative clamps to 00:00");
const t1 = L.tickTimer(1500);
eq(t1.secondsLeft, 1499, "tick decrements by 1");
eq(t1.display, "24:59", "tick display is 24:59");
ok(!t1.done, "not done at 1499");
const t0 = L.tickTimer(1);
eq(t0.secondsLeft, 0, "tick to zero");
ok(t0.done, "done at zero");

/* checklist persistence logic (8) */
const fakeStore = { data: {}, getItem(k) { return this.data[k] || null; }, setItem(k, v) { this.data[k] = v; } };
const fresh = L.loadState(fakeStore);
eq(fresh.topics && Object.keys(fresh.topics).length, 0, "fresh state has no topics");
eq(L.saveState(fakeStore, { topics: { ds: [0, 2] }, kit: { ds: [1] } }), true, "save succeeds");
const loaded = L.loadState(fakeStore);
eq(JSON.stringify(loaded.topics.ds), "[0,2]", "topics round-trip");
eq(JSON.stringify(loaded.kit.ds), "[1]", "kit round-trips");
eq(JSON.stringify(L.toggleIndex([0, 2], 1)), "[0,1,2]", "toggle adds index");
eq(JSON.stringify(L.toggleIndex([0, 1, 2], 1)), "[0,2]", "toggle removes index");
eq(JSON.stringify(L.toggleIndex([], 3)), "[3]", "toggle on empty list");
const broken = { getItem() { return "{not json"; }, setItem() {} };
eq(Object.keys(L.loadState(broken).topics).length, 0, "corrupt state falls back to default");
eq(L.kitProgress(ds, [0, 1, 2]), 60, "3 of 5 kit items = 60%");
eq(L.kitProgress(ds, []), 0, "empty kit = 0%");

/* data sanity (4) */
eq(PAPERS.length, 6, "6 sample papers");
ok(PAPERS.every(p => p.topics.length >= 5), "every paper has 5+ topics");
ok(PAPERS.every(p => p.pastPapers.length >= 2), "every paper has 2+ past papers");
eq(FOCUS_SECONDS, 1500, "focus session is 25 minutes");

console.log("PASS: " + n + " assertions");
