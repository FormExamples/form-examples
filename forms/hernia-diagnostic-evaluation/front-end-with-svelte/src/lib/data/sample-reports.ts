// Sample evaluation rows for the dashboard, used when no back-end is
// configured so the route is usable standalone.
//
// Twelve rows spanning every urgency band, every hernia type, and every
// reducibility status. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form; names are invented. The same set backs the
// HTML dashboard, so the two front-ends show identical data.

import type { EvaluationRow } from '$lib/engine/types';

export const sampleEvaluations: EvaluationRow[] = [
	{
		id: 'HE001',
		assessmentDate: '2026-06-02',
		patient: 'Okonkwo, Ngozi',
		nhs: '501 234 5678',
		herniaType: 'inguinal',
		reducibilityStatus: 'reducible',
		computedUrgency: 'routine',
		finalUrgency: 'routine',
		recommendation: 'watchful-waiting',
		clinician: 'A Bhatt GP',
		flags: []
	},
	{
		id: 'HE002',
		assessmentDate: '2026-06-02',
		patient: 'Lindqvist, Marit',
		nhs: '502 345 6789',
		herniaType: 'umbilical',
		reducibilityStatus: 'reducible',
		computedUrgency: 'soon',
		finalUrgency: 'soon',
		recommendation: 'elective-repair-referral',
		clinician: 'A Bhatt GP',
		flags: []
	},
	{
		id: 'HE003',
		assessmentDate: '2026-06-03',
		patient: 'Adeyemi, Tunde',
		nhs: '503 456 7890',
		herniaType: 'inguinal',
		reducibilityStatus: 'incarcerated',
		computedUrgency: 'emergency',
		finalUrgency: 'emergency',
		recommendation: 'emergency-referral',
		clinician: 'S Whitfield surgical registrar',
		flags: ['strangulation-suspected', 'emergency-surgical-referral']
	},
	{
		id: 'HE004',
		assessmentDate: '2026-06-04',
		patient: 'Petrova, Yelena',
		nhs: '504 567 8901',
		herniaType: 'femoral',
		reducibilityStatus: 'irreducible',
		computedUrgency: 'urgent',
		finalUrgency: 'urgent',
		recommendation: 'urgent-referral',
		clinician: 'S Whitfield surgical registrar',
		flags: ['incarceration-risk']
	},
	{
		id: 'HE005',
		assessmentDate: '2026-06-05',
		patient: 'Kowalski, Bartosz',
		nhs: '505 678 9012',
		herniaType: 'inguinal',
		reducibilityStatus: 'reducible',
		computedUrgency: 'routine',
		finalUrgency: 'soon',
		recommendation: 'elective-repair-referral',
		clinician: 'M Osei general surgeon',
		flags: ['recurrent-hernia']
	},
	{
		id: 'HE006',
		assessmentDate: '2026-06-08',
		patient: 'Ferreira, Ines',
		nhs: '506 789 0123',
		herniaType: 'incisional',
		reducibilityStatus: 'reducible',
		computedUrgency: 'soon',
		finalUrgency: 'soon',
		recommendation: 'elective-repair-referral',
		clinician: 'M Osei general surgeon',
		flags: []
	},
	{
		id: 'HE007',
		assessmentDate: '2026-06-09',
		patient: 'Haddad, Rania',
		nhs: '507 890 1234',
		herniaType: 'epigastric',
		reducibilityStatus: 'reducible',
		computedUrgency: 'routine',
		finalUrgency: 'routine',
		recommendation: 'watchful-waiting',
		clinician: 'A Bhatt GP',
		flags: []
	},
	{
		id: 'HE008',
		assessmentDate: '2026-06-10',
		patient: 'Novotny, Pavel',
		nhs: '508 901 2345',
		herniaType: 'inguinal',
		reducibilityStatus: 'reducible',
		computedUrgency: 'routine',
		finalUrgency: 'routine',
		recommendation: 'watchful-waiting',
		clinician: 'S Whitfield surgical registrar',
		flags: ['occult-hernia-suspected']
	},
	{
		id: 'HE009',
		assessmentDate: '2026-06-11',
		patient: 'Mbeki, Thandiwe',
		nhs: '509 012 3456',
		herniaType: 'paraumbilical',
		reducibilityStatus: 'reducible',
		computedUrgency: 'soon',
		finalUrgency: 'soon',
		recommendation: 'elective-repair-referral',
		clinician: 'M Osei general surgeon',
		flags: ['pregnancy']
	},
	{
		id: 'HE010',
		assessmentDate: '2026-06-12',
		patient: 'Sørensen, Kasper',
		nhs: '510 123 4567',
		herniaType: 'inguinal',
		reducibilityStatus: 'irreducible',
		computedUrgency: 'urgent',
		finalUrgency: 'urgent',
		recommendation: 'urgent-referral',
		clinician: 'A Bhatt GP',
		flags: ['incarceration-risk']
	},
	{
		id: 'HE011',
		assessmentDate: '2026-06-15',
		patient: 'Yamamoto, Aiko',
		nhs: '511 234 5678',
		herniaType: 'inguinal',
		reducibilityStatus: 'reducible',
		computedUrgency: 'routine',
		finalUrgency: 'routine',
		recommendation: 'watchful-waiting',
		clinician: 'S Whitfield surgical registrar',
		flags: []
	},
	{
		id: 'HE012',
		assessmentDate: '2026-06-16',
		patient: 'Grimaldi, Luca',
		nhs: '512 345 6789',
		herniaType: 'inguinal',
		reducibilityStatus: 'incarcerated',
		computedUrgency: 'emergency',
		finalUrgency: 'emergency',
		recommendation: 'emergency-referral',
		clinician: 'M Osei general surgeon',
		flags: ['strangulation-suspected', 'emergency-surgical-referral', 'paediatric']
	}
];
