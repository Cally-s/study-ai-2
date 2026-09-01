(function initProjectToolHeader(root) {
  'use strict';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const classList = (...values) => values.filter(Boolean).join(' ');

  const renderAttributes = attributes => Object.entries(attributes || {})
    .filter(([, value]) => value !== false && value !== null && value !== undefined)
    .map(([name, value]) => value === true ? ` ${escapeHtml(name)}` : ` ${escapeHtml(name)}="${escapeHtml(value)}"`)
    .join('');

  const actionClass = action => classList(
    'btn',
    action.variant === 'primary' ? 'btn-primary' : action.variant === 'tertiary' ? 'btn-quiet' : 'btn-secondary',
    'project-tool-header__action',
    action.variant === 'primary' && 'project-tool-header__action--primary',
    action.variant === 'tertiary' && 'project-tool-header__action--tertiary',
    action.className
  );

  function renderAction(action) {
    return `<button class="${actionClass(action)}"${renderAttributes(action.attributes)} type="button">${escapeHtml(action.label)}</button>`;
  }

  function renderProjectContext(context) {
    if (!context) return '';
    return `<div class="${classList(context.className, 'project-tool-header__context project-feature-hero__context project-context-card')}" role="group" aria-label="${escapeHtml(context.ariaLabel || context.label)}"><div class="project-tool-header__context-text"><span>${escapeHtml(context.label)}</span><strong>${escapeHtml(context.projectName)}</strong></div><button class="btn btn-secondary project-tool-header__context-action"${renderAttributes(context.buttonAttributes)} type="button">${escapeHtml(context.buttonLabel || 'Choose Project')}</button></div>`;
  }

  function render(options) {
    const titleId = options.titleId || 'project-tool-title';
    const actions = options.actions || [];
    return `<header class="${classList(options.pageClass, 'project-feature-hero project-tool-header')}" aria-labelledby="${escapeHtml(titleId)}"><button class="${classList(options.backClass, 'study-page-back project-feature-hero__back project-tool-header__back')}"${renderAttributes(options.backAttributes)} type="button" aria-label="${escapeHtml(options.backLabel || 'Return to Projects')}"><span aria-hidden="true">←</span></button><div class="${classList(options.mainClass, 'project-feature-hero__content project-tool-header__main')}"><div class="project-tool-header__identity"><div class="${classList(options.iconClass, 'project-feature-hero__icon project-tool-header__icon')}" aria-hidden="true">${escapeHtml(options.icon)}</div><div class="project-tool-header__title-group project-tool-header__text"><span class="${classList(options.eyebrowClass, 'project-feature-hero__eyebrow project-tool-header__eyebrow')}">${escapeHtml(options.eyebrow)}</span><h1 id="${escapeHtml(titleId)}" class="${classList(options.titleClass, 'project-feature-hero__title project-tool-header__title')}" tabindex="-1">${escapeHtml(options.title)}</h1></div></div><p class="${classList(options.descriptionClass, 'project-feature-hero__description project-tool-header__description')}">${escapeHtml(options.description)}</p>${renderProjectContext(options.projectContext)}<aside class="${classList(options.guidanceClass, 'project-feature-hero__guidance project-guidance-note project-tool-header__guidance')}" role="note"><strong>${escapeHtml(options.guidance)}</strong></aside></div><div class="${classList(options.actionsClass, 'project-feature-hero__actions project-tool-header__actions')}" aria-label="${escapeHtml(options.actionsLabel || `${options.title} actions`)}">${actions.map(renderAction).join('')}</div></header>`;
  }

  root.ProjectToolHeader = Object.freeze({ render });
})(typeof window !== 'undefined' ? window : globalThis);
