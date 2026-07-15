import { calculateLpaValidity } from './composite-validator.js';
import { emptyAttorney, emptyCertificateProvider, emptyLpaApplication, emptyPersonToNotify, emptyReplacementAttorney } from './factory.js';

// LP1H wizard — vanilla classic-script app. Renders all 14 statutory sections
// as a continuous single-page wizard, binds inputs to a single LpaApplication
// state object, recomputes validity on every change, and re-renders the
// report aside.

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let application = emptyLpaApplication();
let validity = calculateLpaValidity(application);

const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'civil-partner', label: 'Civil partner' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'professional', label: 'Professional' },
  { value: 'other', label: 'Other' },
];

const PROFESSIONS = [
  { value: 'solicitor', label: 'Solicitor' },
  { value: 'barrister', label: 'Barrister' },
  { value: 'general-practitioner', label: 'General practitioner' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'registered-nurse', label: 'Registered nurse' },
  { value: 'registered-social-worker', label: 'Registered social worker' },
  { value: 'imca', label: 'IMCA' },
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'psychologist', label: 'Psychologist' },
  { value: 'other-registered-professional', label: 'Other registered professional' },
];

const PREFERENCE_CATEGORIES = [
  { value: 'residence', label: 'Residence' },
  { value: 'contact-with-others', label: 'Contact with others' },
  { value: 'religion-and-belief', label: 'Religion and belief' },
  { value: 'food-and-drink', label: 'Food and drink' },
  { value: 'end-of-life-care', label: 'End-of-life care' },
  { value: 'daily-routine', label: 'Daily routine' },
  { value: 'medical-treatment', label: 'Medical treatment' },
  { value: 'other', label: 'Other' },
];

const INSTRUCTION_CATEGORIES = [
  { value: 'medical-treatment-limit', label: 'Medical treatment limit' },
  { value: 'residence-restriction', label: 'Residence restriction' },
  { value: 'contact-restriction', label: 'Contact restriction' },
  { value: 'religion-and-belief', label: 'Religion and belief' },
  { value: 'food-and-drink', label: 'Food and drink' },
  { value: 'end-of-life-care', label: 'End-of-life care' },
  { value: 'other', label: 'Other' },
];

const REMISSION_REASONS = [
  { value: 'low-income', label: 'Low income' },
  { value: 'universal-credit', label: 'Universal Credit' },
  { value: 'income-support', label: 'Income Support' },
  { value: 'pension-credit-guarantee', label: 'Pension Credit (guarantee)' },
  { value: 'housing-benefit', label: 'Housing Benefit' },
  { value: 'employment-and-support-allowance', label: 'ESA' },
  { value: 'jobseekers-allowance', label: 'Jobseeker’s Allowance' },
  { value: 'working-tax-credit', label: 'Working Tax Credit' },
  { value: 'other', label: 'Other' },
];

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'value') node.value = v;
      else if (k === 'checked') node.checked = !!v;
      else node.setAttribute(k, v);
    }
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if (Array.isArray(c)) c.forEach((cc) => cc && node.appendChild(cc));
    else node.appendChild(c);
  }
  return node;
}

function field(labelText, inputEl, opts) {
  opts = opts || {};
  const id = inputEl.id || `f${Math.random().toString(36).slice(2, 8)}`;
  inputEl.id = id;
  if (opts.required) {
    inputEl.setAttribute('data-required', '');
    inputEl.setAttribute('aria-describedby', id + '-error');
  }
  const wrapper = el('div', { class: opts.full ? 'field field-full' : 'field' });
  const labelProps = { for: id, class: 'label' };
  if (opts.required) labelProps['data-required'] = '';
  const label = el('label', labelProps, labelText);
  if (opts.required) label.appendChild(el('span', { class: 'required-mark req' }, ' *'));
  wrapper.appendChild(label);
  wrapper.appendChild(inputEl);
  if (opts.hint) wrapper.appendChild(el('p', { class: 'hint' }, opts.hint));
  wrapper.appendChild(el('span', { class: 'error-message', id: id + '-error' }));
  return wrapper;
}

function lilyInputClass(type) {
  switch (type) {
    case 'email':          return 'email-input';
    case 'number':         return 'number-input';
    case 'date':           return 'date-input';
    case 'datetime-local': return 'date-input';
    case 'time':           return 'time-input';
    case 'tel':            return 'tel-input';
    case 'url':            return 'url-input';
    case 'search':         return 'search-input';
    default:               return 'text-input';
  }
}

function textInput(getter, setter, opts) {
  opts = opts || {};
  const type = opts.type || 'text';
  const input = el('input', {
    type,
    class: lilyInputClass(type),
    value: getter() || '',
    placeholder: opts.placeholder || '',
  });
  input.addEventListener('input', () => {
    setter(input.value);
    recompute();
  });
  return input;
}

function numberInput(getter, setter, opts) {
  opts = opts || {};
  const input = el('input', {
    type: 'number',
    class: 'number-input',
    value: getter() == null ? '' : String(getter()),
    min: opts.min, max: opts.max, step: opts.step,
  });
  input.addEventListener('input', () => {
    if (input.value === '') setter(null);
    else setter(Number(input.value));
    recompute();
  });
  return input;
}

function selectInput(getter, setter, options) {
  const select = el('select', { class: 'select' });
  select.appendChild(el('option', { value: '' }, '— select —'));
  for (const opt of options) {
    select.appendChild(el('option', { value: opt.value }, opt.label));
  }
  select.value = getter() || '';
  select.addEventListener('change', () => {
    setter(select.value);
    recompute();
  });
  return select;
}

function yesnoInput(getter, setter) {
  const group = el('div', { class: 'radio-group', role: 'radiogroup' });
  const name = `yn${Math.random().toString(36).slice(2, 10)}`;
  for (const val of ['yes', 'no']) {
    const id = `${name}-${val}`;
    const input = el('input', { class: 'radio-input', type: 'radio', name, value: val, id });
    if (getter() === val) input.checked = true;
    input.addEventListener('change', () => {
      if (input.checked) { setter(val); recompute(); }
    });
    group.appendChild(el('label', { for: id }, input, ' ' + val[0].toUpperCase() + val.slice(1)));
  }
  return group;
}

function textareaInput(getter, setter, opts) {
  opts = opts || {};
  const ta = el('textarea', { class: 'text-area-input', rows: opts.rows || 3, placeholder: opts.placeholder || '' });
  ta.value = getter() || '';
  ta.addEventListener('input', () => {
    setter(ta.value);
    recompute();
  });
  return ta;
}

// ---------------------------------------------------------------------------
// Per-step renderers
// ---------------------------------------------------------------------------

function renderStep(number, lp1hSection, title, description, contentEl) {
  const card = el('fieldset', { class: 'step fieldset', id: `step-${number}`, 'data-step': String(number) });
  const legend = el(
    'legend',
    { class: 'step-header fieldset-legend' },
    el('span', { class: 'step-tag' }, `LP1H ${lp1hSection}`),
    el('h2', { class: 'step-title' }, `Step ${number}. ${title}`),
    el('p', { class: 'step-desc' }, description),
  );
  card.appendChild(legend);
  card.appendChild(contentEl);
  return card;
}

function renderStep1() {
  const d = application.donor;
  const grid = el('div', { class: 'field-grid' });
  grid.appendChild(field('Given names', textInput(() => d.givenNames, (v) => (d.givenNames = v)), { required: true }));
  grid.appendChild(field('Family name', textInput(() => d.familyName, (v) => (d.familyName = v)), { required: true }));
  grid.appendChild(field('Other names used', textInput(() => d.otherNamesUsed, (v) => (d.otherNamesUsed = v)), { hint: 'LP1H s.1 requires any other names to be listed.' }));
  grid.appendChild(field('Date of birth', textInput(() => d.birthDate, (v) => (d.birthDate = v), { type: 'date' }), { required: true }));
  grid.appendChild(field('Email', textInput(() => d.email, (v) => (d.email = v), { type: 'email' })));
  grid.appendChild(field('Telephone', textInput(() => d.phone, (v) => (d.phone = v), { type: 'tel' })));
  grid.appendChild(field('Postal address', textInput(() => d.postalAddressAsFullText, (v) => (d.postalAddressAsFullText = v)), { full: true, required: true }));
  grid.appendChild(field('Postcode', textInput(() => d.postcode, (v) => (d.postcode = v))));
  grid.appendChild(field('Country (ISO 3166-1)', textInput(() => d.countryAsIso31661Alpha2, (v) => (d.countryAsIso31661Alpha2 = v)), { hint: 'GB for the UK.' }));
  grid.appendChild(field('NHS number', textInput(() => d.unitedKingdomNhsNumber, (v) => (d.unitedKingdomNhsNumber = v)), { hint: 'Optional. Used for ADRT cross-check.' }));
  grid.appendChild(field('Jurisdiction', selectInput(() => d.jurisdiction, (v) => (d.jurisdiction = v), [
    { value: 'england', label: 'England' },
    { value: 'wales', label: 'Wales' },
  ]), { required: true }));
  grid.appendChild(field('Preferred language', selectInput(() => d.preferredLanguage, (v) => (d.preferredLanguage = v), [
    { value: 'en', label: 'English' },
    { value: 'cy', label: 'Cymraeg' },
  ])));
  grid.appendChild(field('Donor declares mental capacity at signing', yesnoInput(() => d.capacityDeclared, (v) => (d.capacityDeclared = v)), { hint: 'MCA 2005 s.9(2)(b).' }));
  grid.appendChild(field('Capacity declared at', textInput(() => d.capacityDeclaredAt, (v) => (d.capacityDeclaredAt = v), { type: 'datetime-local' })));
  return renderStep(1, 's.1', 'Donor identification', 'Full name, date of birth, address, and any other names the donor uses.', grid);
}

function renderStep2() {
  const grid = el('div', { class: 'field-grid' });
  grid.appendChild(field('LPA jurisdiction', selectInput(() => application.jurisdiction, (v) => (application.jurisdiction = v), [
    { value: 'england', label: 'England' },
    { value: 'wales', label: 'Wales' },
  ]), { required: true, full: true, hint: 'Scotland and Northern Ireland use separate schemes.' }));
  return renderStep(2, 's.4–5', 'LPA scope and activation', 'Jurisdiction (England or Wales). The LPA can only be used after registration and after the donor has lost capacity (MCA s.11(7)).', grid);
}

function renderAttorneyBlock(label, list, isReplacement) {
  const wrapper = el('div');
  list.forEach((a, idx) => {
    const sub = el('section', { class: 'subform' });
    const header = el('div', { class: 'subform-header' },
      el('h3', null, `${label} #${idx + 1}`),
      el('button', { type: 'button', class: 'btn-remove', onclick: () => { list.splice(idx, 1); rerenderAll(); } }, 'Remove'),
    );
    sub.appendChild(header);
    const grid = el('div', { class: 'field-grid' });
    grid.appendChild(field('Given names', textInput(() => a.givenNames, (v) => (a.givenNames = v)), { required: true }));
    grid.appendChild(field('Family name', textInput(() => a.familyName, (v) => (a.familyName = v)), { required: true }));
    grid.appendChild(field('Date of birth', textInput(() => a.birthDate, (v) => (a.birthDate = v), { type: 'date' }), { required: true }));
    grid.appendChild(field('Relationship to donor', selectInput(() => a.relationshipToDonor, (v) => (a.relationshipToDonor = v), RELATIONSHIPS)));
    grid.appendChild(field('Postal address', textInput(() => a.postalAddressAsFullText, (v) => (a.postalAddressAsFullText = v)), { full: true }));
    grid.appendChild(field('Email', textInput(() => a.email, (v) => (a.email = v), { type: 'email' })));
    grid.appendChild(field('Telephone', textInput(() => a.phone, (v) => (a.phone = v), { type: 'tel' })));
    grid.appendChild(field('Bankrupt?', yesnoInput(() => a.isBankrupt, (v) => (a.isBankrupt = v)), { hint: 'Informational only — bar applies to P&FA LPAs.' }));
    grid.appendChild(field('Capacity to act?', yesnoInput(() => a.capacityDeclared, (v) => (a.capacityDeclared = v))));
    if (isReplacement) {
      grid.appendChild(field('Replacement trigger', textareaInput(() => a.replacementTrigger, (v) => (a.replacementTrigger = v), { rows: 2 }), { full: true, hint: 'Free text describing the trigger condition.' }));
    }
    sub.appendChild(grid);
    wrapper.appendChild(sub);
  });
  return wrapper;
}

function renderStep3() {
  const wrapper = el('div');
  wrapper.appendChild(el('p', { class: 'hint' }, 'Name 1 to 4 attorneys. Each attorney must be ≥ 18 and have capacity (MCA 2005 s.10).'));
  wrapper.appendChild(renderAttorneyBlock('Attorney', application.attorneys, false));
  if (application.attorneys.length < 4) {
    wrapper.appendChild(el('button', { type: 'button', class: 'btn btn-add', onclick: () => { application.attorneys.push(emptyAttorney()); rerenderAll(); } }, '+ Add attorney'));
  }
  return renderStep(3, 's.2', 'Attorneys', 'Up to 4 attorneys with their details and relationship to the donor.', wrapper);
}

function renderStep4() {
  const wrapper = el('div', { class: 'field-grid' });
  wrapper.appendChild(field('How must the attorneys decide?',
    selectInput(() => application.decisionRule, (v) => (application.decisionRule = v), [
      { value: 'jointly', label: 'Jointly (all must agree)' },
      { value: 'jointly-and-severally', label: 'Jointly and severally (any may decide alone)' },
      { value: 'mixed', label: 'Mixed — joint for some, severally for others' },
    ]), { full: true, required: true, hint: 'LP1H s.3, MCA 2005 s.10(4).' }));
  if (application.decisionRule === 'mixed') {
    wrapper.appendChild(field('Which decisions must be made jointly?',
      textareaInput(() => application.jointDecisionSet, (v) => (application.jointDecisionSet = v), { rows: 3 }),
      { full: true, hint: 'List the decisions that require unanimous agreement.' }));
  }
  return renderStep(4, 's.3', 'Attorney decision rule', 'Jointly, jointly and severally, or jointly for some decisions and severally for others.', wrapper);
}

function renderStep5() {
  const wrapper = el('div');
  wrapper.appendChild(el('p', { class: 'hint' }, '0 to 4 replacement attorneys. They step in if a primary attorney cannot act.'));
  wrapper.appendChild(renderAttorneyBlock('Replacement attorney', application.replacementAttorneys, true));
  if (application.replacementAttorneys.length < 4) {
    wrapper.appendChild(el('button', { type: 'button', class: 'btn btn-add', onclick: () => { application.replacementAttorneys.push(emptyReplacementAttorney()); rerenderAll(); } }, '+ Add replacement attorney'));
  }
  return renderStep(5, 's.4', 'Replacement attorneys', '0 to 4 replacement attorneys and the conditions under which they take over.', wrapper);
}

function renderStep6() {
  const wrapper = el('div');
  wrapper.appendChild(el('p', { class: 'hint' }, 'Under MCA 2005 s.11(7) the donor must choose Option A or Option B on life-sustaining treatment.'));
  for (const opt of [
    { value: 'option-a', label: 'Option A', body: 'Attorneys may give or refuse consent to life-sustaining treatment.' },
    { value: 'option-b', label: 'Option B', body: 'Attorneys do NOT have authority over life-sustaining treatment.' },
  ]) {
    const radio = el('input', { type: 'radio', name: 'lst', value: opt.value });
    if (application.lstChoice === opt.value) radio.checked = true;
    radio.addEventListener('change', () => {
      if (radio.checked) { application.lstChoice = opt.value; recompute(); }
    });
    wrapper.appendChild(el('label', { class: 'subform' },
      el('div', { style: 'display: flex; gap: 0.5rem; align-items: flex-start;' },
        radio,
        el('div', null,
          el('strong', null, opt.label),
          el('p', { class: 'hint' }, opt.body),
        ),
      ),
    ));
  }
  if (application.lstChoice !== '') {
    const grid = el('div', { class: 'field-grid' });
    grid.appendChild(field('Has the donor initialled the chosen option?',
      yesnoInput(() => application.lstDonorInitialled, (v) => (application.lstDonorInitialled = v)),
      { full: true, hint: 'LP1H requires the donor to personally initial — not merely tick — the chosen box.' }));
    wrapper.appendChild(grid);
  }
  return renderStep(6, 's.5', 'Life-sustaining treatment', 'Donor election under MCA 2005 s.11(7).', wrapper);
}

function renderItemBlock(label, list, blank, renderFields) {
  const wrapper = el('div');
  list.forEach((item, idx) => {
    const sub = el('section', { class: 'subform' });
    sub.appendChild(el('div', { class: 'subform-header' },
      el('h3', null, `${label} #${idx + 1}`),
      el('button', { type: 'button', class: 'btn-remove', onclick: () => { list.splice(idx, 1); rerenderAll(); } }, 'Remove'),
    ));
    const grid = el('div', { class: 'field-grid' });
    renderFields(item, grid);
    sub.appendChild(grid);
    wrapper.appendChild(sub);
  });
  wrapper.appendChild(el('button', { type: 'button', class: 'btn btn-add', onclick: () => { list.push(blank()); rerenderAll(); } }, `+ Add ${label.toLowerCase()}`));
  return wrapper;
}

function renderStep7() {
  const wrapper = renderItemBlock('Preference', application.preferences, () => ({ category: '', statement: '' }), (p, grid) => {
    grid.appendChild(field('Category', selectInput(() => p.category, (v) => (p.category = v), PREFERENCE_CATEGORIES), { full: true }));
    grid.appendChild(field('Statement', textareaInput(() => p.statement, (v) => (p.statement = v)), { full: true }));
  });
  return renderStep(7, 's.7', 'Preferences (non-binding)', 'Non-binding guidance for the attorneys.', wrapper);
}

function renderStep8() {
  const wrapper = renderItemBlock('Instruction', application.instructions, () => ({ category: '', statement: '', lawfulnessAssessed: '', contradictsAdrt: '' }), (ins, grid) => {
    grid.appendChild(field('Category', selectInput(() => ins.category, (v) => (ins.category = v), INSTRUCTION_CATEGORIES), { full: true }));
    grid.appendChild(field('Statement', textareaInput(() => ins.statement, (v) => (ins.statement = v)), { full: true }));
    grid.appendChild(field('Lawfulness assessed?', yesnoInput(() => ins.lawfulnessAssessed, (v) => (ins.lawfulnessAssessed = v))));
    grid.appendChild(field('Contradicts a known ADRT?', yesnoInput(() => ins.contradictsAdrt, (v) => (ins.contradictsAdrt = v))));
  });
  return renderStep(8, 's.7', 'Instructions (binding)', 'Binding constraints; must be lawful and consistent with any ADRT.', wrapper);
}

function renderStep9() {
  const wrapper = el('div');
  wrapper.appendChild(el('p', { class: 'hint' }, '0 to 5 persons to notify when the LPA is being registered (LP1H s.6).'));
  application.peopleToNotify.forEach((p, idx) => {
    const sub = el('section', { class: 'subform' });
    sub.appendChild(el('div', { class: 'subform-header' },
      el('h3', null, `Person to notify #${idx + 1}`),
      el('button', { type: 'button', class: 'btn-remove', onclick: () => { application.peopleToNotify.splice(idx, 1); rerenderAll(); } }, 'Remove'),
    ));
    const grid = el('div', { class: 'field-grid' });
    grid.appendChild(field('Given names', textInput(() => p.givenNames, (v) => (p.givenNames = v))));
    grid.appendChild(field('Family name', textInput(() => p.familyName, (v) => (p.familyName = v))));
    grid.appendChild(field('Relationship to donor', selectInput(() => p.relationshipToDonor, (v) => (p.relationshipToDonor = v), RELATIONSHIPS)));
    grid.appendChild(field('Email', textInput(() => p.email, (v) => (p.email = v), { type: 'email' })));
    grid.appendChild(field('Postal address', textInput(() => p.postalAddressAsFullText, (v) => (p.postalAddressAsFullText = v)), { full: true }));
    sub.appendChild(grid);
    wrapper.appendChild(sub);
  });
  if (application.peopleToNotify.length < 5) {
    wrapper.appendChild(el('button', { type: 'button', class: 'btn btn-add', onclick: () => { application.peopleToNotify.push(emptyPersonToNotify()); rerenderAll(); } }, '+ Add person to notify'));
  }
  return renderStep(9, 's.6', 'People to notify', '0 to 5 named recipients of the notice of intention to register.', wrapper);
}

function renderStep10() {
  if (!application.certificateProvider) {
    application.certificateProvider = emptyCertificateProvider();
  }
  const cp = application.certificateProvider;
  const grid = el('div', { class: 'field-grid' });
  grid.appendChild(field('Given names', textInput(() => cp.givenNames, (v) => (cp.givenNames = v)), { required: true }));
  grid.appendChild(field('Family name', textInput(() => cp.familyName, (v) => (cp.familyName = v)), { required: true }));
  grid.appendChild(field('Postal address', textInput(() => cp.postalAddressAsFullText, (v) => (cp.postalAddressAsFullText = v)), { full: true }));
  grid.appendChild(field('Email', textInput(() => cp.email, (v) => (cp.email = v), { type: 'email' })));
  grid.appendChild(field('Telephone', textInput(() => cp.phone, (v) => (cp.phone = v), { type: 'tel' })));
  grid.appendChild(field('Eligibility route', selectInput(() => cp.route, (v) => { cp.route = v; rerenderAll(); }, [
    { value: 'skill-based', label: 'Skill-based (registered profession)' },
    { value: 'knowledge-based', label: 'Knowledge-based (≥ 2 years)' },
  ]), { full: true, required: true }));
  if (cp.route === 'skill-based') {
    grid.appendChild(field('Profession', selectInput(() => cp.profession, (v) => (cp.profession = v), PROFESSIONS), { required: true }));
    grid.appendChild(field('Registration number', textInput(() => cp.professionRegistrationNumber, (v) => (cp.professionRegistrationNumber = v))));
  } else if (cp.route === 'knowledge-based') {
    grid.appendChild(field('Years known the donor', numberInput(() => cp.yearsKnownDonor, (v) => (cp.yearsKnownDonor = v), { min: 0, step: 0.5 }), { full: true, hint: 'Must be ≥ 2 for the knowledge-based route.' }));
  }
  grid.appendChild(field('Not a family member of donor or attorneys?', yesnoInput(() => cp.declaredNotFamily, (v) => (cp.declaredNotFamily = v))));
  grid.appendChild(field('Not a business partner or employee?', yesnoInput(() => cp.declaredNotEmployee, (v) => (cp.declaredNotEmployee = v))));
  grid.appendChild(field('Not an attorney in this LPA?', yesnoInput(() => cp.declaredNotAttorney, (v) => (cp.declaredNotAttorney = v))));
  return renderStep(10, 's.10', 'Certificate provider', 'Independent skill-based or knowledge-based certifier.', grid);
}

function ensureSignature(role, idx) {
  let sig = application.signatures.find((s) => s.signerRole === role && s.signerIndex === idx);
  if (!sig) {
    sig = { signerRole: role, signerIndex: idx, signedAt: '', signatureMethod: '', witnessName: '', witnessAddress: '', witnessSignedAt: '', witnessIsAttorney: '' };
    application.signatures.push(sig);
  }
  return sig;
}

function renderSignatureFields(sig, grid) {
  grid.appendChild(field('Signed at', textInput(() => sig.signedAt, (v) => (sig.signedAt = v), { type: 'datetime-local' })));
  grid.appendChild(field('Method', selectInput(() => sig.signatureMethod, (v) => (sig.signatureMethod = v), [
    { value: 'wet-ink', label: 'Wet-ink' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'mark-with-witness', label: 'Mark with witness' },
  ])));
  grid.appendChild(field('Witness name', textInput(() => sig.witnessName, (v) => (sig.witnessName = v))));
  grid.appendChild(field('Witness signed at', textInput(() => sig.witnessSignedAt, (v) => (sig.witnessSignedAt = v), { type: 'datetime-local' })));
  grid.appendChild(field('Witness address', textInput(() => sig.witnessAddress, (v) => (sig.witnessAddress = v)), { full: true }));
  grid.appendChild(field('Witness is an attorney?', yesnoInput(() => sig.witnessIsAttorney, (v) => (sig.witnessIsAttorney = v))));
}

function renderStep11() {
  const sig = ensureSignature('donor', 0);
  const grid = el('div', { class: 'field-grid' });
  renderSignatureFields(sig, grid);
  return renderStep(11, 's.9', 'Donor signature and witness', 'The donor must sign first, before the certificate provider and attorneys.', grid);
}

function renderStep12() {
  const wrapper = el('div');
  const cpSig = ensureSignature('certificate-provider', 0);
  const cpSub = el('section', { class: 'subform' },
    el('div', { class: 'subform-header' }, el('h3', null, 'Certificate provider signature')),
  );
  const cpGrid = el('div', { class: 'field-grid' });
  renderSignatureFields(cpSig, cpGrid);
  cpSub.appendChild(cpGrid);
  wrapper.appendChild(cpSub);

  application.attorneys.forEach((a, idx) => {
    const aSig = ensureSignature('attorney', idx);
    const sub = el('section', { class: 'subform' },
      el('div', { class: 'subform-header' }, el('h3', null, `Attorney #${idx + 1} — ${a.givenNames} ${a.familyName}`)),
    );
    const grid = el('div', { class: 'field-grid' });
    renderSignatureFields(aSig, grid);
    sub.appendChild(grid);
    wrapper.appendChild(sub);
  });
  return renderStep(12, 's.10, s.11', 'Certificate provider and attorney signatures', 'Order: donor → certificate provider → attorneys. Witness must not be an attorney.', wrapper);
}

function renderStep13() {
  const reg = application.registration;
  const grid = el('div', { class: 'field-grid' });
  grid.appendChild(field('Applicant', selectInput(() => reg.applicantRole, (v) => (reg.applicantRole = v), [
    { value: 'donor', label: 'Donor' },
    { value: 'attorney', label: 'One attorney' },
    { value: 'attorneys-jointly', label: 'All attorneys jointly' },
  ]), { required: true }));
  grid.appendChild(field('Applicant signed at', textInput(() => reg.applicantSignedAt, (v) => (reg.applicantSignedAt = v), { type: 'datetime-local' }), { required: true }));
  grid.appendChild(field('Fee (£)', numberInput(() => reg.feeAmountPounds, (v) => (reg.feeAmountPounds = v ?? 0), { min: 0, step: 0.01 }), { hint: 'Standard £82 (2026); zero when fully exempt.' }));
  grid.appendChild(field('Fee remission', selectInput(() => reg.feeRemission, (v) => { reg.feeRemission = v; rerenderAll(); }, [
    { value: 'none', label: 'None — full fee' },
    { value: 'half', label: 'Half remission' },
    { value: 'full-exempt', label: 'Full exemption' },
  ])));
  if (reg.feeRemission !== '' && reg.feeRemission !== 'none') {
    grid.appendChild(field('Remission reason', selectInput(() => reg.feeRemissionReason, (v) => (reg.feeRemissionReason = v), REMISSION_REASONS), { full: true }));
  }
  grid.appendChild(field('Submission channel', selectInput(() => reg.submissionChannel, (v) => (reg.submissionChannel = v), [
    { value: 'post', label: 'Post' },
    { value: 'opg-digital', label: 'OPG digital' },
    { value: 'solicitor-portal', label: 'Solicitor portal' },
  ])));
  grid.appendChild(field('Submitted at', textInput(() => reg.submittedAt, (v) => (reg.submittedAt = v), { type: 'datetime-local' })));
  return renderStep(13, 'Part C', 'Registration application', 'LP1H Part C — applicant identity, signature, and fee.', grid);
}

function renderStep14() {
  const wrapper = el('div');
  wrapper.appendChild(el('p', { class: 'hint' }, 'The validity engine has computed the latest result. The report aside on the right shows live updates as you change fields above.'));
  const json = JSON.stringify(application, null, 2);
  const exportSection = el('div', { class: 'export-section' });
  exportSection.appendChild(el('h3', null, 'JSON export'));
  const copyBtn = el('button', { type: 'button', class: 'btn btn-primary', onclick: () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json);
    }
  } }, 'Copy JSON');
  exportSection.appendChild(copyBtn);
  // tabindex + aria-label so the scrollable code block is keyboard-focusable
  // (WCAG 2.1.1 — scrollable regions must have keyboard access).
  exportSection.appendChild(el('pre', { tabindex: '0', role: 'region', 'aria-label': 'JSON export' }, json));
  wrapper.appendChild(exportSection);
  return renderStep(14, 'computed', 'Validity summary and export', 'Live validity result; export the JSON packet for OPG submission.', wrapper);
}

// ---------------------------------------------------------------------------
// Report aside
// ---------------------------------------------------------------------------

function renderReportAside() {
  const aside = document.getElementById('report-aside');
  if (!aside) return;
  aside.innerHTML = '';
  aside.appendChild(el('h2', null, 'Validity'));
  const badge = el('div', null,
    el('span', { class: 'status-badge status-' + (validity.validityStatus || 'invalid') }, validity.validityStatus || '—'),
  );
  aside.appendChild(badge);

  const dl = el('dl');
  for (const [k, v] of [
    ['Completeness', validity.completenessScore + '%'],
    ['Effective date', validity.effectiveDate || '—'],
    ['Engine', 'v' + validity.engineVersion],
  ]) {
    dl.appendChild(el('div', { class: 'report-row' }, el('dt', null, k), el('dd', null, v)));
  }
  aside.appendChild(dl);

  if (validity.firedRules.length > 0) {
    aside.appendChild(el('h3', { style: 'margin: 0.75rem 0 0.25rem; font-size: 0.85rem;' }, `Fired rules (${validity.firedRules.length})`));
    const ul = el('ul', { class: 'fired-rules' });
    for (const r of validity.firedRules.slice(0, 15)) {
      ul.appendChild(el('li', { class: 'fired-rule ' + r.severity },
        el('div', null, el('code', null, r.ruleId)),
        el('div', null, r.description),
      ));
    }
    aside.appendChild(ul);
  }

  if (validity.additionalFlags.length > 0) {
    aside.appendChild(el('h3', { style: 'margin: 0.75rem 0 0.25rem; font-size: 0.85rem;' }, `Flags (${validity.additionalFlags.length})`));
    const ul = el('ul', { class: 'fired-rules' });
    for (const f of validity.additionalFlags) {
      ul.appendChild(el('li', { class: 'fired-rule' },
        el('div', null, el('code', null, f.category)),
        el('div', null, f.description),
      ));
    }
    aside.appendChild(ul);
  }

  const bar = document.getElementById('progress');
  if (bar) bar.value = validity.completenessScore;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = validity.completenessScore + '% complete';
  updateStepListStatuses();
}

// ---------------------------------------------------------------------------
// Step-list
// ---------------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1,  title: 'Donor' },
  { step: 2,  title: 'Scope' },
  { step: 3,  title: 'Attorneys' },
  { step: 4,  title: 'Decisions' },
  { step: 5,  title: 'Replacements' },
  { step: 6,  title: 'LST' },
  { step: 7,  title: 'Preferences' },
  { step: 8,  title: 'Instructions' },
  { step: 9,  title: 'Notify' },
  { step: 10, title: 'Certifier' },
  { step: 11, title: 'Donor sig' },
  { step: 12, title: 'Other sigs' },
  { step: 13, title: 'Register' },
  { step: 14, title: 'Export' }
];

function renderStepList() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  ol.innerHTML = '';
  for (const def of STEP_DEFINITIONS) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(def.step);
    li.setAttribute('aria-label', 'Step ' + def.step + ': ' + def.title);
    const span = document.createElement('span');
    span.textContent = def.title;
    li.appendChild(span);
    li.addEventListener('click', () => {
      const target = document.getElementById('step-' + def.step);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  }
}

function updateStepListStatuses() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  // Best-effort: use overall completeness to set step states. A finished
  // step is one whose required inputs in document order are filled. We
  // approximate by counting [data-required] descendants of each step
  // element and how many have non-empty value.
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector('[data-step="' + def.step + '"]');
    const step = document.getElementById('step-' + def.step);
    if (!li || !step) continue;
    const required = step.querySelectorAll('[data-required]');
    let answered = 0;
    required.forEach((r) => {
      if (r.type === 'radio') {
        if (document.querySelector('input[type="radio"][name="' + r.name + '"]:checked')) answered++;
      } else if (r.type === 'checkbox') {
        if (r.checked) answered++;
      } else if (r.value && String(r.value).trim() !== '') {
        answered++;
      }
    });
    if (required.length > 0 && answered >= required.length) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
    } else if (answered > 0) {
      li.dataset.status = 'in-progress';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    } else {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
      if (firstUnfinished === -1) firstUnfinished = def.step;
    }
  }
  if (firstUnfinished === -1) firstUnfinished = STEP_DEFINITIONS[0].step;
  const current = ol.querySelector('[data-step="' + firstUnfinished + '"]');
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
  }
  ol.dataset.current = String(firstUnfinished - 1);
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function recompute() {
  validity = calculateLpaValidity(application);
  renderReportAside();
}

function rerenderAll() {
  const root = document.getElementById('form-sections');
  if (!root) return;
  // Preserve the error-summary div across re-renders.
  const errorSummary = document.getElementById('error-summary');
  root.innerHTML = '';
  if (errorSummary) root.appendChild(errorSummary);
  root.appendChild(renderStep1());
  root.appendChild(renderStep2());
  root.appendChild(renderStep3());
  root.appendChild(renderStep4());
  root.appendChild(renderStep5());
  root.appendChild(renderStep6());
  root.appendChild(renderStep7());
  root.appendChild(renderStep8());
  root.appendChild(renderStep9());
  root.appendChild(renderStep10());
  root.appendChild(renderStep11());
  root.appendChild(renderStep12());
  root.appendChild(renderStep13());
  root.appendChild(renderStep14());
  recompute();
}

function boot() {
  renderStepList();
  rerenderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
