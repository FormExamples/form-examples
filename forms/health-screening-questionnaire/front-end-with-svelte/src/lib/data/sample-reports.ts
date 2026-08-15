// Sample questionnaire rows for the dashboard, used when no back-end is
// configured so the route is usable standalone.
//
// Eight rows spanning every risk band, both PAR-Q+ clearance states, and
// every AUDIT-C band. Identifiers are invented placeholder values; names are
// invented. The same set backs the HTML dashboard, so the two front-ends show
// identical data.

import type { QuestionnaireRow } from '#lib/engine/types.js';

export const sampleQuestionnaires: QuestionnaireRow[] = [
	{
		id: 'HSQ001',
		assessmentDate: '2026-06-02',
		patient: 'Okonkwo, Ngozi',
		identifier: '501 234 5678',
		screeningPurpose: 'routine-public-health',
		parqPlusClearance: 'cleared',
		auditCScore: 1,
		auditCBand: 'low',
		riskBand: 'low',
		recommendation: 'clear-to-proceed',
		assessor: 'Dr A Okafor',
		flags: []
	},
	{
		id: 'HSQ002',
		assessmentDate: '2026-06-02',
		patient: 'Lindqvist, Marit',
		identifier: '502 345 6789',
		screeningPurpose: 'physical-activity-readiness',
		parqPlusClearance: 'further-assessment-required',
		auditCScore: 3,
		auditCBand: 'low',
		riskBand: 'moderate',
		recommendation: 'routine-review',
		assessor: 'J Marsh (personal trainer)',
		flags: ['parq-positive-medical-clearance-needed']
	},
	{
		id: 'HSQ003',
		assessmentDate: '2026-06-03',
		patient: 'Adeyemi, Tunde',
		identifier: '503 456 7890',
		screeningPurpose: 'occupational-pre-placement',
		parqPlusClearance: 'cleared',
		auditCScore: 6,
		auditCBand: 'increasing-risk',
		riskBand: 'moderate',
		recommendation: 'routine-review',
		assessor: 'R Singh (occupational health nurse)',
		flags: []
	},
	{
		id: 'HSQ004',
		assessmentDate: '2026-06-04',
		patient: 'Novak, Petra',
		identifier: 'EMP-88213',
		screeningPurpose: 'occupational-pre-placement',
		parqPlusClearance: 'cleared',
		auditCScore: null,
		auditCBand: '',
		riskBand: 'low',
		recommendation: 'clear-to-proceed',
		assessor: 'R Singh (occupational health nurse)',
		flags: []
	},
	{
		id: 'HSQ005',
		assessmentDate: '2026-06-04',
		patient: 'Osei, Kwame',
		identifier: '505 678 9012',
		screeningPurpose: 'perioperative-referral',
		parqPlusClearance: 'further-assessment-required',
		auditCScore: 9,
		auditCBand: 'higher-risk',
		riskBand: 'high',
		recommendation: 'gp-review-required',
		assessor: 'Dr A Okafor',
		flags: ['alcohol-higher-risk', 'parq-positive-medical-clearance-needed']
	},
	{
		id: 'HSQ006',
		assessmentDate: '2026-06-05',
		patient: 'Byrne, Siobhan',
		identifier: '506 789 0123',
		screeningPurpose: 'routine-public-health',
		parqPlusClearance: 'cleared',
		auditCScore: 2,
		auditCBand: 'low',
		riskBand: 'refer-urgently',
		recommendation: 'refer-urgently',
		assessor: 'Dr A Okafor',
		flags: ['urgent-cardiac-symptom']
	},
	{
		id: 'HSQ007',
		assessmentDate: '2026-06-06',
		patient: 'Kowalski, Jan',
		identifier: '508 901 2345',
		screeningPurpose: 'physical-activity-readiness',
		parqPlusClearance: 'cleared',
		auditCScore: 0,
		auditCBand: 'low',
		riskBand: 'high',
		recommendation: 'gp-review-required',
		assessor: 'J Marsh (personal trainer)',
		flags: ['family-history-premature-cardiac-event']
	},
	{
		id: 'HSQ008',
		assessmentDate: '2026-06-06',
		patient: 'Patel, Ishaan',
		identifier: '509 012 3456',
		screeningPurpose: 'routine-public-health',
		parqPlusClearance: '',
		auditCScore: null,
		auditCBand: '',
		riskBand: '',
		recommendation: 'paediatric-pathway',
		assessor: 'Dr A Okafor',
		flags: ['paediatric']
	}
];
