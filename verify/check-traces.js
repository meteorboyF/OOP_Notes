// Replays every trace headlessly and checks:
//  1. every step's line reference resolves to a line in the code,
//  2. the trace's final console output equals the answer's output,
//  3. the answer's output equals what real Java printed (verify/<dir>/expected.txt), when such a dir exists.
// Usage: node verify/check-traces.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = { window: {}, console, CSS: { escape: s => s }, requestAnimationFrame: () => {} };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['js/core.js', 'js/tracer.js', 'js/widgets.js', 'js/data/concepts.js', 'js/data/q-class.js', 'js/data/q-class-2.js', 'js/data/q-array.js', 'js/data/practice.js', 'js/data/practice-class.js']) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
}
const OOP = ctx.OOP;
let fails = 0, checked = 0, javaChecked = 0;
const norm = s => (s || '').replace(/\r/g, '').replace(/\s+$/, '');

function checkSteps(name, codeText, steps, expected) {
  const lines = codeText.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  steps.forEach((st, i) => {
    if (st.l != null && OOP.Tracer.resolveLine(lines, st.l) < 0) { fails++; console.log('✗ ' + name + ' step ' + (i + 1) + ': line not found: ' + st.l); }
  });
  let states;
  try { states = OOP.Tracer.buildStates(steps); } catch (e) { fails++; console.log('✗ ' + name + ': ' + e.message); return; }
  const out = states.length ? states[states.length - 1].out : '';
  if (expected != null && norm(out) !== norm(expected)) {
    fails++;
    console.log('✗ ' + name + ': trace output differs\n--- trace ---\n' + out + '--- expected ---\n' + expected);
  }
  checked++;
}

const origWarn = console.warn; console.warn = () => {};
for (const q of OOP.questions) {
  const tr = typeof q.trace === 'string' ? OOP.traces[q.trace] : q.trace;
  if (tr && tr.steps) checkSteps(q.id, tr.code || q.given, tr.steps, q.answer && q.answer.output);
  const dir = path.join(__dirname, 'q' + q.id.replace('-q', '_').replace(/[()]/g, ''));
  const exp = path.join(dir, 'expected.txt');
  if (fs.existsSync(exp) && q.answer && q.answer.output) {
    javaChecked++;
    if (norm(fs.readFileSync(exp, 'utf8')) !== norm(q.answer.output)) { fails++; console.log('✗ ' + q.id + ': answer differs from real Java output in ' + exp); }
  }
}
for (const id of Object.keys(OOP.traces)) {
  const tr = OOP.traces[id];
  if (tr.steps) checkSteps('trace:' + id, tr.code, tr.steps, tr.expect);
}
// practice: run builders with default input, and compare to p.output if given
for (const p of OOP.practice) {
  const inp = {};
  p.input.fields.forEach(f => { inp[f.key] = f.def; });
  const steps = [];
  try {
    p.input.build(inp, { s(l, n, ...o) { steps.push({ l, n, o }); } });
  } catch (e) { fails++; console.log('✗ practice ' + p.id + ': ' + e.message); continue; }
  checkSteps('practice:' + p.id, p.code, steps, p.output);
  const exp = path.join(__dirname, 'p_' + p.id.replace(/^p-/, '').replace(/-/g, '_'), 'expected.txt');
  if (fs.existsSync(exp)) {
    javaChecked++;
    if (norm(fs.readFileSync(exp, 'utf8')) !== norm(p.output)) { fails++; console.log('✗ ' + p.id + ': output differs from real Java:\n' + fs.readFileSync(exp, 'utf8')); }
  } else if (process.argv.includes('--export')) {
    fs.mkdirSync(path.dirname(exp), { recursive: true });
    fs.writeFileSync(path.join(path.dirname(exp), p.cls + '.java'), p.full + '\n');
  } else { fails++; console.log('✗ ' + p.id + ': no Java verification program (run with --export, then verify/run.sh)'); }
}
console.warn = origWarn;
console.log(`\nquestions: ${OOP.questions.length}, practice: ${OOP.practice.length}, traces checked: ${checked}, answers checked against real Java: ${javaChecked}`);
console.log(fails ? `${fails} problem(s)` : 'all good ✓');
process.exit(fails ? 1 : 0);
