// Hash router + page renderers.
(function () {
  const { esc, codeBlock, outBlock, PAPERS, SUBTOPICS } = OOP;
  const app = document.getElementById('app');
  const TYPE_LABEL = { output: 'Write the output', code: 'Write code', fix: 'Find & fix errors', theory: 'Short answer' };
  const paperOrder = Object.keys(PAPERS);

  const done = new Set(OOP.load('oop-done', []));
  let revealAll = OOP.load('oop-reveal-all', false);

  function sortQs(list) {
    return list.slice().sort((a, b) => paperOrder.indexOf(b.paper) - paperOrder.indexOf(a.paper) || String(a.qno).localeCompare(String(b.qno), undefined, { numeric: true }));
  }
  function qById(id) { return OOP.questions.find(q => q.id === id); }
  function traceOf(obj) {
    const t = typeof obj.trace === 'string' ? OOP.traces[obj.trace] : obj.trace;
    if (t && !t.code && !t.input) t.code = obj.given; // traces default to the question's code
    return t;
  }

  function badgesFor(q) {
    return '<span class="badge ' + q.type + '">' + TYPE_LABEL[q.type] + '</span>' +
      (traceOf(q) ? '<span class="badge viz">▶ visualiser</span>' : '') +
      (q.marks ? '<span class="badge">' + q.marks + ' marks</span>' : '');
  }
  function qItem(q) {
    return '<a class="card qitem" href="#/q/' + q.id + '"><span class="qnum">' + q.paper + ' · Q' + esc(q.qno) + '</span>' +
      '<span><span class="ttl">' + esc(q.title) + '</span><br><span class="sub">' + esc(PAPERS[q.paper]) + ' · ' + q.sub.map(s => SUBTOPICS[s]).join(', ') + '</span></span>' +
      '<span class="badges">' + badgesFor(q) + (done.has(q.id) ? '<span class="done-mark" title="Marked done">✅</span>' : '') + '</span></a>';
  }

  function updateProgress() {
    const total = OOP.questions.length + OOP.practice.length;
    const n = OOP.questions.filter(q => done.has(q.id)).length + OOP.practice.filter(p => done.has(p.id)).length;
    document.getElementById('progressFoot').innerHTML = 'Your progress: <b>' + n + '</b> / ' + total + ' done' +
      '<div class="bar"><span style="width:' + (total ? (100 * n / total) : 0) + '%"></span></div>';
  }

  // ---------- pages ----------
  function home() {
    const nq = OOP.questions.length, nt = OOP.questions.filter(q => traceOf(q)).length + OOP.practice.length;
    const subs = Object.keys(SUBTOPICS);
    const short = p => ({ Spring: 'Sp', Summer: 'Su', Fall: 'Fa' })[PAPERS[p].split(' ')[0]] + PAPERS[p].slice(-2);
    const heat = '<div class="table-wrap"><table class="heat"><thead><tr><th></th>' +
      paperOrder.map(p => '<th title="' + esc(PAPERS[p]) + '">' + short(p) + '</th>').join('') + '</tr></thead><tbody>' +
      subs.map(s => '<tr><th>' + esc(SUBTOPICS[s]) + '</th>' + paperOrder.map(p => {
        const c = OOP.questions.filter(q => q.paper === p && q.sub.includes(s)).length;
        return '<td title="' + esc(PAPERS[p] + ' · ' + SUBTOPICS[s] + ': ' + c + ' question(s)') + '"><span class="hc' + (c ? ' on' : '') + '" style="' + (c ? 'opacity:' + Math.min(1, .45 + c * .25) : '') + '">' + (c || '') + '</span></td>';
      }).join('') + '</tr>').join('') + '</tbody></table></div>' +
      '<p class="muted" style="font-size:.8rem;margin-bottom:0">Sp = Spring, Su = Summer, Fa = Fall; 17 = 2017 … 26 = 2026. Hover a cell for details.</p>';
    return '<div class="page">' +
      '<div class="card hero"><h1>CSE 1115 · OOP mid-term notes</h1>' +
      '<p>Concepts, every Class/Object and Array question from 24 past mid papers (Fall 2017 to Spring 2026) with solutions, ' +
      'exam tricks, and step-by-step visualisers that show the stack, the heap and the references while the code runs.</p>' +
      '<div class="stats"><div class="stat"><b>' + nq + '</b><span>solved past questions</span></div>' +
      '<div class="stat"><b>' + OOP.practice.length + '</b><span>practice problems</span></div>' +
      '<div class="stat"><b>' + nt + '</b><span>interactive visualisers</span></div>' +
      '<div class="stat"><b>24</b><span>papers analysed</span></div></div></div>' +
      '<h2>Start here</h2><div class="grid cols-3">' +
      tile('#/learn/class-object', '📦 Class & Object', 'Constructors, this(), static vs instance, init order, references, GC, encapsulation, final.') +
      tile('#/learn/arrays', '🔢 Arrays', '1D, for-each, 2D & jagged arrays, arrays of objects, the memory picture behind them.') +
      tile('#/cheatsheet', '⚡ Exam cheat-sheet', 'Every trap that has appeared in the papers, on one page. Read it the night before.') +
      tile('#/questions/class', '📝 Class & Object questions', 'Output tracing, write-the-class and fix-the-error questions with full answers.') +
      tile('#/questions/array', '📝 Array questions', 'Every array question from the mids, solved and explained.') +
      tile('#/practice', '💻 Practice problems', 'The course Class & Object sheet solved, plus array problems from basic to hard, all with visualisers.') +
      '</div>' +
      '<h2>What the mids actually ask</h2><p class="muted">Each cell counts questions on that topic in that paper. Darker = more. Initialization order and references show up in nearly every recent paper.</p>' +
      '<div class="card">' + heat + '</div>' +
      '<h2>How to use the visualiser</h2><div class="card"><ol>' +
      '<li>Open any question with the <span class="badge viz">▶ visualiser</span> badge.</li>' +
      '<li>Press <b>Next ▶</b> (or the → key). The highlighted line is the one that just ran.</li>' +
      '<li>Left memory column = the <b>stack</b> (local variables, one box per method call). Right column = the <b>heap</b> (objects and arrays). Arrows are references.</li>' +
      '<li>Objects nobody points to turn red with 🗑: that is exactly what "eligible for garbage collection" means.</li>' +
      '<li>Before stepping, write your own answer on paper. Then check it line by line.</li></ol></div></div>';
  }
  function tile(href, title, text) { return '<a class="card tile" href="' + href + '"><h3>' + title + '</h3><p>' + text + '</p></a>'; }

  function questionsPage(topic, query) {
    const all = OOP.questions.filter(q => q.topic === topic);
    const subs = Object.keys(SUBTOPICS).filter(s => all.some(q => q.sub.includes(s)));
    const state = OOP.load('oop-filter-' + topic, { sub: 'all', type: 'all' });
    const title = topic === 'class' ? 'Class & Object: past mid questions' : 'Arrays: past mid questions';
    setTimeout(() => {
      const draw = () => {
        let list = all.filter(q => (state.sub === 'all' || q.sub.includes(state.sub)) && (state.type === 'all' || q.type === state.type));
        list = sortQs(list);
        const box = document.getElementById('qlist');
        if (!box) return;
        if (state.sub === 'all') {
          // group by subtopic (primary = first sub)
          box.innerHTML = subs.map(s => {
            const g = list.filter(q => q.sub[0] === s);
            return g.length ? '<div class="section-head"><h2>' + esc(SUBTOPICS[s]) + '</h2><span class="muted">' + g.length + '</span></div><div class="qlist">' + g.map(qItem).join('') + '</div>' : '';
          }).join('') || '<div class="empty">No questions match.</div>';
        } else {
          box.innerHTML = list.length ? '<div class="qlist">' + list.map(qItem).join('') + '</div>' : '<div class="empty">No questions match.</div>';
        }
        document.querySelectorAll('[data-fs]').forEach(c => c.classList.toggle('on', state.sub === c.dataset.fs));
        document.querySelectorAll('[data-ft]').forEach(c => c.classList.toggle('on', state.type === c.dataset.ft));
      };
      document.querySelectorAll('[data-fs]').forEach(c => c.onclick = () => { state.sub = c.dataset.fs; OOP.save('oop-filter-' + topic, state); draw(); });
      document.querySelectorAll('[data-ft]').forEach(c => c.onclick = () => { state.type = c.dataset.ft; OOP.save('oop-filter-' + topic, state); draw(); });
      draw();
    });
    return '<div class="page"><h1>' + title + '</h1><p class="muted">' + all.length + ' questions, newest papers first. Questions with <span class="badge viz">▶ visualiser</span> can be traced step by step.</p>' +
      '<div class="filters"><b style="font-size:.85rem">Topic:</b> <button class="chip" data-fs="all">All</button>' +
      subs.map(s => '<button class="chip" data-fs="' + s + '">' + esc(SUBTOPICS[s]) + '</button>').join('') + '</div>' +
      '<div class="filters"><b style="font-size:.85rem">Type:</b> <button class="chip" data-ft="all">All</button>' +
      Object.keys(TYPE_LABEL).filter(t => all.some(q => q.type === t)).map(t => '<button class="chip" data-ft="' + t + '">' + TYPE_LABEL[t] + '</button>').join('') + '</div>' +
      '<div id="qlist"></div></div>';
  }

  function papersPage() {
    return '<div class="page"><h1>Questions by paper</h1><p class="muted">Only the Class/Object and Array questions are covered for now. Inheritance, polymorphism and abstract-class questions will be added in a later chapter.</p>' +
      paperOrder.slice().reverse().map(p => {
        const qs = sortQs(OOP.questions.filter(q => q.paper === p));
        return '<div class="section-head"><h2>' + PAPERS[p] + '</h2><span class="muted">' + qs.length + ' covered</span></div>' +
          (qs.length ? '<div class="qlist">' + qs.map(qItem).join('') + '</div>' : '<p class="muted">No Class/Object or Array questions in this paper (it is mostly inheritance / polymorphism).</p>');
      }).join('') + '</div>';
  }

  function answerHTML(q) {
    const a = q.answer || {};
    let h = '';
    if (a.output) h += '<h3>Output</h3>' + outBlock(a.output);
    if (a.code) h += '<h3>' + (a.codeTitle || 'Solution code') + '</h3>' + codeBlock(a.code);
    if (a.html) h += '<h3>Explanation</h3><div class="prose">' + a.html + '</div>';
    return h;
  }

  function questionPage(id) {
    const q = qById(id);
    if (!q) return notFound();
    const list = sortQs(OOP.questions.filter(x => x.topic === q.topic));
    const i = list.indexOf(q);
    const prev = list[i - 1], next = list[i + 1];
    const tr = traceOf(q);
    const shown = revealAll || OOP.load('oop-rev-' + q.id, false);
    setTimeout(() => {
      const r = document.getElementById('revealBtn');
      if (r) r.onclick = () => { OOP.save('oop-rev-' + q.id, true); document.getElementById('ans').innerHTML = answerHTML(q); wireCopy(); };
      const d = document.getElementById('doneBtn');
      d.onclick = () => { done.has(q.id) ? done.delete(q.id) : done.add(q.id); OOP.save('oop-done', Array.from(done)); d.textContent = done.has(q.id) ? '✅ Done' : '☐ Mark as done'; updateProgress(); };
      if (tr) OOP.Tracer.mount(document.getElementById('trace'), tr);
    });
    const related = OOP.questions.filter(x => x !== q && x.sub[0] === q.sub[0]).slice(0, 8);
    return '<div class="page wide"><div class="crumbs"><a href="#/questions/' + q.topic + '">' + (q.topic === 'class' ? 'Class & Object' : 'Arrays') + ' questions</a> › ' + esc(PAPERS[q.paper]) + ' · Q' + esc(q.qno) + '</div>' +
      '<div class="qhead"><h1>' + esc(q.title) + '</h1><div class="badges">' + badgesFor(q) +
      q.sub.map(s => '<span class="badge">' + esc(SUBTOPICS[s]) + '</span>').join('') +
      '<span class="badge">' + esc(PAPERS[q.paper]) + ' · Q' + esc(q.qno) + '</span>' +
      '<button class="btn small done-toggle" id="doneBtn">' + (done.has(q.id) ? '✅ Done' : '☐ Mark as done') + '</button></div></div>' +
      '<div class="qsec"><h2>📄 Question</h2><div class="prose">' + q.prompt + '</div>' + (q.given ? codeBlock(q.given) : '') + (q.givenOut ? '<p><b>Expected output given in the paper:</b></p>' + outBlock(q.givenOut) : '') + '</div>' +
      (q.traps && q.traps.length ? '<div class="qsec"><h2>⚠️ Traps in this question</h2><ul class="tips-list">' + q.traps.map(t => '<li class="callout trap">' + t + '</li>').join('') + '</ul></div>' : '') +
      '<div class="qsec"><h2>✅ Answer</h2><div id="ans" class="answer">' + (shown ? answerHTML(q) :
        '<div class="reveal"><p>Try it on paper first, then check.</p><button class="btn primary" id="revealBtn">Reveal answer</button></div>') + '</div></div>' +
      (tr ? '<div class="qsec"><h2>▶ Trace it step by step</h2><p class="muted" style="margin-top:0">' + (tr.intro || 'Step through the code and watch the stack, heap and console change.') + '</p><div id="trace"></div></div>' : '') +
      (q.tips && q.tips.length ? '<div class="qsec"><h2>💡 Tricks &amp; tips</h2><ul class="tips-list">' + q.tips.map(t => '<li class="callout tip">' + t + '</li>').join('') + '</ul></div>' : '') +
      (related.length ? '<div class="qsec"><h2>🔗 Similar questions</h2><div class="related">' + related.map(r => '<a class="btn small" href="#/q/' + r.id + '">' + r.paper + ' Q' + esc(r.qno) + ' · ' + esc(r.title) + '</a>').join('') + '</div></div>' : '') +
      '<div class="qnav">' + (prev ? '<a class="btn" href="#/q/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/q/' + next.id + '">' + esc(next.title) + ' →</a>' : '') + '</div></div>';
  }

  function practicePage() {
    const levels = [['class', '📦 Class & Object', 'The course practice sheet: write a class, then test it in main.'], ['basic', '🟢 Basic', 'Single loop over an array. These must be automatic.'], ['medium', '🟡 Medium', 'Two pointers, nested loops, sorting, 2D arrays.'], ['hard', '🔴 Hard', 'Classic interview-style array problems and arrays of objects.']];
    return '<div class="page"><h1>Practice: write the code</h1>' +
      '<p class="muted">The Class &amp; Object problems are the course practice sheet, solved. The array problems go from basic to hard, and their visualisers let <b>you change the input</b> and watch the loop run. Every solution was run through Java. ' +
      'Problems tagged <span class="badge">mid</span> came up in a past mid paper.</p>' +
      levels.map(([lv, name, d]) => {
        const ps = OOP.practice.filter(p => p.level === lv);
        return '<div class="section-head"><h2>' + name + '</h2><span class="muted">' + ps.length + ' problems · ' + d + '</span></div><div class="qlist">' +
          ps.map((p, i) => '<a class="card qitem" href="#/p/' + p.id + '"><span class="qnum">' + (lv === 'class' ? 'C' : lv[0].toUpperCase()) + (i + 1) + '</span><span><span class="ttl">' + esc(p.title) + '</span><br><span class="sub">' + esc(p.short || '') + '</span></span>' +
            '<span class="badges">' + (p.mid ? '<span class="badge">mid ' + esc(p.mid) + '</span>' : '') + '<span class="badge viz">▶ visualiser</span>' + (done.has(p.id) ? '<span class="done-mark">✅</span>' : '') + '</span></a>').join('') + '</div>';
      }).join('') + '</div>';
  }

  function practiceDetail(id) {
    const p = OOP.practice.find(x => x.id === id);
    if (!p) return notFound();
    const i = OOP.practice.indexOf(p);
    const prev = OOP.practice[i - 1], next = OOP.practice[i + 1];
    setTimeout(() => {
      OOP.Tracer.mount(document.getElementById('trace'), { code: p.code, input: p.input });
      const d = document.getElementById('doneBtn');
      d.onclick = () => { done.has(p.id) ? done.delete(p.id) : done.add(p.id); OOP.save('oop-done', Array.from(done)); d.textContent = done.has(p.id) ? '✅ Done' : '☐ Mark as done'; updateProgress(); };
      const r = document.getElementById('revealBtn');
      if (r) r.onclick = () => { OOP.save('oop-rev-' + p.id, true); document.getElementById('ans').innerHTML = codeBlock(p.full || p.code) + (p.output ? outBlock(p.output) : ''); wireCopy(); };
    });
    const shown = revealAll || OOP.load('oop-rev-' + p.id, false);
    return '<div class="page wide"><div class="crumbs"><a href="#/practice">Practice</a> › ' + (p.level === 'class' ? 'Class & Object' : p.level) + '</div>' +
      '<h1>' + esc(p.title) + '</h1><div class="badges"><span class="badge ' + (p.level === 'class' ? 'code' : p.level) + '">' + (p.level === 'class' ? 'Class & Object' : p.level) + '</span>' + (p.mid ? '<span class="badge">asked in mid ' + esc(p.mid) + '</span>' : '') +
      (p.complexity ? '<span class="badge">' + esc(p.complexity) + '</span>' : '') +
      '<button class="btn small done-toggle" id="doneBtn">' + (done.has(p.id) ? '✅ Done' : '☐ Mark as done') + '</button></div>' +
      '<div class="qsec"><h2>📄 Problem</h2><div class="prose">' + p.prompt + '</div></div>' +
      '<div class="qsec"><h2>🧠 Idea</h2><div class="prose">' + p.idea + '</div></div>' +
      '<div class="qsec"><h2>✅ Full Java solution</h2><div id="ans">' + (shown ? codeBlock(p.full || p.code) + (p.output ? outBlock(p.output) : '') :
        '<div class="reveal"><p>Write it yourself first. Then compare.</p><button class="btn primary" id="revealBtn">Reveal solution</button></div>') + '</div></div>' +
      '<div class="qsec"><h2>▶ ' + (p.input.fields.length ? 'Visualise it (edit the input!)' : 'Trace main() step by step') + '</h2><div id="trace"></div></div>' +
      (p.tips && p.tips.length ? '<div class="qsec"><h2>💡 Tricks &amp; tips</h2><ul class="tips-list">' + p.tips.map(t => '<li class="callout tip">' + t + '</li>').join('') + '</ul></div>' : '') +
      '<div class="qnav">' + (prev ? '<a class="btn" href="#/p/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/p/' + next.id + '">' + esc(next.title) + ' →</a>' : '') + '</div></div>';
  }

  function learnPage(id) {
    const pg = OOP.pages[id];
    if (!pg) return notFound();
    setTimeout(() => {
      app.querySelectorAll('[data-trace]').forEach(el => OOP.Tracer.mount(el, OOP.traces[el.dataset.trace]));
      app.querySelectorAll('[data-widget]').forEach(el => OOP.Widgets.mount(el));
      app.querySelectorAll('[data-qlinks]').forEach(el => {
        const qs = sortQs(OOP.questions.filter(q => q.sub.includes(el.dataset.qlinks)));
        el.innerHTML = qs.length ? '<p style="margin-bottom:6px"><b>Practise this in past papers:</b></p><div class="related">' + qs.map(q => '<a class="btn small" href="#/q/' + q.id + '">' + q.paper + ' Q' + esc(q.qno) + ' · ' + esc(q.title) + '</a>').join('') + '</div>' : '';
      });
    });
    return '<div class="page wide"><div class="learn-wrap"><article class="prose"><h1>' + pg.title + '</h1>' + pg.intro +
      pg.sections.map(s => '<h2 id="' + s.id + '">' + s.title + '</h2>' + s.html + (s.qlinks ? '<div data-qlinks="' + s.qlinks + '"></div>' : '')).join('') +
      '</article><nav class="toc"><b>On this page</b>' + pg.sections.map(s => '<a href="#/learn/' + id + '/' + s.id + '">' + s.title.replace(/<[^>]+>/g, '') + '</a>').join('') + '</nav></div></div>';
  }

  function cheatsheet() {
    const pg = OOP.pages.cheatsheet;
    setTimeout(() => app.querySelectorAll('[data-widget]').forEach(el => OOP.Widgets.mount(el)));
    return '<div class="page"><h1>⚡ Exam cheat-sheet</h1>' + pg.html + '</div>';
  }

  function searchPage(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = o => (o.title + ' ' + o.paper + ' ' + (PAPERS[o.paper] || '') + ' ' + (o.sub || []).map(s => SUBTOPICS[s]).join(' ') + ' ' + (o.prompt || '') + ' ' + (o.given || '') + ' ' + (o.tags || '') + ' ' + (o.short || '')).toLowerCase();
    const qs = sortQs(OOP.questions.filter(q => words.every(w => hay(q).includes(w))));
    const ps = OOP.practice.filter(p => words.every(w => hay(p).includes(w)));
    return '<div class="page"><h1>Search: “' + esc(query) + '”</h1>' +
      '<h2>Past questions (' + qs.length + ')</h2>' + (qs.length ? '<div class="qlist">' + qs.map(qItem).join('') + '</div>' : '<p class="muted">Nothing found.</p>') +
      '<h2>Practice problems (' + ps.length + ')</h2>' + (ps.length ? '<div class="qlist">' + ps.map(p => '<a class="card qitem" href="#/p/' + p.id + '"><span class="qnum">' + p.level + '</span><span class="ttl">' + esc(p.title) + '</span><span></span></a>').join('') + '</div>' : '<p class="muted">Nothing found.</p>') + '</div>';
  }

  function notFound() { return '<div class="page"><div class="empty"><h2>Page not found</h2><a class="btn" href="#/">Go home</a></div></div>'; }

  function wireCopy() {
    app.querySelectorAll('[data-copy]').forEach(b => {
      b.onclick = () => {
        const done = () => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1200); };
        if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, () => {}); else done();
      };
    });
  }

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    let html, nav = parts.slice(0, 2).join('/') || 'home', anchor = null;
    if (!parts.length) { html = home(); nav = 'home'; }
    else if (parts[0] === 'learn') { html = learnPage(parts[1]); anchor = parts[2]; }
    else if (parts[0] === 'questions') html = questionsPage(parts[1] === 'array' ? 'array' : 'class');
    else if (parts[0] === 'q') { html = questionPage(parts[1]); const q = qById(parts[1]); nav = q ? 'questions/' + q.topic : ''; }
    else if (parts[0] === 'papers') html = papersPage();
    else if (parts[0] === 'practice') html = practicePage();
    else if (parts[0] === 'p') { html = practiceDetail(parts[1]); nav = 'practice'; }
    else if (parts[0] === 'cheatsheet') html = cheatsheet();
    else if (parts[0] === 'search') html = searchPage(decodeURIComponent((qs || '').replace(/^q=/, '')));
    else html = notFound();
    app.innerHTML = html;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
    document.body.classList.remove('nav-open');
    wireCopy();
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); if (el) el.scrollIntoView(); }, 30);
    else window.scrollTo(0, 0);
    const t = app.querySelector('h1');
    document.title = (t && parts.length ? t.textContent + ' · ' : '') + 'OOP Mid Notes';
  }

  // ---------- chrome ----------
  document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('nav-open');
  document.getElementById('scrim').onclick = () => document.body.classList.remove('nav-open');
  document.getElementById('themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nxt = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nxt);
    OOP.save('oop-theme', nxt);
    // re-render so tracer arrows pick up the new colours/layout
    route();
  };
  const search = document.getElementById('search');
  let st;
  search.addEventListener('input', () => {
    clearTimeout(st);
    st = setTimeout(() => {
      const v = search.value.trim();
      if (v) location.hash = '#/search?q=' + encodeURIComponent(v);
    }, 250);
  });
  window.addEventListener('hashchange', route);
  updateProgress();
  route();
})();
