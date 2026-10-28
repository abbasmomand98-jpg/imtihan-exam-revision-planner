/* Imtihan — pure logic, no DOM. Safe to require() in Node for tests. */

const DAY_MS = 24 * 60 * 60 * 1000;

/* Paper date = today (midnight) + daysFromToday. Keeps the demo's countdown
   working whenever it is opened, without claiming a real exam date. */
function paperDate(paper, now) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() + paper.daysFromToday);
  return d;
}

function daysUntil(paper, now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((paperDate(paper, now) - today) / DAY_MS);
}

function daysLabel(days) {
  if (days < 0) return "Done";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return days + " days";
}

function urgency(days) {
  if (days <= 5) return "soon";
  if (days <= 10) return "near";
  return "later";
}

/* Percent of a paper's topics marked done. doneSet = array of done indexes. */
function progressPercent(paper, doneSet) {
  if (!paper.topics.length) return 0;
  const done = paper.topics.filter((_, i) => doneSet.includes(i)).length;
  return Math.round((done / paper.topics.length) * 100);
}

function nextPaper(papers, now) {
  const upcoming = papers
    .map(p => ({ paper: p, days: daysUntil(p, now) }))
    .filter(x => x.days >= 0)
    .sort((a, b) => a.days - b.days);
  return upcoming.length ? upcoming[0] : null;
}

function filterPapers(papers, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return papers.slice();
  return papers.filter(p => p.subject.toLowerCase().includes(q));
}

function filterPastPapers(paper, query) {
  const q = (query || "").trim();
  if (!q) return paper.pastPapers.slice();
  return paper.pastPapers.filter(pp => String(pp.year) === q);
}

/* --- focus timer --- */
function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
}

function tickTimer(secondsLeft) {
  const next = Math.max(0, secondsLeft - 1);
  return { secondsLeft: next, display: formatTime(next), done: next === 0 };
}

/* --- checklist state (storage-agnostic so tests can inject a fake store) --- */
const STATE_KEY = "imtihan-state-v1";

function defaultState() {
  return { topics: {}, kit: {} };
}

function loadState(store) {
  try {
    const raw = store.getItem(STATE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultState();
    return { topics: parsed.topics || {}, kit: parsed.kit || {} };
  } catch (e) {
    return defaultState();
  }
}

function saveState(store, state) {
  try {
    store.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

/* Toggle one index in a Set-like array; returns a NEW array (no mutation). */
function toggleIndex(list, index) {
  const set = list.slice();
  const at = set.indexOf(index);
  if (at === -1) set.push(index);
  else set.splice(at, 1);
  return set.sort((a, b) => a - b);
}

function kitProgress(paper, doneKit) {
  if (!paper.kit.length) return 0;
  return Math.round((doneKit.length / paper.kit.length) * 100);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DAY_MS, paperDate, daysUntil, daysLabel, urgency, progressPercent,
    nextPaper, filterPapers, filterPastPapers, formatTime, tickTimer,
    STATE_KEY, defaultState, loadState, saveState, toggleIndex, kitProgress
  };
}
