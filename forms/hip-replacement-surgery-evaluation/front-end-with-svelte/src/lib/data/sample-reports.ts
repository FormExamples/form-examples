// Sample evaluation rows for the dashboard, used when no back-end is
// configured so the route is usable standalone.
//
// Twelve rows spanning every OHS category band and every surgical-candidacy
// recommendation. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form; names are invented. The same set backs the
// HTML dashboard, so the two front-ends show identical data.

import type { EvaluationRow } from '$lib/engine/types';

export const sampleEvaluations: EvaluationRow[] = [
	{
		id: 'HR001',
		assessmentDate: '2026-06-02',
		patient: 'Okonkwo, Ngozi',
		nhs: '501 234 5678',
		bmi: 24.8,
		ohsTotal: 12,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 4,
		candidacy: 'strong-candidate',
		clinician: 'Mr A Bhatt FRCS (Orth)',
		flags: []
	},
	{
		id: 'HR002',
		assessmentDate: '2026-06-02',
		patient: 'Lindqvist, Marit',
		nhs: '502 345 6789',
		bmi: 41.2,
		ohsTotal: 18,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 3,
		candidacy: 'strong-candidate',
		clinician: 'Mr A Bhatt FRCS (Orth)',
		flags: ['high-bmi-surgical-risk']
	},
	{
		id: 'HR003',
		assessmentDate: '2026-06-03',
		patient: 'Adeyemi, Tunde',
		nhs: '503 456 7890',
		bmi: 27.6,
		ohsTotal: 25,
		ohsCategory: 'moderate',
		kellgrenLawrenceGrade: 2,
		candidacy: 'candidate',
		clinician: 'Ms S Whitfield ESP',
		flags: ['trendelenburg-positive']
	},
	{
		id: 'HR004',
		assessmentDate: '2026-06-04',
		patient: 'Petrova, Yelena',
		nhs: '504 567 8901',
		bmi: 22.1,
		ohsTotal: 33,
		ohsCategory: 'mild-to-moderate',
		kellgrenLawrenceGrade: 2,
		candidacy: 'continue-conservative',
		clinician: 'Ms S Whitfield ESP',
		flags: ['conservative-treatment-not-exhausted']
	},
	{
		id: 'HR005',
		assessmentDate: '2026-06-05',
		patient: 'Kowalski, Bartosz',
		nhs: '505 678 9012',
		bmi: 29.4,
		ohsTotal: 44,
		ohsCategory: 'satisfactory',
		kellgrenLawrenceGrade: 1,
		candidacy: 'not-indicated',
		clinician: 'Mr M Osei FRCS (Orth)',
		flags: []
	},
	{
		id: 'HR006',
		assessmentDate: '2026-06-08',
		patient: 'Ferreira, Ines',
		nhs: '506 789 0123',
		bmi: 26.3,
		ohsTotal: 21,
		ohsCategory: 'moderate',
		kellgrenLawrenceGrade: null,
		candidacy: 'mdt-review',
		clinician: 'Mr M Osei FRCS (Orth)',
		flags: []
	},
	{
		id: 'HR007',
		assessmentDate: '2026-06-09',
		patient: 'Haddad, Rania',
		nhs: '507 890 1234',
		bmi: 23.0,
		ohsTotal: 9,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 4,
		candidacy: 'strong-candidate',
		clinician: 'Mr A Bhatt FRCS (Orth)',
		flags: ['leg-length-discrepancy-significant', 'pre-op-bloods-incomplete']
	},
	{
		id: 'HR008',
		assessmentDate: '2026-06-10',
		patient: 'Novotny, Pavel',
		nhs: '508 901 2345',
		bmi: 31.5,
		ohsTotal: 28,
		ohsCategory: 'moderate',
		kellgrenLawrenceGrade: 3,
		candidacy: 'candidate',
		clinician: 'Ms S Whitfield ESP',
		flags: ['bilateral-symptomatic']
	},
	{
		id: 'HR009',
		assessmentDate: '2026-06-11',
		patient: 'Mbeki, Thandiwe',
		nhs: '509 012 3456',
		bmi: 24.2,
		ohsTotal: 14,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 3,
		candidacy: 'continue-conservative',
		clinician: 'Mr M Osei FRCS (Orth)',
		flags: ['conservative-treatment-not-exhausted']
	},
	{
		id: 'HR010',
		assessmentDate: '2026-06-12',
		patient: 'Sørensen, Kasper',
		nhs: '510 123 4567',
		bmi: 22.9,
		ohsTotal: 6,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 4,
		candidacy: 'strong-candidate',
		clinician: 'Mr A Bhatt FRCS (Orth)',
		flags: []
	},
	{
		id: 'HR011',
		assessmentDate: '2026-06-15',
		patient: 'Yamamoto, Aiko',
		nhs: '511 234 5678',
		bmi: 20.6,
		ohsTotal: 30,
		ohsCategory: 'mild-to-moderate',
		kellgrenLawrenceGrade: 2,
		candidacy: 'candidate',
		clinician: 'Ms S Whitfield ESP',
		flags: []
	},
	{
		id: 'HR012',
		assessmentDate: '2026-06-16',
		patient: 'Grimaldi, Luca',
		nhs: '512 345 6789',
		bmi: 19.2,
		ohsTotal: 11,
		ohsCategory: 'severe',
		kellgrenLawrenceGrade: 4,
		candidacy: 'strong-candidate',
		clinician: 'Mr M Osei FRCS (Orth)',
		flags: ['paediatric']
	}
];
