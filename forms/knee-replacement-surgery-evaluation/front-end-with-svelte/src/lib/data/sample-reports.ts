// Sample evaluation rows for the dashboard, used when no back-end is
// configured so the route is usable standalone.
//
// Twelve rows spanning every OKS category, every candidacy recommendation,
// and every knee side. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form; names are invented. The same set backs the
// HTML dashboard, so the two front-ends show identical data.

import type { EvaluationRow } from '$lib/engine/types';

export const sampleEvaluations: EvaluationRow[] = [
	{
		id: 'KRSE001',
		assessmentDate: '2026-06-02',
		patient: 'Okonkwo, Ngozi',
		nhs: '501 234 5678',
		kneeSide: 'right',
		oksTotal: 14,
		oksCategory: 'severe',
		candidacy: 'strong-candidate',
		clinician: 'Mr A Bhatt FRCS',
		planRecommendation: 'total-knee-replacement',
		flags: []
	},
	{
		id: 'KRSE002',
		assessmentDate: '2026-06-02',
		patient: 'Lindqvist, Marit',
		nhs: '502 345 6789',
		kneeSide: 'left',
		oksTotal: 26,
		oksCategory: 'moderate',
		candidacy: 'candidate',
		clinician: 'Mr A Bhatt FRCS',
		planRecommendation: 'partial-knee-replacement',
		flags: []
	},
	{
		id: 'KRSE003',
		assessmentDate: '2026-06-03',
		patient: 'Adeyemi, Tunde',
		nhs: '503 456 7890',
		kneeSide: 'bilateral',
		oksTotal: 11,
		oksCategory: 'severe',
		candidacy: 'strong-candidate',
		clinician: 'Ms S Whitfield ESP',
		planRecommendation: 'total-knee-replacement',
		flags: ['bilateral-symptomatic', 'high-bmi-surgical-risk']
	},
	{
		id: 'KRSE004',
		assessmentDate: '2026-06-04',
		patient: 'Petrova, Yelena',
		nhs: '504 567 8901',
		kneeSide: 'right',
		oksTotal: 33,
		oksCategory: 'mild-to-moderate',
		candidacy: 'continue-conservative',
		clinician: 'Ms S Whitfield ESP',
		planRecommendation: 'continue-conservative-management',
		flags: ['conservative-treatment-not-exhausted']
	},
	{
		id: 'KRSE005',
		assessmentDate: '2026-06-05',
		patient: 'Kowalski, Bartosz',
		nhs: '505 678 9012',
		kneeSide: 'left',
		oksTotal: 44,
		oksCategory: 'satisfactory',
		candidacy: 'not-indicated',
		clinician: 'Mr M Osei FRCS',
		planRecommendation: 'not-currently-a-candidate',
		flags: []
	},
	{
		id: 'KRSE006',
		assessmentDate: '2026-06-08',
		patient: 'Ferreira, Ines',
		nhs: '506 789 0123',
		kneeSide: 'right',
		oksTotal: 17,
		oksCategory: 'severe',
		candidacy: 'strong-candidate',
		clinician: 'Mr M Osei FRCS',
		planRecommendation: 'total-knee-replacement',
		flags: ['pre-op-bloods-incomplete']
	},
	{
		id: 'KRSE007',
		assessmentDate: '2026-06-09',
		patient: 'Haddad, Rania',
		nhs: '507 890 1234',
		kneeSide: 'left',
		oksTotal: 24,
		oksCategory: 'moderate',
		candidacy: 'mdt-review',
		clinician: 'Mr A Bhatt FRCS',
		planRecommendation: 'mdt-review',
		flags: ['fixed-flexion-deformity']
	},
	{
		id: 'KRSE008',
		assessmentDate: '2026-06-10',
		patient: 'Novotny, Pavel',
		nhs: '508 901 2345',
		kneeSide: 'right',
		oksTotal: 21,
		oksCategory: 'moderate',
		candidacy: 'candidate',
		clinician: 'Ms S Whitfield ESP',
		planRecommendation: 'partial-knee-replacement',
		flags: []
	},
	{
		id: 'KRSE009',
		assessmentDate: '2026-06-11',
		patient: 'Mbeki, Thandiwe',
		nhs: '509 012 3456',
		kneeSide: 'left',
		oksTotal: 8,
		oksCategory: 'severe',
		candidacy: 'strong-candidate',
		clinician: 'Mr M Osei FRCS',
		planRecommendation: 'total-knee-replacement',
		flags: ['high-bmi-surgical-risk']
	},
	{
		id: 'KRSE010',
		assessmentDate: '2026-06-12',
		patient: 'Sørensen, Kasper',
		nhs: '510 123 4567',
		kneeSide: 'right',
		oksTotal: 38,
		oksCategory: 'mild-to-moderate',
		candidacy: 'continue-conservative',
		clinician: 'Mr A Bhatt FRCS',
		planRecommendation: 'continue-conservative-management',
		flags: []
	},
	{
		id: 'KRSE011',
		assessmentDate: '2026-06-15',
		patient: 'Yamamoto, Aiko',
		nhs: '511 234 5678',
		kneeSide: 'left',
		oksTotal: 19,
		oksCategory: 'severe',
		candidacy: 'mdt-review',
		clinician: 'Ms S Whitfield ESP',
		planRecommendation: 'mdt-review',
		flags: []
	},
	{
		id: 'KRSE012',
		assessmentDate: '2026-06-16',
		patient: 'Grimaldi, Luca',
		nhs: '512 345 6789',
		kneeSide: 'bilateral',
		oksTotal: 6,
		oksCategory: 'severe',
		candidacy: 'strong-candidate',
		clinician: 'Mr M Osei FRCS',
		planRecommendation: 'total-knee-replacement',
		flags: ['bilateral-symptomatic', 'conservative-treatment-not-exhausted', 'pre-op-bloods-incomplete']
	}
];
