// Small interactive widgets that can be dropped into concept pages with <div data-widget="name">.
(function () {
  const { esc, highlight } = OOP;
  const quizzes = {};

  // ---------- Java "+" evaluator (left-to-right, with types) ----------
  function tokenize(s) {
    const toks = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '+' || c === '(' || c === ')' || c === '*' || c === '-') { toks.push({ t: c }); i++; continue; }
      if (c === '"') { const j = s.indexOf('"', i + 1); if (j < 0) throw new Error('Unclosed "string"'); toks.push({ t: 'v', type: 'String', v: s.slice(i + 1, j) }); i = j + 1; continue; }
      if (c === "'") { if (s[i + 2] !== "'") throw new Error("A char literal holds exactly one character, like 'a'"); toks.push({ t: 'v', type: 'char', v: s[i + 1] }); i += 3; continue; }
      const m = /^\d+(\.\d+)?/.exec(s.slice(i));
      if (m) { toks.push({ t: 'v', type: m[1] ? 'double' : 'int', v: Number(m[0]) }); i += m[0].length; continue; }
      throw new Error('Only literals, + - * and ( ) are supported here. Problem near: ' + s.slice(i, i + 8));
    }
    return toks;
  }
  function show(x) {
    if (x.type === 'String') return '"' + x.v + '"';
    if (x.type === 'char') return "'" + x.v + "'";
    if (x.type === 'double') return Number.isInteger(x.v) ? x.v + '.0' : String(x.v);
    return String(x.v);
  }
  function asText(x) { return x.type === 'String' ? x.v : x.type === 'char' ? x.v : show(x); }
  function num(x) { return x.type === 'char' ? x.v.charCodeAt(0) : x.v; }
  function combine(a, op, b, steps) {
    let r;
    if (op === '+' && (a.type === 'String' || b.type === 'String')) {
      r = { type: 'String', v: asText(a) + asText(b) };
      steps.push(show(a) + ' + ' + show(b) + '  →  ' + show(r) + '   <span class="s">(one side is a String ⇒ join as text)</span>');
      return r;
    }
    if (a.type === 'String' || b.type === 'String') throw new Error('Cannot use ' + op + ' with a String');
    const dbl = a.type === 'double' || b.type === 'double';
    const x = num(a), y = num(b);
    let v = op === '+' ? x + y : op === '-' ? x - y : x * y;
    r = { type: dbl ? 'double' : 'int', v };
    const why = (a.type === 'char' || b.type === 'char') ? 'char is a number here (\'' + (a.type === 'char' ? a.v : b.v) + '\' = ' + (a.type === 'char' ? num(a) : num(b)) + ')' : dbl ? 'numbers, one is double ⇒ double result' : 'both numbers ⇒ arithmetic';
    steps.push(show(a) + ' ' + op + ' ' + show(b) + '  →  ' + show(r) + '   <span class="s">(' + why + ')</span>');
    return r;
  }
  // precedence: * before + -, left to right
  function parseExpr(toks, steps) {
    let i = 0;
    function atom() {
      const t = toks[i++];
      if (!t) throw new Error('Expression ended too early');
      if (t.t === '(') { const v = sum(); if (!toks[i] || toks[i].t !== ')') throw new Error('Missing )'); i++; return v; }
      if (t.t === 'v') return t;
      throw new Error('Unexpected ' + t.t);
    }
    function prod() { let a = atom(); while (toks[i] && toks[i].t === '*') { i++; a = combine(a, '*', atom(), steps); } return a; }
    function sum() { let a = prod(); while (toks[i] && (toks[i].t === '+' || toks[i].t === '-')) { const op = toks[i++].t; a = combine(a, op, prod(), steps); } return a; }
    const r = sum();
    if (i < toks.length) throw new Error('Unexpected ' + toks[i].t);
    return r;
  }

  const widgets = {
    concat(el) {
      const presets = ['"Sum: " + 2 + 3', '"Sum: " + (2 + 3)', "'a' + 2", '1 + 2 + "3" + 4 + 5', '10 + 5.0 + "Bazinga"', '"Bazinga" + 10 + 5.0', "'a' + 'b' + \"c\"", '"" + \'a\' + \'b\''];
      el.innerHTML = '<h4>🧮 Try it: how Java evaluates <code>+</code></h4>' +
        '<p class="muted" style="margin-top:0">Type an expression made of literals. Java goes <b>left to right</b>; the moment one side is a String, <code>+</code> means "join".</p>' +
        '<input type="text" value="' + esc(presets[0]) + '"><div class="badges" style="margin-top:8px">' + presets.map(p => '<button class="chip" data-p="' + esc(p) + '">' + esc(p) + '</button>').join('') + '</div><div class="evsteps"></div>';
      const inp = el.querySelector('input'), out = el.querySelector('.evsteps');
      const run = () => {
        try {
          const steps = [];
          const r = parseExpr(tokenize(inp.value), steps);
          out.innerHTML = steps.map((s, i) => '<div>' + (i + 1) + '. ' + s.replace(/</g, '&lt;').replace(/&lt;span class="s">/g, '<span class="s">').replace(/&lt;\/span>/g, '</span>') + '</div>').join('') +
            '<div style="background:var(--good-soft)"><b>println prints:</b> ' + esc(asText(r)) + '</div>';
        } catch (e) { out.innerHTML = '<div style="color:var(--bad)">' + esc(e.message) + '</div>'; }
      };
      inp.addEventListener('input', run);
      el.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { inp.value = b.dataset.p; run(); });
      run();
    },

    quiz(el) {
      const q = quizzes[el.dataset.id];
      if (!q) return;
      el.innerHTML = '<h4>❓ Quick check</h4><div>' + q.q + '</div><div class="quiz-opts">' +
        q.opts.map((o, i) => '<button class="btn" data-i="' + i + '">' + o + '</button>').join('') + '</div><div class="why"></div>';
      el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        el.querySelectorAll('[data-i]').forEach(x => x.classList.remove('right', 'wrong'));
        b.classList.add(i === q.ans ? 'right' : 'wrong');
        el.querySelector('[data-i="' + q.ans + '"]').classList.add('right');
        el.querySelector('.why').innerHTML = '<div class="callout ' + (i === q.ans ? 'tip' : 'trap') + '"><b class="t">' + (i === q.ans ? 'Correct!' : 'Not quite.') + '</b>' + q.why + '</div>';
      });
    },

    // Build any jagged int array: give row lengths, get the picture + two ways to write the code.
    jagged(el) {
      el.innerHTML = '<h4>🧱 Jagged array builder</h4><p class="muted" style="margin-top:0">Enter the number of cells in each row (exam pictures are usually 1 2 3 4 or 4 3 2 1) and the first value.</p>' +
        '<div class="badges"><label class="muted" style="font-size:.85rem">Row lengths <input type="text" data-k="rows" value="1 2 3 4" style="width:140px"></label>' +
        '<label class="muted" style="font-size:.85rem">Start at <input type="text" data-k="start" value="0" style="width:60px"></label>' +
        '<button class="chip" data-p="1 2 3 4|0">Fall 2017 / Fall 2018</button><button class="chip" data-p="4 3 2 1|1">Summer 2018 / Summer 2019</button></div><div class="out"></div>';
      const rowsIn = el.querySelector('[data-k=rows]'), startIn = el.querySelector('[data-k=start]'), out = el.querySelector('.out');
      const run = () => {
        try {
          const rows = OOP.Tracer.nums(rowsIn.value, { max: 8 }).map(n => { if (n < 0 || n > 10 || !Number.isInteger(n)) throw new Error('Row lengths must be whole numbers 0–10'); return n; });
          let v = Number(startIn.value) || 0;
          const data = rows.map(n => Array.from({ length: n }, () => v++));
          const pic = '<div class="grid2" style="padding:8px 0">' + data.map((r, i) => '<div class="r"><span class="rl" style="padding-bottom:4px">[' + i + ']</span><div class="cells" style="padding:0">' + r.map((x, j) => '<div class="cell"><div class="bx">' + x + '</div></div>').join('') + '</div></div>').join('') + '</div>';
          const lit = 'int[][] a = {\n' + data.map(r => '    {' + r.join(', ') + '}').join(',\n') + '\n};';
          const loop = 'int[][] a = new int[' + rows.length + '][];   // only the number of rows is fixed\n' +
            rows.map((n, i) => 'a[' + i + '] = new int[' + n + '];').join('\n') +
            '\n\nint value = ' + (Number(startIn.value) || 0) + ';\nfor (int i = 0; i < a.length; i++) {\n    for (int j = 0; j < a[i].length; j++) {   // a[i].length, NOT a.length\n        a[i][j] = value++;\n    }\n}';
          out.innerHTML = pic + '<p style="margin-bottom:0"><b>Way 1: initializer list</b> (fastest to write in the exam)</p>' + highlight(lit) + '<p style="margin-bottom:0"><b>Way 2: allocate each row, then fill with loops</b></p>' + highlight(loop);
        } catch (e) { out.innerHTML = '<div class="callout trap">' + esc(e.message) + '</div>'; }
      };
      el.querySelectorAll('input').forEach(i => i.addEventListener('input', run));
      el.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const [r, s] = b.dataset.p.split('|'); rowsIn.value = r; startIn.value = s; run(); });
      run();
    }
  };

  OOP.Widgets = {
    quizzes,
    mount(el) { const w = widgets[el.dataset.widget]; if (w) { el.classList.add('widget'); w(el); } }
  };
})();
