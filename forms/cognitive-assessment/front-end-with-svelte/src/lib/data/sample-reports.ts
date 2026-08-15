import type { AssessmentData } from '#lib/engine/types.js';
import { calculateMMSE } from '#lib/engine/mmse-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { mmseCategory } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	mmseScore: number;
	mmseCategory: string;
	referralSource: string;
	safetyFlag: boolean;
	flagCount: number;
}

/** Fill all 30 MMSE items so the engine sums to `score` (remaining items 0). */
function mmse(d: AssessmentData, score: number): void {
	const order: Array<[keyof AssessmentData, string]> = [
		['orientationScores', 'year'], ['orientationScores', 'season'], ['orientationScores', 'date'],
		['orientationScores', 'day'], ['orientationScores', 'month'],
		['orientationScores', 'country'], ['orientationScores', 'county'], ['orientationScores', 'town'],
		['orientationScores', 'hospital'], ['orientationScores', 'floor'],
		['registrationScores', 'object1'], ['registrationScores', 'object2'], ['registrationScores', 'object3'],
		['attentionScores', 'serial1'], ['attentionScores', 'serial2'], ['attentionScores', 'serial3'],
		['attentionScores', 'serial4'], ['attentionScores', 'serial5'],
		['recallScores', 'object1'], ['recallScores', 'object2'], ['recallScores', 'object3'],
		['repetitionCommands', 'naming1'], ['repetitionCommands', 'naming2'], ['repetitionCommands', 'repetition'],
		['repetitionCommands', 'command1'], ['repetitionCommands', 'command2'], ['repetitionCommands', 'command3'],
		['repetitionCommands', 'reading'], ['repetitionCommands', 'writing'],
		['visuospatialScores', 'copying']
	];
	order.forEach(([section, item], i) => {
		const value = i < score ? 1 : 0;
		(d[section] as unknown as Record<string, number>)[item] = value;
	});
	// Mirror the language items into languageScores for completeness.
	const lang = d.repetitionCommands;
	d.languageScores = { ...lang };
}

/** Normal cognition: MMSE 29, minimal concerns. */
function normalCognition(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1955-04-12', sex: 'male', educationLevel: 'university', primaryLanguage: 'English', handedness: 'right' };
	d.referralInformation = { ...d.referralInformation, referralSource: 'gp', referralReason: 'screening', referringClinician: 'Dr Adeyemi', urgency: 'routine', previousCognitiveAssessment: 'no' };
	d.functionalHistory = { ...d.functionalHistory, livingArrangement: 'with-spouse', adlBathing: 'independent', adlDressing: 'independent', adlMeals: 'independent', adlMedications: 'independent', adlFinances: 'independent', adlTransport: 'independent', carersAvailable: 'yes' };
	mmse(d, 29);
	return d;
}

/** Mild cognitive impairment: MMSE 21, some functional difficulty. */
function mildImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1948-09-30', sex: 'female', educationLevel: 'secondary', primaryLanguage: 'English', handedness: 'right' };
	d.referralInformation = { ...d.referralInformation, referralSource: 'neurologist', referralReason: 'memory-concern', referringClinician: 'Dr Okafor', urgency: 'routine', previousCognitiveAssessment: 'yes', previousAssessmentDetails: 'MMSE 25, 18 months ago' };
	d.functionalHistory = { ...d.functionalHistory, livingArrangement: 'with-family', adlBathing: 'independent', adlDressing: 'independent', adlMeals: 'needs-some-help', adlMedications: 'needs-some-help', adlFinances: 'needs-some-help', adlTransport: 'needs-some-help', carersAvailable: 'yes', recentChanges: 'Increasingly forgetful with appointments.' };
	mmse(d, 21);
	return d;
}

/** Moderate cognitive impairment: MMSE 14, lives alone. */
function moderateImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1941-01-22', sex: 'female', educationLevel: 'primary', primaryLanguage: 'English', handedness: 'right' };
	d.referralInformation = { ...d.referralInformation, referralSource: 'geriatrician', referralReason: 'functional-decline', referringClinician: 'Dr Nwosu', urgency: 'urgent', previousCognitiveAssessment: 'yes' };
	d.functionalHistory = { ...d.functionalHistory, livingArrangement: 'alone', adlBathing: 'needs-significant-help', adlDressing: 'needs-significant-help', adlMeals: 'needs-significant-help', adlMedications: 'fully-dependent', adlFinances: 'fully-dependent', adlTransport: 'fully-dependent', carersAvailable: 'no', safetyConerns: 'Left the cooker on twice last month.' };
	mmse(d, 14);
	return d;
}

/** Severe cognitive impairment: MMSE 7, urgent. */
function severeImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1938-11-03', sex: 'male', educationLevel: 'secondary', primaryLanguage: 'English', handedness: 'left' };
	d.referralInformation = { ...d.referralInformation, referralSource: 'psychiatrist', referralReason: 'confusion', referringClinician: 'Dr Mbeki', urgency: 'emergency', previousCognitiveAssessment: 'no' };
	d.functionalHistory = { ...d.functionalHistory, livingArrangement: 'care-home', adlBathing: 'fully-dependent', adlDressing: 'fully-dependent', adlMeals: 'fully-dependent', adlMedications: 'fully-dependent', adlFinances: 'fully-dependent', adlTransport: 'fully-dependent', carersAvailable: 'yes', safetyConerns: 'Wandering at night; disoriented to place.' };
	mmse(d, 7);
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CG-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: normalCognition() },
	{ id: 'CG-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildImpairment() },
	{ id: 'CG-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateImpairment() },
	{ id: 'CG-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeImpairment() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { mmseScore } = calculateMMSE(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		mmseScore,
		mmseCategory: mmseCategory(mmseScore),
		referralSource: s.data.referralInformation.referralSource,
		safetyFlag: s.data.functionalHistory.safetyConerns.trim().length > 0,
		flagCount: flags.length
	};
});
