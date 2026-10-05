// ---------- Ticker tape (resume highlights, not market quotes) ----------
const tapeItems = [
  ['MACRO', '5 SIMULTANEOUS TRADES'], ['VCA', '~25% ACCEPTANCE'], ['REGRESSION ROBOTICS', '$15K BUDGET'],
  ['FUNDING', '+$5K RAISED'], ['iTRIANGLE', '200+ TXNS / MO'], ['AUTOMATION', '-25% REPORTING TIME'],
  ['TUTORING', '100+ STUDENTS'], ['GRADES', '+20% AVG'], ['CODE NINJAS', '50+ STUDENTS / WK'], ['STEMSHALA', '100+ INSTRUCTION HRS']
];
const tape = document.getElementById('tape');
const html = tapeItems.map(([k, v]) => `<span><b>${k}</b><span class="u">▲ ${v}</span></span>`).join('');
tape.innerHTML = html + html;

document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- Hero candlestick background ----------
(function () {
  const c = document.getElementById('chart'), x = c.getContext('2d');
  let W, H, candles = [];
  const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  function resize() {
    const d = devicePixelRatio || 1;
    W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.ceil(W / 18); candles = []; let p = H * .72;
    for (let i = 0; i < n; i++) {
      const o = p, cl = o + (rand() - .56) * 26, hi = Math.min(o, cl) - rand() * 14, lo = Math.max(o, cl) + rand() * 14;
      p = Math.max(H * .15, Math.min(H * .85, cl - 2.2)); candles.push({ o, c: cl, h: hi, l: lo });
    }
  }
  let t = 0;
  function draw() {
    x.clearRect(0, 0, W, H);
    candles.forEach((k, i) => {
      const reveal = Math.min(1, Math.max(0, (t - i * 1.2) / 20));
      if (!reveal) return;
      const up = k.c <= k.o, col = up ? '#2ee59d' : '#ff5d6c', cx = i * 18 + 9;
      x.globalAlpha = reveal * .85; x.strokeStyle = x.fillStyle = col;
      x.beginPath(); x.moveTo(cx, k.h); x.lineTo(cx, k.l); x.stroke();
      x.fillRect(cx - 5, Math.min(k.o, k.c), 10, Math.max(2, Math.abs(k.c - k.o)) * reveal);
    });
    x.globalAlpha = 1; t++;
    if (t < candles.length * 1.2 + 40) requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener('resize', () => { resize(); t = 9999; draw(); });
})();

// ---------- KPI counters ----------
const fmt = n => n.toLocaleString('en-US');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
    el.textContent = pre + fmt(v) + suf; if (p < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

// ---------- Scroll reveal ----------
document.querySelectorAll('.card,.job,.sec').forEach(el => el.classList.add('reveal'));
const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => rv.observe(el));

// ---------- Experience filter ----------
document.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active')); b.classList.add('active');
  document.querySelectorAll('.job').forEach(j => j.classList.toggle('hide', b.dataset.f !== 'all' && j.dataset.cat !== b.dataset.f));
}));

// ---------- Compound growth model ----------
(function () {
  const $ = id => document.getElementById(id), cv = $('growth'), g = cv.getContext('2d');
  const usd = n => '$' + Math.round(n).toLocaleString('en-US');
  function calc() {
    const P = +$('p').value || 0, M = +$('m').value || 0, R = (+$('r').value || 0) / 100 / 12, Y = +$('y').value;
    $('yo').textContent = Y;
    const bal = [P], contrib = [P]; let b = P, c = P;
    for (let i = 1; i <= Y * 12; i++) { b = b * (1 + R) + M; c += M; if (i % 12 === 0) { bal.push(b); contrib.push(c); } }
    $('fv').textContent = usd(b);
    $('split').textContent = `CONTRIBUTED ${usd(c)}  ·  GROWTH ${usd(b - c)}`;
    const d = devicePixelRatio || 1, W = cv.clientWidth, H = 160; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, W, H); const max = Math.max(...bal, 1), n = bal.length - 1 || 1;
    const pt = (arr, i) => [i / n * W, H - 6 - arr[i] / max * (H - 16)];
    const path = arr => { g.beginPath(); arr.forEach((_, i) => g[i ? 'lineTo' : 'moveTo'](...pt(arr, i))); };
    path(bal); g.lineTo(W, H); g.lineTo(0, H); g.closePath();
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(46,229,157,.35)'); gr.addColorStop(1, 'rgba(46,229,157,0)'); g.fillStyle = gr; g.fill();
    path(bal); g.strokeStyle = '#2ee59d'; g.lineWidth = 2; g.stroke();
    path(contrib); g.strokeStyle = '#8fa89d'; g.setLineDash([5, 5]); g.lineWidth = 1.5; g.stroke(); g.setLineDash([]);
  }
  ['p', 'm', 'r', 'y'].forEach(id => $(id).addEventListener('input', calc));
  addEventListener('resize', calc); calc();
})();
