// Employee Satisfaction Survey — items registry.
//
// Every item is a 1-5 Likert ("agreement" wording: Strongly disagree through
// Strongly agree). Items are positively worded: a higher response is more
// favourable. No reverse-coding is required.
//
// The grader normalises each item to 0-100 by mean × 20 and averages the
// eight graded domain scores into a single composite. Categories:
//
//   85-100  excellent
//   70-84   good
//   50-69   satisfactory
//   25-49   poor
//    0-24   very-poor
//
// Step 1 (demographics) and step 2 (role & tenure) capture anonymised
// context only and are NOT included in the composite. Step 10 contains
// four Likert items in the `overall` domain plus an eNPS 0-10 question
// (`recommendScore`) and a retention-intent dropdown. The four Likert
// items contribute to the composite; the eNPS and retention intent are
// reported separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} SurveyItem
 * @property {string} id            Field id (e.g. 'wl1').
 * @property {string} domain        Domain key (e.g. 'workload').
 * @property {string} label         Statement text.
 * @property {1 | 5} scaleMin
 * @property {1 | 5} scaleMax
 */

// Wrapped in an IIFE; published via window.EmployeeSatisfactionSurvey.

// ---------------------------------------------------------------------
// Likert agreement scale (text labels for each numeric value 1..5)
// ---------------------------------------------------------------------

const LIKERT_AGREEMENT = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' }
];

// ---------------------------------------------------------------------
// Domain meta (display titles, descriptions, step numbers)
// ---------------------------------------------------------------------
//
// `graded` = whether items contribute to the composite score. Demographics
// and Role & Tenure capture context only.

const DOMAINS = [
  {
    key: 'workload',
    title: 'Workload & Work-Life Balance',
    stepNumber: 3,
    graded: true,
    description:
      'How manageable your workload is and how well you can balance work with your personal life.'
  },
  {
    key: 'management',
    title: 'Management & Leadership',
    stepNumber: 4,
    graded: true,
    description:
      'The support, communication and trust you receive from your line manager and senior leadership.'
  },
  {
    key: 'growth',
    title: 'Growth & Development',
    stepNumber: 5,
    graded: true,
    description:
      'Opportunities to learn, develop your skills and advance your career.'
  },
  {
    key: 'compensation',
    title: 'Compensation & Benefits',
    stepNumber: 6,
    graded: true,
    description:
      'Whether your pay, benefits and rewards feel fair for the work you do.'
  },
  {
    key: 'culture',
    title: 'Culture & Inclusion',
    stepNumber: 7,
    graded: true,
    description:
      'The day-to-day culture, sense of belonging and treatment of all colleagues.'
  },
  {
    key: 'environment',
    title: 'Environment & Resources',
    stepNumber: 8,
    graded: true,
    description:
      'The physical or virtual workplace, tools and resources you need to do your job well.'
  },
  {
    key: 'recognition',
    title: 'Recognition & Engagement',
    stepNumber: 9,
    graded: true,
    description:
      'How your contributions are recognised and how engaged you feel in your work.'
  },
  {
    key: 'overall',
    title: 'Overall Experience & Retention Intent',
    stepNumber: 10,
    graded: true,
    description:
      'Your overall view of working here, including an eNPS-style recommendation question and your retention intent.'
  }
];

// ---------------------------------------------------------------------
// Items (Likert 1-5; positively worded)
// ---------------------------------------------------------------------

/** @type {SurveyItem[]} */
const surveyItems = [
  // -------- Workload & Work-Life Balance (5 items) ------------------
  { id: 'wl1', domain: 'workload', scaleMin: 1, scaleMax: 5,
    label: 'My workload is manageable.' },
  { id: 'wl2', domain: 'workload', scaleMin: 1, scaleMax: 5,
    label: 'I am able to maintain a healthy balance between work and my personal life.' },
  { id: 'wl3', domain: 'workload', scaleMin: 1, scaleMax: 5,
    label: 'I rarely feel exhausted or burnt out at the end of the working week.' },
  { id: 'wl4', domain: 'workload', scaleMin: 1, scaleMax: 5,
    label: 'I am able to take time off when I need it.' },
  { id: 'wl5', domain: 'workload', scaleMin: 1, scaleMax: 5,
    label: 'My working hours are reasonable for the role I do.' },

  // -------- Management & Leadership (5 items) -----------------------
  { id: 'mg1', domain: 'management', scaleMin: 1, scaleMax: 5,
    label: 'My line manager treats me with respect.' },
  { id: 'mg2', domain: 'management', scaleMin: 1, scaleMax: 5,
    label: 'My line manager gives me clear direction and constructive feedback.' },
  { id: 'mg3', domain: 'management', scaleMin: 1, scaleMax: 5,
    label: 'I trust the senior leadership of this organisation.' },
  { id: 'mg4', domain: 'management', scaleMin: 1, scaleMax: 5,
    label: 'Decisions made by leadership are communicated openly.' },
  { id: 'mg5', domain: 'management', scaleMin: 1, scaleMax: 5,
    label: 'My line manager supports my wellbeing.' },

  // -------- Growth & Development (4 items) --------------------------
  { id: 'gr1', domain: 'growth', scaleMin: 1, scaleMax: 5,
    label: 'I have meaningful opportunities to learn new skills here.' },
  { id: 'gr2', domain: 'growth', scaleMin: 1, scaleMax: 5,
    label: 'I see a clear path for career progression.' },
  { id: 'gr3', domain: 'growth', scaleMin: 1, scaleMax: 5,
    label: 'My manager actively supports my professional development.' },
  { id: 'gr4', domain: 'growth', scaleMin: 1, scaleMax: 5,
    label: 'Training and development resources are available when I need them.' },

  // -------- Compensation & Benefits (4 items) -----------------------
  { id: 'cb1', domain: 'compensation', scaleMin: 1, scaleMax: 5,
    label: 'I am paid fairly for the work I do.' },
  { id: 'cb2', domain: 'compensation', scaleMin: 1, scaleMax: 5,
    label: 'My benefits package meets my needs.' },
  { id: 'cb3', domain: 'compensation', scaleMin: 1, scaleMax: 5,
    label: 'Pay decisions in this organisation are made fairly.' },
  { id: 'cb4', domain: 'compensation', scaleMin: 1, scaleMax: 5,
    label: 'My total compensation is competitive with similar roles elsewhere.' },

  // -------- Culture & Inclusion (5 items) ---------------------------
  { id: 'cu1', domain: 'culture', scaleMin: 1, scaleMax: 5,
    label: 'I feel a sense of belonging at this organisation.' },
  { id: 'cu2', domain: 'culture', scaleMin: 1, scaleMax: 5,
    label: 'People from all backgrounds are treated fairly here.' },
  { id: 'cu3', domain: 'culture', scaleMin: 1, scaleMax: 5,
    label: 'I can be myself at work.' },
  { id: 'cu4', domain: 'culture', scaleMin: 1, scaleMax: 5,
    label: 'My colleagues collaborate well together.' },
  { id: 'cu5', domain: 'culture', scaleMin: 1, scaleMax: 5,
    label: 'Inappropriate behaviour is addressed promptly when it occurs.' },

  // -------- Environment & Resources (4 items) -----------------------
  { id: 'en1', domain: 'environment', scaleMin: 1, scaleMax: 5,
    label: 'I have the tools and equipment I need to do my job well.' },
  { id: 'en2', domain: 'environment', scaleMin: 1, scaleMax: 5,
    label: 'My work environment (on-site or remote) supports productive work.' },
  { id: 'en3', domain: 'environment', scaleMin: 1, scaleMax: 5,
    label: 'I have access to the information and systems I need.' },
  { id: 'en4', domain: 'environment', scaleMin: 1, scaleMax: 5,
    label: 'Health and safety in my workplace are taken seriously.' },

  // -------- Recognition & Engagement (4 items) ----------------------
  { id: 'rc1', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'I receive meaningful recognition when I do good work.' },
  { id: 'rc2', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'I feel motivated to go beyond what is strictly required.' },
  { id: 'rc3', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'My contributions are valued by my team and manager.' },
  { id: 'rc4', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'I find my day-to-day work engaging.' },

  // -------- Overall Experience (4 Likert items + eNPS / retention) -
  { id: 'ov1', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'I am proud to tell people I work here.' },
  { id: 'ov2', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'I would recommend this organisation as a great place to work.' },
  { id: 'ov3', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'Knowing what I know now, I would still choose to join this organisation.' },
  { id: 'ov4', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'I expect to still be working here in twelve months.' }
];

// ---------------------------------------------------------------------
// Demographic option lists (kept deliberately broad to preserve anonymity)
// ---------------------------------------------------------------------

const DEPARTMENT_OPTIONS = [
  { value: 'operations',         label: 'Operations' },
  { value: 'engineering',        label: 'Engineering / IT' },
  { value: 'sales-marketing',    label: 'Sales / Marketing' },
  { value: 'customer-service',   label: 'Customer Service' },
  { value: 'finance',            label: 'Finance' },
  { value: 'human-resources',    label: 'Human Resources' },
  { value: 'administration',     label: 'Administration' },
  { value: 'clinical',           label: 'Clinical / Care' },
  { value: 'research',           label: 'Research' },
  { value: 'leadership',         label: 'Leadership / Executive' },
  { value: 'other',              label: 'Other / Prefer not to say' }
];

const TENURE_OPTIONS = [
  { value: 'less-than-1-year',    label: 'Less than 1 year' },
  { value: '1-to-3-years',        label: '1 to 3 years' },
  { value: '3-to-5-years',        label: '3 to 5 years' },
  { value: '5-to-10-years',       label: '5 to 10 years' },
  { value: 'more-than-10-years',  label: 'More than 10 years' }
];

const HOURS_OPTIONS = [
  { value: 'part-time-under-20',  label: 'Part-time (under 20 hours / week)' },
  { value: 'part-time-20-to-34',  label: 'Part-time (20–34 hours / week)' },
  { value: 'full-time-35-to-44',  label: 'Full-time (35–44 hours / week)' },
  { value: 'long-hours-45-plus',  label: 'Long hours (45+ hours / week)' }
];

const ROLE_LEVEL_OPTIONS = [
  { value: 'individual-contributor', label: 'Individual contributor' },
  { value: 'team-lead',              label: 'Team lead' },
  { value: 'manager',                label: 'Manager' },
  { value: 'senior-manager',         label: 'Senior manager' },
  { value: 'director-or-above',      label: 'Director or above' }
];

const WORK_LOCATION_OPTIONS = [
  { value: 'on-site', label: 'Mostly on-site' },
  { value: 'hybrid',  label: 'Hybrid' },
  { value: 'remote',  label: 'Mostly remote' }
];

const RETENTION_INTENT_OPTIONS = [
  { value: 'definitely-stay',          label: 'I definitely plan to stay' },
  { value: 'probably-stay',            label: 'I probably plan to stay' },
  { value: 'unsure',                   label: 'I am unsure' },
  { value: 'probably-leave-12-months', label: 'I will probably leave within 12 months' },
  { value: 'leaving-within-6-months',  label: 'I am actively planning to leave within 6 months' }
];

// All graded domain keys, in the canonical display order used by the
// grader and the report.
const GRADED_DOMAIN_KEYS = [
  'workload', 'management', 'growth', 'compensation',
  'culture', 'environment', 'recognition', 'overall'
];

export { LIKERT_AGREEMENT, DOMAINS, surveyItems, GRADED_DOMAIN_KEYS, DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS, ROLE_LEVEL_OPTIONS, WORK_LOCATION_OPTIONS, RETENTION_INTENT_OPTIONS };
