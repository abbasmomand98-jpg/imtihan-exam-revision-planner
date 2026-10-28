# Imtihan — Exam Revision Planner (UX Concept)

A working demo of a student exam revision planner: a countdown dashboard for
every paper, topic checklists with a 25-minute focus timer, a past-paper bank,
and a paper-day kit checklist — all in one calm, midnight-violet interface.

> **Sample-data honesty note:** every paper, date, topic, past paper and
> checklist item in this demo is invented sample data for demonstration only.
> No real roll number, CNIC, phone number, student, or exam hall is used
> anywhere in this project.

## How it works

- **Paper countdown** — each paper's date is counted from the day you open the
  page (today + a fixed number of days), so the countdown always works. The
  nearest paper is highlighted as "Next paper" with its revision progress ring.
- **Search & filter** — type in the search box to filter the 6 sample papers;
  type a year (e.g. 2024) to filter a paper's past-paper bank.
- **Topic checklists** — tick topics as you revise them. Your ticks are saved
  in your browser's `localStorage` (key `imtihan-state-v1`), so your progress
  survives a refresh. The progress bar and percentage update live.
- **Focus timer** — a 25-minute Pomodoro timer. Start, pause, and reset it;
  when it reaches zero it tells you to take a 5-minute break.
- **Paper-day kit** — a morning checklist (roll-number slip, ID card,
  stationery, water, watch) that is also saved per paper, plus a last-night
  revision card holding only the handful of ideas that matter most.

The demo ships 6 sample papers (Data Structures, Software Engineering, Theory
of Automata, Probability & Statistics, Computer Organization, Multivariable
Calculus), 34 topics in total, 13 sample past papers, and a 5-item kit per
paper.

## What you can learn from this project

- **Date maths without a library** — `daysUntil` normalises both dates to
  midnight, so daylight-saving shifts and time-of-day never corrupt the
  countdown.
- **Keeping logic testable** — all pure logic lives in `logic.js` with no DOM
  access, and the checklist storage is injected as a plain object, so the same
  code runs in the browser and in Node tests (`node test.js`).
- **State that survives refresh** — `loadState`/`saveState` wrap
  `localStorage` with safe fallbacks: corrupt stored JSON quietly resets to
  defaults instead of breaking the page.
- **Small, honest UI patterns** — progress rings, days-left chips, and urgency
  bands (`soon` / `near` / `later`) that any student planner can reuse.

Fork it and adapt the pattern to your own local problem: swap the sample
papers for your own subjects, change the focus length, or point the kit list at
whatever your exam day actually needs — the structure stays the same.

## Files

- `index.html` — page structure
- `style.css` — midnight violet (#4C1D95) on off-white (#F8FAFC) styling
- `data.js` — the 6 sample papers (all labelled SAMPLE DATA)
- `logic.js` — countdown, filter, timer, and checklist logic (no DOM)
- `app.js` — DOM wiring
- `test.js` — smoke test (run `node test.js`)

Open `index.html` in any browser — no build step, no framework, no server.
Live demo: https://abbasmomand98-jpg.github.io/imtihan-exam-revision-planner/
