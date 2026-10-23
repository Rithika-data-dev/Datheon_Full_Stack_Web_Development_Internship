'use strict';
const root = document.documentElement;
const themeBtn = document.getElementById('theme');
const menuBtn = document.getElementById('menu');
const nav = document.getElementById('nav');
const modal = document.getElementById('modal');

// Theme toggle (remembers choice)
function setTheme(t) {
  root.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch (e) {}
  themeBtn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} theme`);
}
setTheme(root.dataset.theme);
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// Mobile hamburger menu
function toggleMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') toggleMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// Project modal (edit this list with your own projects)
const projects = [
  { title: 'Task Flow', tech: 'JavaScript · CSS Grid · localStorage',
    desc: 'A Kanban-style board with drag-and-drop cards. Tasks persist in the browser so nothing is lost on refresh.',
    live: 'https://example.com/task-flow', code: 'https://github.com/your-username/task-flow' },
  { title: 'Weather Now', tech: 'Fetch API · HTML5 · CSS3',
    desc: 'Search any city and see current conditions and a 5-day forecast, with friendly error messages when a city is not found.',
    live: 'https://example.com/weather-now', code: 'https://github.com/your-username/weather-now' },
  { title: 'Shop Lane', tech: 'React · Tailwind CSS',
    desc: 'A responsive storefront with product filters, a cart drawer and a mobile-first checkout layout.',
    live: 'https://example.com/shop-lane', code: 'https://github.com/your-username/shop-lane' }
];
document.querySelectorAll('[data-project]').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = projects[btn.dataset.project];
    document.getElementById('m-title').textContent = p.title;
    document.getElementById('m-desc').textContent = p.desc;
    document.getElementById('m-tech').textContent = p.tech;
    document.getElementById('m-live').href = p.live;
    document.getElementById('m-code').href = p.code;
    modal.showModal();
  });
});
document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

// Highlight current section in nav
const links = [...nav.querySelectorAll('a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();
