// Sample request data for the neurodiversity reasonable-adjustments dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every priority tier (routine / soon / urgent),
// every eligibility band, and every impact / wellbeing band. Includes the
// required worked cases: an autistic software developer needing
// noise-cancelling headphones and a quiet desk; an employee with ADHD needing
// written instructions and flexible hours; and someone awaiting an autism
// assessment at risk of burnout.

/** @type {import('./dashboard-types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'R001',
    requestDate: '2026-05-04',
    worker: 'Okafor, Amara',
    jobTitle: 'Software Developer',
    department: 'Engineering',
    eligibilityBand: 'likely-covered',
    impactBand: 'caution',
    priorityTier: 'soon',
    completenessPercent: 100,
    recommendation: 'signpost-access-to-work',
    manager: 'J Iqbal',
    flags: ['disability-duty-engaged', 'access-to-work-recommended']
  },
  {
    id: 'R002',
    requestDate: '2026-05-05',
    worker: 'Bianchi, Marco',
    jobTitle: 'Account Manager',
    department: 'Sales',
    eligibilityBand: 'likely-covered',
    impactBand: 'caution',
    priorityTier: 'soon',
    completenessPercent: 95,
    recommendation: 'progress-to-meeting',
    manager: 'K Mensah',
    flags: ['disability-duty-engaged']
  },
  {
    id: 'R003',
    requestDate: '2026-05-05',
    worker: 'Novak, Petra',
    jobTitle: 'Data Analyst',
    department: 'Finance',
    eligibilityBand: 'possibly-covered',
    impactBand: 'high-risk',
    priorityTier: 'urgent',
    completenessPercent: 90,
    recommendation: 'seek-occupational-health',
    manager: 'L Romano',
    flags: ['burnout-risk', 'occupational-health-recommended']
  },
  {
    id: 'R004',
    requestDate: '2026-05-06',
    worker: 'Hassan, Layla',
    jobTitle: 'Content Designer',
    department: 'Marketing',
    eligibilityBand: 'possibly-covered',
    impactBand: 'ok',
    priorityTier: 'routine',
    completenessPercent: 85,
    recommendation: 'signpost-access-to-work',
    manager: 'M Adebayo',
    flags: ['access-to-work-recommended']
  },
  {
    id: 'R005',
    requestDate: '2026-05-06',
    worker: 'Connolly, Niamh',
    jobTitle: 'Warehouse Operative',
    department: 'Logistics',
    eligibilityBand: 'possibly-covered',
    impactBand: 'caution',
    priorityTier: 'routine',
    completenessPercent: 80,
    recommendation: 'progress-to-meeting',
    manager: 'H Iqbal',
    flags: []
  },
  {
    id: 'R006',
    requestDate: '2026-05-07',
    worker: 'Silva, Beatriz',
    jobTitle: 'Customer Adviser',
    department: 'Customer Service',
    eligibilityBand: 'likely-covered',
    impactBand: 'ok',
    priorityTier: 'routine',
    completenessPercent: 90,
    recommendation: 'progress-to-meeting',
    manager: 'P Sharma',
    flags: ['disability-duty-engaged']
  },
  {
    id: 'R007',
    requestDate: '2026-05-07',
    worker: 'Andersson, Elin',
    jobTitle: 'Project Coordinator',
    department: 'Operations',
    eligibilityBand: 'unclear',
    impactBand: 'ok',
    priorityTier: 'routine',
    completenessPercent: 40,
    recommendation: 'request-more-detail',
    manager: 'R Ahmed',
    flags: ['missing-adjustments', 'missing-difficulties']
  },
  {
    id: 'R008',
    requestDate: '2026-05-08',
    worker: 'Kowalski, Tomasz',
    jobTitle: 'Support Engineer',
    department: 'IT',
    eligibilityBand: 'likely-covered',
    impactBand: 'high-risk',
    priorityTier: 'urgent',
    completenessPercent: 95,
    recommendation: 'seek-occupational-health',
    manager: 'K Mensah',
    flags: ['disability-duty-engaged', 'burnout-risk', 'occupational-health-recommended']
  },
  {
    id: 'R009',
    requestDate: '2026-05-08',
    worker: 'Muller, Hannah',
    jobTitle: 'HR Assistant',
    department: 'People',
    eligibilityBand: 'possibly-covered',
    impactBand: 'caution',
    priorityTier: 'soon',
    completenessPercent: 75,
    recommendation: 'progress-to-meeting',
    manager: 'L Romano',
    flags: ['no-consent-to-share']
  },
  {
    id: 'R010',
    requestDate: '2026-05-09',
    worker: 'Tanaka, Yuki',
    jobTitle: 'Graduate Trainee',
    department: 'Engineering',
    eligibilityBand: 'possibly-covered',
    impactBand: 'ok',
    priorityTier: 'routine',
    completenessPercent: 85,
    recommendation: 'progress-to-meeting',
    manager: 'M Adebayo',
    flags: []
  }
];

export { sampleRequests };
