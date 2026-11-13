# OOP Mid Notes (CSE 1115)

Study site for the UIU CSE 1115 Object Oriented Programming mid-term, built from 24 past papers (Fall 2017 – Spring 2026).

**Live site:** https://meteorboyf.github.io/OOP_Notes/

## What's inside

- **Learn**: concept notes for *Class & Object* and *Arrays* (including the Lecture 3 slide theory up to arrays), with exam traps, quizzes and small interactive widgets (String `+` evaluator, jagged array builder).
- **Past mid questions**: every Class/Object and Array question from the papers, with full answers, explanations, tricks and traps. Filter by topic or type, or browse by paper.
- **Step-by-step visualiser**: steps through the code showing the stack, the heap, static variables, reference arrows, garbage-collectable objects and console output.
- **Practice problems**: the course *Class & Object* practice sheet (8 problems) solved with step-by-step traces, plus 32 array problems (basic → medium → hard) whose visualisers run on input you type.
- **Exam cheat-sheet**: every trap that has appeared in a paper, on one page.

Inheritance / polymorphism / abstract classes will be added in a later chapter.

## Verified answers

Every "write the output" answer and every practice solution is compiled and run with real Java:

```bash
./verify/run.sh               # compile + run all programs in verify/, record what Java prints
node verify/check-traces.js   # check answers == Java output, and every visualiser replays to that output
```

CI runs both before each deploy.

## Project layout

```
index.html            app shell
css/style.css         styles (light + dark)
js/core.js            registries, Java highlighter, helpers
js/tracer.js          the memory visualiser engine
js/widgets.js         quizzes, + evaluator, jagged array builder
js/app.js             hash router and page rendering
js/data/*.js          content: concepts, questions, practice problems
verify/               Java programs used to verify answers
```

No build step: open `index.html` through any static server (e.g. `python3 -m http.server`).
