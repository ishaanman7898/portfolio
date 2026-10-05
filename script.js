// Highlight the nav pill for the section in view (education counts as skills).
const links = document.querySelectorAll('.pill-nav a');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = { '': 'top', education: 'skills' }[e.target.id] ?? e.target.id;
    links.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('.hero, main > section[id]').forEach(s => io.observe(s));

// Copy install commands.
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; }
  catch { b.textContent = 'Failed'; }
  setTimeout(() => (b.textContent = 'Copy'), 1500);
}));
