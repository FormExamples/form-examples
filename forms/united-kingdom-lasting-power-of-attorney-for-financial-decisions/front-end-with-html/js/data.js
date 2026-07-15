// Sample dashboard data for the UK LP1F case dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Six realistic LP1F cases spanning every validity band and composite-risk
// level. Each row's validityBand / compositeRisk / firedRuleIds / flagIds were
// produced by running the shared validation engine (js/{rules,flags,grader}.js)
// over the corresponding LPA — identical to the SvelteKit dashboard's
// sampleLpaRows — so the two stacks stay byte-for-byte aligned.

/** @type {import('./dashboard-types.js').DashboardRow[]} */
const sampleRows = [
  {
    id: 'lpa-0001',
    donorName: 'Mrs Margaret Thompson',
    attorneyCount: 0,
    decisionMode: '',
    whenAttorneysCanAct: '',
    replacementAttorneyCount: 0,
    peopleToNotifyCount: 0,
    validityBand: 'draft',
    compositeRisk: 'critical',
    opgStatus: 'draft',
    opgReferenceNumber: '',
    createdAt: '2026-05-10',
    firedRuleIds: ['NoAttorneyAppointed'],
    flagIds: ['NoPeopleToNotify', 'PreferencesEmpty', 'EmergencyContactMissing']
  },
  {
    id: 'lpa-0002',
    donorName: 'Mr David Walker',
    attorneyCount: 1,
    decisionMode: 'single_attorney',
    whenAttorneysCanAct: 'as_soon_as_registered',
    replacementAttorneyCount: 0,
    peopleToNotifyCount: 0,
    validityBand: 'ready_for_signing',
    compositeRisk: 'moderate',
    opgStatus: 'ready_for_signing',
    opgReferenceNumber: '',
    createdAt: '2026-04-22',
    firedRuleIds: [],
    flagIds: ['SingleAttorneyNoReplacement', 'NoPeopleToNotify', 'EmergencyContactMissing']
  },
  {
    id: 'lpa-0003',
    donorName: 'Mr James Pemberton',
    attorneyCount: 2,
    decisionMode: 'jointly_and_severally',
    whenAttorneysCanAct: 'as_soon_as_registered',
    replacementAttorneyCount: 1,
    peopleToNotifyCount: 3,
    validityBand: 'registered',
    compositeRisk: 'critical',
    opgStatus: 'registered',
    opgReferenceNumber: 'OPG-2026-77412189',
    createdAt: '2026-03-15',
    firedRuleIds: ['DonorMustHaveCapacity'],
    flagIds: ['PreferencesEmpty', 'EmergencyContactMissing']
  },
  {
    id: 'lpa-0004',
    donorName: 'Mr Peter Llewellyn',
    attorneyCount: 1,
    decisionMode: 'single_attorney',
    whenAttorneysCanAct: 'as_soon_as_registered',
    replacementAttorneyCount: 0,
    peopleToNotifyCount: 0,
    validityBand: 'draft',
    compositeRisk: 'critical',
    opgStatus: 'draft',
    opgReferenceNumber: '',
    createdAt: '2026-05-01',
    firedRuleIds: ['AttorneyUnderEighteen'],
    flagIds: ['SingleAttorneyNoReplacement', 'NoPeopleToNotify', 'PreferencesEmpty', 'AttorneyEmailMissing', 'EmergencyContactMissing']
  },
  {
    id: 'lpa-0005',
    donorName: 'Mrs Elizabeth Forsyth',
    attorneyCount: 2,
    decisionMode: 'jointly',
    whenAttorneysCanAct: 'only_when_no_capacity',
    replacementAttorneyCount: 0,
    peopleToNotifyCount: 0,
    validityBand: 'ready_for_signing',
    compositeRisk: 'critical',
    opgStatus: 'ready_for_signing',
    opgReferenceNumber: '',
    createdAt: '2026-04-29',
    firedRuleIds: ['JointlyButNoReplacement'],
    flagIds: ['OnlyWhenNoCapacitySelected', 'NoPeopleToNotify', 'PreferencesEmpty', 'EmergencyContactMissing']
  },
  {
    id: 'lpa-0006',
    donorName: 'Mr Frank Doherty',
    attorneyCount: 2,
    decisionMode: 'jointly_and_severally',
    whenAttorneysCanAct: 'as_soon_as_registered',
    replacementAttorneyCount: 1,
    peopleToNotifyCount: 1,
    validityBand: 'submitted',
    compositeRisk: 'critical',
    opgStatus: 'submitted',
    opgReferenceNumber: '',
    createdAt: '2026-02-18',
    firedRuleIds: ['DonorMustHaveCapacity'],
    flagIds: ['ReducedFeeWithoutLPA120A', 'PreferencesEmpty', 'EmergencyContactMissing']
  }
];

export { sampleRows };
