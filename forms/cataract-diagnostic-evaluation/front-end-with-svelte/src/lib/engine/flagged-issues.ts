// Safety-flag detection.
//
// Flags fire independently of the surgical-candidacy recommendation and are
// never suppressed by a clinician override — see doc/safety-case-notes.md.
// Flag IDs are stable and identical across every front-end and the back-end.

import type { AdditionalFlag, CataractDiagnosticEvaluation, FlagCategory, FlagPriority, LocsIIISeverity } from './types';
import { num } from './utils';

export interface FlagContext {
	severityRight: LocsIIISeverity;
	severityLeft: LocsIIISeverity;
	age: number | null;
}

/** Detect safety flags for a cataract diagnostic evaluation, most severe first. */
export function detectFlags(data: CataractDiagnosticEvaluation, context: FlagContext): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		description: string,
		suggestedAction: string
	) => flags.push({ flagId, category, priority, description, suggestedAction });

	const { severityRight, severityLeft, age } = context;

	// --- Competing pathology ------------------------------------------------
	const competingPathology =
		data.differential.glaucomaSuspected === 'yes' ||
		data.differential.amdSuspected === 'yes' ||
		data.differential.diabeticRetinopathySuspected === 'yes';
	if (competingPathology) {
		const suspects: string[] = [];
		if (data.differential.glaucomaSuspected === 'yes') suspects.push('glaucoma');
		if (data.differential.amdSuspected === 'yes') suspects.push('age-related macular degeneration');
		if (data.differential.diabeticRetinopathySuspected === 'yes') suspects.push('diabetic retinopathy');
		push('F-COMPETING-PATHOLOGY-SUSPECTED-001', 'competing-pathology-suspected', 'high',
			`Competing posterior-segment pathology suspected: ${suspects.join(', ')}.`,
			'Refer into the appropriate pathway (glaucoma / medical retina / diabetic eye screening) alongside or before cataract listing.');
	}

	// --- Raised intraocular pressure ----------------------------------------
	const iopRight = num(data.tonometry.intraocularPressureRightMmhg);
	const iopLeft = num(data.tonometry.intraocularPressureLeftMmhg);
	if ((iopRight !== null && iopRight > 21) || (iopLeft !== null && iopLeft > 21)) {
		const readings: string[] = [];
		if (iopRight !== null && iopRight > 21) readings.push(`right ${iopRight} mmHg`);
		if (iopLeft !== null && iopLeft > 21) readings.push(`left ${iopLeft} mmHg`);
		push('F-RAISED-IOP-001', 'raised-iop', 'high',
			`Intraocular pressure above 21 mmHg: ${readings.join(', ')}.`,
			'Investigate for glaucoma before cataract listing; consider same-visit or urgent glaucoma referral.');
	}

	// --- View obscured, fundus not assessed ---------------------------------
	const viewObscured =
		data.fundus.viewObscuredByCataractRight === 'yes' || data.fundus.viewObscuredByCataractLeft === 'yes';
	if (viewObscured && data.fundus.dilatedFundusExamPerformed !== 'yes') {
		push('F-VIEW-OBSCURED-FUNDUS-NOT-ASSESSED-001', 'view-obscured-fundus-not-assessed', 'medium',
			'The cataract obscures the fundus view and a dilated fundus examination was not performed.',
			'Arrange a dilated fundus examination, or B-scan ultrasound if the view remains obscured, before surgical listing to exclude posterior-segment pathology.');
	}

	// --- Rapid progression ---------------------------------------------------
	const durationMonths = num(data.symptoms.symptomDurationMonths);
	const severeEye = severityRight === 'severe' || severityLeft === 'severe';
	if (durationMonths !== null && durationMonths < 3 && severeEye) {
		push('F-RAPID-PROGRESSION-001', 'rapid-progression', 'medium',
			`Symptom duration of ${durationMonths} month(s) with a severe LOCS III grade suggests atypically rapid progression.`,
			'Consider a non-age-related cause (steroid-induced, traumatic, diabetic, or uveitic) and investigate accordingly.');
	}

	// --- Biometry incomplete for surgical planning --------------------------
	const surgicalReferral =
		data.management.managementRecommendation === 'surgical-referral-routine' ||
		data.management.managementRecommendation === 'surgical-referral-urgent';
	if (surgicalReferral && data.biometry.biometryPerformed !== 'yes') {
		push('F-BIOMETRY-INCOMPLETE-FOR-SURGICAL-PLANNING-001', 'biometry-incomplete-for-surgical-planning', 'low',
			'A surgical referral is recommended but biometry for intraocular lens planning was not performed.',
			'Book biometry (axial length, keratometry, IOL power calculation) ahead of the surgical clinic appointment.');
	}

	// --- Paediatric ------------------------------------------------------------
	if (age !== null && age < 16) {
		push('F-PAEDIATRIC-001', 'paediatric', 'high',
			`The patient is ${age} years old; LOCS III and this form's adult referral pathway are not validated below 16 years.`,
			'Refer to a paediatric ophthalmology pathway. Treat the LOCS III grading and surgical-candidacy recommendation on this report as invalid.');
	}

	return flags;
}
