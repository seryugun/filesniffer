// App Store 링크: 웹 주소(apps.apple.com)는 브라우저에서 앱 소개 웹 페이지만 엽니다.
// Mac에서는 macappstore:// 주소로 바꿔 App Store 앱이 바로 열리게 합니다.
// iPad는 navigator.platform이 MacIntel로 나오므로 터치 지원 여부로 구분합니다.
const isMac = /Mac/.test(navigator.platform) && navigator.maxTouchPoints < 2;
if (isMac) {
  document.querySelectorAll('[data-appstore]').forEach(a => {
    a.href = 'macappstore://apps.apple.com/app/id6819963720';
  });
}

// Microsoft Store 링크: 웹 주소(apps.microsoft.com)는 브라우저에서 소개 페이지를 엽니다.
// Windows에서는 ms-windows-store:// 주소로 바꿔 Microsoft Store 앱의 FileSniffer 페이지가 바로 열리게 합니다.
if (/Win/.test(navigator.platform)) {
  document.querySelectorAll('[data-msstore]').forEach(a => {
    a.href = 'ms-windows-store://pdp/?productid=9PBN8PLCWSG6';
  });
}

// 언어 메뉴에서 고른 언어를 기억해, 다음에 index.html로 들어와도 그 언어로 보여 줍니다.
document.querySelectorAll('.lang-menu a').forEach(a => a.addEventListener('click', () => {
  try { localStorage.setItem('fs-lang', a.hreflang); } catch (e) {}
}));
document.addEventListener('click', e => {
  const menu = document.querySelector('.lang[open]');
  if (menu && !menu.contains(e.target)) menu.removeAttribute('open');
});

// 검색 화면 데모: 문구는 #result-count의 data 속성에서 가져옵니다.
const input = document.querySelector('#demo-search'), count = document.querySelector('#result-count');
if (input && count) {
  document.querySelectorAll('[data-query]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.query; run(); }));
  document.querySelector('#demo-run').addEventListener('click', run);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
}
function run() {
  const rows = document.querySelectorAll('.result');
  rows.forEach(r => { r.style.opacity = '.25'; r.style.transform = 'translateY(3px)'; });
  count.textContent = count.dataset.searching;
  setTimeout(() => {
    rows.forEach(r => { r.style.opacity = '1'; r.style.transform = 'none'; });
    count.textContent = input.value.includes('dupe') ? count.dataset.dupe : count.dataset.found;
  }, 350);
}

const observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Support-page feedback links open a prefilled message with useful diagnostics.
document.querySelectorAll('[data-feedback]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const lang = a.closest('.lang')?.id || 'en';
  const language = { ko: 'ko', en: 'en', ja: 'ja', 'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant' }[lang] || lang;
  const platform = /Mac/.test(navigator.platform) ? 'macOS' : /Win/.test(navigator.platform) ? 'Windows' : navigator.platform || 'Unknown';
  const body = `문제나 의견을 여기에 적어 주세요. 문제가 발생했다면 무엇을 했을 때 어떻게 되었는지 알려 주시면 도움이 됩니다.\n\n---\nApp: FileSniffer {Version input required}\nOS: {OS input required}\nLanguage: ${language}`;
  const subject = language === 'ko' ? 'FileSniffer 피드백' : 'FileSniffer Support';
  location.href = `mailto:seryugun@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}));
