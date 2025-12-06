// TacticDev new tab logic: theme, time, focus, scratchpad, search shortcuts, launchpad management
(function () {
  const THEME_KEY = 'tacticdev-theme';
  const FOCUS_KEY = 'tacticdev-focus';
  const FOCUS_ITEMS_KEY = 'tacticdev-focus-items';
  const SCRATCH_KEY = 'tacticdev-scratchpad';
  const SCRATCH_HISTORY_KEY = 'tacticdev-scratchpad-history';
  const SEARCH_HISTORY_KEY = 'tacticdev-search-history';
  const LINKS_KEY = 'tacticdev-links';
  const POMODORO_KEY = 'tacticdev-pomodoro';

  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const datetimeEl = document.getElementById('local-datetime');
  const focusEl = document.getElementById('focus-text');
  const focusListEl = document.getElementById('focus-list');
  const focusForm = document.getElementById('focus-form');
  const focusInput = document.getElementById('focus-input');
  const focusProgressFill = document.getElementById('focus-progress-fill');
  const focusProgressLabel = document.getElementById('focus-progress-label');
  const scratchEl = document.getElementById('scratchpad');
  const scratchPreviewToggle = document.getElementById('scratch-preview-toggle');
  const scratchPreview = document.getElementById('scratchpad-preview');
  const scratchSave = document.getElementById('scratch-save');
  const scratchClear = document.getElementById('scratch-clear');
  const historyEl = document.getElementById('history-list');
  const historyClear = document.getElementById('history-clear');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchSuggestions = document.getElementById('search-suggestions');
  const linkGrid = document.getElementById('link-grid');
  const linkManageBtn = document.getElementById('link-manage-btn');
  const linkResetBtn = document.getElementById('link-reset-btn');
  const linkModal = document.getElementById('link-modal');
  const linkModalClose = document.getElementById('link-modal-close');
  const linkManageList = document.getElementById('link-manage-list');
  const linkForm = document.getElementById('link-form');
  const linkIdInput = document.getElementById('link-id');
  const linkNameInput = document.getElementById('link-name');
  const linkUrlInput = document.getElementById('link-url');
  const linkMetaInput = document.getElementById('link-meta');
  const linkTagInput = document.getElementById('link-tag');
  const linkCancelBtn = document.getElementById('link-cancel');
  const exportBtn = document.getElementById('export-btn');

  let searchHistoryIndex = -1;
  let currentSuggestions = [];

  const defaultLinks = [
    {
      id: 'tacticdev',
      name: 'TacticDev.com',
      url: 'https://tacticdev.com',
      meta: 'Public site & positioning. Gut-check the story.',
      tag: 'Studio'
    },
    {
      id: 'org-gh',
      name: 'TacticDev GitHub',
      url: 'https://github.com/Tactic-Dev',
      meta: 'Org repos, issues, PRs.',
      tag: 'Org'
    },
    {
      id: 'tyy130',
      name: 'tyy130 GitHub',
      url: 'https://github.com/tyy130',
      meta: 'Weird experiments, personal toys, proofs-of-concept.',
      tag: 'Personal'
    },
    {
      id: 'airtable',
      name: 'TacticDev Airtable',
      url: 'https://airtable.com/appNSUbn7tG2iJaj2/shrq38ri0cMcgbmOU',
      meta: 'Pipelines, clients, sprint tracking.',
      tag: 'Ops'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      meta: 'Pair programmer, copy desk, strategy brain.',
      tag: 'AI'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      url: 'https://gemini.google.com',
      meta: 'Alt brain, quick drafts, cross-checks.',
      tag: 'AI'
    },
    {
      id: 'v0',
      name: 'v0 by Vercel',
      url: 'https://v0.dev',
      meta: 'UI mocks, snippets, and quick front-end riffs.',
      tag: 'Build'
    },
    {
      id: 'photoroom',
      name: 'Photoroom',
      url: 'https://www.photoroom.com/',
      meta: 'Crisp product / hero assets.',
      tag: 'Visual'
    },
    {
      id: 'suno',
      name: 'Suno',
      url: 'https://app.suno.ai',
      meta: 'Rowan / Slughouse sound design lab.',
      tag: 'Audio'
    },
    {
      id: 'linear',
      name: 'Linear',
      url: 'https://linear.app/tacticdev',
      meta: 'Issues, roadmap, runway checks in one pass.',
      tag: 'Ops'
    },
    {
      id: 'figma',
      name: 'Figma',
      url: 'https://www.figma.com/files/recent',
      meta: 'Latest canvases from studio + clients.',
      tag: 'Design'
    },
    {
      id: 'vercel',
      name: 'Vercel Deploys',
      url: 'https://vercel.com/tacticdev',
      meta: 'Prod health, previews, incident watch.',
      tag: 'Ship'
    },
    {
      id: 'stripe',
      name: 'Stripe Dashboard',
      url: 'https://dashboard.stripe.com/',
      meta: 'Revenue pulses, payouts, client receipts.',
      tag: 'Finance'
    },
    {
      id: 'notion',
      name: 'Notion HQ',
      url: 'https://www.notion.so/tacticdev',
      meta: 'Operating docs, briefs, archived learnings.',
      tag: 'Docs'
    },
    {
      id: 'slack',
      name: 'Slack',
      url: 'https://app.slack.com/client',
      meta: 'Client channels and internal huddles.',
      tag: 'Comm'
    }
  ];

  let launchpadLinks = loadLaunchpadLinks();
  let focusItems = loadFocusItems();

  /* ---------- THEME ---------- */

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (toggleBtn) {
      toggleBtn.setAttribute('data-theme', theme);
      toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  (function initTheme() {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const preferred = storedTheme || 'dark';
    setTheme(preferred);
  })();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- TIME ---------- */

  function updateTime() {
    if (!datetimeEl) return;
    try {
      const now = new Date();
      const opts = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
      datetimeEl.textContent = now.toLocaleString(undefined, opts);
    } catch (e) {
      datetimeEl.textContent = '';
    }
  }
  updateTime();
  setInterval(updateTime, 60000);

  /* ---------- LAUNCHPAD LINKS ---------- */

  function cloneDefaultLinks() {
    return defaultLinks.map(link => ({ ...link }));
  }

  function loadLaunchpadLinks() {
    try {
      const raw = localStorage.getItem(LINKS_KEY);
      if (!raw) return cloneDefaultLinks();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map((link, idx) => ({
          id: link.id || `${link.name || 'link'}-${idx}`,
          name: link.name || 'Untitled',
          url: link.url || 'https://example.com',
          meta: link.meta || '',
          tag: link.tag || ''
        }));
      }
    } catch (_) {}
    return cloneDefaultLinks();
  }

  function persistLaunchpadLinks(list) {
    launchpadLinks = list;
    try {
      localStorage.setItem(LINKS_KEY, JSON.stringify(list));
    } catch (_) {}
    renderLinks();
    renderLinkManageList();
  }

  function renderLinks() {
    if (!linkGrid) return;
    linkGrid.innerHTML = '';
    if (!launchpadLinks.length) {
      const empty = document.createElement('div');
      empty.className = 'link-empty';
      empty.textContent = 'Add links to keep this launchpad useful.';
      linkGrid.appendChild(empty);
      return;
    }

    launchpadLinks.forEach(link => {
      const a = document.createElement('a');
      a.className = 'link-tile';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';

      const label = document.createElement('span');
      label.className = 'link-label';
      label.textContent = link.name;

      const meta = document.createElement('span');
      meta.className = 'link-meta';
      meta.textContent = link.meta || '';

      a.appendChild(label);
      a.appendChild(meta);

      if (link.tag) {
        const tag = document.createElement('span');
        tag.className = 'link-tag';
        tag.textContent = link.tag;
        a.appendChild(tag);
      }

      linkGrid.appendChild(a);
    });
  }

  function renderLinkManageList() {
    if (!linkManageList) return;
    linkManageList.innerHTML = '';

    if (!launchpadLinks.length) {
      const empty = document.createElement('li');
      empty.className = 'link-manage-item';
      empty.textContent = 'No links yet. Add your first favorite.';
      linkManageList.appendChild(empty);
      return;
    }

    launchpadLinks.forEach((link, idx) => {
      const li = document.createElement('li');
      li.className = 'link-manage-item';

      const info = document.createElement('div');
      info.className = 'link-manage-info';
      info.innerHTML = `<strong>${link.name}</strong><span>${link.url}</span>`;

      const actions = document.createElement('div');
      actions.className = 'link-item-actions';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.textContent = 'UP';
      upBtn.disabled = idx === 0;
      upBtn.addEventListener('click', () => moveLink(link.id, -1));

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.textContent = 'DN';
      downBtn.disabled = idx === launchpadLinks.length - 1;
      downBtn.addEventListener('click', () => moveLink(link.id, 1));

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'EDIT';
      editBtn.addEventListener('click', () => openLinkModal(link));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', () => deleteLink(link.id));

      actions.appendChild(upBtn);
      actions.appendChild(downBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(info);
      li.appendChild(actions);
      linkManageList.appendChild(li);
    });
  }

  function openLinkModal(link) {
    if (!linkModal || !linkForm) return;
    linkModal.classList.add('active');
    linkModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (link) {
      linkIdInput.value = link.id;
      linkNameInput.value = link.name || '';
      linkUrlInput.value = link.url || '';
      linkMetaInput.value = link.meta || '';
      linkTagInput.value = link.tag || '';
    } else {
      linkForm.reset();
      linkIdInput.value = '';
    }

    setTimeout(() => {
      linkNameInput?.focus();
    }, 10);
  }

  function closeLinkModal() {
    if (!linkModal || !linkForm) return;
    linkModal.classList.remove('active');
    linkModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    linkForm.reset();
    linkIdInput.value = '';
  }

  function deleteLink(id) {
    launchpadLinks = launchpadLinks.filter(link => link.id !== id);
    persistLaunchpadLinks(launchpadLinks);
  }

  function moveLink(id, direction) {
    const index = launchpadLinks.findIndex(link => link.id === id);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= launchpadLinks.length) return;
    const newList = [...launchpadLinks];
    const [removed] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, removed);
    persistLaunchpadLinks(newList);
  }

  if (linkForm) {
    linkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (linkNameInput?.value || '').trim();
      const url = (linkUrlInput?.value || '').trim();
      if (!name || !url) return;
      const meta = (linkMetaInput?.value || '').trim();
      const tag = (linkTagInput?.value || '').trim();
      const id = linkIdInput.value || `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newLink = { id, name, url, meta, tag };
      const existingIndex = launchpadLinks.findIndex(link => link.id === id);
      const nextLinks = [...launchpadLinks];
      if (existingIndex >= 0) {
        nextLinks[existingIndex] = newLink;
      } else {
        nextLinks.push(newLink);
      }
      persistLaunchpadLinks(nextLinks);
      closeLinkModal();
    });
  }

  if (linkManageBtn) {
    linkManageBtn.addEventListener('click', () => openLinkModal());
  }
  linkModalClose?.addEventListener('click', closeLinkModal);
  linkCancelBtn?.addEventListener('click', closeLinkModal);
  if (linkModal) {
    linkModal.addEventListener('click', (e) => {
      if (e.target === linkModal) closeLinkModal();
    });
  }

  if (linkResetBtn) {
    linkResetBtn.addEventListener('click', () => {
      persistLaunchpadLinks(cloneDefaultLinks());
    });
  }

  renderLinks();
  renderLinkManageList();

  /* ---------- FOCUS ---------- */

  if (focusEl) {
    const storedFocus = localStorage.getItem(FOCUS_KEY);
    if (storedFocus) focusEl.textContent = storedFocus;

    focusEl.addEventListener('click', () => {
      const next = prompt("Set today’s focus:", focusEl.textContent.trim());
      if (next && next.trim().length > 0) {
        const val = next.trim();
        focusEl.textContent = val;
        localStorage.setItem(FOCUS_KEY, val);
      }
    });
  }

  function loadFocusItems() {
    try {
      const raw = localStorage.getItem(FOCUS_ITEMS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveFocusItems(items) {
    focusItems = items;
    try {
      localStorage.setItem(FOCUS_ITEMS_KEY, JSON.stringify(items));
    } catch (_) {}
  }

  function renderFocusItems() {
    if (!focusListEl) return;
    focusListEl.innerHTML = '';
    if (!focusItems.length) {
      const empty = document.createElement('div');
      empty.className = 'focus-item focus-empty';
      empty.textContent = 'Set 1–3 micro tasks. Finish them before wandering.';
      focusListEl.appendChild(empty);
    } else {
      focusItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'focus-item';
        if (item.done) row.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(item.done);
        checkbox.addEventListener('change', () => toggleFocusItem(item.id, checkbox.checked));

        const text = document.createElement('span');
        text.textContent = item.text;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', () => removeFocusItem(item.id));

        row.appendChild(checkbox);
        row.appendChild(text);
        row.appendChild(removeBtn);
        focusListEl.appendChild(row);
      });
    }
    updateFocusProgress();
  }

  function updateFocusProgress() {
    if (!focusProgressFill || !focusProgressLabel) return;
    const total = focusItems.length;
    const done = focusItems.filter(item => item.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    focusProgressFill.style.width = `${pct}%`;
    focusProgressLabel.textContent = total ? `${done}/${total} complete` : '0 tasks';
  }

  function addFocusItem(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: trimmed,
      done: false
    };
    const next = [...focusItems, item];
    saveFocusItems(next);
    renderFocusItems();
  }

  function toggleFocusItem(id, done) {
    const next = focusItems.map(item => (item.id === id ? { ...item, done } : item));
    saveFocusItems(next);
    renderFocusItems();
  }

  function removeFocusItem(id) {
    const next = focusItems.filter(item => item.id !== id);
    saveFocusItems(next);
    renderFocusItems();
  }

  if (focusForm && focusInput) {
    focusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addFocusItem(focusInput.value || '');
      focusInput.value = '';
      focusInput.focus();
    });
  }

  renderFocusItems();

  /* ---------- SCRATCHPAD + HISTORY ---------- */

  function getHistory() {
    try {
      const raw = localStorage.getItem(SCRATCH_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(list) {
    try {
      localStorage.setItem(SCRATCH_HISTORY_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function renderHistory() {
    if (!historyEl) return;

    const list = getHistory();
    while (historyEl.firstChild) historyEl.removeChild(historyEl.firstChild);

    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'history-empty';
      li.textContent = 'No snapshots yet. Save something worth keeping.';
      historyEl.appendChild(li);
      return;
    }

    list
      .slice()
      .reverse()
      .forEach(entry => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const preview = document.createElement('span');
        preview.className = 'preview';
        preview.textContent = entry.text
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80) || '(empty)';

        const time = document.createElement('span');
        time.className = 'time';
        time.textContent = entry.label || entry.timestamp;

        li.appendChild(preview);
        li.appendChild(time);

        li.addEventListener('click', () => {
          if (!scratchEl || !entry.text) return;
          scratchEl.textContent = entry.text;
          localStorage.setItem(SCRATCH_KEY, entry.text);
          scratchEl.focus();
          updateScratchPreview();
        });

        historyEl.appendChild(li);
      });
  }

  if (scratchEl) {
    const storedScratch = localStorage.getItem(SCRATCH_KEY) || '';
    if (storedScratch.trim().length > 0) {
      scratchEl.textContent = storedScratch;
    } else {
      scratchEl.innerHTML =
        '<span class="scratchpad-placeholder">Jot down todos, links, or braindumps. This stays on this device.</span>';
    }

    scratchEl.addEventListener('focus', () => {
      const placeholder = scratchEl.querySelector('.scratchpad-placeholder');
      if (placeholder) {
        scratchEl.innerHTML = '';
      }
    });

    scratchEl.addEventListener('input', () => {
      const text = scratchEl.textContent || '';
      localStorage.setItem(SCRATCH_KEY, text);
      if (!text.trim().length) {
        scratchEl.innerHTML =
          '<span class="scratchpad-placeholder">Jot down todos, links, or braindumps. This stays on this device.</span>';
      }
      updateScratchPreview();
    });
  }

  function renderMarkdown(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    const formatInline = (str) =>
      str
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    lines.forEach(line => {
      if (/^\s*[-*]\s+/.test(line)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${formatInline(line.replace(/^\s*[-*]\s+/, ''))}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (!line.trim()) {
          html += '<br />';
        } else if (/^#{1,3}\s+/.test(line)) {
          const level = Math.min(line.match(/^#{1,3}/)[0].length + 3, 6);
          const content = formatInline(line.replace(/^#{1,3}\s+/, ''));
          html += `<h${level}>${content}</h${level}>`;
        } else {
          html += `<p>${formatInline(line)}</p>`;
        }
      }
    });

    if (inList) html += '</ul>';
    return html || '<em>Nothing to preview.</em>';
  }

  function updateScratchPreview() {
    if (!scratchPreview || !scratchPreviewToggle || !scratchEl) return;
    if (!scratchPreviewToggle.checked) return;
    const text = scratchEl.textContent || '';
    scratchPreview.innerHTML = renderMarkdown(text.trim());
  }

  if (scratchPreviewToggle) {
    scratchPreviewToggle.addEventListener('change', () => {
      if (!scratchPreview) return;
      scratchPreview.classList.toggle('active', scratchPreviewToggle.checked);
      if (scratchPreviewToggle.checked) {
        updateScratchPreview();
      }
    });
  }

  if (scratchSave && scratchEl) {
    scratchSave.addEventListener('click', () => {
      const text = scratchEl.textContent || '';
      const trimmed = text.trim();
      if (!trimmed.length) return;

      const now = new Date();
      const label = now.toLocaleString(undefined, {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      const list = getHistory();
      list.push({
        text,
        timestamp: now.toISOString(),
        label
      });

      if (list.length > 20) list.splice(0, list.length - 20);
      saveHistory(list);
      renderHistory();
    });
  }

  if (scratchClear && scratchEl) {
    scratchClear.addEventListener('click', () => {
      scratchEl.innerHTML =
        '<span class="scratchpad-placeholder">Jot down todos, links, or braindumps. This stays on this device.</span>';
      localStorage.removeItem(SCRATCH_KEY);
      if (scratchPreview) scratchPreview.innerHTML = '';
    });
  }

  if (historyClear) {
    historyClear.addEventListener('click', () => {
      saveHistory([]);
      renderHistory();
    });
  }

  renderHistory();

  /* ---------- SEARCH SHORTCUTS ---------- */

  function looksLikeUrl(str) {
    const urlPattern = /^(https?:\/\/)/i;
    const domainPattern = /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i;
    return urlPattern.test(str) || domainPattern.test(str);
  }

  function buildSearchUrl(raw) {
    const q = raw.trim();
    if (!q) return null;

    if (looksLikeUrl(q) && !q.includes(' ')) {
      if (/^https?:\/\//i.test(q)) return q;
      return 'https://' + q;
    }

    const parts = q.split(/\s+/);
    const prefix = parts[0].toLowerCase();
    const rest = parts.slice(1).join(' ').trim();

    const encRest = encodeURIComponent(rest);
    const encAll = encodeURIComponent(q);

    switch (prefix) {
      case 'gh':
        return rest
          ? 'https://github.com/search?q=' + encRest
          : 'https://github.com/';
      case 'yt':
        return rest
          ? 'https://www.youtube.com/results?search_query=' + encRest
          : 'https://www.youtube.com/';
      case 'ddg':
        return 'https://duckduckgo.com/?q=' + encodeURIComponent(rest || '');
      case 'td':
        if (!rest) return 'https://tacticdev.com/';
        return (
          'https://duckduckgo.com/?q=' +
          encodeURIComponent(rest + ' site:tacticdev.com')
        );
      case 'at':
        return 'https://airtable.com/appNSUbn7tG2iJaj2/shrq38ri0cMcgbmOU';
      case 'sc':
        return rest
          ? 'https://soundcloud.com/search?q=' + encRest
          : 'https://soundcloud.com/';
      default:
        return 'https://duckduckgo.com/?q=' + encAll;
    }
  }

  /* ---------- SEARCH HISTORY & SUGGESTIONS ---------- */

  function getSearchHistory() {
    try {
      const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveSearchHistory(query) {
    if (!query || !query.trim()) return;
    const history = getSearchHistory();
    const trimmed = query.trim();
    const filtered = history.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    filtered.push(trimmed);
    const recent = filtered.slice(-20);
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(recent));
    } catch (_) {}
  }

  function showSuggestions(query) {
    if (!searchSuggestions) return;
    if (!query || query.trim().length < 1) {
      searchSuggestions.style.display = 'none';
      currentSuggestions = [];
      return;
    }

    const history = getSearchHistory();
    const lowerQuery = query.toLowerCase();
    const matches = history
      .filter(item => item.toLowerCase().includes(lowerQuery))
      .slice(0, 5);

    if (matches.length === 0) {
      searchSuggestions.style.display = 'none';
      currentSuggestions = [];
      return;
    }

    currentSuggestions = matches;
    searchSuggestions.innerHTML = '';
    matches.forEach((match, idx) => {
      const li = document.createElement('li');
      li.className = 'suggestion-item';
      li.textContent = match;
      li.addEventListener('click', () => {
        searchInput.value = match;
        searchSuggestions.style.display = 'none';
        searchInput.focus();
      });
      searchSuggestions.appendChild(li);
    });
    searchSuggestions.style.display = 'block';
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      showSuggestions(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && currentSuggestions.length > 0) {
        e.preventDefault();
        const items = searchSuggestions.querySelectorAll('.suggestion-item');
        if (items.length > 0) {
          searchHistoryIndex = Math.min(searchHistoryIndex + 1, items.length - 1);
          items[searchHistoryIndex]?.scrollIntoView({ block: 'nearest' });
          items.forEach((item, idx) => {
            item.classList.toggle('active', idx === searchHistoryIndex);
          });
        }
      } else if (e.key === 'ArrowUp' && currentSuggestions.length > 0) {
        e.preventDefault();
        const items = searchSuggestions.querySelectorAll('.suggestion-item');
        if (items.length > 0) {
          searchHistoryIndex = Math.max(searchHistoryIndex - 1, -1);
          if (searchHistoryIndex >= 0) {
            items[searchHistoryIndex]?.scrollIntoView({ block: 'nearest' });
            items.forEach((item, idx) => {
              item.classList.toggle('active', idx === searchHistoryIndex);
            });
          } else {
            items.forEach(item => item.classList.remove('active'));
          }
        }
      } else if (e.key === 'Enter' && searchHistoryIndex >= 0 && currentSuggestions.length > 0) {
        e.preventDefault();
        const items = searchSuggestions.querySelectorAll('.suggestion-item');
        if (items[searchHistoryIndex]) {
          searchInput.value = currentSuggestions[searchHistoryIndex];
          searchSuggestions.style.display = 'none';
          searchHistoryIndex = -1;
        }
      } else if (e.key === 'Escape') {
        searchSuggestions.style.display = 'none';
        searchHistoryIndex = -1;
      }
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (searchSuggestions) searchSuggestions.style.display = 'none';
      }, 200);
    });
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = searchInput.value || '';
      if (!raw.trim()) return;
      saveSearchHistory(raw);
      const url = buildSearchUrl(raw);
      if (!url) return;
      window.location.href = url;
    });
  }

  /* ---------- KEYBOARD SHORTCUTS ---------- */

  document.addEventListener('keydown', (e) => {
    if (linkModal && linkModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLinkModal();
      }
      return;
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      if (e.key === '/' && e.target !== searchInput) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleBtn?.click();
    } else if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      scratchEl?.focus();
    } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      focusEl?.click();
    } else if (e.key === 'Escape') {
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        if (searchSuggestions) searchSuggestions.style.display = 'none';
      }
    }
  });

  /* ---------- POMODORO TIMER ---------- */

  function initPomodoro() {
    const pomodoroEl = document.getElementById('pomodoro-timer');
    const pomodoroBtn = document.getElementById('pomodoro-start');
    const pomodoroReset = document.getElementById('pomodoro-reset');
    if (!pomodoroEl || !pomodoroBtn) return;

    let timerInterval = null;
    let timeLeft = 25 * 60;
    let isRunning = false;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
      pomodoroEl.textContent = formatTime(timeLeft);
      document.title = `${formatTime(timeLeft)} - TacticDev — Browser Console`;
    }

    function loadPomodoroState() {
      try {
        const stored = localStorage.getItem(POMODORO_KEY);
        if (stored) {
          const state = JSON.parse(stored);
          if (state.endTime && new Date(state.endTime) > new Date()) {
            const remaining = Math.ceil((new Date(state.endTime) - new Date()) / 1000);
            if (remaining > 0) {
              timeLeft = remaining;
              isRunning = true;
              startTimer();
            }
          } else {
            timeLeft = state.timeLeft || 25 * 60;
          }
        }
      } catch (_) {}
      updateDisplay();
    }

    function savePomodoroState() {
      try {
        const state = {
          timeLeft,
          isRunning,
          endTime: isRunning ? new Date(Date.now() + timeLeft * 1000).toISOString() : null
        };
        localStorage.setItem(POMODORO_KEY, JSON.stringify(state));
      } catch (_) {}
    }

    function requestNotificationPermission() {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }

    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      isRunning = true;
      pomodoroBtn.textContent = 'Pause';
      savePomodoroState();
      requestNotificationPermission();

      timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        savePomodoroState();

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          isRunning = false;
          pomodoroBtn.textContent = 'Start';
          document.title = 'TacticDev — Browser Console';
          if (Notification.permission === 'granted') {
            new Notification('Pomodoro Complete! 🎉', {
              body: 'Time for a break! You\'ve earned it.',
              icon: 'icons/icon48.png',
              tag: 'pomodoro-complete'
            });
          }
        }
      }, 1000);
    }

    function pauseTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      isRunning = false;
      pomodoroBtn.textContent = 'Start';
      savePomodoroState();
    }

    pomodoroBtn.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });

    pomodoroReset?.addEventListener('click', () => {
      pauseTimer();
      timeLeft = 25 * 60;
      updateDisplay();
      savePomodoroState();
    });

    loadPomodoroState();
  }

  initPomodoro();

  /* ---------- EXPORT FUNCTIONALITY ---------- */

  function exportData() {
    const data = {
      focus: localStorage.getItem(FOCUS_KEY) || '',
      focusItems: localStorage.getItem(FOCUS_ITEMS_KEY) || '[]',
      scratchpad: localStorage.getItem(SCRATCH_KEY) || '',
      scratchpadHistory: localStorage.getItem(SCRATCH_HISTORY_KEY) || '[]',
      searchHistory: localStorage.getItem(SEARCH_HISTORY_KEY) || '[]',
      links: localStorage.getItem(LINKS_KEY) || '[]',
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tacticdev-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportBtn?.addEventListener('click', exportData);

  /* ---------- SYNC & IDENTITY ENGINE ---------- */
  const SYNC_CONFIG_KEY = 'tacticdev-sync-config';
  const INSTANCE_NAME_KEY = 'tacticdev-instance-name';
  
  const syncBtn = document.getElementById('sync-btn');
  const syncModal = document.getElementById('sync-modal');
  const syncModalClose = document.getElementById('sync-modal-close');
  const syncForm = document.getElementById('sync-form');
  const instanceNameInput = document.getElementById('instance-name-input');
  const instanceDisplay = document.getElementById('instance-display');
  const syncUrlInput = document.getElementById('sync-url');
  const syncKeyInput = document.getElementById('sync-key');
  const syncPullBtn = document.getElementById('sync-pull-btn');
  const syncPushBtn = document.getElementById('sync-push-btn');
  const syncStatusEl = document.getElementById('sync-status');
  const syncLastTimeEl = document.getElementById('sync-last-time');

  let syncConfig = { url: '', key: '' };
  let instanceName = 'New tab';

  function loadIdentity() {
    const storedName = localStorage.getItem(INSTANCE_NAME_KEY);
    if (storedName) {
      instanceName = storedName;
    }
    if (instanceDisplay) instanceDisplay.textContent = instanceName;
  }

  function saveIdentity(name) {
    instanceName = name || 'New tab';
    localStorage.setItem(INSTANCE_NAME_KEY, instanceName);
    if (instanceDisplay) instanceDisplay.textContent = instanceName;
  }

  function loadSyncConfig() {
    try {
      const raw = localStorage.getItem(SYNC_CONFIG_KEY);
      if (raw) syncConfig = JSON.parse(raw);
    } catch (_) {}
  }

  function saveSyncConfig() {
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(syncConfig));
  }

  async function performSync(mode = 'pull') {
    if (!syncConfig.url) {
      updateSyncStatus('No URL configured');
      return;
    }

    updateSyncStatus(mode === 'pull' ? 'Pulling...' : 'Pushing...');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (syncConfig.key) {
      // JSONBin.io specific: Use X-Access-Key only to avoid 401 conflicts
      if (syncConfig.url.includes('jsonbin.io')) {
        headers['X-Access-Key'] = syncConfig.key;
      } else {
        // Generic fallback for other services
        headers['X-Master-Key'] = syncConfig.key; 
        headers['X-Access-Key'] = syncConfig.key;
        headers['Authorization'] = `Bearer ${syncConfig.key}`;
      }
    }

    try {
      if (mode === 'pull') {
        const res = await fetch(syncConfig.url, { method: 'GET', headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Handle JSONBin "record" wrapper if present, otherwise use raw
        const payload = data.record ? data.record : data;
        importData(payload);
        updateSyncStatus('Synced (Pull)');
      } else {
        const data = exportDataObject();
        const res = await fetch(syncConfig.url, { 
          method: 'PUT', 
          headers, 
          body: JSON.stringify(data) 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        updateSyncStatus('Synced (Push)');
      }
      if (syncLastTimeEl) syncLastTimeEl.textContent = new Date().toLocaleTimeString();
    } catch (e) {
      console.error(e);
      updateSyncStatus(`Error: ${e.message}`);
    }
  }

  function updateSyncStatus(msg) {
    if (syncStatusEl) syncStatusEl.textContent = msg;
  }

  function importData(data) {
    // Use !== undefined to allow importing empty strings (clearing data)
    if (data.focus !== undefined) localStorage.setItem(FOCUS_KEY, data.focus);
    if (data.focusItems !== undefined) localStorage.setItem(FOCUS_ITEMS_KEY, data.focusItems);
    if (data.scratchpad !== undefined) localStorage.setItem(SCRATCH_KEY, data.scratchpad);
    if (data.links !== undefined) localStorage.setItem(LINKS_KEY, data.links);
    if (data.pomodoro !== undefined) localStorage.setItem(POMODORO_KEY, data.pomodoro);
    // We do NOT overwrite instance name from sync, as that is local to the device
    location.reload(); // Refresh to show new data
  }

  function exportDataObject() {
    return {
      sourceInstance: instanceName,
      focus: localStorage.getItem(FOCUS_KEY) || '',
      focusItems: localStorage.getItem(FOCUS_ITEMS_KEY) || '[]',
      scratchpad: localStorage.getItem(SCRATCH_KEY) || '',
      links: localStorage.getItem(LINKS_KEY) || '[]',
      pomodoro: localStorage.getItem(POMODORO_KEY) || '{}',
      updatedAt: new Date().toISOString()
    };
  }

  function openSyncModal() {
    if (!syncModal) return;
    loadSyncConfig();
    loadIdentity();
    if (instanceNameInput) instanceNameInput.value = instanceName;
    syncUrlInput.value = syncConfig.url || '';
    syncKeyInput.value = syncConfig.key || '';
    syncModal.classList.add('active');
    syncModal.setAttribute('aria-hidden', 'false');
  }

  function closeSyncModal() {
    if (!syncModal) return;
    syncModal.classList.remove('active');
    syncModal.setAttribute('aria-hidden', 'true');
  }

  if (syncBtn) syncBtn.addEventListener('click', openSyncModal);
  if (syncModalClose) syncModalClose.addEventListener('click', closeSyncModal);
  if (syncModal) {
    syncModal.addEventListener('click', (e) => {
      if (e.target === syncModal) closeSyncModal();
    });
  }

  if (syncForm) {
    syncForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveIdentity(instanceNameInput.value.trim());
      syncConfig.url = syncUrlInput.value.trim();
      syncConfig.key = syncKeyInput.value.trim();
      saveSyncConfig();
      updateSyncStatus('Config saved');
    });
  }

  if (syncPullBtn) syncPullBtn.addEventListener('click', () => performSync('pull'));
  if (syncPushBtn) syncPushBtn.addEventListener('click', () => performSync('push'));

  // Check status on load
  loadIdentity();
  loadSyncConfig();
  if (syncConfig.url) updateSyncStatus('Ready');
})();

