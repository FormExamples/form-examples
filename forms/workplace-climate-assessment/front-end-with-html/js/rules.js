// Workplace Climate Assessment — items registry.
//
// Every item is a 1-5 Likert ("agreement" wording: Strongly disagree through
// Strongly agree). Items are positively worded: a higher response is more
// favourable. No reverse-coding is required.
//
// The grader normalises each item to 0-100 by mean × 20 and averages the
// eight graded domain scores into a single composite Workplace Climate
// Index. Categories:
//
//   85-100  thriving    Strong, inclusive, psychologically safe climate
//   70-84   healthy     Generally positive climate with minor growth areas
//   50-69   developing  Mixed climate with several improvement areas
//   25-49   strained    Concerning climate requiring intervention
//    0-24   critical    Severely unhealthy climate requiring urgent action
//
// Step 1 (demographics) captures anonymised banding only and is NOT
// included in the composite. Step 10 contains three Likert items in the
// `overall` domain, an explicit "would you recommend this as a place to
// work" choice, and free-text feedback. Only the eight graded domain
// blocks contribute to the composite.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} SurveyItem
 * @property {string} id            Field id (e.g. 'ld1').
 * @property {string} domain        Domain key (e.g. 'leadership').
 * @property {string} label         Statement text.
 * @property {1 | 5} scaleMin
 * @property {1 | 5} scaleMax
 */

// Wrapped in an IIFE; published via window.WorkplaceClimateAssessment.

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
// captures context only.

const DOMAINS = [
  {
    key: 'leadership',
    title: 'Leadership & Management',
    stepNumber: 2,
    graded: true,
    description:
      'Whether senior leaders and line managers are trustworthy, consistent and supportive.'
  },
  {
    key: 'psychSafety',
    title: 'Psychological Safety',
    stepNumber: 3,
    graded: true,
    description:
      'Whether people can speak up, raise concerns and admit mistakes without fear of being punished or humiliated.'
  },
  {
    key: 'inclusion',
    title: 'Inclusion & Belonging',
    stepNumber: 4,
    graded: true,
    description:
      'Whether everyone is treated with respect, has equal opportunity, and feels they belong.'
  },
  {
    key: 'communication',
    title: 'Communication',
    stepNumber: 5,
    graded: true,
    description:
      'Whether information flows clearly, openly and in time for people to act on it.'
  },
  {
    key: 'collaboration',
    title: 'Collaboration & Teamwork',
    stepNumber: 6,
    graded: true,
    description:
      'Whether teams cooperate effectively across boundaries and resolve conflict constructively.'
  },
  {
    key: 'recognition',
    title: 'Recognition & Reward',
    stepNumber: 7,
    graded: true,
    description:
      'Whether good work is noticed, appreciated and rewarded fairly.'
  },
  {
    key: 'wellbeing',
    title: 'Wellbeing',
    stepNumber: 8,
    graded: true,
    description:
      'Whether the workload, hours and culture support physical and mental wellbeing.'
  },
  {
    key: 'career',
    title: 'Career Development',
    stepNumber: 9,
    graded: true,
    description:
      'Whether there are meaningful opportunities to learn, grow and progress.'
  },
  {
    key: 'overall',
    title: 'Overall Climate & Recommendations',
    stepNumber: 10,
    graded: false,
    description:
      'Your overall view of the climate at this organisation, plus optional free-text suggestions for what to keep and what to change.'
  }
];

// ---------------------------------------------------------------------
// Items (Likert 1-5; positively worded)
// ---------------------------------------------------------------------

/** @type {SurveyItem[]} */
const surveyItems = [
  // -------- Leadership & Management (5 items) -----------------------
  { id: 'ld1', domain: 'leadership', scaleMin: 1, scaleMax: 5,
    label: 'I trust the senior leadership of this organisation.' },
  { id: 'ld2', domain: 'leadership', scaleMin: 1, scaleMax: 5,
    label: 'My line manager treats me with respect.' },
  { id: 'ld3', domain: 'leadership', scaleMin: 1, scaleMax: 5,
    label: 'Leaders make decisions that are consistent with the organisation\u2019s stated values.' },
  { id: 'ld4', domain: 'leadership', scaleMin: 1, scaleMax: 5,
    label: 'My line manager supports my professional growth.' },
  { id: 'ld5', domain: 'leadership', scaleMin: 1, scaleMax: 5,
    label: 'Leadership communicates a clear direction for the organisation.' },

  // -------- Psychological Safety (5 items) --------------------------
  { id: 'ps1', domain: 'psychSafety', scaleMin: 1, scaleMax: 5,
    label: 'I can raise difficult issues at work without fear of negative consequences.' },
  { id: 'ps2', domain: 'psychSafety', scaleMin: 1, scaleMax: 5,
    label: 'I can admit a mistake here without being humiliated or punished.' },
  { id: 'ps3', domain: 'psychSafety', scaleMin: 1, scaleMax: 5,
    label: 'My colleagues respect different opinions, including disagreement.' },
  { id: 'ps4', domain: 'psychSafety', scaleMin: 1, scaleMax: 5,
    label: 'When I raise a concern, it is taken seriously.' },
  { id: 'ps5', domain: 'psychSafety', scaleMin: 1, scaleMax: 5,
    label: 'I feel safe being myself at work.' },

  // -------- Inclusion & Belonging (5 items) -------------------------
  { id: 'in1', domain: 'inclusion', scaleMin: 1, scaleMax: 5,
    label: 'People from all backgrounds are treated fairly here.' },
  { id: 'in2', domain: 'inclusion', scaleMin: 1, scaleMax: 5,
    label: 'I feel a genuine sense of belonging at this organisation.' },
  { id: 'in3', domain: 'inclusion', scaleMin: 1, scaleMax: 5,
    label: 'My voice is heard and considered, regardless of my role or background.' },
  { id: 'in4', domain: 'inclusion', scaleMin: 1, scaleMax: 5,
    label: 'Inappropriate or disrespectful behaviour is addressed promptly when it occurs.' },
  { id: 'in5', domain: 'inclusion', scaleMin: 1, scaleMax: 5,
    label: 'Hiring, development and promotion decisions are made fairly.' },

  // -------- Communication (4 items) ---------------------------------
  { id: 'co1', domain: 'communication', scaleMin: 1, scaleMax: 5,
    label: 'Important information reaches me in time for me to act on it.' },
  { id: 'co2', domain: 'communication', scaleMin: 1, scaleMax: 5,
    label: 'Decisions made by leadership are communicated openly and honestly.' },
  { id: 'co3', domain: 'communication', scaleMin: 1, scaleMax: 5,
    label: 'My line manager keeps me informed about things that affect my work.' },
  { id: 'co4', domain: 'communication', scaleMin: 1, scaleMax: 5,
    label: 'Two-way communication is encouraged here, not just top-down announcements.' },

  // -------- Collaboration & Teamwork (4 items) ----------------------
  { id: 'cl1', domain: 'collaboration', scaleMin: 1, scaleMax: 5,
    label: 'My colleagues collaborate well with each other.' },
  { id: 'cl2', domain: 'collaboration', scaleMin: 1, scaleMax: 5,
    label: 'Teams across the organisation cooperate effectively.' },
  { id: 'cl3', domain: 'collaboration', scaleMin: 1, scaleMax: 5,
    label: 'Conflict is handled constructively when it arises.' },
  { id: 'cl4', domain: 'collaboration', scaleMin: 1, scaleMax: 5,
    label: 'People here are willing to help each other when needed.' },

  // -------- Recognition & Reward (4 items) --------------------------
  { id: 're1', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'I receive meaningful recognition when I do good work.' },
  { id: 're2', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'Pay decisions in this organisation are made fairly.' },
  { id: 're3', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'High performers are recognised and rewarded appropriately.' },
  { id: 're4', domain: 'recognition', scaleMin: 1, scaleMax: 5,
    label: 'My contributions are valued by my team and manager.' },

  // -------- Wellbeing (5 items) -------------------------------------
  { id: 'we1', domain: 'wellbeing', scaleMin: 1, scaleMax: 5,
    label: 'My workload is manageable.' },
  { id: 'we2', domain: 'wellbeing', scaleMin: 1, scaleMax: 5,
    label: 'I am able to maintain a healthy balance between work and my personal life.' },
  { id: 'we3', domain: 'wellbeing', scaleMin: 1, scaleMax: 5,
    label: 'I rarely feel exhausted or burnt out at the end of the working week.' },
  { id: 'we4', domain: 'wellbeing', scaleMin: 1, scaleMax: 5,
    label: 'This organisation actively supports employee mental health.' },
  { id: 'we5', domain: 'wellbeing', scaleMin: 1, scaleMax: 5,
    label: 'I am able to take time off when I need it.' },

  // -------- Career Development (4 items) ----------------------------
  { id: 'ca1', domain: 'career', scaleMin: 1, scaleMax: 5,
    label: 'I have meaningful opportunities to learn new skills here.' },
  { id: 'ca2', domain: 'career', scaleMin: 1, scaleMax: 5,
    label: 'I see a clear path for career progression.' },
  { id: 'ca3', domain: 'career', scaleMin: 1, scaleMax: 5,
    label: 'My manager actively supports my professional development.' },
  { id: 'ca4', domain: 'career', scaleMin: 1, scaleMax: 5,
    label: 'Training and development resources are available when I need them.' },

  // -------- Overall Climate (3 Likert items, NOT graded) ------------
  // These items are stored on the `overall` section and surfaced in the
  // report, but they do NOT contribute to the eight graded domain
  // composite. They are kept here so the wizard can render them with
  // the same `likertGroup` builder.
  { id: 'oc1', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'Overall, the climate at this organisation is positive.' },
  { id: 'oc2', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'I would recommend this organisation as a great place to work.' },
  { id: 'oc3', domain: 'overall', scaleMin: 1, scaleMax: 5,
    label: 'This organisation lives the values it says it stands for.' }
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
  { value: 'part-time-20-to-34',  label: 'Part-time (20\u201334 hours / week)' },
  { value: 'full-time-35-to-44',  label: 'Full-time (35\u201344 hours / week)' },
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

const RECOMMEND_OPTIONS = [
  { value: 'definitely',     label: 'Definitely yes' },
  { value: 'probably',       label: 'Probably yes' },
  { value: 'unsure',         label: 'Unsure' },
  { value: 'probably-not',   label: 'Probably not' },
  { value: 'definitely-not', label: 'Definitely not' }
];

// All graded domain keys, in the canonical display order used by the
// grader and the report.
const GRADED_DOMAIN_KEYS = [
  'leadership', 'psychSafety', 'inclusion', 'communication',
  'collaboration', 'recognition', 'wellbeing', 'career'
];

export { LIKERT_AGREEMENT, DOMAINS, surveyItems, GRADED_DOMAIN_KEYS, DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS, ROLE_LEVEL_OPTIONS, WORK_LOCATION_OPTIONS, RECOMMEND_OPTIONS };
