// Sample evaluation rows for the dashboard, used when no back-end is
// configured so the route is usable standalone.
//
// Twelve rows spanning every LOCS III severity band and every computed
// surgical-candidacy recommendation, including a paediatric and an
// urgent-referral case. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form; names are invented. The same set backs the
// HTML dashboard, so the two front-ends show identical data.

import type { EvaluationRow } from '#lib/engine/types.js';

export const sampleEvaluations: EvaluationRow[] = [
	{
		id: 'CE001',
		assessmentDate: '2026-06-02',
		patient: 'Okonkwo, Ngozi',
		nhs: '501 234 5678',
		locsIIISeverityRight: 'mild',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'not-indicated',
		finalSurgicalCandidacy: 'not-indicated',
		clinician: 'A Bhatt (Optometrist)',
		flags: []
	},
	{
		id: 'CE002',
		assessmentDate: '2026-06-02',
		patient: 'Lindqvist, Marit',
		nhs: '502 345 6789',
		locsIIISeverityRight: 'moderate',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'consider',
		finalSurgicalCandidacy: 'consider',
		clinician: 'A Bhatt (Optometrist)',
		flags: []
	},
	{
		id: 'CE003',
		assessmentDate: '2026-06-03',
		patient: 'Adeyemi, Tunde',
		nhs: '503 456 7890',
		locsIIISeverityRight: 'severe',
		locsIIISeverityLeft: 'severe',
		computedSurgicalCandidacy: 'urgent-referral',
		finalSurgicalCandidacy: 'urgent-referral',
		clinician: 'S Whitfield (Ophthalmologist)',
		flags: ['raised-iop', 'rapid-progression']
	},
	{
		id: 'CE004',
		assessmentDate: '2026-06-04',
		patient: 'Petrova, Yelena',
		nhs: '504 567 8901',
		locsIIISeverityRight: 'moderate',
		locsIIISeverityLeft: 'moderate',
		computedSurgicalCandidacy: 'consider',
		finalSurgicalCandidacy: 'consider',
		clinician: 'S Whitfield (Ophthalmologist)',
		flags: []
	},
	{
		id: 'CE005',
		assessmentDate: '2026-06-05',
		patient: 'Kowalski, Bartosz',
		nhs: '505 678 9012',
		locsIIISeverityRight: 'mild',
		locsIIISeverityLeft: 'moderate',
		computedSurgicalCandidacy: 'urgent-referral',
		finalSurgicalCandidacy: 'urgent-referral',
		clinician: 'M Osei (Optometrist)',
		flags: ['competing-pathology-suspected']
	},
	{
		id: 'CE006',
		assessmentDate: '2026-06-08',
		patient: 'Ferreira, Ines',
		nhs: '506 789 0123',
		locsIIISeverityRight: 'severe',
		locsIIISeverityLeft: 'moderate',
		computedSurgicalCandidacy: 'indicated',
		finalSurgicalCandidacy: 'indicated',
		clinician: 'M Osei (Optometrist)',
		flags: ['biometry-incomplete-for-surgical-planning']
	},
	{
		id: 'CE007',
		assessmentDate: '2026-06-09',
		patient: 'Haddad, Rania',
		nhs: '507 890 1234',
		locsIIISeverityRight: 'mild',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'not-indicated',
		finalSurgicalCandidacy: 'consider',
		clinician: 'A Bhatt (Optometrist)',
		flags: []
	},
	{
		id: 'CE008',
		assessmentDate: '2026-06-10',
		patient: 'Novotny, Pavel',
		nhs: '508 901 2345',
		locsIIISeverityRight: 'moderate',
		locsIIISeverityLeft: 'severe',
		computedSurgicalCandidacy: 'indicated',
		finalSurgicalCandidacy: 'indicated',
		clinician: 'S Whitfield (Ophthalmologist)',
		flags: []
	},
	{
		id: 'CE009',
		assessmentDate: '2026-06-11',
		patient: 'Mbeki, Thandiwe',
		nhs: '509 012 3456',
		locsIIISeverityRight: '',
		locsIIISeverityLeft: '',
		computedSurgicalCandidacy: 'not-indicated',
		finalSurgicalCandidacy: 'not-indicated',
		clinician: 'M Osei (Optometrist)',
		flags: []
	},
	{
		id: 'CE010',
		assessmentDate: '2026-06-12',
		patient: 'Sørensen, Kasper',
		nhs: '510 123 4567',
		locsIIISeverityRight: 'severe',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'indicated',
		finalSurgicalCandidacy: 'indicated',
		clinician: 'A Bhatt (Optometrist)',
		flags: ['view-obscured-fundus-not-assessed']
	},
	{
		id: 'CE011',
		assessmentDate: '2026-06-15',
		patient: 'Yamamoto, Aiko',
		nhs: '511 234 5678',
		locsIIISeverityRight: 'moderate',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'consider',
		finalSurgicalCandidacy: 'consider',
		clinician: 'S Whitfield (Ophthalmologist)',
		flags: []
	},
	{
		id: 'CE012',
		assessmentDate: '2026-06-16',
		patient: 'Grimaldi, Luca',
		nhs: '512 345 6789',
		locsIIISeverityRight: 'mild',
		locsIIISeverityLeft: 'mild',
		computedSurgicalCandidacy: 'urgent-referral',
		finalSurgicalCandidacy: 'urgent-referral',
		clinician: 'M Osei (Optometrist)',
		flags: ['paediatric']
	}
];
