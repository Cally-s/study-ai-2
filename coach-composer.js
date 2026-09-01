(function installStudySparkCoachComposer(root) {
  'use strict';

  const PLACEHOLDER = 'Type your question or ask for help here…';

  function composerMarkup() {
    const form = root.document.createElement('form');
    form.id = 'coachForm';
    form.className = 'chat-input';
    form.noValidate = true;
    form.innerHTML = '<div class="coach-composer-field">' +
      '<label for="coachInput">Ask StudySpark Coach</label>' +
      '<textarea id="coachInput" name="coachMessage" rows="3" maxlength="2000" aria-describedby="coachInputHelp coachComposerCount coachComposerStatus" required></textarea>' +
      '<div class="coach-composer-meta"><small id="coachInputHelp">Quick Start suggestions are optional. Edit one or write your own question.</small><small id="coachComposerCount" aria-live="polite">0 of 2000 characters</small></div>' +
      '<p id="coachComposerStatus" class="coach-composer-status" role="status" aria-live="polite"></p>' +
      '</div><button class="btn btn-primary coach-send-button" type="submit" disabled>Send</button>';
    form.dataset.composerFallback = 'true';
    return form;
  }

  function bindFallback(form, input) {
    if (form.dataset.composerFallbackBound === 'true') return;
    form.dataset.composerFallbackBound = 'true';
    const send = form.querySelector('.coach-send-button');
    const count = form.querySelector('#coachComposerCount');
    const status = form.querySelector('#coachComposerStatus');
    const update = () => {
      send.disabled = !input.value.trim();
      count.textContent = input.value.length + ' of ' + input.maxLength + ' characters';
    };
    input.addEventListener('input', update);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) {
        status.textContent = 'Type a learning question before sending.';
        input.focus();
        return;
      }
      const preflight = new CustomEvent('studyspark:coach-message-before-send', {
        bubbles: true,
        cancelable: true,
        detail: { message: question, learningMode: root.document.getElementById('learningModeSelector')?.value || 'COACH_ME' }
      });
      if (!form.dispatchEvent(preflight)) {
        status.textContent = 'Review the privacy or assignment-policy notice before sending.';
        return;
      }
      if (typeof root.sendCoach !== 'function') {
        status.textContent = 'StudySpark Coach could not send this question. Your text is still here.';
        return;
      }
      root.sendCoach(question);
      input.value = '';
      update();
      status.textContent = 'Question sent.';
    });
    update();
  }

  function ensureComposer() {
    const card = root.document.querySelector('#coachView .chat-card');
    const messages = root.document.getElementById('chatMessages');
    const suggestions = card?.querySelector('.suggestions');
    if (!card || !messages || !suggestions) return;

    let form = root.document.getElementById('coachForm');
    if (!form) {
      form = composerMarkup();
      suggestions.after(form);
    }
    const input = form.querySelector('#coachInput');
    if (!input) return;
    input.placeholder = PLACEHOLDER;
    input.readOnly = false;
    input.disabled = false;
    form.hidden = false;
    form.removeAttribute('aria-hidden');

    if (messages.nextElementSibling !== suggestions) messages.after(suggestions);
    if (suggestions.nextElementSibling !== form) suggestions.after(form);
    if (form.dataset.composerFallback === 'true') bindFallback(form, input);
  }

  ensureComposer();
  root.requestAnimationFrame(ensureComposer);
  root.addEventListener('hashchange', ensureComposer);
  root.addEventListener('pageshow', ensureComposer);
  const card = root.document.querySelector('#coachView .chat-card');
  if (card) new MutationObserver(ensureComposer).observe(card, { childList: true, subtree: false });
})(window);
