// Shared registries + helpers used by every other script.
window.OOP = (function () {
  const questions = [];
  const practice = [];
  const traces = {};
  const pages = {};

  const PAPERS = {
    '173': 'Fall 2017', '181': 'Spring 2018', '182': 'Summer 2018', '183': 'Fall 2018',
    '191': 'Spring 2019', '192': 'Summer 2019', '193': 'Fall 2019',
    '202': 'Summer 2020', '203': 'Fall 2020', '212': 'Summer 2021', '213': 'Fall 2021',
    '221': 'Spring 2022', '222': 'Summer 2022', '223': 'Fall 2022',
    '231': 'Spring 2023', '232': 'Summer 2023', '233': 'Fall 2023',
    '241': 'Spring 2024', '242': 'Summer 2024', '243': 'Fall 2024',
    '251': 'Spring 2025', '252': 'Summer 2025', '253': 'Fall 2025', '261': 'Spring 2026'
  };

  const SUBTOPICS = {
    'class-basics': 'Class & object basics',
    'constructors': 'Constructors & this()',
    'init-order': 'Static / instance blocks & init order',
    'static': 'static members',
    'encapsulation': 'Encapsulation, getters & setters',
    'references': 'References & pass-by-value',
    'gc': 'Garbage collection & reference diagrams',
    'overloading': 'Method overloading',
    'final': 'final keyword',
    'access': 'Packages & access modifiers',
    'strings': 'String concatenation tricks',
    'array-1d': '1D arrays & for-each',
    'array-2d': '2D / jagged arrays',
    'array-obj': 'Arrays of objects'
  };

  // String.raw so "\n" inside Java code stays literally as backslash-n.
  const code = String.raw;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---- tiny Java highlighter ----
  const KW = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static super switch synchronized this throw throws transient try void volatile while var true false null').split(' '));
  const TY = new Set('String System Math Scanner Object Integer Double Arrays'.split(' '));
  function hlLine(line) {
    let out = '';
    let i = 0;
    const n = line.length;
    while (i < n) {
      const c = line[i];
      if (c === '/' && line[i + 1] === '/') { out += '<span class="tk-com">' + esc(line.slice(i)) + '</span>'; break; }
      if (c === '/' && line[i + 1] === '*') {
        const e = line.indexOf('*/', i + 2);
        const end = e < 0 ? n : e + 2;
        out += '<span class="tk-com">' + esc(line.slice(i, end)) + '</span>'; i = end; continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; }
        out += '<span class="tk-str">' + esc(line.slice(i, j + 1)) + '</span>'; i = j + 1; continue;
      }
      if (/[0-9]/.test(c) && !/[A-Za-z_]/.test(line[i - 1] || '')) {
        let j = i; while (j < n && /[0-9._fFdDL]/.test(line[j])) j++;
        out += '<span class="tk-num">' + esc(line.slice(i, j)) + '</span>'; i = j; continue;
      }
      if (/[A-Za-z_@]/.test(c)) {
        let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(line[j])) j++;
        const w = line.slice(i, j);
        if (KW.has(w)) out += '<span class="tk-kw">' + w + '</span>';
        else if (TY.has(w) || /^[A-Z]/.test(w)) out += '<span class="tk-ty">' + w + '</span>';
        else if (line[j] === '(') out += '<span class="tk-fn">' + w + '</span>';
        else out += esc(w);
        i = j; continue;
      }
      out += esc(c); i++;
    }
    return out;
  }
  // Multi-line comments are rare in exam code; handled per line which is good enough.
  function highlight(src, opts) {
    opts = opts || {};
    const lines = src.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    return '<pre class="code' + (opts.plain ? ' plain' : '') + '">' + lines.map((l, k) =>
      '<span class="ln" data-n="' + (k + 1) + '">' + (hlLine(l) || ' ') + '</span>').join('') + '</pre>';
  }
  function codeBlock(src, opts) {
    return '<div class="code-wrap">' + highlight(src, opts) +
      '<button class="btn small copy-btn" data-copy="' + esc(src.replace(/^\n/, '').replace(/\s+$/, '')) + '">Copy</button></div>';
  }
  function outBlock(text) {
    return '<pre class="out">' + esc(text.replace(/^\n/, '').replace(/\s+$/, '')) + '</pre>';
  }

  // ---- localStorage helpers (always guarded) ----
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }

  return {
    questions, practice, traces, pages, PAPERS, SUBTOPICS, code, esc, highlight, codeBlock, outBlock, hlLine, load, save,
    Q(q) { questions.push(q); },
    P(p) { practice.push(p); },
    T(id, t) { traces[id] = t; },
    page(id, p) { pages[id] = p; }
  };
})();
