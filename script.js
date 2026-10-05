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
  ['meridianalgo.org', 'The source code for this website — React, TypeScript, Tailwind.', 'TypeScript'],
  ['Python-Packages', 'Our PyPI packages. Install with pip install meridianalgo, or read the source.', 'Python · MIT'],
  ['Javascript-Packages', 'Our NPM packages — a quantitative finance framework for Node and TypeScript.', 'TypeScript · MIT'],
  ['Learn-Quant', 'The utilities behind our programs, commented line by line so beginners can follow them.', 'Python'],
  ['AraAI', 'Stock volatility prediction, market trend forecasting, and portfolio optimization.', 'Python'],
  ['FinAI', 'Our in-house LLM research, aimed at finance-based chat and financial requests.', 'Python'],
  ['Midnight.AI', 'Multi-objective trading engine with a pretrained model, Alpaca paper trading, and a backtester.', 'Python · MIT'],
  ['Basic-Sentiment-Analysis', 'FinBERT sentiment classification of financial news: positive, negative, neutral.', 'Python · MIT'],
  ['Cryptvault', 'Cryptocurrency analysis with ML predictions, 50+ pattern recognition, and terminal charting.', 'Python · BSD 3-Clause'],
  ['Apex-Analysis', 'Beginner-friendly stock analysis and research, built for accessibility.', 'Python · MIT'],
  ['FinDB', 'Multi-source financial data scraper and database, updated automatically every day.', 'Python · MIT'],
  ['No-Ticker-Left-Behind', 'Every ticker for every world stock, refreshed regularly and exported in common formats.', 'Python'],
  ['Pine-A-Script', 'Transpiler converting TradingView Pine Script (v5/v6) indicators to JavaScript for Node.', 'JavaScript · MIT'],
  ['Interlink', 'Interoperability protocol bridging blockchain ecosystems with zero-knowledge proofs.', 'Rust · MIT'],
  ['UniGroth', 'A Rust implementation of the Groth16 zkSNARK — faster, safer, more adaptable.', 'Rust'],
  ['LiteLayer', 'A lightweight, secure storage layer for self-hosted NAS.', 'Python']
];

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
    q('[data-count]').textContent = pad(i + 1) + ' / ' + pad(PROJECTS.length) + ' · Open source';
    q('[data-name]').textContent = name;
    q('[data-desc]').textContent = desc;
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
