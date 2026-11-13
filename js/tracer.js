// Memory tracer: replays a list of steps into snapshots of stack / heap / statics / console
// and renders them next to the code with arrows from references to objects.
//
// A trace is { code, steps:[{l, n, o:[op...]}] } or, for editable-input traces,
// { code, input:{fields:[{key,label,def}], build(inp, t)} } where build calls t.s(l, n, ...ops).
//
// l  : line to highlight — a 1-based number, or a substring of the line ("text" or "text@2" for 2nd match)
// n  : explanation HTML for this step
// op : ['call', frameName, {vars}]   push stack frame        ['ret']                 pop frame
//      ['v', name, value]             set local in top frame ['vd', name]            remove local
//      ['new', id, Class, {fields}]   create object          ['f', id, key, value]   set field / element
//      ['arr', id, type, [values]]    create 1D array        ['arr2', id, type, [[..],[..]]] create 2D array
//      ['s', Class, name, value]      set static variable    ['p', text] println     ['pr', text] print
//      ['ptr', arrId, name, idx|null] move a named pointer   ['mark', arrId, idx, 'done'|'hl2'|null]
// Values are strings exactly as Java would show them: '5', '3.0', '"Sam"', 'null', or '@id' for a reference.
(function () {
  const { esc, highlight } = OOP;
  const COLORS = ['#4f46e5', '#0e9f6e', '#e8590c', '#d6336c', '#0b7285', '#9c36b5', '#c08a00', '#1971c2', '#2f9e44', '#e03131'];

  function emptyState() {
    return { frames: [], heap: {}, order: [], statics: {}, sorder: [], out: '', ptrs: {}, marks: {}, changed: [], fresh: [], outPrev: 0 };
  }

  function idxKey(k) { return Array.isArray(k) ? k.join(',') : String(k); }

  function applyOp(st, op) {
    const k = op[0];
    const top = st.frames[st.frames.length - 1];
    switch (k) {
      case 'call': {
        const vars = [];
        const init = op[2] || {};
        Object.keys(init).forEach(n => vars.push([n, init[n]]));
        st.frames.push({ name: op[1], vars });
        vars.forEach(v => st.changed.push('v:' + (st.frames.length - 1) + ':' + v[0]));
        break;
      }
      case 'ret': st.frames.pop(); break;
      case 'v': {
        const f = top; if (!f) throw new Error('no frame for var ' + op[1]);
        const i = f.vars.findIndex(v => v[0] === op[1]);
        if (i >= 0) f.vars[i][1] = op[2]; else f.vars.push([op[1], op[2]]);
        st.changed.push('v:' + (st.frames.length - 1) + ':' + op[1]);
        break;
      }
      case 'vd': { if (top) top.vars = top.vars.filter(v => v[0] !== op[1]); break; }
      case 'new': {
        const fields = [];
        const init = op[3] || {};
        Object.keys(init).forEach(n => fields.push([n, init[n]]));
        st.heap[op[1]] = { kind: 'obj', cls: op[2], fields, label: op[4], n: st.order.length + 1 };
        st.order.push(op[1]); st.fresh.push(op[1]);
        break;
      }
      case 'arr': {
        st.heap[op[1]] = { kind: 'arr', cls: op[2] + '[]', elems: op[3].slice(), label: op[4], n: st.order.length + 1 };
        st.order.push(op[1]); st.fresh.push(op[1]);
        break;
      }
      case 'arr2': {
        st.heap[op[1]] = { kind: 'arr2', cls: op[2] + '[][]', rows: op[3].map(r => r == null ? null : r.slice()), label: op[4], n: st.order.length + 1 };
        st.order.push(op[1]); st.fresh.push(op[1]);
        break;
      }
      case 'f': {
        const o = st.heap[op[1]]; if (!o) throw new Error('no object ' + op[1]);
        if (o.kind === 'obj') {
          const i = o.fields.findIndex(f => f[0] === op[2]);
          if (i >= 0) o.fields[i][1] = op[3]; else o.fields.push([op[2], op[3]]);
        } else if (o.kind === 'arr') o.elems[op[2]] = op[3];
        else if (Array.isArray(op[2])) o.rows[op[2][0]][op[2][1]] = op[3];
        else o.rows[op[2]] = op[3]; // replace a whole row (array of values or null)
        st.changed.push('f:' + op[1] + ':' + idxKey(op[2]));
        break;
      }
      case 's': {
        if (!st.statics[op[1]]) { st.statics[op[1]] = []; st.sorder.push(op[1]); }
        const box = st.statics[op[1]];
        const i = box.findIndex(f => f[0] === op[2]);
        if (i >= 0) box[i][1] = op[3]; else box.push([op[2], op[3]]);
        st.changed.push('s:' + op[1] + ':' + op[2]);
        break;
      }
      case 'p': st.out += op[1] + '\n'; break;
      case 'pr': st.out += op[1]; break;
      case 'ptr': {
        const p = st.ptrs[op[1]] || (st.ptrs[op[1]] = {});
        if (op[3] == null) delete p[op[2]]; else p[op[2]] = op[3];
        break;
      }
      case 'clrptr': delete st.ptrs[op[1]]; break;
      case 'mark': {
        const m = st.marks[op[1]] || (st.marks[op[1]] = {});
        if (op[3] == null) delete m[idxKey(op[2])]; else m[idxKey(op[2])] = op[3];
        break;
      }
      default: throw new Error('unknown op ' + k);
    }
  }

  function isRef(v) { return typeof v === 'string' && v[0] === '@'; }

  function reachable(st) {
    const seen = new Set();
    const stack = [];
    const push = v => { if (isRef(v) && !seen.has(v.slice(1))) { seen.add(v.slice(1)); stack.push(v.slice(1)); } };
    st.frames.forEach(f => f.vars.forEach(v => push(v[1])));
    st.sorder.forEach(c => st.statics[c].forEach(v => push(v[1])));
    while (stack.length) {
      const o = st.heap[stack.pop()];
      if (!o) continue;
      if (o.kind === 'obj') o.fields.forEach(f => push(f[1]));
      else if (o.kind === 'arr') o.elems.forEach(push);
      else o.rows.forEach(r => r && r.forEach(push));
    }
    return seen;
  }

  function buildStates(steps) {
    let st = emptyState();
    const states = [];
    for (const step of steps) {
      const prevOut = st.out.length;
      st = JSON.parse(JSON.stringify(st));
      st.changed = []; st.fresh = []; st.outPrev = prevOut;
      (step.o || []).forEach(op => applyOp(st, op));
      st.l = step.l; st.n = step.n || '';
      st.live = Array.from(reachable(st));
      states.push(st);
    }
    return states;
  }

  function resolveLine(lines, l) {
    if (l == null) return -1;
    if (typeof l === 'number') return l - 1;
    let text = l, nth = 1;
    const m = /^(.*)@(\d+)$/.exec(l);
    if (m) { text = m[1]; nth = +m[2]; }
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(text) && --nth === 0) return i;
    }
    console.warn('tracer: line not found:', l);
    return -1;
  }

  // ---------- rendering ----------
  function valHTML(v, st, srcId) {
    if (v === 'null') return '<span class="nullv">null</span>';
    if (isRef(v)) {
      const id = v.slice(1);
      const o = st.heap[id];
      const color = COLORS[((o ? o.n : 1) - 1) % COLORS.length];
      return '<span class="ref" data-src="' + esc(id) + '" data-color="' + color + '"><i style="background:' + color + '"></i>#' + (o ? o.n : '?') + '</span>';
    }
    return esc(v);
  }

  function rowHTML(k, v, st, flashKey) {
    const flash = st.changed.includes(flashKey) ? ' flash' : '';
    return '<div class="row' + flash + '"><span class="k">' + esc(k) + '</span><span class="val">' + valHTML(v, st) + '</span></div>';
  }

  function cellsHTML(id, elems, st, rowIdx) {
    const ptrs = st.ptrs[id] || {};
    const marks = st.marks[id] || {};
    return elems.map((v, i) => {
      const key = rowIdx == null ? String(i) : rowIdx + ',' + i;
      const names = Object.keys(ptrs).filter(p => {
        const at = ptrs[p];
        return Array.isArray(at) ? (rowIdx != null && at[0] === rowIdx && at[1] === i) : (rowIdx == null && at === i);
      });
      let cls = 'cell';
      if (names.length) cls += ' hl';
      if (marks[key]) cls += ' ' + marks[key];
      if (st.changed.includes('f:' + id + ':' + key)) cls += ' flash';
      return '<div class="' + cls + '"><span class="ix">' + i + '</span><div class="bx">' + valHTML(v, st) + '</div><span class="pt">' + esc(names.join(',')) + '</span></div>';
    }).join('');
  }

  function objHTML(id, st) {
    const o = st.heap[id];
    const garbage = !st.live.includes(id);
    const fresh = st.fresh.includes(id) ? ' fresh' : '';
    let head = '<div class="obj-h"><span>#' + o.n + ' ' + esc(o.label || o.cls) + '</span>' +
      (garbage ? '<span class="gc-tag">🗑 eligible for GC</span>' : (o.kind === 'arr' ? '<span>length ' + o.elems.length + '</span>' : (o.kind === 'arr2' ? '<span>length ' + o.rows.length + '</span>' : ''))) + '</div>';
    let body = '';
    if (o.kind === 'obj') {
      body = o.fields.length ? o.fields.map(f => rowHTML(f[0], f[1], st, 'f:' + id + ':' + f[0])).join('') : '<div class="row"><span class="k muted">(no fields)</span><span></span></div>';
    } else if (o.kind === 'arr') {
      body = '<div class="cells">' + cellsHTML(id, o.elems, st, null) + '</div>';
    } else {
      body = '<div class="grid2">' + o.rows.map((r, ri) => {
        const rowPtr = Object.keys(st.ptrs[id] || {}).filter(p => st.ptrs[id][p] === ri);
        return '<div class="r"><span class="rl">' + (rowPtr.length ? '<b style="color:var(--accent-text)">' + esc(rowPtr.join(',')) + '</b> ' : '') + '[' + ri + ']</span>' +
          (r == null ? '<span class="nullv" style="padding-bottom:20px">null</span>' : '<div class="cells" style="padding:0">' + cellsHTML(id, r, st, ri) + '</div>') + '</div>';
      }).join('') + '</div>';
    }
    return '<div class="objcard' + (garbage ? ' garbage' : '') + fresh + '" data-obj="' + esc(id) + '">' + head + body + '</div>';
  }

  function memHTML(st) {
    let left = '<div class="mem-col"><h4>Stack (local variables)</h4>';
    if (st.sorder.length) {
      left = '<div class="mem-col"><h4>Static area (one copy per class)</h4>' + st.sorder.map(c =>
        '<div class="statics"><div class="statics-h"><span>' + esc(c) + ' (static)</span></div>' +
        st.statics[c].map(f => rowHTML(f[0], f[1], st, 's:' + c + ':' + f[0])).join('') + '</div>').join('') +
        '<h4 style="margin-top:8px">Stack (local variables)</h4>';
    }
    if (!st.frames.length) left += '<div class="muted" style="font-size:12px">— empty —</div>';
    for (let i = st.frames.length - 1; i >= 0; i--) {
      const f = st.frames[i];
      left += '<div class="frame' + (i === st.frames.length - 1 ? ' top' : '') + '"><div class="frame-h"><span>' + esc(f.name) + '</span>' +
        (i === st.frames.length - 1 ? '<span title="currently running">●</span>' : '') + '</div>' +
        (f.vars.length ? f.vars.map(v => rowHTML(v[0], v[1], st, 'v:' + i + ':' + v[0])).join('') : '<div class="row"><span class="k muted">(no locals)</span><span></span></div>') + '</div>';
    }
    left += '</div>';
    let right = '<div class="mem-col"><h4>Heap (objects &amp; arrays)</h4>';
    right += st.order.length ? st.order.filter(id => st.heap[id]).map(id => objHTML(id, st)).join('') : '<div class="muted" style="font-size:12px">— no objects yet —</div>';
    right += '</div>';
    return left + right + '<svg class="arrows"></svg>';
  }

  function drawArrows(mem) {
    const svg = mem.querySelector('svg.arrows');
    if (!svg) return;
    const base = mem.getBoundingClientRect();
    if (!base.width) return;
    let defs = '<defs>';
    COLORS.forEach((c, i) => {
      defs += '<marker id="ah' + i + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + c + '"/></marker>';
    });
    defs += '</defs>';
    let paths = '';
    mem.querySelectorAll('[data-src]').forEach(src => {
      const target = mem.querySelector('[data-obj="' + CSS.escape(src.dataset.src) + '"]');
      if (!target) return;
      const s = src.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      const color = src.dataset.color;
      const mi = COLORS.indexOf(color);
      const sx = s.right - base.left + 2, sy = s.top + s.height / 2 - base.top;
      let d;
      if (t.left - base.left >= sx - 4) {
        const ex = t.left - base.left - 1, ey = Math.min(t.top - base.top + 13, t.bottom - base.top - 6);
        const dx = Math.max(24, (ex - sx) / 2);
        d = 'M' + sx + ',' + sy + ' C' + (sx + dx) + ',' + sy + ' ' + (ex - dx) + ',' + ey + ' ' + ex + ',' + ey;
      } else {
        // heap → heap: loop around the right edge
        const ex = t.right - base.left + 1, ey = Math.min(t.top - base.top + 13, t.bottom - base.top - 6);
        const cx = Math.max(sx, ex) + 30;
        d = 'M' + sx + ',' + sy + ' C' + cx + ',' + sy + ' ' + cx + ',' + ey + ' ' + ex + ',' + ey;
      }
      paths += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.8" opacity=".85" marker-end="url(#ah' + mi + ')"/>';
    });
    svg.innerHTML = defs + paths;
  }

  function mount(root, trace, opts) {
    opts = opts || {};
    const lines = trace.code.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    let states = [];
    let idx = 0;
    let timer = null;

    root.classList.add('tracer');
    root.tabIndex = 0;
    root.innerHTML =
      '<div class="tr-head"><span class="t">▶ Step-by-step visualiser</span>' +
      '<span class="legend"><span>← → keys to step</span><span>🗑 = unreachable object</span></span></div>' +
      (trace.input ? '<div class="tr-input"></div>' : '') +
      '<div class="tr-body"><div class="tr-code">' + highlight(trace.code) + '</div>' +
      '<div class="tr-right"><div class="tr-note"></div><div class="tr-mem"></div>' +
      '<div class="tr-console"></div></div></div>' +
      '<div class="tr-ctrl">' +
      '<button class="btn small" data-a="first" title="First step">⏮</button>' +
      '<button class="btn small" data-a="prev" title="Previous step">◀ Prev</button>' +
      '<button class="btn small primary" data-a="play" title="Play / pause">▶ Play</button>' +
      '<button class="btn small" data-a="next" title="Next step">Next ▶</button>' +
      '<button class="btn small" data-a="last" title="Last step">⏭</button>' +
      '<input type="range" min="0" value="0" aria-label="Step">' +
      '<select aria-label="Speed"><option value="1600">Slow</option><option value="900" selected>Normal</option><option value="400">Fast</option></select>' +
      '<span class="cnt"></span></div>';

    const $ = s => root.querySelector(s);
    const codeBox = $('.tr-code');
    const lineEls = codeBox.querySelectorAll('.ln');
    const note = $('.tr-note'), mem = $('.tr-mem'), con = $('.tr-console'), range = $('input[type=range]'), cnt = $('.cnt');
    const playBtn = $('[data-a=play]');

    function setSteps(steps) {
      states = buildStates(steps);
      idx = 0;
      range.max = Math.max(0, states.length - 1);
      render();
    }

    function render() {
      const st = states[idx];
      if (!st) return;
      lineEls.forEach(e => e.classList.remove('cur', 'prev'));
      const li = resolveLine(lines, st.l);
      if (idx > 0) {
        const pl = resolveLine(lines, states[idx - 1].l);
        if (pl >= 0 && pl !== li && lineEls[pl]) lineEls[pl].classList.add('prev');
      }
      if (li >= 0 && lineEls[li]) {
        const el = lineEls[li];
        el.classList.add('cur');
        const top = el.offsetTop, h = codeBox.clientHeight;
        if (top < codeBox.scrollTop + 20 || top > codeBox.scrollTop + h - 40) codeBox.scrollTop = Math.max(0, top - h / 3);
      }
      note.innerHTML = '<span class="stepno">STEP ' + (idx + 1) + ' / ' + states.length + '</span>' + (st.n || '');
      mem.innerHTML = memHTML(st);
      const old = st.out.slice(0, st.outPrev), add = st.out.slice(st.outPrev);
      con.innerHTML = '<span class="lbl">CONSOLE OUTPUT</span>' + esc(old) + (add ? '<span class="new">' + esc(add) + '</span>' : '');
      con.scrollTop = con.scrollHeight;
      range.value = idx;
      cnt.textContent = (idx + 1) + ' / ' + states.length;
      $('[data-a=prev]').disabled = $('[data-a=first]').disabled = idx === 0;
      $('[data-a=next]').disabled = $('[data-a=last]').disabled = idx >= states.length - 1;
      requestAnimationFrame(() => drawArrows(mem));
    }

    function go(i) { idx = Math.max(0, Math.min(states.length - 1, i)); render(); }
    function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ Play'; }
    function play() {
      if (idx >= states.length - 1) go(0);
      playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => { if (idx >= states.length - 1) stop(); else go(idx + 1); }, +$('select').value);
    }

    root.querySelector('.tr-ctrl').addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'play') { timer ? stop() : play(); return; }
      stop();
      if (act === 'first') go(0);
      if (act === 'prev') go(idx - 1);
      if (act === 'next') go(idx + 1);
      if (act === 'last') go(states.length - 1);
    });
    range.addEventListener('input', () => { stop(); go(+range.value); });
    $('select').addEventListener('change', () => { if (timer) { stop(); play(); } });
    root.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); go(idx - 1); }
    });
    if (window.ResizeObserver) new ResizeObserver(() => drawArrows(mem)).observe(mem);

    if (trace.input) {
      const box = $('.tr-input');
      if (!trace.input.fields.length) box.style.display = 'none';
      box.innerHTML = trace.input.fields.map(f =>
        '<label>' + esc(f.label) + ' <input data-k="' + f.key + '" class="' + (f.short ? 'short' : '') + '" value="' + esc(f.def) + '"></label>').join('') +
        '<button class="btn small primary" data-run>Run with this input</button><span class="err"></span>';
      const run = () => {
        const inp = {};
        box.querySelectorAll('input[data-k]').forEach(i => { inp[i.dataset.k] = i.value; });
        const steps = [];
        const t = { s(l, n, ...o) { if (steps.length < 900) steps.push({ l, n, o }); } };
        try {
          trace.input.build(inp, t);
          box.querySelector('.err').textContent = steps.length >= 900 ? 'Input is large — showing the first 900 steps.' : '';
          stop(); setSteps(steps);
        } catch (err) {
          box.querySelector('.err').textContent = err.message;
        }
      };
      box.querySelector('[data-run]').addEventListener('click', run);
      box.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
      run();
    } else {
      setSteps(trace.steps);
    }
    return { go, get count() { return states.length; }, states: () => states };
  }

  // Parses "5, 3, -2" into numbers; used by editable-input traces.
  function nums(s, opts) {
    opts = opts || {};
    const parts = String(s).split(/[\s,]+/).filter(Boolean);
    if (!parts.length && !opts.allowEmpty) throw new Error('Enter at least one number.');
    const out = parts.map(p => { const v = Number(p); if (!Number.isFinite(v)) throw new Error('"' + p + '" is not a number.'); return v; });
    if (out.length > (opts.max || 12)) throw new Error('Please use at most ' + (opts.max || 12) + ' numbers so the picture stays readable.');
    return out;
  }
  // Rows separated by ";" e.g. "1 2 3; 4 5 6"
  function matrix(s, opts) {
    return String(s).split(';').map(r => nums(r, Object.assign({ max: 8 }, opts)));
  }

  OOP.Tracer = { mount, buildStates, nums, matrix, resolveLine };
})();
