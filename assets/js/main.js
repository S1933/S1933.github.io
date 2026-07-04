(() => {
  'use strict';

  const THEME_KEY = 'portfolio-theme';

  /* ── Theme toggle ── */
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = toggleBtn?.querySelector('.theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'light' ? '☾' : '☀';
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  let currentTheme = (() => {
    try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
  })() || getSystemTheme();

  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    try {
      if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'light' : 'dark');
    } catch (_) {}
  });

  /* ── Scroll-spy ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
  }

  /* ── GitHub repos ── */
  const projectsContainer = document.getElementById('projects-grid');

  const FEATURED = {
    quorum: {
      name: 'quorum',
      description: 'Outil de revue de code par consensus multi-LLM. Un diff Git envoyé à plusieurs modèles (Claude, Gemini, Codex, Ollama…) — seuls les retours convergents sont remontés. TypeScript, Bun.',
      language: 'TypeScript',
      stargazers_count: 2,
      html_url: 'https://github.com/S1933/quorum',
      featured: true
    }
  };

  function createCard(repo) {
    const a = document.createElement('a');
    a.href = repo.html_url;
    a.className = 'project-card';
    a.rel = 'noopener';

    let inner = '';
    if (repo.featured) inner += '<span class="featured-badge">★ phare</span>';
    inner += `<h3>${escapeHtml(repo.name)}</h3>`;
    inner += `<p class="project-desc">${escapeHtml(repo.description || '')}</p>`;
    inner += '<div class="project-meta">';
    if (repo.language) inner += `<span class="project-lang">${escapeHtml(repo.language)}</span>`;
    if (repo.stargazers_count > 0) inner += `<span class="project-star">${repo.stargazers_count}</span>`;
    inner += '</div>';
    a.innerHTML = inner;
    return a;
  }

  function renderCurated() {
    projectsContainer.innerHTML = '';
    Object.values(FEATURED).forEach((repo) => projectsContainer.appendChild(createCard(repo)));
  }

  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  if (projectsContainer) renderCurated();
})();
