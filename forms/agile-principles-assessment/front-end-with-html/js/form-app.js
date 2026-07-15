import { calculateMaturity } from './engine.js';
import { PRINCIPLES } from './principles.js';

  
  
  

  const ROLES = [
    { value: '', label: '—' },
    { value: 'individual-contributor', label: 'Individual contributor' },
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

  const LIKERT_LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

  const state = {
    respondent: {
      isAnonymous: false,
      fullName: '',
      email: '',
      role: '',
      yearsInAgile: '',
      teamName: '',
      organisationName: '',
      assessmentDate: '',
      assessmentPeriod: '',
    },
    responses: PRINCIPLES.map(function () { return { score: null, comment: '', weight: 1.0 }; }),
    actionPlan: {
      topAction1: '',
      topAction2: '',
      topAction3: '',
      coachNotes: '',
      overallNotes: '',
    },
  };

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

  function bandClass(score) {
    if (score === null) return '';
    if (score <= 2) return 'low';
    if (score === 3) return 'mid';
    return 'high';
  }

  function setIdentityDisabled(grid, disabled) {
    ['fullName', 'email', 'role'].forEach(function (key) {
      const input = grid.querySelector('#f-' + key);
      if (!input) return;
      input.disabled = disabled;
      const label = input.closest('label');
      if (label) label.classList.toggle('field-disabled', disabled);
    });
  }

  function renderRespondentSection() {
    const fullName = labelInput('Full name', 'text', state.respondent, 'fullName');
    const email = labelInput('Email', 'email', state.respondent, 'email');
    const role = labelSelect('Role', state.respondent, 'role', ROLES);
    const grid = el('div', { class: 'field-grid cols-2' }, [
      fullName,
      email,
      role,
      labelInput('Years working in agile', 'number', state.respondent, 'yearsInAgile', { min: 0, max: 50 }),
      labelInput('Team being assessed', 'text', state.respondent, 'teamName'),
      labelInput('Organisation / programme', 'text', state.respondent, 'organisationName'),
      labelInput('Assessment date', 'date', state.respondent, 'assessmentDate'),
      labelSelect('Assessment cadence', state.respondent, 'assessmentPeriod', PERIODS),
    ]);

    const anonCheckbox = el('input', { type: 'checkbox', id: 'anon-toggle', class: 'checkbox-input' });
    anonCheckbox.checked = state.respondent.isAnonymous;
    anonCheckbox.addEventListener('change', function (ev) {
      const checked = ev.target.checked;
      state.respondent.isAnonymous = checked;
      if (checked) {
        state.respondent.fullName = '';
        state.respondent.email = '';
        state.respondent.role = '';
        ['fullName', 'email', 'role'].forEach(function (key) {
          const input = grid.querySelector('#f-' + key);
          if (input) input.value = '';
        });
      }
      setIdentityDisabled(grid, checked);
    });

    const anonLabel = el('label', { class: 'anon-toggle' }, [
      anonCheckbox,
      el('span', null, [
        el('strong', null, ['Submit anonymously. ']),
        'When checked, name, email, and role are cleared and excluded from the report. ',
        'Team and organisation context are still recorded so coaching aggregates can group the response.',
      ]),
    ]);

    const fs = el('fieldset', { class: 'fieldset', 'data-step': '1', id: 'step-1' }, [
      el('legend', { class: 'fieldset-legend' }, ['Step 1 — Respondent identification']),
      el('p', { class: 'hint' }, [
        'Tell us who is completing the assessment. None of these fields affect the maturity calculation.',
      ]),
      anonLabel,
      grid,
    ]);

    setIdentityDisabled(grid, state.respondent.isAnonymous);
    return fs;
  }

  function lilyInputClass(type) {
    switch (type) {
      case 'email':  return 'email-input';
      case 'number': return 'number-input';
      case 'date':   return 'date-input';
      case 'time':   return 'time-input';
      case 'tel':    return 'tel-input';
      case 'url':    return 'url-input';
      case 'search': return 'search-input';
      default:       return 'text-input';
    }
  }

  function labelInput(text, type, target, key, extra) {
    const input = el('input', Object.assign({ type: type, id: 'f-' + key, class: lilyInputClass(type) }, extra || {}));
    input.value = target[key] !== null && target[key] !== undefined ? target[key] : '';
    input.addEventListener('input', function (ev) {
      let v = ev.target.value;
      if (type === 'number') v = v === '' ? '' : Number(v);
      target[key] = v;
      onChange();
    });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), input]);
  }

  function labelSelect(text, target, key, options) {
    const select = el('select', { id: 'f-' + key, class: 'select' });
    options.forEach(function (o) {
      const opt = el('option', { value: o.value }, [o.label]);
      if (target[key] === o.value) opt.setAttribute('selected', 'selected');
      select.appendChild(opt);
    });
    select.addEventListener('change', function (ev) { target[key] = ev.target.value; onChange(); });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), select]);
  }

  function renderPrincipleSection(principle, index) {
    const stepNumber = index + 2;
    const heading = 'Step ' + stepNumber + ' — Principle ' + principle.number + ': ' + principle.shortTitle;

    const likertGroup = el('div', { class: 'likert-scale radio-group', role: 'radiogroup' });
    for (let s = 1; s <= 5; s += 1) {
      const optLabel = el('label', {
        class: 'likert-option ' + bandClass(s) + (state.responses[index].score === s ? ' checked' : ''),
        for: 'p' + principle.number + '-s' + s,
      });
      const radio = el('input', {
        type: 'radio',
        class: 'radio-input',
        name: 'principle-' + principle.number,
        id: 'p' + principle.number + '-s' + s,
        value: s,
      });
      if (state.responses[index].score === s) radio.checked = true;
      radio.addEventListener('change', function () {
        state.responses[index].score = s;
        onChange();
      });
      optLabel.appendChild(radio);
      optLabel.appendChild(el('span', { class: 'score' }, [String(s)]));
      optLabel.appendChild(el('span', { class: 'label' }, [LIKERT_LABELS[s - 1]]));
      likertGroup.appendChild(optLabel);
    }

    const comment = el('textarea', {
      id: 'comment-' + principle.number,
      class: 'text-area-input',
      placeholder: 'Concrete examples, blockers, or evidence — these populate the action plan.',
    });
    comment.value = state.responses[index].comment;
    comment.addEventListener('input', function (ev) {
      state.responses[index].comment = ev.target.value;
    });

    return el('fieldset', { class: 'fieldset', 'data-step': String(stepNumber), id: 'step-' + stepNumber }, [
      el('legend', { class: 'fieldset-legend' }, [heading]),
      el('p', { class: 'prompt' }, [principle.prompt]),
      el('p', { class: 'hint' }, [principle.description]),
      el('p', null, ['How well does this describe your team / organisation today?']),
      likertGroup,
      el('label', { class: 'stacked' }, [
        el('span', null, ['Comment (optional)']),
        comment,
      ]),
    ]);
  }

  function renderWeightsSection() {
    const list = el('ul', { class: 'weights-list' });
    PRINCIPLES.forEach(function (p, i) {
      const input = el('input', {
        type: 'number', class: 'number-input', min: '0.5', max: '2.0', step: '0.1', id: 'weight-' + p.number,
      });
      input.value = String(state.responses[i].weight);
      input.addEventListener('input', function (ev) {
        const v = Number(ev.target.value);
        state.responses[i].weight = isNaN(v) ? 1.0 : v;
      });
      list.appendChild(el('li', null, [
        el('span', null, ['P' + p.number + ' — ' + p.shortTitle]),
        input,
      ]));
    });

    const resetBtn = el('button', { type: 'button', class: 'button', 'data-variant': 'secondary' }, ['Reset all weights to 1.0']);
    resetBtn.addEventListener('click', function () {
      state.responses.forEach(function (r) { r.weight = 1.0; });
      list.querySelectorAll('input').forEach(function (input) { input.value = '1'; });
    });

    const details = document.createElement('details');
    const summary = el('summary', null, ['Customise weights']);
    details.appendChild(summary);
    details.appendChild(el('p', { class: 'hint' }, [
      'Weight each principle between 0.5 (half-weight) and 2.0 (double-weight). Default is 1.0. Weights only affect the weighted mean and the composite maturity.',
    ]));
    details.appendChild(list);
    details.appendChild(resetBtn);
    return details;
  }

  function renderSummarySection() {
    return el('fieldset', { class: 'fieldset', 'data-step': '14', id: 'step-14' }, [
      el('legend', { class: 'fieldset-legend' }, ['Step 14 — Summary, action plan']),
      renderWeightsSection(),
      el('div', { class: 'field-grid' }, [
        labelInput('Top action 1', 'text', state.actionPlan, 'topAction1'),
        labelInput('Top action 2', 'text', state.actionPlan, 'topAction2'),
        labelInput('Top action 3', 'text', state.actionPlan, 'topAction3'),
        labelTextarea('Coach notes', state.actionPlan, 'coachNotes'),
        labelTextarea('Overall notes', state.actionPlan, 'overallNotes'),
      ]),
    ]);
  }

  function labelTextarea(text, target, key) {
    const textarea = el('textarea', { id: 'f-' + key, class: 'text-area-input', rows: 3 });
    textarea.value = target[key];
    textarea.addEventListener('input', function (ev) { target[key] = ev.target.value; });
    return el('label', { class: 'stacked' }, [el('span', null, [text]), textarea]);
  }

  function maturityLabel(m) {
    return m.toUpperCase().replace('-', ' ');
  }

  function renderReport() {
    const result = calculateMaturity({
      responses: state.responses,
    });

    const bannerKids = [
      el('p', null, [
        el('strong', null, ['Composite maturity: ']),
        maturityLabel(result.maturity) + (result.weightsCustomised ? ' (weighted)' : ''),
      ]),
      el('p', null, [
        el('strong', null, ['Unweighted mean: ']),
        result.meanScore !== null ? result.meanScore.toFixed(2) : '— (insufficient data)',
        ' (' + result.answeredCount + '/12 answered)',
      ]),
    ];
    if (result.weightsCustomised) {
      bannerKids.push(el('p', null, [
        el('strong', null, ['Weighted mean: ']),
        result.weightedMeanScore !== null ? result.weightedMeanScore.toFixed(2) : '— (insufficient data)',
      ]));
    }
    const banner = el('div', { class: 'flag-banner maturity-' + result.maturity }, bannerKids.concat([
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
    ]));

    const tbody = el('tbody', null,
      PRINCIPLES.map(function (p, i) {
        const band = result.perPrincipleBands[i];
        const score = state.responses[i].score;
        return el('tr', { class: 'band-' + band }, [
          el('td', null, ['P' + p.number]),
          el('td', null, [p.shortTitle]),
          el('td', null, [score === null ? '—' : String(score)]),
          el('td', { class: 'band' }, [band.toUpperCase()]),
          el('td', null, [state.responses[i].comment || '—']),
        ]);
      }),
    );

    const table = el('table', { class: 'principle-table' }, [
      el('thead', null, [
        el('tr', null, [
          el('th', null, ['#']),
          el('th', null, ['Principle']),
          el('th', null, ['Score']),
          el('th', null, ['Band']),
          el('th', null, ['Comment']),
        ]),
      ]),
      tbody,
    ]);

    const reportEl = document.getElementById('report');
    reportEl.innerHTML = '';
    reportEl.appendChild(el('h2', null, ['Assessment report']));
    reportEl.appendChild(banner);
    reportEl.appendChild(el('h3', null, ['Per-principle scores']));
    reportEl.appendChild(table);

    if (result.firedRules.length) {
      const ruleList = el('ul', { class: 'flag-list' },
        result.firedRules.map(function (r) {
          return el('li', null, [
            el('code', null, [r.ruleId]),
            ' — P' + r.principleNumber + ' ' + r.band.toUpperCase() + ': ' + (r.description || '(no coaching note)'),
          ]);
        }),
      );
      const details = el('details', null, [
        el('summary', null, ['Fired coaching rules (' + result.firedRules.length + ')']),
        ruleList,
      ]);
      reportEl.appendChild(details);
    }

    reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onChange() {
    const answered = state.responses.filter(function (r) { return r.score !== null; }).length;
    const pct = Math.round((answered / 12) * 100);
    const progress = document.getElementById('progress');
    if (progress) progress.value = pct;
    document.getElementById('progress-text').textContent = answered + ' of 12 principles scored (' + pct + '%)';
    updateStepListStatuses();
  }

  function renderStepList() {
    const ol = document.getElementById('step-list');
    if (!ol) return;
    ol.innerHTML = '';
    const items = [{ step: 1, title: 'Respondent' }];
    PRINCIPLES.forEach(function (p) {
      items.push({ step: p.number + 1, title: 'P' + p.number + ': ' + p.shortTitle });
    });
    items.push({ step: 14, title: 'Summary' });
    items.forEach(function (def) {
      const li = document.createElement('li');
      li.className = 'step-list-item';
      li.dataset.status = 'waiting';
      li.dataset.step = String(def.step);
      li.setAttribute('aria-label', 'Step ' + def.step + ': ' + def.title);
      li.innerHTML = '<span>' + def.title + '</span>';
      li.addEventListener('click', function () {
        const target = document.getElementById('step-' + def.step);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      ol.appendChild(li);
    });
  }

  function updateStepListStatuses() {
    const ol = document.getElementById('step-list');
    if (!ol) return;
    let firstUnfinished = -1;

    // Step 1 — Respondent: finished if anonymous or any identity field set
    const r = state.respondent;
    const respondentAnswered = r.isAnonymous || r.fullName || r.email || r.role ||
      r.yearsInAgile !== '' || r.teamName || r.organisationName ||
      r.assessmentDate || r.assessmentPeriod;
    setStepStatus(ol, 1, respondentAnswered ? 'finished' : 'waiting');
    if (!respondentAnswered && firstUnfinished === -1) firstUnfinished = 1;

    // Principle steps 2..13
    PRINCIPLES.forEach(function (p, i) {
      const stepNum = p.number + 1;
      if (state.responses[i].score !== null) {
        setStepStatus(ol, stepNum, 'finished');
      } else {
        setStepStatus(ol, stepNum, 'waiting');
        if (firstUnfinished === -1) firstUnfinished = stepNum;
      }
    });

    // Step 14 — Summary: finished if any action-plan field set
    const a = state.actionPlan;
    const summaryAnswered = a.topAction1 || a.topAction2 || a.topAction3 || a.coachNotes || a.overallNotes;
    setStepStatus(ol, 14, summaryAnswered ? 'finished' : 'waiting');
    if (!summaryAnswered && firstUnfinished === -1) firstUnfinished = 14;

    if (firstUnfinished === -1) firstUnfinished = 1;
    const current = ol.querySelector('[data-step="' + firstUnfinished + '"]');
    if (current) {
      current.setAttribute('aria-current', 'step');
      if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
    }
    ol.dataset.current = String(firstUnfinished - 1);
  }

  function setStepStatus(ol, stepNum, status) {
    const li = ol.querySelector('[data-step="' + stepNum + '"]');
    if (!li) return;
    li.dataset.status = status;
    if (status !== 'in-progress') li.removeAttribute('aria-current');
  }

  function build() {
    const sections = document.getElementById('form-sections');
    sections.innerHTML = '';
    sections.appendChild(renderRespondentSection());
    PRINCIPLES.forEach(function (p, i) { sections.appendChild(renderPrincipleSection(p, i)); });
    sections.appendChild(renderSummarySection());
    renderStepList();
    onChange();
  }

  function reset() {
    state.respondent = {
      isAnonymous: false,
      fullName: '', email: '', role: '', yearsInAgile: '',
      teamName: '', organisationName: '', assessmentDate: '', assessmentPeriod: '',
    };
    state.responses = PRINCIPLES.map(function () { return { score: null, comment: '', weight: 1.0 }; });
    state.actionPlan = { topAction1: '', topAction2: '', topAction3: '', coachNotes: '', overallNotes: '' };
    const report = document.getElementById('report');
    if (report) report.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
    build();
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    document.getElementById('submit-btn').addEventListener('click', renderReport);
    document.getElementById('reset-btn').addEventListener('click', reset);
  });
