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