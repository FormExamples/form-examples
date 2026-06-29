import type { AssessmentData, RiskLevel } from '$lib/engine/types';
import { gradeGenetics } from '$lib/engine/genetics-grader';
import { createDefaultAssessment, emptyRelative } from '$lib/engine/factory';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	riskLevel: RiskLevel;
	manchesterScore: number;
	bethesdaMet: number;
	premm5: number | null;
	brcaTestingFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: reassurance, no referral criteria met. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.probandDemographics = {
		...d.probandDemographics,
		firstName: 'Emma',
		lastName: 'Clarke',
		dateOfBirth: '1985-03-18',
		sex: 'female',
		mrn: 'MRN-1001',
		preferredContact: 'emma.clarke@example.com'
	};
	d.presentingConcern = {
		...d.presentingConcern,
		chiefConcern: 'Worried after a friend was diagnosed with breast cancer.',
		referralReason: 'Family-history review requested by GP.',
		urgency: 'routine'
	};
	d.priorGeneticTesting.priorGeneticCounselling = 'yes';
	return d;
}

/** A moderate-risk assessment: Manchester 15-19 (consider BRCA testing). */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.probandDemographics = {
		...d.probandDemographics,
		firstName: 'Sophie',
		lastName: 'Nguyen',
		dateOfBirth: '1972-11-02',
		sex: 'female',
		mrn: 'MRN-1002'
	};
	d.presentingConcern = {
		...d.presentingConcern,
		chiefConcern: 'Mother and aunt had breast cancer in their forties.',
		referralReason: 'Significant maternal breast-cancer history.',
		urgency: 'soon'
	};
	// Two relatives with ovarian cancer < 60 → Manchester 16 (consider BRCA testing).
	d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 2;
	d.familyPedigree.mother.affectedWithCancer = 'yes';
	d.familyPedigree.mother.cancers = [{ type: 'Breast', ageAtDiagnosis: 46 }];
	return d;
}

/** A high-risk assessment: Manchester >= 30 (mutation strongly indicated). */
function highRiskManchester(): AssessmentData {
	const d = createDefaultAssessment();
	d.probandDemographics = {
		...d.probandDemographics,
		firstName: 'Hannah',
		lastName: 'Roberts',
		dateOfBirth: '1968-07-25',
		sex: 'female',
		mrn: 'MRN-1003'
	};
	d.presentingConcern = {
		...d.presentingConcern,
		chiefConcern: 'Strong family history of breast and ovarian cancer.',
		referralReason: 'Multiple affected relatives; HBOC suspected.',
		urgency: 'urgent',
		suspectedSyndrome: 'Hereditary breast and ovarian cancer (HBOC)'
	};
	// Four relatives with ovarian cancer < 60 → Manchester 32.
	d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 4;
	d.consanguinityAncestry.ashkenaziJewish = 'yes';
	const sib = emptyRelative({ relation: 'Sibling', side: 'self', generation: 3 });
	sib.sex = 'female';
	sib.affectedWithCancer = 'yes';
	sib.cancers = [{ type: 'Ovarian', ageAtDiagnosis: 49 }];
	d.familyPedigree.siblings = [sib];
	d.familyPedigree.mother.affectedWithCancer = 'yes';
	d.familyPedigree.mother.cancers = [{ type: 'Breast', ageAtDiagnosis: 44 }];
	return d;
}

/** A high-risk assessment via Lynch pathway: PREMM5 >= 5% and 2 Bethesda criteria. */
function highRiskLynch(): AssessmentData {
	const d = createDefaultAssessment();
	d.probandDemographics = {
		...d.probandDemographics,
		firstName: 'Daniel',
		lastName: 'O’Brien',
		dateOfBirth: '1979-01-09',
		sex: 'male',
		mrn: 'MRN-1004'
	};
	d.presentingConcern = {
		...d.presentingConcern,
		chiefConcern: 'Early colorectal cancer; concerned for children.',
		referralReason: 'CRC at 44 with family history of Lynch tumours.',
		urgency: 'urgent',
		suspectedSyndrome: 'Lynch syndrome'
	};
	d.personalMedicalHistory.personalCancerHistory = 'yes';
	d.personalMedicalHistory.cancers = [
		{ type: 'Colorectal', ageAtDiagnosis: 44, bilateral: '', treatment: 'Surgery' }
	];
	d.targetedRiskScoring.bethesda.crcUnder50 = 'yes';
	d.targetedRiskScoring.bethesda.firstDegreeLynchTumour = 'yes';
	d.targetedRiskScoring.premm5.probandColorectal = 'yes';
	d.targetedRiskScoring.premm5.externalPREMM5Percent = 12;
	d.familyPedigree.father.affectedWithCancer = 'yes';
	d.familyPedigree.father.cancers = [{ type: 'Colorectal', ageAtDiagnosis: 52 }];
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GA-2026-0001', patientName: 'Clarke, Emma', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'GA-2026-0002', patientName: 'Nguyen, Sophie', assessedDate: '2026-06-12', data: moderateRisk() },
	{
		id: 'GA-2026-0003',
		patientName: 'Roberts, Hannah',
		assessedDate: '2026-06-15',
		data: highRiskManchester()
	},
	{
		id: 'GA-2026-0004',
		patientName: 'O’Brien, Daniel',
		assessedDate: '2026-06-18',
		data: highRiskLynch()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeGenetics(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		riskLevel: g.riskLevel,
		manchesterScore: g.manchesterScore,
		bethesdaMet: g.bethesdaMet,
		premm5: g.premm5Score,
		brcaTestingFlag: g.manchesterScore >= 15,
		flagCount: g.additionalFlags.length
	};
});
