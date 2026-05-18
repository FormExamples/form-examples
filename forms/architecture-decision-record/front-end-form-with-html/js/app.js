/*
 * Architecture Decision Record — single-file front-end app.
 *
 * Renders a 16-step wizard for the Tyree & Akerman ADR template, maintains
 * form state in plain JS (no framework), and produces a Markdown ADR
 * document on submit. Designed to work from file:// — no ES modules, no
 * fetch, no build step.
 */
(function () {
  'use strict';

  // -- Enums ---------------------------------------------------------------

  var ROLES = [
    '', 'architect', 'principal-engineer', 'staff-engineer',
    'engineering-manager', 'cto', 'product-manager', 'security-officer',
    'compliance-officer', 'consultant', 'other'
  ];

  var STATUSES = [
    'pending', 'decided', 'approved', 'superseded', 'deprecated'
  ];

  var GROUPS = [
    '', 'business', 'data', 'integration', 'presentation', 'security',
    'infrastructure', 'operations', 'governance', 'other'
  ];

  // -- Empty state factory -------------------------------------------------

  function emptyData() {
    return {
      author: {
        name: '',
        email: '',
        phone: '',
        role: '',
        organizationName: '',
        teamName: ''
      },
      organization: {
        name: '',
        legalName: '',
        industry: '',
        domain: '',
        countryAsIso31661Alpha2: '',
        description: ''
      },
      adr: {
        slug: '',
        number: '',
        title: '',
        decisionDate: '',
        status: 'pending',
        decisionGroup: '',
        issue: '',
        decision: '',
        assumptions: '',
        constraints: '',
        argument: '',
        implications: '',
        relatedDecisions: '',
        relatedRequirements: '',
        relatedArtifacts: '',
        relatedPrinciples: '',
        signedOffBy: '',
        signedOffAt: ''
      },
      positions: [
        { name: '', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' }
      ],
      notes: []
    };
  }

  // -- localStorage autosave -----------------------------------------------

  var STORAGE_KEY = 'adr.form.v1';

  function loadFromStorage() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyData();
      var parsed = JSON.parse(raw);
      // Merge with emptyData() so missing fields get defaults if the schema
      // grows. emptyData() supplies positions/notes shapes.
      var base = emptyData();
      if (parsed && typeof parsed === 'object') {
        if (parsed.author)       Object.assign(base.author, parsed.author);
        if (parsed.organization) Object.assign(base.organization, parsed.organization);
        if (parsed.adr)          Object.assign(base.adr, parsed.adr);
        if (Array.isArray(parsed.positions) && parsed.positions.length > 0) base.positions = parsed.positions;
        if (Array.isArray(parsed.notes))     base.notes = parsed.notes;
      }
      return base;
    } catch (_) {
      return emptyData();
    }
  }

  function saveToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {
      // quota exceeded or storage disabled — autosave is best-effort
    }
  }

  function clearStorage() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  var data = loadFromStorage();

  // -- Step definitions ----------------------------------------------------

  var STEPS = [
    { n: 1,  slug: 'author',                title: 'Author identification',          help: 'Who is writing this ADR.' },
    { n: 2,  slug: 'organization',          title: 'Organization & context',         help: 'The organization context for the decision.' },
    { n: 3,  slug: 'issue',                 title: 'Issue',                          help: 'Tyree & Akerman §1: the architectural design issue being addressed; explain why now.' },
    { n: 4,  slug: 'decision',              title: 'Decision',                       help: 'Tyree & Akerman §2: the position chosen, stated clearly.' },
    { n: 5,  slug: 'status-group',          title: 'Status & group',                 help: 'Tyree & Akerman §3 & §4: workflow status and architectural category.' },
    { n: 6,  slug: 'assumptions',           title: 'Assumptions',                    help: 'Tyree & Akerman §5: environmental factors influencing the decision (cost, schedule, technology).' },
    { n: 7,  slug: 'constraints',           title: 'Constraints',                    help: 'Tyree & Akerman §6: environmental limits imposed by the decision.' },
    { n: 8,  slug: 'positions',             title: 'Positions (alternatives)',       help: 'Tyree & Akerman §7: viable alternatives considered. Mark exactly one as chosen.' },
    { n: 9,  slug: 'argument',              title: 'Argument',                       help: 'Tyree & Akerman §8: rationale for the chosen position over the others (cost of implementation, ownership, time-to-market, resourcing).' },
    { n: 10, slug: 'implications',          title: 'Implications',                   help: 'Tyree & Akerman §9: consequences, follow-on decisions, scope/schedule impact, training requirements.' },
    { n: 11, slug: 'related-decisions',     title: 'Related decisions',              help: 'Tyree & Akerman §10: other ADRs this depends on, supersedes, or is superseded by. One per line.' },
    { n: 12, slug: 'related-requirements',  title: 'Related requirements',           help: 'Tyree & Akerman §11: business or functional requirements this addresses. One per line.' },
    { n: 13, slug: 'related-artifacts',     title: 'Related artifacts',              help: 'Tyree & Akerman §12: designs, models, scope documents impacted. One per line.' },
    { n: 14, slug: 'related-principles',    title: 'Related principles',             help: 'Tyree & Akerman §13: enterprise principles this aligns with or breaks. One per line.' },
    { n: 15, slug: 'notes',                 title: 'Notes',                          help: 'Tyree & Akerman §14: discussion log captured during socialisation. Append-only; each note is timestamped.' },
    { n: 16, slug: 'summary',               title: 'Summary & sign-off',             help: 'Confirm sign-off and review the captured ADR.' }
  ];

  // -- DOM helpers ---------------------------------------------------------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (v === true) node.setAttribute(k, '');
        else if (v !== false && v != null) node.setAttribute(k, v);
      }
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c == null) continue;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return node;
  }

  function field(opts) {
    // opts: { id, label, value, type, options, rows, onInput, required }
    var id = opts.id;
    var labelEl = el('label', { for: id, class: opts.required ? 'required' : '' }, opts.label);
    var input;
    if (opts.type === 'textarea') {
      input = el('textarea', { id: id, rows: opts.rows || 4 });
      input.value = opts.value || '';
      input.addEventListener('input', function (e) { opts.onInput(e.target.value); });
    } else if (opts.type === 'select') {
      input = el('select', { id: id });
      for (var i = 0; i < opts.options.length; i++) {
        var v = opts.options[i];
        var label = v === '' ? '— select —' : v;
        var optEl = el('option', { value: v }, label);
        if (v === opts.value) optEl.selected = true;
        input.appendChild(optEl);
      }
      input.addEventListener('change', function (e) { opts.onInput(e.target.value); });
    } else {
      input = el('input', { id: id, type: opts.type || 'text' });
      input.value = opts.value || '';
      input.addEventListener('input', function (e) { opts.onInput(e.target.value); });
    }
    return el('div', { class: 'field' }, [labelEl, input]);
  }

  // -- Step renderers ------------------------------------------------------

  function renderAuthor() {
    var a = data.author;
    return el('div', { class: 'field-grid cols-2' }, [
      field({ id: 'author-name', label: 'Author name', value: a.name, required: true,
              onInput: function (v) { a.name = v; updateProgress(); } }),
      field({ id: 'author-email', label: 'Email', type: 'email', value: a.email,
              onInput: function (v) { a.email = v; updateProgress(); } }),
      field({ id: 'author-phone', label: 'Phone', type: 'tel', value: a.phone,
              onInput: function (v) { a.phone = v; updateProgress(); } }),
      field({ id: 'author-role', label: 'Role', type: 'select', options: ROLES, value: a.role,
              onInput: function (v) { a.role = v; updateProgress(); } }),
      field({ id: 'author-organization-name', label: 'Organization (free text)', value: a.organizationName,
              onInput: function (v) { a.organizationName = v; updateProgress(); } }),
      field({ id: 'author-team-name', label: 'Team', value: a.teamName,
              onInput: function (v) { a.teamName = v; updateProgress(); } })
    ]);
  }

  function renderOrganization() {
    var o = data.organization;
    return el('div', { class: 'field-grid cols-2' }, [
      field({ id: 'org-name', label: 'Organization name', value: o.name,
              onInput: function (v) { o.name = v; updateProgress(); } }),
      field({ id: 'org-legal-name', label: 'Legal name', value: o.legalName,
              onInput: function (v) { o.legalName = v; updateProgress(); } }),
      field({ id: 'org-industry', label: 'Industry', value: o.industry,
              onInput: function (v) { o.industry = v; updateProgress(); } }),
      field({ id: 'org-domain', label: 'Domain (e.g. example.com)', value: o.domain,
              onInput: function (v) { o.domain = v; updateProgress(); } }),
      field({ id: 'org-country', label: 'Country (ISO 3166-1 alpha-2)', value: o.countryAsIso31661Alpha2,
              onInput: function (v) { o.countryAsIso31661Alpha2 = v.toUpperCase().slice(0, 2); updateProgress(); } }),
      field({ id: 'org-description', label: 'Description', type: 'textarea', value: o.description,
              onInput: function (v) { o.description = v; updateProgress(); } })
    ]);
  }

  function renderTextareaSection(field_, placeholder) {
    return el('div', { class: 'field-grid' }, [
      field({
        id: 'adr-' + field_,
        label: placeholder,
        type: 'textarea',
        value: data.adr[field_],
        rows: 6,
        onInput: function (v) { data.adr[field_] = v; updateProgress(); }
      })
    ]);
  }

  function renderIssue()        { return renderTextareaSection('issue',        'What is the architectural design issue? Why now?'); }
  function renderDecision()     { return renderTextareaSection('decision',     'State the chosen position clearly.'); }
  function renderAssumptions()  { return renderTextareaSection('assumptions',  'Environmental factors influencing the decision (cost, schedule, technology).'); }
  function renderConstraints()  { return renderTextareaSection('constraints',  'Environmental limits imposed by the decision.'); }
  function renderArgument()     { return renderTextareaSection('argument',     'Rationale for the chosen position. Implementation cost, ownership cost, time-to-market, resourcing.'); }
  function renderImplications() { return renderTextareaSection('implications', 'Consequences, follow-on decisions, scope/schedule impact, training requirements.'); }
  function renderRelatedDecisions()    { return renderTextareaSection('relatedDecisions',    'Related ADRs (one per line).'); }
  function renderRelatedRequirements() { return renderTextareaSection('relatedRequirements', 'Related requirements (one per line).'); }
  function renderRelatedArtifacts()    { return renderTextareaSection('relatedArtifacts',    'Related artifacts (one per line).'); }
  function renderRelatedPrinciples()   { return renderTextareaSection('relatedPrinciples',   'Related enterprise principles (one per line).'); }

  function renderStatusGroup() {
    var a = data.adr;
    return el('div', { class: 'field-grid cols-2' }, [
      field({ id: 'adr-slug', label: 'Slug (URL-safe identifier)', value: a.slug,
              onInput: function (v) { a.slug = v; updateProgress(); } }),
      field({ id: 'adr-number', label: 'Number (sequential, optional)', type: 'number', value: a.number,
              onInput: function (v) { a.number = v; updateProgress(); } }),
      field({ id: 'adr-title', label: 'Title', required: true, value: a.title,
              onInput: function (v) { a.title = v; updateProgress(); } }),
      field({ id: 'adr-decision-date', label: 'Decision date', type: 'date', value: a.decisionDate,
              onInput: function (v) { a.decisionDate = v; updateProgress(); } }),
      field({ id: 'adr-status', label: 'Status', type: 'select', options: STATUSES, value: a.status,
              onInput: function (v) { a.status = v; updateProgress(); } }),
      field({ id: 'adr-group', label: 'Group', type: 'select', options: GROUPS, value: a.decisionGroup,
              onInput: function (v) { a.decisionGroup = v; updateProgress(); } })
    ]);
  }

  function renderPositions() {
    var wrap = el('div');
    var list = el('div', { class: 'positions-list' });

    function addPositionCard(p, idx) {
      var card = el('div', { class: 'position-card' + (p.isChosen ? ' is-chosen' : '') });
      var header = el('div', { class: 'position-card-header' }, [
        el('span', { class: 'position-card-title' }, 'Position ' + (idx + 1)),
        el('button', {
          type: 'button', class: 'btn btn-remove',
          onclick: function () {
            data.positions.splice(idx, 1);
            if (data.positions.length === 0) {
              data.positions.push({ name: '', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' });
            }
            renderAll();
          }
        }, 'Remove')
      ]);
      card.appendChild(header);

      var grid = el('div', { class: 'field-grid cols-2' }, [
        field({ id: 'pos-name-' + idx, label: 'Name', required: true, value: p.name,
                onInput: function (v) { p.name = v; updateProgress(); } }),
        field({ id: 'pos-url-' + idx, label: 'Model or diagram URL', type: 'url', value: p.modelOrDiagramUrl,
                onInput: function (v) { p.modelOrDiagramUrl = v; updateProgress(); } }),
        field({ id: 'pos-desc-' + idx, label: 'Description', type: 'textarea', value: p.description,
                onInput: function (v) { p.description = v; updateProgress(); } }),
        field({ id: 'pos-chosen-' + idx, label: 'Chosen?', type: 'select',
                options: ['no', 'yes'],
                value: p.isChosen ? 'yes' : 'no',
                onInput: function (v) {
                  if (v === 'yes') {
                    for (var j = 0; j < data.positions.length; j++) data.positions[j].isChosen = false;
                    p.isChosen = true;
                  } else {
                    p.isChosen = false;
                  }
                  renderAll();
                } }),
        field({ id: 'pos-pros-' + idx, label: 'Pros (one per line)', type: 'textarea', value: p.pros,
                onInput: function (v) { p.pros = v; updateProgress(); } }),
        field({ id: 'pos-cons-' + idx, label: 'Cons (one per line)', type: 'textarea', value: p.cons,
                onInput: function (v) { p.cons = v; updateProgress(); } })
      ]);
      card.appendChild(grid);
      list.appendChild(card);
    }

    for (var i = 0; i < data.positions.length; i++) addPositionCard(data.positions[i], i);
    wrap.appendChild(list);

    var addBtn = el('button', {
      type: 'button', class: 'btn btn-add',
      style: 'margin-top: 0.5rem;',
      onclick: function () {
        data.positions.push({ name: '', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' });
        renderAll();
      }
    }, '+ Add position');
    wrap.appendChild(addBtn);
    return wrap;
  }

  function renderNotes() {
    var wrap = el('div');
    var list = el('div', { class: 'notes-list' });
    if (data.notes.length === 0) {
      list.appendChild(el('p', { class: 'help' }, 'No notes yet. Add one as you socialise the decision.'));
    }
    for (var i = 0; i < data.notes.length; i++) (function (n, idx) {
      var card = el('div', { class: 'note-card' }, [
        el('div', { class: 'note-meta' }, n.notedAt + ' — ' + (n.notedBy || 'unknown')),
        el('div', null, n.body),
        el('button', {
          type: 'button', class: 'btn btn-remove',
          style: 'margin-top: 0.5rem;',
          onclick: function () { data.notes.splice(idx, 1); renderAll(); }
        }, 'Remove')
      ]);
      list.appendChild(card);
    })(data.notes[i], i);

    var newNote = { notedBy: '', body: '' };
    var addPanel = el('div', { class: 'field-grid cols-2', style: 'margin-top: 0.75rem;' }, [
      field({ id: 'note-by', label: 'Noted by', value: newNote.notedBy,
              onInput: function (v) { newNote.notedBy = v; } }),
      field({ id: 'note-body', label: 'Body', type: 'textarea', value: newNote.body,
              onInput: function (v) { newNote.body = v; } })
    ]);
    var addBtn = el('button', {
      type: 'button', class: 'btn btn-add', style: 'margin-top: 0.5rem;',
      onclick: function () {
        if (!newNote.body.trim()) return;
        data.notes.push({
          notedAt: new Date().toISOString(),
          notedBy: newNote.notedBy,
          body: newNote.body
        });
        renderAll();
      }
    }, '+ Add note');

    wrap.appendChild(list);
    wrap.appendChild(addPanel);
    wrap.appendChild(addBtn);
    return wrap;
  }

  function renderSummary() {
    var a = data.adr;
    return el('div', { class: 'field-grid cols-2' }, [
      field({ id: 'signed-off-by', label: 'Signed off by', value: a.signedOffBy,
              onInput: function (v) { a.signedOffBy = v; updateProgress(); } }),
      field({ id: 'signed-off-at', label: 'Signed off at (ISO timestamp)', value: a.signedOffAt,
              onInput: function (v) { a.signedOffAt = v; updateProgress(); } })
    ]);
  }

  var STEP_RENDERERS = {
    author: renderAuthor,
    organization: renderOrganization,
    issue: renderIssue,
    decision: renderDecision,
    'status-group': renderStatusGroup,
    assumptions: renderAssumptions,
    constraints: renderConstraints,
    positions: renderPositions,
    argument: renderArgument,
    implications: renderImplications,
    'related-decisions': renderRelatedDecisions,
    'related-requirements': renderRelatedRequirements,
    'related-artifacts': renderRelatedArtifacts,
    'related-principles': renderRelatedPrinciples,
    notes: renderNotes,
    summary: renderSummary
  };

  // -- Top-level render ----------------------------------------------------

  function renderAll() {
    var sections = document.getElementById('form-sections');
    sections.innerHTML = '';
    for (var i = 0; i < STEPS.length; i++) {
      var s = STEPS[i];
      var sec = el('section', { class: 'form-section', id: 'step-' + s.n }, [
        el('h2', null, [el('span', { class: 'step-number' }, String(s.n)), s.title]),
        el('p', { class: 'help' }, s.help),
        STEP_RENDERERS[s.slug]()
      ]);
      sections.appendChild(sec);
    }
    updateProgress();
  }

  // -- Progress meter ------------------------------------------------------

  function answeredCount() {
    var fields = [
      data.author.name, data.author.email, data.author.role,
      data.organization.name,
      data.adr.title, data.adr.status, data.adr.decisionGroup,
      data.adr.issue, data.adr.decision, data.adr.assumptions,
      data.adr.constraints, data.adr.argument, data.adr.implications,
      data.adr.relatedDecisions, data.adr.relatedRequirements,
      data.adr.relatedArtifacts, data.adr.relatedPrinciples,
      data.adr.signedOffBy
    ];
    var answered = 0;
    for (var i = 0; i < fields.length; i++) if (String(fields[i] || '').trim() !== '') answered++;
    if (data.positions.some(function (p) { return p.name.trim(); })) answered++;
    if (data.positions.some(function (p) { return p.isChosen; })) answered++;
    return { answered: answered, total: fields.length + 2 };
  }

  function updateProgress() {
    var c = answeredCount();
    var pct = Math.round((c.answered / c.total) * 100);
    var bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = pct + '%';
    var txt = document.getElementById('progress-text');
    if (txt) txt.textContent = c.answered + ' of ' + c.total + ' fields answered (' + pct + '%)';
    var prog = document.getElementById('progress-bar');
    if (prog) prog.setAttribute('aria-valuenow', String(pct));
    // Autosave on every change — emptyData() rendered first counts as a save.
    saveToStorage();
  }

  // -- Markdown report -----------------------------------------------------

  function bullets(text) {
    var lines = String(text || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length === 0) return '_None._\n';
    return lines.map(function (l) { return '- ' + l; }).join('\n') + '\n';
  }

  function buildMarkdown() {
    var a = data.adr;
    var au = data.author;
    var org = data.organization;

    var num = a.number ? String(a.number).padStart(4, '0') : 'NNNN';
    var heading = num + (a.title ? ' — ' + a.title : '');
    var lines = [];
    lines.push('# ' + heading);
    lines.push('');
    lines.push('- **Status:** ' + (a.status || 'pending'));
    if (a.decisionGroup) lines.push('- **Group:** ' + a.decisionGroup);
    if (a.decisionDate)  lines.push('- **Date:** ' + a.decisionDate);
    if (au.name)         lines.push('- **Author:** ' + au.name + (au.email ? ' <' + au.email + '>' : '') + (au.role ? ' (' + au.role + ')' : ''));
    if (org.name)        lines.push('- **Organization:** ' + org.name);
    lines.push('');

    lines.push('## Issue');           lines.push(a.issue || '_TBD_');           lines.push('');
    lines.push('## Decision');        lines.push(a.decision || '_TBD_');        lines.push('');
    lines.push('## Assumptions');     lines.push(a.assumptions || '_TBD_');     lines.push('');
    lines.push('## Constraints');     lines.push(a.constraints || '_TBD_');     lines.push('');

    lines.push('## Positions');
    if (data.positions.length === 0) {
      lines.push('_None._');
    } else {
      for (var i = 0; i < data.positions.length; i++) {
        var p = data.positions[i];
        lines.push('### ' + (i + 1) + '. ' + (p.name || '(unnamed)') + (p.isChosen ? '  ✓ chosen' : ''));
        if (p.description) lines.push(p.description);
        if (p.modelOrDiagramUrl) lines.push('Model/diagram: <' + p.modelOrDiagramUrl + '>');
        if (p.pros) { lines.push(''); lines.push('**Pros:**'); lines.push(bullets(p.pros)); }
        if (p.cons) { lines.push('**Cons:**'); lines.push(bullets(p.cons)); }
        lines.push('');
      }
    }
    lines.push('');

    lines.push('## Argument');     lines.push(a.argument || '_TBD_');     lines.push('');
    lines.push('## Implications'); lines.push(a.implications || '_TBD_'); lines.push('');

    lines.push('## Related Decisions');     lines.push(bullets(a.relatedDecisions));
    lines.push('## Related Requirements');  lines.push(bullets(a.relatedRequirements));
    lines.push('## Related Artifacts');     lines.push(bullets(a.relatedArtifacts));
    lines.push('## Related Principles');    lines.push(bullets(a.relatedPrinciples));

    lines.push('## Notes');
    if (data.notes.length === 0) {
      lines.push('_None._');
    } else {
      for (var j = 0; j < data.notes.length; j++) {
        var n = data.notes[j];
        lines.push('- **' + n.notedAt + '** (' + (n.notedBy || 'unknown') + '): ' + n.body);
      }
    }
    lines.push('');

    if (a.signedOffBy) {
      lines.push('---');
      lines.push('Signed off by ' + a.signedOffBy + (a.signedOffAt ? ' on ' + a.signedOffAt : '') + '.');
    }

    return lines.join('\n');
  }

  function renderReport() {
    var md = buildMarkdown();
    var report = document.getElementById('report');
    report.innerHTML = '';
    report.appendChild(el('h2', null, 'Markdown ADR'));
    report.appendChild(el('p', { class: 'help' },
      'Copy the Markdown below into your repo at docs/adr/NNNN-' +
      (data.adr.slug || 'your-slug') + '.md.'));

    var actions = el('div', { class: 'report-actions' }, [
      el('button', {
        type: 'button', class: 'btn btn-primary',
        onclick: function () {
          if (navigator.clipboard) navigator.clipboard.writeText(md);
        }
      }, 'Copy Markdown to clipboard'),
      el('button', {
        type: 'button', class: 'btn btn-secondary',
        onclick: function () {
          var blob = new Blob([md], { type: 'text/markdown' });
          var url = URL.createObjectURL(blob);
          var fn = (data.adr.number ? String(data.adr.number).padStart(4, '0') : 'NNNN') +
                   '-' + (data.adr.slug || 'adr') + '.md';
          var a = el('a', { href: url, download: fn });
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'Download .md file')
    ]);
    report.appendChild(actions);

    var pre = el('pre', { class: 'report-markdown' }, md);
    report.appendChild(pre);
    report.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // -- Markdown parser -----------------------------------------------------
  //
  // Reverse of buildMarkdown(). The format we emit is well-defined:
  //   # <NNNN> — <title>
  //   - **Status:** ...
  //   - **Group:** ...
  //   - **Date:** ...
  //   - **Author:** Name <email> (role)
  //   - **Organization:** ...
  //   ## Issue / Decision / Assumptions / Constraints / ...
  //   ## Positions   (### N. <name>  ✓ chosen / desc / Model/diagram: / Pros / Cons)
  //   ## Related Decisions / Requirements / Artifacts / Principles  (bullets)
  //   ## Notes  (- **<timestamp>** (<by>): <body>)
  //   --- Signed off by ...
  //
  // Unknown sections are ignored; missing sections leave the form's
  // defaults in place. This is a best-effort parser, not a strict spec.

  function parseMarkdown(md) {
    var out = emptyData();
    var lines = String(md).split('\n');

    // Heading: # <NNNN> — <title>
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^#\s+(\S+)\s+—\s+(.+)$/);
      if (m) {
        if (/^\d+$/.test(m[1])) out.adr.number = String(parseInt(m[1], 10));
        out.adr.title = m[2].trim();
        break;
      }
      if (lines[i].indexOf('# ') === 0) {
        out.adr.title = lines[i].slice(2).trim();
        break;
      }
    }

    // Metadata bullets
    for (var j = 0; j < lines.length; j++) {
      var line = lines[j];
      var meta = line.match(/^-\s+\*\*([^:]+):\*\*\s*(.*)$/);
      if (!meta) continue;
      var key = meta[1].toLowerCase();
      var val = meta[2].trim();
      if (key === 'status')        out.adr.status = val;
      else if (key === 'group')    out.adr.decisionGroup = val;
      else if (key === 'date')     out.adr.decisionDate = val;
      else if (key === 'organization') out.organization.name = val;
      else if (key === 'author') {
        var a = val.match(/^(.+?)(?:\s+<([^>]+)>)?(?:\s+\(([^)]+)\))?$/);
        if (a) {
          out.author.name = a[1].trim();
          if (a[2]) out.author.email = a[2];
          if (a[3]) out.author.role = a[3];
        } else {
          out.author.name = val;
        }
      }
    }

    // Helper: gather lines between "## <heading>" and the next "## " or EOF.
    function collectSection(heading) {
      var start = -1;
      var pat = new RegExp('^##\\s+' + heading.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '\\s*$', 'i');
      for (var k = 0; k < lines.length; k++) {
        if (pat.test(lines[k])) { start = k + 1; break; }
      }
      if (start < 0) return null;
      var body = [];
      for (var k2 = start; k2 < lines.length; k2++) {
        if (/^##\s/.test(lines[k2]) || /^---\s*$/.test(lines[k2])) break;
        body.push(lines[k2]);
      }
      // Trim leading/trailing blank lines
      while (body.length && body[0].trim() === '') body.shift();
      while (body.length && body[body.length - 1].trim() === '') body.pop();
      return body;
    }

    function textOf(heading) {
      var b = collectSection(heading);
      if (!b) return '';
      var t = b.join('\n').trim();
      return (t === '_TBD_' || t === '_None._') ? '' : t;
    }

    function bulletsOf(heading) {
      var b = collectSection(heading);
      if (!b) return '';
      var items = [];
      for (var i = 0; i < b.length; i++) {
        var m = b[i].match(/^-\s+(.*)$/);
        if (m) items.push(m[1].trim());
      }
      return items.join('\n');
    }

    out.adr.issue        = textOf('Issue');
    out.adr.decision     = textOf('Decision');
    out.adr.assumptions  = textOf('Assumptions');
    out.adr.constraints  = textOf('Constraints');
    out.adr.argument     = textOf('Argument');
    out.adr.implications = textOf('Implications');
    out.adr.relatedDecisions    = bulletsOf('Related Decisions');
    out.adr.relatedRequirements = bulletsOf('Related Requirements');
    out.adr.relatedArtifacts    = bulletsOf('Related Artifacts');
    out.adr.relatedPrinciples   = bulletsOf('Related Principles');

    // Positions: ### N. <name> [  ✓ chosen]
    var posBody = collectSection('Positions');
    if (posBody) {
      var positions = [];
      var current = null;
      for (var p = 0; p < posBody.length; p++) {
        var headMatch = posBody[p].match(/^###\s+\d+\.\s+(.+?)(\s+✓\s*chosen)?\s*$/);
        if (headMatch) {
          if (current) positions.push(current);
          current = {
            name: headMatch[1].trim(),
            description: '',
            modelOrDiagramUrl: '',
            isChosen: !!headMatch[2],
            pros: '',
            cons: ''
          };
          continue;
        }
        if (!current) continue;
        var urlMatch = posBody[p].match(/^Model\/diagram:\s+<?([^>]+)>?$/);
        if (urlMatch) { current.modelOrDiagramUrl = urlMatch[1].trim(); continue; }
        if (/^\*\*Pros:\*\*\s*$/i.test(posBody[p])) {
          var pros = [];
          for (var q = p + 1; q < posBody.length && /^-\s+/.test(posBody[q]); q++) {
            pros.push(posBody[q].replace(/^-\s+/, '').trim());
            p = q;
          }
          current.pros = pros.join('\n');
          continue;
        }
        if (/^\*\*Cons:\*\*\s*$/i.test(posBody[p])) {
          var cons = [];
          for (var r = p + 1; r < posBody.length && /^-\s+/.test(posBody[r]); r++) {
            cons.push(posBody[r].replace(/^-\s+/, '').trim());
            p = r;
          }
          current.cons = cons.join('\n');
          continue;
        }
        if (posBody[p].trim() === '' || posBody[p].trim() === '_None._') continue;
        current.description = (current.description ? current.description + '\n' : '') + posBody[p];
      }
      if (current) positions.push(current);
      if (positions.length > 0) out.positions = positions;
    }

    // Notes: - **<timestamp>** (<who>): <body>
    var noteBody = collectSection('Notes');
    if (noteBody) {
      var notes = [];
      for (var n = 0; n < noteBody.length; n++) {
        var nm = noteBody[n].match(/^-\s+\*\*([^*]+)\*\*\s*\(([^)]*)\):\s*(.*)$/);
        if (!nm) continue;
        notes.push({
          notedAt: nm[1].trim(),
          notedBy: nm[2].trim() === 'unknown' ? '' : nm[2].trim(),
          body: nm[3].trim()
        });
      }
      out.notes = notes;
    }

    // Sign-off footer: Signed off by <who> on <when>.
    for (var s = 0; s < lines.length; s++) {
      var so = lines[s].match(/^Signed off by\s+(.+?)(?:\s+on\s+(.+?))?\.?\s*$/);
      if (so) {
        out.adr.signedOffBy = so[1];
        if (so[2]) out.adr.signedOffAt = so[2];
        break;
      }
    }

    return out;
  }

  function importFromFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var md = String(e.target.result || '');
      var parsed = parseMarkdown(md);
      if (!parsed.adr.title.trim()) {
        alert('Could not parse Markdown — no "# title" heading found.');
        return;
      }
      if (!confirm('Replace the current draft with the contents of ' + file.name + '?')) return;
      data = parsed;
      saveToStorage();
      document.getElementById('report').innerHTML = '';
      renderAll();
    };
    reader.readAsText(file);
  }

  // -- Wiring --------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    renderAll();
    document.getElementById('submit-btn').addEventListener('click', renderReport);
    document.getElementById('reset-btn').addEventListener('click', function () {
      if (!confirm('Discard all entries and start over? This also clears the autosaved draft.')) return;
      clearStorage();
      data = emptyData();
      document.getElementById('report').innerHTML = '';
      renderAll();
    });
    var importInput = document.getElementById('import-input');
    if (importInput) {
      importInput.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) importFromFile(file);
        e.target.value = ''; // allow re-importing the same file
      });
    }
  });
})();
