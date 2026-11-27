/* ===== MEMBER 4: Garden visual state ===== */
(function initGardenState() {
  const ACTIVITY_TO_SECTION = {
    flowerMatch: 'flower-patch',
    helpBee: 'bee-area',
    butterflyGarden: 'butterfly-area',
  };

  // Called by Member 1 whenever an activity completes.
  // Also exposed globally so Member 1's code can call it.
  window.onActivityComplete = function onActivityComplete(activityId) {
    const sectionId = ACTIVITY_TO_SECTION[activityId];
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section || section.classList.contains('is-complete')) return;

    section.classList.add('is-complete');
    const badge = section.querySelector('.done-badge');
    if (badge) badge.hidden = false;

    updateProgress();
  };

  function updateProgress() {
    const done = document.querySelectorAll('.garden-section.is-complete').length;
    const text = document.getElementById('progress-text');
    if (text) text.textContent = `${done} of 3 garden tasks complete`;
    if (done === 3) showCompletion();
  }

  function showCompletion() {
    const panel = document.getElementById('completion-panel');
    if (panel) {
      panel.hidden = false;
      panel.querySelector('#play-again')?.focus();
    }
  }

  function resetGarden() {
    document.querySelectorAll('.garden-section.is-complete')
      .forEach(s => s.classList.remove('is-complete'));
    document.querySelectorAll('.done-badge').forEach(b => b.hidden = true);
    const panel = document.getElementById('completion-panel');
    if (panel) panel.hidden = true;
    const text = document.getElementById('progress-text');
    if (text) text.textContent = '0 of 3 garden tasks complete';
  }

  // Play Again — resets garden AND calls Member 1's reset if present
  document.addEventListener('click', (e) => {
    if (e.target.id === 'play-again') {
      resetGarden();
      if (typeof window.resetApp === 'function') window.resetApp();
    }
  });

  // Expose reset so Member 1's restart can also clear garden
  window.resetGarden = resetGarden;
})();
/* ===== end MEMBER 4 ===== */

/* ===== MEMBER 1: Shared state, navigation, restart ===== */
(function initApp() {
  const ACTIVITIES = {
    flowerMatch:     { title: 'Flower Match',     instructions: 'Tap two flowers that look the same.' },
    helpBee:         { title: 'Help the Bee',     instructions: '' },
    butterflyGarden: { title: 'Butterfly Garden', instructions: '' },
  };
  const registry = {}; // activityId -> render(rootEl, api)

  // Single authoritative state (see integration-notes.md)
  const state = {
    currentScreen: 'intro',
    completedActivities: { flowerMatch: false, helpBee: false, butterflyGarden: false },
    progress: 0,
    selectedItem: null,
  };
  window.appState = state;

  const $ = (id) => document.getElementById(id);

  function showFeedback(message, kind) {
    const el = $('feedback');
    el.textContent = message || '';
    el.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function showScreen(name) {
    state.currentScreen = name;
    $('screen-intro').hidden = name !== 'intro';
    $('screen-garden').hidden = !(name === 'garden' || name === 'complete');
    $('activity-container').hidden = !ACTIVITIES[name];
    showFeedback('');
  }

  function startActivity(id) {
    const info = ACTIVITIES[id];
    if (!info) return;
    state.selectedItem = null;
    showScreen(id);
    $('activity-title').textContent = info.title;
    $('activity-instructions').textContent = info.instructions;
    const root = $('activity-root');
    root.innerHTML = '';
    if (typeof registry[id] === 'function') {
      registry[id](root, { completeActivity, showFeedback, state });
    } else {
      root.innerHTML = '<p>This activity is coming soon!</p>';
    }
    $('activity-title').focus();
  }

  // Activities call this exactly once when the child finishes.
  function completeActivity(id) {
    if (!(id in state.completedActivities) || state.completedActivities[id]) return;
    state.completedActivities[id] = true;
    state.progress = Object.values(state.completedActivities).filter(Boolean).length;
    state.selectedItem = null;
    window.onActivityComplete(id);            // Member 4: colours the section, updates text/panel
    showScreen(state.progress === 3 ? 'complete' : 'garden');
    showFeedback(state.progress === 3 ? '' : 'Great job! Part of the garden has its colour back.', 'good');
  }

  function resetApp() {
    state.completedActivities = { flowerMatch: false, helpBee: false, butterflyGarden: false };
    state.progress = 0;
    state.selectedItem = null;
    if (typeof window.resetGarden === 'function') window.resetGarden();
    $('activity-root').innerHTML = '';
    showScreen('intro');
  }

  window.registerActivity = (id, renderFn) => { registry[id] = renderFn; };
  window.completeActivity = completeActivity;
  window.resetApp = resetApp;
  window.showFeedback = showFeedback;

  $('start-btn').addEventListener('click', () => showScreen('garden'));
  $('back-btn').addEventListener('click', () => showScreen('garden'));
  $('restart-btn').addEventListener('click', resetApp);
  document.querySelectorAll('.station-btn[data-activity]').forEach((btn) =>
    btn.addEventListener('click', () => startActivity(btn.dataset.activity)));
  showScreen('intro');
})();

/* ===== MEMBER 1: Activity A - Flower Match (3 pairs) ===== */
window.registerActivity('flowerMatch', function renderFlowerMatch(root, api) {
  const FLOWERS = [
    { id: 'tulip', symbol: '🌷', name: 'tulip' },
    { id: 'sunflower', symbol: '🌻', name: 'sunflower' },
    { id: 'rose', symbol: '🌹', name: 'rose' },
  ];
  const cards = FLOWERS.concat(FLOWERS).map((f, i) => ({ ...f, key: i, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) {           // shuffle
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  const grid = document.createElement('div');
  grid.className = 'match-grid';
  root.appendChild(grid);
  let first = null, locked = false, matchedPairs = 0;

  const buttons = cards.map((card) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'match-card';
    b.textContent = card.symbol;
    b.setAttribute('aria-label', card.name);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => pick(card, b));
    grid.appendChild(b);
    return b;
  });

  function pick(card, btn) {
    if (locked || card.matched || first === card) return;
    btn.classList.add('is-selected');
    btn.setAttribute('aria-pressed', 'true');
    if (!first) { first = card; api.state.selectedItem = card.id; return; }

    const a = first, aBtn = buttons[cards.indexOf(a)];
    first = null; api.state.selectedItem = null;
    if (a.id === card.id) {
      [aBtn, btn].forEach((x) => { x.classList.replace('is-selected', 'is-matched'); x.disabled = true; });
      a.matched = card.matched = true;
      matchedPairs++;
      if (matchedPairs === FLOWERS.length) {
        api.showFeedback('You matched them all!', 'good');
        locked = true;
        setTimeout(() => api.completeActivity('flowerMatch'), 900);
      } else {
        api.showFeedback('Yes! That is a match.', 'good');
      }
    } else {
      locked = true;
      api.showFeedback('Not quite. Try again!', 'try-again');
      [aBtn, btn].forEach((x) => x.classList.add('is-wrong'));
      setTimeout(() => {
        [aBtn, btn].forEach((x) => {
          x.classList.remove('is-selected', 'is-wrong');
          x.setAttribute('aria-pressed', 'false');
        });
        locked = false;
      }, 900);
    }
  }
});
/* ===== end MEMBER 1 ===== */
