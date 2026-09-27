const themeButton = document.querySelector('#themeToggle');
const savedTheme = localStorage.getItem('techai-site-theme');
if (savedTheme === 'dark') document.body.classList.remove('light');
function updateThemeButton() {
  const light = document.body.classList.contains('light');
  themeButton.textContent = light ? '☾' : '☼';
  themeButton.setAttribute('aria-label', light ? 'Attiva il tema scuro' : 'Attiva il tema chiaro');
  document.querySelector('meta[name="theme-color"]').content = light ? '#f4f7fb' : '#080d16';
}
updateThemeButton();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('techai-site-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeButton();
});

const railLinks = [...document.querySelectorAll('#railNav a')];
const sections = railLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  railLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-20% 0px -58% 0px', threshold: [0, .25, .5] });
sections.forEach(section => observer.observe(section));

const railSearch = document.querySelector('#railSearch');
railSearch.addEventListener('input', () => {
  const query = railSearch.value.trim().toLocaleLowerCase('it');
  railLinks.forEach(link => { link.hidden = !link.textContent.toLocaleLowerCase('it').includes(query); });
  document.querySelectorAll('#railNav .nav-group').forEach(group => {
    let next = group.nextElementSibling;
    let hasVisibleLink = false;
    while (next && !next.classList.contains('nav-group')) {
      if (next.matches('a') && !next.hidden) hasVisibleLink = true;
      next = next.nextElementSibling;
    }
    group.hidden = !hasVisibleLink;
  });
});

document.querySelectorAll('.screenshot img').forEach(img => {
  img.setAttribute('role', 'button');
  img.setAttribute('tabindex', '0');
  img.setAttribute('aria-label', `${img.alt}. Attiva per espandere l'immagine`);
  const toggle = () => img.closest('.screenshot').classList.toggle('expanded');
  img.addEventListener('click', toggle);
  img.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();
