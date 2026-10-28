/* Imtihan — DOM wiring. Depends on data.js + logic.js loaded before it. */
(function () {
  "use strict";

  var state = loadState(window.localStorage);
  var selectedId = PAPERS[0].id;
  var timerLeft = FOCUS_SECONDS;
  var timerRunning = false;
  var timerHandle = null;

  function $(id) { return document.getElementById(id); }

  function doneTopics(paper) {
    return state.topics[paper.id] !== undefined ? state.topics[paper.id] : paper.doneTopics;
  }

  function doneKit(paper) {
    return state.kit[paper.id] || [];
  }

  function selectedPaper() {
    return PAPERS.find(function (p) { return p.id === selectedId; }) || PAPERS[0];
  }

  function renderNextPaper() {
    var next = nextPaper(PAPERS, new Date());
    if (!next) return;
    $("nextPaperSubject").textContent = next.paper.subject;
    $("nextPaperMeta").textContent =
      daysLabel(next.days) + " · " + next.paper.time + " · " + next.paper.hall;
    $("nextPaperRing").textContent = progressPercent(next.paper, doneTopics(next.paper)) + "%";
  }

  function renderPaperList() {
    var query = $("searchInput").value;
    var list = filterPapers(PAPERS, query);
    var html = "";
    list.forEach(function (p) {
      var days = daysUntil(p, new Date());
      var pct = progressPercent(p, doneTopics(p));
      html += '<button class="paper-row' + (p.id === selectedId ? " active" : "") +
        '" data-paper="' + p.id + '">' +
        '<span class="row-main"><strong>' + p.subject + "</strong>" +
        '<small>' + daysLabel(days) + " · " + p.time + " · " + p.hall + "</small></span>" +
        '<span class="row-ring">' + pct + "%</span>" +
        '<span class="row-chip ' + urgency(days) + '">' + daysLabel(days).toUpperCase() + "</span>" +
        "</button>";
    });
    $("paperList").innerHTML = html || '<p class="empty">No paper matches that search.</p>';
    var rows = $("paperList").querySelectorAll("[data-paper]");
    rows.forEach(function (row) {
      row.addEventListener("click", function () {
        selectedId = row.getAttribute("data-paper");
        renderAll();
      });
    });
  }

  function renderPlanner() {
    var p = selectedPaper();
    var done = doneTopics(p);
    $("detailSubject").textContent = p.subject;
    $("detailMeta").textContent =
      daysLabel(daysUntil(p, new Date())) + " to go · " + p.time + " · " + p.hall;
    $("progressText").textContent = done.length + " of " + p.topics.length + " topics done · " + progressPercent(p, done) + "%";
    $("progressFill").style.width = progressPercent(p, done) + "%";
    var html = "";
    p.topics.forEach(function (t, i) {
      var on = done.includes(i);
      html += '<label class="topic' + (on ? " done" : "") + '">' +
        '<input type="checkbox" data-topic="' + i + '"' + (on ? " checked" : "") + ">" +
        "<span>" + t + "</span></label>";
    });
    $("topicList").innerHTML = html;
    var boxes = $("topicList").querySelectorAll("[data-topic]");
    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        var idx = parseInt(box.getAttribute("data-topic"), 10);
        var current = doneTopics(p);
        state.topics[p.id] = toggleIndex(current, idx);
        saveState(window.localStorage, state);
        renderAll();
      });
    });
    $("timerTopic").textContent = "Now revising: " + (p.topics[done.length] || p.topics[p.topics.length - 1]);
  }

  function renderBank() {
    var p = selectedPaper();
    var query = $("pastPaperSearch").value;
    var list = filterPastPapers(p, query);
    var html = "";
    list.forEach(function (pp) {
      html += '<div class="bank-row"><div><strong>' + p.subject + " · " + pp.year +
        "</strong><small>Midterm · " + pp.questions + " questions · sample paper</small></div>" +
        '<button class="open-btn" type="button">Open</button></div>';
    });
    $("pastPaperList").innerHTML = html || '<p class="empty">No past paper for that year.</p>';
    $("bankSubject").textContent = "Past-paper bank · " + p.subject;
    $("lastNightText").textContent = p.lastNight;
  }

  function renderKit() {
    var p = selectedPaper();
    var done = doneKit(p);
    $("kitSubject").textContent = "Paper-day kit · " + p.subject;
    $("kitProgress").textContent = done.length + " of " + p.kit.length + " packed · " + kitProgress(p, done) + "%";
    var html = "";
    p.kit.forEach(function (item, i) {
      var on = done.includes(i);
      html += '<label class="topic' + (on ? " done" : "") + '">' +
        '<input type="checkbox" data-kit="' + i + '"' + (on ? " checked" : "") + ">" +
        "<span>" + item + "</span></label>";
    });
    $("kitList").innerHTML = html;
    var boxes = $("kitList").querySelectorAll("[data-kit]");
    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        var idx = parseInt(box.getAttribute("data-kit"), 10);
        state.kit[p.id] = toggleIndex(doneKit(p), idx);
        saveState(window.localStorage, state);
        renderAll();
      });
    });
  }

  function renderTimer() {
    $("timerDisplay").textContent = formatTime(timerLeft);
    $("timerStart").textContent = timerRunning ? "Pause" : "Start";
  }

  function renderAll() {
    renderNextPaper();
    renderPaperList();
    renderPlanner();
    renderBank();
    renderKit();
    renderTimer();
  }

  $("searchInput").addEventListener("input", renderPaperList);
  $("pastPaperSearch").addEventListener("input", renderBank);

  $("timerStart").addEventListener("click", function () {
    timerRunning = !timerRunning;
    if (timerRunning) {
      timerHandle = setInterval(function () {
        var res = tickTimer(timerLeft);
        timerLeft = res.secondsLeft;
        if (res.done) {
          clearInterval(timerHandle);
          timerRunning = false;
          alert("Focus session done — take a 5-minute break.");
        }
        renderTimer();
      }, 1000);
    } else if (timerHandle) {
      clearInterval(timerHandle);
    }
    renderTimer();
  });

  $("timerReset").addEventListener("click", function () {
    if (timerHandle) clearInterval(timerHandle);
    timerRunning = false;
    timerLeft = FOCUS_SECONDS;
    renderTimer();
  });

  renderAll();
})();
