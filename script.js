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

// Experience timeline: year badge, duration, and a bar placed relative to the full date range.
(function () {
  const jobs = [...document.querySelectorAll('.job[data-start]')];
  if (!jobs.length) return;
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  const idx = v => {
    if (v === 'present') return nowIdx;
    const [y, m] = v.split('-').map(Number);
    return y * 12 + m - 1;
  };
  const first = Math.min(...jobs.map(j => idx(j.dataset.start)));
  const y0 = Math.floor(first / 12), y1 = now.getFullYear();
  const total = (y1 - y0 + 1) * 12;
  const base = y0 * 12;
  const dur = n => {
    const y = Math.floor(n / 12), m = n % 12;
    return [y && y + ' yr', m && m + ' mo'].filter(Boolean).join(' ') || '1 mo';
  };
  jobs.forEach(j => {
    const s = idx(j.dataset.start), e = idx(j.dataset.end);
    const badge = document.createElement('span');
    badge.className = 'yr';
    badge.textContent = Math.floor(s / 12);
    j.prepend(badge);
    const label = j.querySelector('.label');
    const d = document.createElement('span');
    d.className = 'dur';
    d.textContent = '· ' + dur(e - s + 1);
    label.appendChild(d);
    const bar = document.createElement('div');
    bar.className = 'span';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<div class="span-track" style="--seg:' + (100 / (y1 - y0 + 1)) + '%;--l:' + ((s - base) / total * 100) + '%;--w:' + ((e - s + 1) / total * 100) + '%"><i></i></div>' +
      '<div class="span-yrs">' + Array.from({ length: y1 - y0 + 1 }, (_, k) => '<span>' + (y0 + k) + '</span>').join('') + '</div>';
    j.appendChild(bar);
  });
})();
