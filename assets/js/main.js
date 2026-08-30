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
  const navLinks = document.querySelectorAll('[data-spy]');

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

  /* ── Agent skills (registry S1933/skills) ── */
  const ROLE_LABELS = {
    discovery: 'Découverte',
    design: 'Design',
    implementation: 'Implémentation',
    setup: 'Setup',
    quality: 'Qualité',
    delivery: 'Livraison',
    style: 'Style'
  };
  const ROLE_COLORS = {
    discovery: '#7cc7ff',
    design: '#c792ea',
    implementation: '#6fd69a',
    setup: '#ffd166',
    quality: '#ff8a7a',
    delivery: '#79c0ff',
    style: '#ff9ece'
  };
  const roleOrder = ['discovery', 'design', 'implementation', 'setup', 'quality', 'delivery', 'style'];

  const SKILLS = [
    { name: 'caveman', owner: 'juliusbrussee', repo: 'caveman', role: 'style', desc: 'Communication ultra-compressée : moins de tokens, l\u2019essentiel.' },
    { name: 'code-review', owner: 'mattpocock', repo: 'skills', role: 'quality', desc: 'Revue de code méthodique : sécurité, qualité, anti-patterns.' },
    { name: 'codebase-design', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Vocabulaire partagé pour concevoir des modules profonds.' },
    { name: 'diagnosing-bugs', owner: 'mattpocock', repo: 'skills', role: 'quality', desc: 'Diagnostic systématique : comprendre avant de corriger.' },
    { name: 'domain-modeling', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Construire et affiner le modèle de domaine du projet.' },
    { name: 'executing-plans', owner: 'obra', repo: 'superpowers', role: 'implementation', desc: 'Exécuter un plan écrit : tâches, chemins, code.' },
    { name: 'finishing-a-development-branch', owner: 'obra', repo: 'superpowers', role: 'delivery', desc: 'Clôturer proprement : tests verts, revue, merge.' },
    { name: 'grill-with-docs', owner: 'mattpocock', repo: 'skills', role: 'discovery', desc: 'Entretien exigeant qui affine un plan ou un design, preuves à l\u2019appui.' },
    { name: 'grilling', owner: 'mattpocock', repo: 'skills', role: 'discovery', desc: 'Challenger les décisions : interview sans relâche.' },
    { name: 'handoff', owner: 'mattpocock', repo: 'skills', role: 'delivery', desc: 'Compacter la conversation en document de passation exploitable.' },
    { name: 'i-have-adhd', owner: 'ayghri', repo: 'i-have-adhd', role: 'style', desc: 'Output façonné ADHD : action d\u2019abord, sans préambule ni recap.' },
    { name: 'improve-codebase-architecture', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Scanner un codebase et proposer des approfondissements.' },
    { name: 'karpathy-guidelines', owner: 'multica-ai', repo: 'andrej-karpathy-skills', role: 'quality', desc: 'Guidelines de code issues des pratiques de Karpathy.' },
    { name: 'prototype', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Prototype jetable pour répondre à une question de design.' },
    { name: 'receiving-code-review', owner: 'obra', repo: 'superpowers', role: 'quality', desc: 'Recevoir une review : intégrer le feedback sereinement.' },
    { name: 'requesting-code-review', owner: 'obra', repo: 'superpowers', role: 'quality', desc: 'Review pré-commit : scan sécurité + quality gates.' },
    { name: 'security-review', owner: 'getsentry', repo: 'skills', role: 'quality', desc: 'Chasse aux failles : injections, secrets, surfaces d\u2019attaque.' },
    { name: 'setup-matt-pocock-skills', owner: 'mattpocock', repo: 'skills', role: 'setup', desc: 'Installation et configuration des skills Matt Pocock.' },
    { name: 'show-me', owner: 'humanlayer', repo: 'knowledge-work-plugins', role: 'style', desc: 'Montrer le résultat : captures, preuves, démos.' },
    { name: 'stop-slop', owner: 'hardikpandya', repo: 'stop-slop', role: 'style', desc: 'Stopper les réponses génériques IA : ton humain.' },
    { name: 'subagent-driven-development', owner: 'obra', repo: 'superpowers', role: 'implementation', desc: 'Développement piloté par sub-agents, revue en 2 étapes.' },
    { name: 'tdd', owner: 'mattpocock', repo: 'skills', role: 'implementation', desc: 'Test-driven development : RED-GREEN-REFACTOR.' },
    { name: 'tech-debt', owner: 'anthropics', repo: 'skills', role: 'quality', desc: 'Identifier et prioriser la dette technique.' },
    { name: 'to-spec', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Implémenter fidèlement à la spécification.' },
    { name: 'to-tickets', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Découper le travail en tickets actionnables.' },
    { name: 'triage', owner: 'mattpocock', repo: 'skills', role: 'quality', desc: 'Machine à états pour trier issues et PR externes.' },
    { name: 'using-git-worktrees', owner: 'obra', repo: 'superpowers', role: 'implementation', desc: 'Isoler chaque feature dans un worktree dédié.' },
    { name: 'verification-before-completion', owner: 'obra', repo: 'superpowers', role: 'delivery', desc: 'Preuve avant de déclarer terminé : logs, tests, sorties réelles.' },
    { name: 'wait-what', owner: 'mattpocock', repo: 'skills', role: 'style', desc: 'Objection bienveillante : demander la preuve.' },
    { name: 'writing-for-agents', owner: 'mattpocock', repo: 'skills', role: 'design', desc: 'Écrire de la documentation réellement exploitable par les agents.' }
  ];

  const skillsGrid = document.getElementById('skills-grid');
  const skillsFilters = document.getElementById('skills-filters');
  let activeRole = null;

  function skillHref(s) {
    return `https://github.com/${s.owner}/${s.repo}`;
  }

  function renderSkillCard(s) {
    const a = document.createElement('a');
    a.href = skillHref(s);
    a.className = 'skill-card';
    a.rel = 'noopener';
    a.dataset.role = s.role;
    const color = ROLE_COLORS[s.role] || '#9a948a';
    a.innerHTML =
      `<div class="skill-card-head">
        <span class="skill-role" style="color:${color};border-color:${color}44;background:${color}14">${ROLE_LABELS[s.role] || s.role}</span>
      </div>
      <h3 class="skill-name">${escapeHtml(s.name)}</h3>
      <p class="skill-desc">${escapeHtml(s.desc)}</p>
      <div class="skill-meta"><span class="skill-owner">@${escapeHtml(s.owner)}</span></div>`;
    return a;
  }

  function renderSkills() {
    if (!skillsGrid) return;
    skillsGrid.innerHTML = '';
    SKILLS.filter((s) => !activeRole || s.role === activeRole)
      .forEach((s) => skillsGrid.appendChild(renderSkillCard(s)));
  }

  function renderSkillFilters() {
    if (!skillsFilters) return;
    skillsFilters.innerHTML = '';
    const counts = {};
    SKILLS.forEach((s) => { counts[s.role] = (counts[s.role] || 0) + 1; });
    const all = document.createElement('button');
    all.className = 'skill-filter' + (activeRole === null ? ' active' : '');
    all.textContent = `Tous · ${SKILLS.length}`;
    all.addEventListener('click', () => { activeRole = null; renderSkillFilters(); renderSkills(); });
    skillsFilters.appendChild(all);
    roleOrder.forEach((role) => {
      if (!counts[role]) return;
      const b = document.createElement('button');
      b.className = 'skill-filter' + (activeRole === role ? ' active' : '');
      b.textContent = `${ROLE_LABELS[role]} · ${counts[role]}`;
      b.dataset.role = role;
      b.addEventListener('click', () => { activeRole = (activeRole === role) ? null : role; renderSkillFilters(); renderSkills(); });
      skillsFilters.appendChild(b);
    });
  }

  renderSkillFilters();
  renderSkills();
})();
