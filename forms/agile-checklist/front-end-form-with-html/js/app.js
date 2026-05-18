(function () {
  'use strict';

  const NS = window.AgileChecklist;
  const ALL_ITEMS = NS.ALL_ITEMS;
  const TEAMS_ITEMS = NS.TEAMS_ITEMS;
  const STAKEHOLDERS_ITEMS = NS.STAKEHOLDERS_ITEMS;
  const PRACTICES_ITEMS = NS.PRACTICES_ITEMS;
  const SECTION_LABEL = NS.SECTION_LABEL;
  const calculateMaturity = NS.calculateMaturity;

  const ROLES = [
    { value: '', label: '—' },
    { value: 'team-member', label: 'Team member' },
    { value: 'team-lead', label: 'Team lead' },
    { value: 'scrum-master', label: 'Scrum master' },
    { value: 'product-owner', label: 'Product owner' },
    { value: 'engineering-manager', label: 'Engineering manager' },
    { value: 'agile-coach', label: 'Agile coach' },
    { value: 'executive-sponsor', label: 'Executive sponsor' },
    { value: 'other', label: 'Other' },
  ];

  const PERIODS = [
    { value: '', label: '—' },
    { value: 'sprint', label: 'Per sprint' },
    { value: 'quarter', label: 'Quarterly' },
    { value: 'half-year', label: 'Half-yearly' },
    { value: 'annual', label: 'Annual' },
    { value: 'ad-hoc', label: 'Ad-hoc' },
  ];

  function emptyAnswers() {
    const a = {};
    ALL_ITEMS.forEach(function (i) { a[i.id] = ''; });
    return a;
  }

  const STORAGE_KEY = 'agile-checklist:v1';

  function emptyState() {
    return {
      respondent: {
        fullName: '',
        email: '',
        role: '',
        yearsInAgile: '',
        teamName: '',
        organisationName: '',
        assessmentDate: '',
        assessmentPeriod: '',
      },
      answers: emptyAnswers(),
      actionPlan: {
        topAction1: '',
        topAction2: '',
        topAction3: '',
        coachNotes: '',
        overallNotes: '',
      },
    };
  }

  function safeLs() {
    try { return window.localStorage; } catch (_) { return null; }
  }

  function loadDraft() {
    const ls = safeLs();
    if (!ls) return null;
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const fresh = emptyState();
      return {
        savedAt: parsed.savedAt || '',
        data: {
          respondent: Object.assign({}, fresh.respondent, parsed.data && parsed.data.respondent),
          answers: Object.assign({}, fresh.answers, parsed.data && parsed.data.answers),
          actionPlan: Object.assign({}, fresh.actionPlan, parsed.data && parsed.data.actionPlan),
        },
      };
    } catch (_) {
      return null;
    }
  }

  function persistDraft() {
    const ls = safeLs();
    if (!ls) return '';
    const savedAt = new Date().toISOString();
    try {
      ls.setItem(STORAGE_KEY, JSON.stringify({
        savedAt: savedAt,
        data: {
          respondent: state.respondent,
          answers: state.answers,
          actionPlan: state.actionPlan,
        },
      }));
    } catch (_) { /* quota — ignore */ }
    setSavedLabel(savedAt);
    return savedAt;
  }

  function clearDraft() {
    const ls = safeLs();
    if (!ls) return;
    try { ls.removeItem(STORAGE_KEY); } catch (_) {}
    setSavedLabel('');
  }

  function setSavedLabel(iso) {
    const el = document.getElementById('saved-indicator');
    if (!el) return;
    if (!iso) { el.textContent = ''; return; }
    try {
      const d = new Date(iso);
      el.textContent = 'Saved ' + d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
    } catch (_) { el.textContent = ''; }
  }

  let state = emptyState();
  let draftRestored = false;
  const restored = loadDraft();
  if (restored) {
    state = restored.data;
    draftRestored = true;
  }

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'html') e.innerHTML = attrs[k];
        else if (k === 'on') {
          Object.keys(attrs[k]).forEach(function (ev) { e.addEventListener(ev, attrs[k][ev]); });
        } else if (attrs[k] !== undefined && attrs[k] !== null) {
          e.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function labelInput(text, type, target, key, extra) {
    const input = el('input', Object.assign({ type: type, id: 'f-' + key }, extra || {}));
    input.value = target[key] !== null && target[key] !== undefined ? target[key] : '';
    input.addEventListener('input', function (ev) {
      let v = ev.target.value;
      if (type === 'number') v = v === '' ? '' : Number(v);
      target[key] = v;
      persistDraft();
    });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), input]);
  }

  function labelSelect(text, target, key, options) {
    const select = el('select', { id: 'f-' + key });
    options.forEach(function (o) {
      const opt = el('option', { value: o.value }, [o.label]);
      if (target[key] === o.value) opt.setAttribute('selected', 'selected');
      select.appendChild(opt);
    });
    select.addEventListener('change', function (ev) { target[key] = ev.target.value; persistDraft(); });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), select]);
  }

  function labelTextarea(text, target, key) {
    const textarea = el('textarea', { id: 'f-' + key, rows: 3 });
    textarea.value = target[key];
    textarea.addEventListener('input', function (ev) { target[key] = ev.target.value; persistDraft(); });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), textarea]);
  }

  function renderRespondentSection() {
    return el('section', { class: 'form-section', id: 'step-1' }, [
      el('h2', null, ['Step 1 — Respondent identification']),
      el('p', { class: 'description' }, [
        'Tell us who is completing the checklist. None of these fields affect the maturity calculation.',
      ]),
      el('div', { class: 'field-grid cols-2' }, [
        labelInput('Full name', 'text', state.respondent, 'fullName'),
        labelInput('Email', 'email', state.respondent, 'email'),
        labelSelect('Role', state.respondent, 'role', ROLES),
        labelInput('Years working in agile', 'number', state.respondent, 'yearsInAgile', { min: 0, max: 50 }),
        labelInput('Team being assessed', 'text', state.respondent, 'teamName'),
        labelInput('Organisation / programme', 'text', state.respondent, 'organisationName'),
        labelInput('Assessment date', 'date', state.respondent, 'assessmentDate'),
        labelSelect('Assessment cadence', state.respondent, 'assessmentPeriod', PERIODS),
      ]),
    ]);
  }

  function renderItemRow(item) {
    const wrap = el('div', { class: 'item-row', 'data-id': item.id });
    wrap.appendChild(el('code', { class: 'item-id' }, [item.id]));
    wrap.appendChild(el('p', { class: 'item-text' }, [item.text]));
    const group = el('div', { class: 'yesnona', role: 'radiogroup', 'aria-label': item.id });
    [
      { v: 'yes', label: 'Yes' },
      { v: 'no', label: 'No' },
      { v: 'not-applicable', label: 'N/A' },
    ].forEach(function (opt) {
      const btn = el('button', {
        type: 'button',
        role: 'radio',
        class: 'yesnona-btn yesnona-' + opt.v + (state.answers[item.id] === opt.v ? ' checked' : ''),
        'aria-checked': state.answers[item.id] === opt.v ? 'true' : 'false',
        'data-value': opt.v,
      }, [opt.label]);
      btn.addEventListener('click', function () {
        const previous = state.answers[item.id];
        const next = previous === opt.v ? '' : opt.v;
        state.answers[item.id] = next;
        group.querySelectorAll('button').forEach(function (b) {
          const v = b.getAttribute('data-value');
          const isChecked = v === next;
          b.classList.toggle('checked', isChecked);
          b.setAttribute('aria-checked', isChecked ? 'true' : 'false');
        });
        updateProgress();
        updateSectionProgress();
        persistDraft();
      });
      group.appendChild(btn);
    });
    wrap.appendChild(group);
    return wrap;
  }

  function renderSectionStep(stepNumber, sectionKey, items, headingText, description) {
    const summary = el('div', { class: 'section-summary', id: 'summary-' + sectionKey }, ['']);
    const list = el('div', { class: 'item-list' }, items.map(renderItemRow));
    return el('section', { class: 'form-section', id: 'step-' + stepNumber }, [
      el('h2', null, [headingText]),
      el('p', { class: 'description' }, [description]),
      summary,
      list,
    ]);
  }

  function renderSummarySection() {
    return el('section', { class: 'form-section', id: 'step-5' }, [
      el('h2', null, ['Step 5 — Summary, action plan']),
      el('p', { class: 'description' }, [
        'Capture the top three actions to act on after this checklist. The maturity report below will refresh when you press “Generate report”.',
      ]),
      el('div', { class: 'field-grid' }, [
        labelInput('Top action 1', 'text', state.actionPlan, 'topAction1'),
        labelInput('Top action 2', 'text', state.actionPlan, 'topAction2'),
        labelInput('Top action 3', 'text', state.actionPlan, 'topAction3'),
        labelTextarea('Coach notes', state.actionPlan, 'coachNotes'),
        labelTextarea('Overall notes', state.actionPlan, 'overallNotes'),
      ]),
    ]);
  }

  function maturityLabel(m) {
    return m.toUpperCase().replace('-', ' ');
  }

  function pctOrDash(p) {
    return p === null ? '—' : p.toFixed(0) + '%';
  }

  function csvEsc(v) {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function buildCsv(result) {
    const lines = [];
    lines.push('section,key,value');
    // Respondent block
    Object.keys(state.respondent).forEach(function (k) {
      lines.push(['respondent', k, state.respondent[k]].map(csvEsc).join(','));
    });
    // Summary
    lines.push(['summary', 'maturity', result.maturity].map(csvEsc).join(','));
    lines.push(['summary', 'overallPercent',
      result.overallPercent === null ? '' : result.overallPercent.toFixed(0)].map(csvEsc).join(','));
    lines.push(['summary', 'teamsPercent',
      result.teams.percent === null ? '' : result.teams.percent.toFixed(0)].map(csvEsc).join(','));
    lines.push(['summary', 'stakeholdersPercent',
      result.stakeholders.percent === null ? '' : result.stakeholders.percent.toFixed(0)].map(csvEsc).join(','));
    lines.push(['summary', 'practicesPercent',
      result.practices.percent === null ? '' : result.practices.percent.toFixed(0)].map(csvEsc).join(','));
    lines.push(['summary', 'answeredCount', String(result.answeredCount)].map(csvEsc).join(','));
    lines.push('');
    // Per-item answers
    lines.push('itemId,section,text,answer');
    ALL_ITEMS.forEach(function (item) {
      lines.push([
        item.id,
        SECTION_LABEL[item.section],
        item.text,
        state.answers[item.id] || '',
      ].map(csvEsc).join(','));
    });
    lines.push('');
    // Action plan
    lines.push('actionPlan,key,value');
    Object.keys(state.actionPlan).forEach(function (k) {
      lines.push(['actionPlan', k, state.actionPlan[k]].map(csvEsc).join(','));
    });
    lines.push('');
    // Flags
    lines.push('flag,priority,description,suggestedAction');
    result.additionalFlags.forEach(function (f) {
      lines.push([f.flagId, f.priority, f.description, f.suggestedAction].map(csvEsc).join(','));
    });
    return lines.join('\n') + '\n';
  }

  function downloadCsv(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function renderReport() {
    const result = calculateMaturity(state.answers);

    const banner = el('div', { class: 'flag-banner maturity-' + result.maturity }, [
      el('p', null, [
        el('strong', null, ['Composite maturity: ']),
        maturityLabel(result.maturity),
      ]),
      el('p', null, [
        el('strong', null, ['Overall: ']),
        pctOrDash(result.overallPercent) + ' yes',
        ' (' + result.answeredCount + '/57 answered)',
      ]),
      el('p', null, [
        el('strong', null, ['Sections: ']),
        'Teams ' + pctOrDash(result.teams.percent) + ' (' + result.teams.band + ')  ·  ',
        'Stakeholders ' + pctOrDash(result.stakeholders.percent) + ' (' + result.stakeholders.band + ')  ·  ',
        'Practices ' + pctOrDash(result.practices.percent) + ' (' + result.practices.band + ')',
      ]),
      result.additionalFlags.length
        ? el('ul', { class: 'flag-list' },
            result.additionalFlags.map(function (f) {
              return el('li', null, [
                el('strong', null, ['[' + f.priority.toUpperCase() + '] ']),
                f.description + ' — ' + f.suggestedAction,
              ]);
            }),
          )
        : el('p', null, ['No operational flags raised.']),
    ]);

    const tbody = el('tbody', null, ALL_ITEMS.map(function (item) {
      const a = state.answers[item.id] || '';
      return el('tr', { class: a ? 'ans-' + a : 'ans-blank' }, [
        el('td', { class: 'mono' }, [item.id]),
        el('td', null, [SECTION_LABEL[item.section]]),
        el('td', null, [item.text]),
        el('td', { class: 'ans' }, [a ? a.toUpperCase() : '—']),
      ]);
    }));

    const table = el('table', { class: 'item-table' }, [
      el('thead', null, [
        el('tr', null, [
          el('th', null, ['ID']),
          el('th', null, ['Section']),
          el('th', null, ['Item']),
          el('th', null, ['Answer']),
        ]),
      ]),
      tbody,
    ]);

    const downloadBtn = el('button', {
      type: 'button',
      class: 'btn btn-primary',
      id: 'download-csv',
    }, ['Download CSV']);
    downloadBtn.addEventListener('click', function () {
      downloadCsv('agile-checklist.csv', buildCsv(result));
    });

    const reportEl = document.getElementById('report');
    reportEl.innerHTML = '';
    reportEl.appendChild(el('div', { class: 'report-header' }, [
      el('h2', null, ['Checklist report']),
      downloadBtn,
    ]));
    reportEl.appendChild(banner);

    if (result.firedRules.length) {
      reportEl.appendChild(el('details', null, [
        el('summary', null, ['Fired coaching rules (' + result.firedRules.length + ')']),
        el('ul', { class: 'flag-list' }, result.firedRules.map(function (r) {
          return el('li', null, [
            el('code', null, [r.ruleId]),
            ' — ' + (r.description || '(no coaching note)'),
          ]);
        })),
      ]));
    }

    reportEl.appendChild(el('h3', null, ['Per-item answers']));
    reportEl.appendChild(table);

    reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateProgress() {
    let answered = 0;
    ALL_ITEMS.forEach(function (i) { if (state.answers[i.id]) answered += 1; });
    const pct = Math.round((answered / ALL_ITEMS.length) * 100);
    document.getElementById('progress-bar-fill').style.width = pct + '%';
    document.getElementById('progress-bar').setAttribute('aria-valuenow', String(pct));
    document.getElementById('progress-text').textContent =
      answered + ' of ' + ALL_ITEMS.length + ' items answered (' + pct + '%)';
  }

  function updateSectionProgress() {
    [
      { key: 'teams', items: TEAMS_ITEMS },
      { key: 'stakeholders', items: STAKEHOLDERS_ITEMS },
      { key: 'practices', items: PRACTICES_ITEMS },
    ].forEach(function (sec) {
      let y = 0, n = 0, na = 0, blank = 0;
      sec.items.forEach(function (it) {
        const a = state.answers[it.id];
        if (a === 'yes') y += 1;
        else if (a === 'no') n += 1;
        else if (a === 'not-applicable') na += 1;
        else blank += 1;
      });
      const applicable = y + n;
      const pct = applicable === 0 ? null : Math.round((y / applicable) * 100);
      const el = document.getElementById('summary-' + sec.key);
      if (!el) return;
      const parts = [y + ' yes', n + ' no', na + ' n/a', blank + ' unanswered'];
      el.textContent = parts.join(' · ') + (pct === null ? '' : ' — ' + pct + '% yes');
    });
  }

  function buildNav() {
    const nav = document.getElementById('step-nav');
    if (!nav) return;
    nav.innerHTML = '';
    [
      { n: 1, label: 'You' },
      { n: 2, label: 'Teams' },
      { n: 3, label: 'Stakeholders' },
      { n: 4, label: 'Practices' },
      { n: 5, label: 'Summary' },
    ].forEach(function (s) {
      const a = document.createElement('a');
      a.href = '#step-' + s.n;
      a.textContent = s.n + '. ' + s.label;
      nav.appendChild(a);
    });
  }

  function build() {
    const sections = document.getElementById('form-sections');
    sections.innerHTML = '';
    sections.appendChild(renderRespondentSection());
    sections.appendChild(renderSectionStep(
      2, 'teams', TEAMS_ITEMS,
      'Step 2 — Teams (25 items)',
      'Concrete behaviours of the people doing the work — autonomy, collaboration, learning, finishing, and motivation. Answer Yes when the behaviour is reliably true today, No when it is not, and N/A when the item does not apply.',
    ));
    sections.appendChild(renderSectionStep(
      3, 'stakeholders', STAKEHOLDERS_ITEMS,
      'Step 3 — Stakeholders (14 items)',
      'Behaviours of sponsors, executives, and other people outside the team whose decisions shape what the team can do — trust, delegation, experimentation, communication.',
    ));
    sections.appendChild(renderSectionStep(
      4, 'practices', PRACTICES_ITEMS,
      'Step 4 — Practices (18 items)',
      'Operating practices that bind teams and stakeholders together — pace of decisions, focus on finished work, transparency, and scope discipline.',
    ));
    sections.appendChild(renderSummarySection());
    buildNav();
    updateProgress();
    updateSectionProgress();
  }

  function resetAll() {
    state = emptyState();
    document.getElementById('report').innerHTML = '';
    hideDraftBanner();
    clearDraft();
    build();
  }

  function showDraftBanner() {
    const banner = document.getElementById('draft-banner');
    if (banner) banner.hidden = false;
  }

  function hideDraftBanner() {
    const banner = document.getElementById('draft-banner');
    if (banner) banner.hidden = true;
  }

  function bindDraftButtons() {
    const keep = document.getElementById('draft-keep');
    const discard = document.getElementById('draft-discard');
    if (keep) keep.addEventListener('click', hideDraftBanner);
    if (discard) discard.addEventListener('click', function () { resetAll(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    if (draftRestored) {
      showDraftBanner();
      if (restored && restored.savedAt) setSavedLabel(restored.savedAt);
    }
    bindDraftButtons();
    document.getElementById('submit-btn').addEventListener('click', renderReport);
    document.getElementById('reset-btn').addEventListener('click', resetAll);
  });
})();
