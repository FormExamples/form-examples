// Sample responder data for the management dashboard.
//
// Twelve realistic rows: spans every readiness level, every competency
// level, a mix of roles (paramedic, advanced paramedic, EMT, community
// first responder, first aider, lifeguard, military medic), training
// currency states, and recent / lapsed last-call-out dates. Used as the
// sample-data fallback when the backend is offline.

/** @type {import('./types.js').ResponderRow[]} */
const sampleResponders = [
  {
    id: '1',
    registrationNumber: 'PA12345',
    responderName: 'Smith, Jane',
    roleType: 'Paramedic',
    competencyLevel: 'Competent',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-04-28',
    yearsOfService: 8
  },
  {
    id: '2',
    registrationNumber: 'PA20871',
    responderName: 'Patel, Priya',
    roleType: 'Advanced Paramedic',
    competencyLevel: 'Expert',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-05-02',
    yearsOfService: 14
  },
  {
    id: '3',
    registrationNumber: 'EMT5572',
    responderName: 'Jones, Margaret',
    roleType: 'EMT',
    competencyLevel: 'Developing',
    readinessLevel: 'Fit with Restrictions',
    trainingStatus: 'Due Soon',
    lastCallOutDate: '2026-04-15',
    yearsOfService: 2
  },
  {
    id: '4',
    registrationNumber: 'PA34980',
    responderName: 'Williams, David',
    roleType: 'Paramedic',
    competencyLevel: 'Competent',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-04-30',
    yearsOfService: 6
  },
  {
    id: '5',
    registrationNumber: 'CFR0918',
    responderName: 'Brown, Sarah',
    roleType: 'Community First Responder',
    competencyLevel: 'Not Competent',
    readinessLevel: 'Temporarily Unfit',
    trainingStatus: 'Overdue',
    lastCallOutDate: '2025-11-12',
    yearsOfService: 1
  },
  {
    id: '6',
    registrationNumber: 'PA47213',
    responderName: 'Taylor, James',
    roleType: 'Paramedic',
    competencyLevel: 'Expert',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-05-03',
    yearsOfService: 12
  },
  {
    id: '7',
    registrationNumber: 'MIL2208',
    responderName: 'Davies, Helen',
    roleType: 'Military Medic',
    competencyLevel: 'Not Competent',
    readinessLevel: 'Permanently Unfit',
    trainingStatus: 'Overdue',
    lastCallOutDate: '2025-08-04',
    yearsOfService: 9
  },
  {
    id: '8',
    registrationNumber: 'EMT6741',
    responderName: 'Wilson, Robert',
    roleType: 'EMT',
    competencyLevel: 'Competent',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-04-26',
    yearsOfService: 5
  },
  {
    id: '9',
    registrationNumber: 'LG10342',
    responderName: 'Evans, Catherine',
    roleType: 'Lifeguard',
    competencyLevel: 'Developing',
    readinessLevel: 'Fit with Restrictions',
    trainingStatus: 'Due Soon',
    lastCallOutDate: '2026-04-18',
    yearsOfService: 3
  },
  {
    id: '10',
    registrationNumber: 'FA88114',
    responderName: 'Thomas, Michael',
    roleType: 'First Aider',
    competencyLevel: 'Competent',
    readinessLevel: 'Fit for Duty',
    trainingStatus: 'Current',
    lastCallOutDate: '2026-04-22',
    yearsOfService: 4
  },
  {
    id: '11',
    registrationNumber: 'CFR1457',
    responderName: 'Robinson, Emma',
    roleType: 'Community First Responder',
    competencyLevel: 'Developing',
    readinessLevel: 'Fit with Restrictions',
    trainingStatus: 'Due Soon',
    lastCallOutDate: '2026-04-09',
    yearsOfService: 2
  },
  {
    id: '12',
    registrationNumber: 'PA50328',
    responderName: 'Clark, George',
    roleType: 'Paramedic',
    competencyLevel: 'Not Competent',
    readinessLevel: 'Temporarily Unfit',
    trainingStatus: 'Overdue',
    lastCallOutDate: '2025-12-19',
    yearsOfService: 7
  }
];

export { sampleResponders };
