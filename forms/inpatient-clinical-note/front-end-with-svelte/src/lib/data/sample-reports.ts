import type { AcuityBand, AssessmentData, CompletenessStatus } from '#lib/engine/types.js';
import { assess } from '#lib/engine/note-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/**
 * Sample notes for the dashboard and for seeding the wizard on an existing id.
 *
 * These are full `AssessmentData` objects run through the real engine rather
 * than hand-written result rows, so the dashboard can never show a status or a
 * band the engine would not actually produce.
 */

/** A sample note: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	noteDate: string;
	data: AssessmentData;
}

/** A row in the ward dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	hospitalMrn: string;
	patientName: string;
	wardName: string;
	noteType: string;
	authorGrade: string;
	status: CompletenessStatus;
	completenessPercent: number;
	acuityBand: AcuityBand;
	news2Total: number | null;
	highFlagCount: number;
	flagCount: number;
	noteDate: string;
}

/**
 * Complete and Stable — a fully documented progress note on a recovering
 * patient. All nine components required for a progress note are documented.
 */
function completeStableNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.header.noteType = 'progress';
	d.header.noteAt = '2026-07-30T09:20';
	d.header.authorName = 'Dr A. Okafor';
	d.header.authorGrade = 'ST4';
	d.header.hospitalName = "St Thomas' Hospital";
	d.header.wardName = 'Ward 12B, Acute Medical Unit';
	d.header.bedNumber = 'Bay 3, Bed 2';
	d.header.parentSpecialty = 'Acute medicine';
	d.header.responsibleConsultantName = 'Dr B. Nakamura';

	d.admission.patientName = 'Okafor, Chidi';
	d.admission.hospitalMrn = 'MRN-204815';
	d.admission.admissionAt = '2026-07-27T22:10';
	d.admission.admissionMethod = 'emergency-department';
	d.admission.admittingSpecialty = 'Acute medicine';
	d.admission.admissionReason = 'Community-acquired pneumonia.';

	d.interval.intervalHistory =
		'Settled overnight. One episode of mild chest discomfort at 03:00, ECG unchanged.';

	d.observations.observedAt = '2026-07-30T08:45';
	d.observations.respiratoryRate = 18;
	d.observations.oxygenSaturation = 96;
	d.observations.spo2Scale = 'scale-1';
	d.observations.oxygenDelivery = 'air';
	d.observations.systolicBloodPressure = 124;
	d.observations.diastolicBloodPressure = 76;
	d.observations.pulseRate = 82;
	d.observations.acvpu = 'alert';
	d.observations.temperatureCelsius = 37.1;
	d.observations.news2Trend = 'improving';

	d.examination.general = 'Comfortable at rest.';
	d.examination.respiratory = 'Chest clearing, no added sounds.';

	d.investigations.rows = [
		{
			testName: 'C-reactive protein',
			category: 'biochemistry',
			requestedDate: '2026-07-30',
			resultDate: '2026-07-30',
			resultSummary: '84 mg/L, down from 120.',
			abnormal: 'yes',
			actioned: 'yes',
			actionTaken: 'Trend reviewed; continuing current antibiotics.'
		}
	];

	d.problems.rows = [
		{
			problem: 'Community-acquired pneumonia',
			category: 'presenting',
			status: 'resolving',
			priority: 'medium',
			onsetDate: '2026-07-27',
			progressCommentary: 'CRP falling, oxygen requirement resolved.'
		},
		{
			problem: 'Acute kidney injury stage 1',
			category: 'complication',
			status: 'resolving',
			priority: 'low',
			onsetDate: '2026-07-28',
			progressCommentary: 'Creatinine improving with fluids.'
		}
	];

	d.medications.noMedicationChanges = 'yes';
	d.medications.allergyChecked = 'yes';
	d.medications.medicinesReconciliationStatus = 'done';
	d.medications.antimicrobialReviewStatus = 'done';

	d.risks.vteStatus = 'done';
	d.risks.vteProphylaxis = 'pharmacological';
	d.risks.fallsRisk = 'low';
	d.risks.pressureUlcerRisk = 'low';
	d.risks.skinIntegrity = 'intact';
	d.risks.deliriumScreen = 'negative';
	d.risks.nutritionScreen = 'low-risk';
	d.risks.infectionStatus = 'confirmed';
	d.risks.isolationStatus = 'none';

	d.assessment.clinicalImpression = 'Resolving community-acquired pneumonia, improving.';
	d.assessment.responseToTreatment = 'improving';
	d.assessment.sepsisScreen = 'negative';
	d.assessment.arrestCall = 'none';
	d.assessment.newOrganSupport = 'none';

	d.planning.plan = 'Continue oral antibiotics, day 4 of 5. Mobilise with physiotherapy.';
	d.planning.escalationStatus = 'for-full-escalation';
	d.planning.ceilingOfCare = 'full-active-treatment';
	d.planning.seniorReviewBy = 'Dr B. Nakamura, consultant';
	d.planning.estimatedDischargeDate = '2026-08-01';

	d.signOff.familyCommunication = 'Updated daughter by telephone; happy with progress.';
	d.signOff.attestationText = 'Accurate contemporaneous record of my review.';
	d.signOff.electronicSignature = 'A. Okafor';
	return d;
}

/**
 * Incomplete and Escalate — an event note written in a hurry during a
 * deterioration. The observations are recorded but the impression, plan, and
 * escalation action are not, so it grades Incomplete and raises high-priority
 * flags.
 */
function incompleteEscalateNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.header.noteType = 'event';
	d.header.noteAt = '2026-07-30T14:35';
	d.header.authorName = 'Dr S. Rahman';
	d.header.authorGrade = 'FY1';
	d.header.hospitalName = "St Thomas' Hospital";
	d.header.wardName = 'Ward 7, Respiratory';

	d.admission.patientName = 'Doyle, Aoife';
	d.admission.hospitalMrn = 'MRN-771302';
	d.admission.admissionAt = '2026-07-27T11:00';
	d.admission.admissionMethod = 'gp-referral';
	d.admission.admissionReason = 'Infective exacerbation of COPD.';

	d.interval.intervalHistory = 'Acutely more breathless over the last hour.';

	d.observations.observedAt = '2026-07-30T14:30';
	d.observations.respiratoryRate = 24;
	d.observations.oxygenSaturation = 90;
	d.observations.spo2Scale = 'scale-1';
	d.observations.oxygenDelivery = 'nasal-cannula';
	d.observations.oxygenFlowLitresPerMinute = 4;
	d.observations.systolicBloodPressure = 104;
	d.observations.pulseRate = 118;
	d.observations.acvpu = 'alert';
	d.observations.temperatureCelsius = 38.4;
	d.observations.news2Trend = 'worsening';

	d.assessment.newOxygenRequirement = 'yes';
	d.assessment.sepsisScreen = 'not-done';

	// Deliberately absent: problems, medications, VTE, impression, plan,
	// escalation. This is the documentation failure the form exists to surface.
	return d;
}

/**
 * Partial and Critical — a well-observed deterioration with a critical-care
 * referral, but the note type is an admission clerking, which requires more
 * components than are documented.
 */
function partialCriticalNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.header.noteType = 'admission-clerking';
	d.header.noteAt = '2026-07-31T02:15';
	d.header.authorName = 'Dr M. Lindqvist';
	d.header.authorGrade = 'ST3';
	d.header.hospitalName = "St Thomas' Hospital";
	d.header.wardName = 'Ward 5, Cardiology';

	d.admission.patientName = 'Thompson, Gary';
	d.admission.hospitalMrn = 'MRN-118427';
	d.admission.admissionAt = '2026-07-31T01:40';
	d.admission.admissionMethod = 'emergency-department';
	d.admission.admissionReason = 'Cardiogenic shock.';

	d.interval.intervalHistory = 'Admitted directly from the emergency department, peri-arrest.';

	d.observations.observedAt = '2026-07-31T02:00';
	d.observations.news2Total = 12;
	d.observations.news2Trend = 'worsening';

	d.problems.rows = [
		{
			problem: 'Cardiogenic shock',
			category: 'presenting',
			status: 'active',
			priority: 'high',
			onsetDate: '2026-07-31',
			progressCommentary: 'On noradrenaline.'
		}
	];

	d.medications.rows = [
		{
			drugName: 'Noradrenaline',
			action: 'started',
			dose: '0.1 mcg/kg/min',
			route: 'intravenous',
			frequency: 'continuous infusion',
			indication: 'Cardiogenic shock',
			isAntimicrobial: 'no',
			reviewDate: '2026-07-31',
			notes: 'Titrated to MAP 65.'
		}
	];
	d.medications.allergyChecked = 'yes';

	d.risks.vteStatus = 'done';
	d.risks.vteProphylaxis = 'mechanical';

	d.assessment.clinicalImpression = 'Cardiogenic shock secondary to anterior STEMI.';
	d.assessment.criticalCareReferral = 'yes';
	d.assessment.newOrganSupport = 'cardiovascular';
	d.assessment.arrestCall = 'peri-arrest';

	d.planning.plan = 'Transfer to ICU. Urgent primary PCI.';
	d.planning.escalationAction = 'Critical care attended at 02:05; ICU bed accepted.';
	d.planning.escalationStatus = 'for-icu';
	d.planning.ceilingOfCare = 'organ-support';
	d.planning.seniorReviewBy = 'Dr P. Achebe, consultant cardiologist';

	// Absent: examination and investigations, both of which an admission
	// clerking requires — so this grades Partial rather than Complete.
	return d;
}

export const sampleAssessments: SampleAssessment[] = [
	{
		id: '1',
		patientName: 'Okafor, Chidi',
		noteDate: '2026-07-30',
		data: completeStableNote()
	},
	{
		id: '2',
		patientName: 'Doyle, Aoife',
		noteDate: '2026-07-30',
		data: incompleteEscalateNote()
	},
	{
		id: '3',
		patientName: 'Thompson, Gary',
		noteDate: '2026-07-31',
		data: partialCriticalNote()
	}
];

/**
 * Dashboard rows, derived by running the real engine over each sample. Derived
 * rather than hand-written so the dashboard can never disagree with the engine.
 */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = assess(s.data);
	return {
		id: s.id,
		hospitalMrn: s.data.admission.hospitalMrn,
		patientName: s.patientName,
		wardName: s.data.header.wardName,
		noteType: s.data.header.noteType,
		authorGrade: s.data.header.authorGrade,
		status: g.status,
		completenessPercent: g.completenessPercent,
		acuityBand: g.acuityBand,
		news2Total: g.news2Total,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		noteDate: s.noteDate
	};
});
