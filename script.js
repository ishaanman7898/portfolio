// Fade sections in as they scroll into view, matching the Framer reveal.
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Open source projects shown in the rotating showcase.
const GH = 'https://github.com/MeridianAlgo/';
const PROJECTS = [
  ['Learn-Quant', 'The utilities behind our programs, commented line by line so beginners can follow them.', 'Python'],
  ['AraAI', 'Stock volatility prediction, market trend forecasting, and portfolio optimization.', 'Python'],
  ['FinAI', 'Our in-house LLM research, aimed at finance-based chat and financial requests.', 'Python'],
  ['Cryptvault', 'Cryptocurrency analysis with ML predictions, 50+ pattern recognition, and terminal charting.', 'Python · BSD 3-Clause'],
  ['FinDB', 'Multi-source financial data scraper and database, updated automatically every day.', 'Python · MIT'],
  ['No-Ticker-Left-Behind', 'Every ticker for every world stock, refreshed regularly and exported in common formats.', 'Python'],
  ['LiteLayer', 'A lightweight, secure storage layer for self-hosted NAS.', 'Python']
];

const tr = s => (window.I18N ? I18N.tr(s) : s);
const rot = document.getElementById('rotator');
if (rot) {
  const card = rot.querySelector('.card');
  const dots = rot.querySelector('[data-dots]');
  const q = s => card.querySelector(s);
  const pad = n => String(n).padStart(2, '0');
  let i = 0, timer;

  PROJECTS.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Project ' + (n + 1));
    b.addEventListener('click', () => { show(n); restart(); });
    dots.appendChild(b);
  });

  function render() {
    const [name, desc, meta] = PROJECTS[i];
    q('[data-count]').textContent = pad(i + 1) + ' / ' + pad(PROJECTS.length) + ' · ' + tr('Open source');
    q('[data-name]').textContent = name;
    q('[data-desc]').textContent = tr(desc);
    q('[data-meta]').textContent = meta;
    q('[data-link]').href = GH + name;
    [...dots.children].forEach((d, n) => d.classList.toggle('on', n === i));
  }
  function show(n) {
    i = (n + PROJECTS.length) % PROJECTS.length;
    card.classList.add('swap');
    setTimeout(() => { render(); card.classList.remove('swap'); }, 250);
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(i + 1), 5000);
  }
  rot.querySelector('[data-prev]').addEventListener('click', () => { show(i - 1); restart(); });
  rot.querySelector('[data-next]').addEventListener('click', () => { show(i + 1); restart(); });
  rot.addEventListener('mouseenter', () => clearInterval(timer));
  rot.addEventListener('mouseleave', restart);
  render();
  restart();
  window.addEventListener('langchange', render);
}

// Update the tab title to match the section in view.
const TITLES = [['top', 'Home'], ['experience', 'Experience'], ['work', 'Open Source'], ['about', 'About'], ['contact', 'Contact']];
function updateTitle() {
  const mid = window.innerHeight * 0.4;
  let name = TITLES[0][1];
  for (const [id, label] of TITLES) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= mid) name = label;
  }
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) name = 'Contact';
  const t = name + ' | Ishaan Manoor';
  if (document.title !== t) document.title = t;
}
addEventListener('scroll', updateTitle, { passive: true });
updateTitle();

// Resume dropdown: view or download.
const rm = document.getElementById('resumeMenu');
if (rm) {
  const btn = rm.querySelector('button');
  const set = on => { rm.classList.toggle('open', on); btn.setAttribute('aria-expanded', on); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!rm.classList.contains('open')); });
  document.addEventListener('click', () => set(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}

// Floating back-to-top arrow appears after scrolling past the hero.
const toTop = document.getElementById('toTop');
if (toTop) {
  const check = () => toTop.classList.toggle('show', window.scrollY > 500);
  addEventListener('scroll', check, { passive: true });
  check();
}

// Experience timeline: a Gantt chart of when each role happened. Click a role to open its details.
// The role content lives in the hidden .jobs list in index.html (add <img> tags inside .job-photos to show photos).
(function () {
  const container = document.querySelector('.jobs');
  const jobs = [...document.querySelectorAll('.job[data-start]')];
  if (!container || !jobs.length) return;
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  const idx = v => {
    if (v === 'present') return nowIdx;
    const [y, m] = v.split('-').map(Number);
    return y * 12 + m - 1;
  };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = n => MONTHS[n % 12] + ' ' + Math.floor(n / 12);
  const dur = n => {
    const y = Math.floor(n / 12), m = n % 12;
    return [y && y + ' yr', m && m + ' mo'].filter(Boolean).join(' ') || '1 mo';
  };
  const first = Math.min(...jobs.map(j => idx(j.dataset.start)));
  const y0 = Math.floor(first / 12), y1 = now.getFullYear();
  const years = y1 - y0 + 1, total = years * 12, base = y0 * 12;
  const pct = n => (n - base) / total * 100;

  const rows = jobs.map(j => {
    const s = idx(j.dataset.start), e = idx(j.dataset.end), ongoing = j.dataset.end === 'present';
    return {
      j, s, e, ongoing,
      role: j.querySelector('h3').textContent,
      orgFull: j.querySelector('.org').textContent,
      org: j.querySelector('.org').textContent.split(' · ')[0],
      range: fmt(s) + ' — ' + (ongoing ? 'Present' : fmt(e)) + ' · ' + dur(e - s + 1)
    };
  });

  // ---- Chart ----
  const g = document.createElement('div');
  g.className = 'gantt reveal';
  const yrs = Array.from({ length: years }, (_, k) => '<span class="' + (k % 2 ? 'alt' : '') + '">' + (y0 + k) + '</span>').join('');
  g.innerHTML =
    '<div class="g-head"><div></div><div class="g-years">' + yrs + '</div></div>' +
    '<div class="g-body"><div class="g-labels"></div><div class="g-plot" style="--years:' + years + '"><div class="g-rows"></div>' +
    '<div class="g-today" style="left:' + pct(nowIdx + 0.5) + '%"><span>Today</span></div></div></div>' +
    '<p class="g-hint">Click any role to see what I did there.</p>';
  const labels = g.querySelector('.g-labels'), plot = g.querySelector('.g-rows');
  rows.forEach((r, n) => {
    const l = document.createElement('button');
    l.type = 'button';
    l.className = 'g-label';
    l.innerHTML = '<b></b><small></small>';
    l.firstChild.textContent = r.role;
    l.lastChild.textContent = r.org;
    labels.appendChild(l);
    const row = document.createElement('div');
    row.className = 'g-row';
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'g-bar' + (r.ongoing ? ' on' : '');
    bar.style.left = pct(r.s) + '%';
    bar.style.width = (r.e - r.s + 1) / total * 100 + '%';
    bar.title = r.role + ' · ' + r.range;
    bar.setAttribute('aria-label', r.role + ', ' + r.range);
    if ((r.e - r.s + 1) / total > 0.06) bar.textContent = dur(r.e - r.s + 1);
    const on = v => { bar.classList.toggle('hl', v); l.classList.toggle('hl', v); };
    [bar, l].forEach(el => {
      el.addEventListener('mouseenter', () => on(true));
      el.addEventListener('mouseleave', () => on(false));
      el.addEventListener('click', () => open(n));
    });
    row.addEventListener('click', e => { if (e.target === row) open(n); });
    row.appendChild(bar);
    plot.appendChild(row);
  });
  container.parentNode.insertBefore(g, container);
  io.observe(g);

  // ---- Detail modal ----
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="modal-card" tabindex="-1">' +
    '<button type="button" class="modal-x" aria-label="Close">×</button>' +
    '<p class="label accent" data-m-range></p><h3 data-m-role></h3><p class="org" data-m-org></p>' +
    '<div class="modal-body" data-m-body></div><div class="modal-photos" data-m-photos></div>' +
    '<div class="modal-nav"><button type="button" data-m-prev>← Newer</button><button type="button" data-m-next>Older →</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  const card = modal.querySelector('.modal-card');
  let cur = 0, lastFocus = null;

  function fill(n) {
    cur = (n + rows.length) % rows.length;
    const r = rows[cur];
    card.querySelector('[data-m-range]').textContent = r.range;
    card.querySelector('[data-m-role]').textContent = r.role;
    const org = card.querySelector('[data-m-org]');
    org.innerHTML = '';
    const a = r.j.querySelector('a.org');
    if (a) {
      const link = a.cloneNode(true);
      org.appendChild(link);
    } else {
      org.textContent = r.orgFull;
    }
    const body = card.querySelector('[data-m-body]');
    body.innerHTML = '';
    r.j.querySelectorAll('.body, ul').forEach(el => body.appendChild(el.cloneNode(true)));
    const ph = card.querySelector('[data-m-photos]');
    ph.innerHTML = '';
    r.j.querySelectorAll('.job-photos img').forEach(img => {
      const c = img.cloneNode(true);
      c.loading = 'lazy';
      ph.appendChild(c);
    });
    ph.hidden = !ph.children.length;
    card.scrollTop = 0;
  }
  function open(n) {
    lastFocus = document.activeElement;
    fill(n);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('show'));
    document.documentElement.classList.add('modal-open');
    card.focus();
  }
  function close() {
    modal.classList.remove('show');
    document.documentElement.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 220);
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.querySelector('.modal-x').addEventListener('click', close);
  modal.querySelector('[data-m-prev]').addEventListener('click', () => fill(cur - 1));
  modal.querySelector('[data-m-next]').addEventListener('click', () => fill(cur + 1));
  addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') fill(cur - 1);
    if (e.key === 'ArrowRight') fill(cur + 1);
  });
})();

// Nav is a plain full-width bar at the top and condenses into a capsule once you scroll.
const navEl = document.querySelector('.nav');
if (navEl) {
  const sync = () => navEl.classList.toggle('scrolled', window.scrollY > 24);
  addEventListener('scroll', sync, { passive: true });
  sync();
}