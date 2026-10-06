// Whole-page translation via the free Google Translate web widget (no API key).
// The widget reads a "googtrans" cookie, so switching language = set cookie + reload.
(function () {
  const NAMES = { fr: 'French', kn: 'Kannada' };
  const m = document.cookie.match(/(?:^|; )googtrans=\/en\/(\w+)/);
  const lang = m && NAMES[m[1]] ? m[1] : 'en';

  function setCookie(v) {
    const exp = v ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const val = v || '';
    document.cookie = 'googtrans=' + val + '; path=/' + exp;
    const host = location.hostname;
    if (host.includes('.')) document.cookie = 'googtrans=' + val + '; path=/; domain=.' + host + exp;
  }

  function switchTo(l) {
    setCookie(l === 'en' ? '' : '/en/' + l);
    location.reload();
  }

  document.documentElement.classList.toggle('translated', lang !== 'en');
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));

  const bar = document.getElementById('langBar');
  if (bar && lang !== 'en') {
    bar.hidden = false;
    bar.querySelector('[data-lang-msg]').textContent = 'Viewing this site in ' + NAMES[lang] + ' (auto-translated)';
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b && b.dataset.lang !== lang) switchTo(b.dataset.lang);
    if (e.target.closest('[data-lang-back]')) switchTo('en');
  });

  if (lang !== 'en') {
    window.gtInit = function () {
      new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'gt-container');
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=gtInit';
    document.head.appendChild(s);
  }
})();
