(() => {
  'use strict';

  const THEME_KEY = 'portfolio-theme';
  const REPOS_CACHE_KEY = 'portfolio-repos';
  const CACHE_TTL = 3600000; // 1h

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

  function createSkeleton() {
    const div = document.createElement('div');
    div.className = 'loading-skeleton';
    div.innerHTML = '<div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div>';
    return div;
  }

  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  function showNote(text) {
    const p = document.createElement('p');
    p.className = 'api-note';
    p.textContent = text;
    projectsContainer.appendChild(p);
  }

  function renderRepos(repos) {
    projectsContainer.innerHTML = '';

    const featured = Object.values(FEATURED).filter((f) => !repos.some((r) => r.name === f.name));
    const combined = [...featured, ...repos];

    if (combined.length === 0) {
      projectsContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">Aucun projet à afficher pour le moment.</p>';
      return;
    }

    combined.forEach((repo) => projectsContainer.appendChild(createCard(repo)));
  }

  function renderFallback() {
    projectsContainer.innerHTML = '';
    Object.values(FEATURED).forEach((repo) => projectsContainer.appendChild(createCard(repo)));
    showNote('Données issues du cache local — l\'API GitHub est temporairement indisponible.');
  }

  async function fetchRepos() {
    // Show skeletons
    projectsContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) projectsContainer.appendChild(createSkeleton());

    try {
      const res = await fetch('https://api.github.com/users/S1933/repos?sort=stars&per_page=50&direction=desc');
      if (!res.ok) throw new Error('API error');

      const repos = await res.json();
      const filtered = repos
        .filter((r) => !r.fork && r.name !== 'S1933')
        .filter((r) => r.name !== 'S1933.github.io')
        .slice(0, 6);

      // Cache
      try {
        localStorage.setItem(REPOS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: filtered }));
      } catch (_) {}

      renderRepos(filtered);
    } catch (_) {
      // Try cache
      try {
        const cached = JSON.parse(localStorage.getItem(REPOS_CACHE_KEY));
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          renderRepos(cached.data);
          showNote('Données du cache local (' + new Date(cached.ts).toLocaleDateString('fr-FR') + ').');
          return;
        }
      } catch (__) {}

      renderFallback();
    }
  }

  if (projectsContainer) fetchRepos();
})();
