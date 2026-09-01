const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index (2).html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const search = fs.readFileSync(path.join(root, 'global-search.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'global-search.css'), 'utf8');

function includes(source, value, label = value) {
  assert(source.includes(value), `Expected ${label}`);
}

includes(html, 'global-search.css?v=global-search-20260831', 'global search stylesheet');
includes(html, 'global-search.js?v=global-search-close-20260831', 'global search runtime');
includes(html, 'id="globalSearchTrigger"', 'shared header search trigger');
includes(html, 'for="globalSearchHeaderInput">Search StudySpark', 'accessible header search label');
includes(html, 'Search tools, assignments, notes, projects, and more…', 'required placeholder');
includes(html, 'id="globalSearchHeaderClear"', 'clear button');
includes(html, 'id="globalSearchShortcutHint"', 'keyboard shortcut hint');
includes(html, 'id="globalSearchOverlay"', 'global search overlay');
includes(html, 'role="dialog" aria-modal="true" aria-labelledby="globalSearchDialogTitle"', 'named search dialog');
includes(html, 'id="globalSearchResults" class="global-search-results" role="listbox"', 'keyboard result list');
includes(html, 'id="searchView"', 'dedicated search results page');
includes(html, 'id="globalSearchCategoryFilter"', 'category filter');
includes(html, 'id="globalSearchSort"', 'sort control');
includes(html, 'View All Results', 'view all results action');

includes(script, "search:['SEARCH','Search StudySpark']", 'search view metadata');
includes(script, "search:'/search'", 'canonical search route');
includes(script, "noteDetail:'/notes/detail'", 'note detail route used by search');
includes(script, "planDetail:'/assignments/study-plans/detail'", 'plan detail route used by search');
includes(script, "routeWithQuery.split('?')[0]", 'query-safe direct route parsing');
includes(script, "view==='search'&&currentRoute===route", 'query-preserving search route sync');
includes(script, "if(view==='search')window.StudySparkGlobalSearch?.renderSearchPage?.()", 'search page render hook');
includes(script, "window.StudySparkGlobalSearch?.setup?.()", 'global search setup during app render');
includes(script, "search:'<circle", 'shared inline SVG search icon');
includes(search, "const routeQuery=currentSearchQueryFromLocation();const query=String(forcedQuery!==undefined?forcedQuery:(routeQuery||input?.value||''))", 'search page prioritizes direct URL query');

for (const alias of [
  'study cards',
  'write notes',
  'study buddy',
  'find classmate',
  'friends requests connections',
  'group study',
  'catch up',
  'check answer',
  'compare websites',
  'claims evidence argument map',
  'AI disclosure',
  'project planning',
  'system documentation',
  'workflow system diagram',
  'privacy data collection',
  'A I',
  'artificial intelligence',
]) {
  includes(search, alias, `alias ${alias}`);
}

for (const required of [
  'GLOBAL_SEARCH_RECENT_KEY_PREFIX',
  'RECENT_SEARCH_LIMIT=8',
  'SEARCH_DEBOUNCE_MS=180',
  'SUGGESTED_FEATURE_IDS',
  'STUDYSPARK_FEATURE_REGISTRY',
  'ACCOUNT_REQUIRED_VIEWS',
  'featureRecords',
  'userContentRecords',
  'noteRecords',
  'flashcardRecords',
  'planRecords',
  'learningCheckRecords',
  'projectRecords',
  'collaborationRecords',
  'promptRecords',
  'activityRecords',
  "query.length>=2",
  'q.length<2',
  'sensitiveQuery',
  'openResult',
  'openNoteDetail',
  'openPlanDetail',
  'openStudyGroup',
  'showView(result.view',
  'openAuth',
  'No results for',
  'Browse All Tools',
  'Open Help Centre',
  'StudySpark tools are available, but your saved-work results could not be loaded.',
]) {
  includes(search, required, required);
}

assert(/\(event\.ctrlKey\|\|event\.metaKey\)&&key\.toLowerCase\(\)==='k'/.test(search), 'Ctrl/Command K shortcut is handled');
includes(search, "key==='ArrowDown'", 'Arrow Down handling');
includes(search, "key==='ArrowUp'", 'Arrow Up handling');
includes(search, "key==='Enter'", 'Enter handling');
includes(search, "key==='Escape'", 'Escape handling');
includes(search, 'restoreSearchTriggerFocus', 'shared focus return after closing');
includes(search, 'state.suppressFocusOpen', 'focus return does not reopen search');
includes(search, "headerInput?.addEventListener('click'", 'focused header input can reopen search intentionally');
includes(search, "window.addEventListener('popstate',()=>closeOverlay({returnFocus:false}))", 'browser Back closes overlay');
includes(search, "window.addEventListener('hashchange',()=>closeOverlay({returnFocus:false}))", 'hash navigation closes overlay');
includes(search, 'isEditable(target)', 'editor shortcut guard');

for (const cssNeedle of [
  '.global-search-trigger',
  'width: min(100%, 560px)',
  'min-height: 46px',
  '.global-search-panel',
  'width: min(720px, calc(100vw - 28px))',
  '.global-search-results',
  'overscroll-behavior: contain',
  '.global-search-result',
  'grid-template-columns: auto minmax(0, 1fr) auto',
  '@media (max-width: 700px)',
  'max-height: 100dvh',
  '@media (max-width: 390px)',
  '@media (forced-colors: active)',
  '@media (prefers-reduced-motion: reduce)',
]) {
  includes(css, cssNeedle, cssNeedle);
}

console.log('global-search: all assertions passed');
