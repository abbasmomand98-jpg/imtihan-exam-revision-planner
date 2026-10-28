/* Imtihan — Exam Revision Planner (UX Concept)
   SAMPLE DATA ONLY. Every paper, date, topic and past paper below is invented
   for demonstration. No real roll number, CNIC, phone number, student or
   exam hall is used anywhere in this project. */

const PAPERS = [
  {
    id: "ds",
    subject: "Data Structures",
    daysFromToday: 5,
    time: "9:00 AM",
    hall: "Hall B",
    topics: ["Arrays & Big-O", "Linked lists", "Stacks & queues", "Trees & traversal",
             "Graphs & BFS / DFS", "Hashing", "Sorting & searching"],
    doneTopics: [0, 1, 2],
    pastPapers: [
      { year: 2024, questions: 12 },
      { year: 2023, questions: 10 },
      { year: 2022, questions: 11 }
    ],
    lastNight: "10 key ideas: Trees & Graphs — traversal orders, BST rules, BFS vs DFS, and graph representations.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Water bottle", "Watch · no phone in hall"]
  },
  {
    id: "se",
    subject: "Software Engineering",
    daysFromToday: 7,
    time: "9:00 AM",
    hall: "Hall C",
    topics: ["SDLC models", "Requirements", "Use cases & UML", "Design patterns",
             "Testing types", "Agile & Scrum"],
    doneTopics: [0, 1],
    pastPapers: [
      { year: 2024, questions: 9 },
      { year: 2023, questions: 10 }
    ],
    lastNight: "8 key ideas: SDLC models compared, UML diagram types, and testing levels.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Water bottle", "Watch · no phone in hall"]
  },
  {
    id: "toa",
    subject: "Theory of Automata",
    daysFromToday: 9,
    time: "9:00 AM",
    hall: "Hall A",
    topics: ["Finite automata", "Regular expressions", "Context-free grammars",
             "Pushdown automata", "Turing machines"],
    doneTopics: [0],
    pastPapers: [
      { year: 2024, questions: 8 },
      { year: 2023, questions: 9 }
    ],
    lastNight: "6 key ideas: DFA vs NFA, regex to FA, and the pumping lemma in one line each.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Water bottle", "Watch · no phone in hall"]
  },
  {
    id: "ps",
    subject: "Probability & Statistics",
    daysFromToday: 12,
    time: "2:00 PM",
    hall: "Hall B",
    topics: ["Probability basics", "Random variables", "Distributions",
             "Sampling", "Hypothesis testing", "Regression"],
    doneTopics: [0, 1, 2],
    pastPapers: [
      { year: 2024, questions: 11 },
      { year: 2023, questions: 10 }
    ],
    lastNight: "7 key ideas: Bayes in one line, normal vs binomial, and the five test steps.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Calculator", "Watch · no phone in hall"]
  },
  {
    id: "coa",
    subject: "Computer Organization",
    daysFromToday: 14,
    time: "9:00 AM",
    hall: "Hall D",
    topics: ["Number systems", "CPU & datapath", "Memory hierarchy",
             "Cache & pipelining", "I/O systems"],
    doneTopics: [0],
    pastPapers: [
      { year: 2024, questions: 10 },
      { year: 2023, questions: 8 }
    ],
    lastNight: "6 key ideas: cache levels, pipeline stages, and addressing modes.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Water bottle", "Watch · no phone in hall"]
  },
  {
    id: "mvc",
    subject: "Multivariable Calculus",
    daysFromToday: 16,
    time: "9:00 AM",
    hall: "Hall A",
    topics: ["Partial derivatives", "Multiple integrals", "Vector fields",
             "Line & surface integrals", "Green's & Stokes' theorems"],
    doneTopics: [],
    pastPapers: [
      { year: 2024, questions: 9 },
      { year: 2023, questions: 9 }
    ],
    lastNight: "5 key ideas: partials chain rule, Jacobian in one line, and the three big theorems.",
    kit: ["Roll-number slip", "Student ID card", "Stationery · pens, scale", "Calculator", "Watch · no phone in hall"]
  }
];

const FOCUS_SECONDS = 25 * 60;

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PAPERS, FOCUS_SECONDS };
}
