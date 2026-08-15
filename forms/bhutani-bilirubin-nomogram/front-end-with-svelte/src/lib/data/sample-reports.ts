import type { AssessmentData, CareSetting, RiskZone } from '#lib/engine/types.js';
import { gradeBhutani } from '#lib/engine/bhutani-grader.js';
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
	infantIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	ageHours: number | null;
	tsb: number | null;
	riskZone: RiskZone;
	aboveExchange: boolean;
	abovePhototherapy: boolean;
	flagCount: number;
}

/** Low zone — term infant well below both treatment thresholds. */
function lowZoneCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife J. Owen',
		clinicianRole: 'midwife',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'postnatal-ward'
	};
	d.identification = {
		infantIdentifier: 'NN-100482',
		sex: 'female',
		bornAt: '2026-06-22T09:15',
		gestationalAgeWeeks: 40
	};
	d.measurement = { ageHours: 48, totalSerumBilirubinUmolL: 120, measurementMethod: 'transcutaneous' };
	d.note.clinicalNote = 'Well infant, feeding well; TSB in the low-risk zone.';
	return d;
}

/** Low-intermediate zone — 40th–75th percentile, below thresholds. */
function lowIntermediateCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'neonatal-nurse',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'midwife-led-unit'
	};
	d.identification = {
		infantIdentifier: 'NN-573110',
		sex: 'male',
		bornAt: '2026-06-23T11:40',
		gestationalAgeWeeks: 39
	};
	d.measurement = { ageHours: 48, totalSerumBilirubinUmolL: 170, measurementMethod: 'serum' };
	d.riskFactors.exclusiveBreastfeeding = 'yes';
	d.note.clinicalNote = 'Exclusively breastfed; repeat TSB arranged.';
	return d;
}

/** High-intermediate zone — 75th–95th percentile, below the phototherapy line. */
function highIntermediateCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'paediatrician',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'postnatal-ward'
	};
	d.identification = {
		infantIdentifier: 'NN-100517',
		sex: 'female',
		bornAt: '2026-06-23T16:05',
		gestationalAgeWeeks: 38
	};
	d.measurement = { ageHours: 72, totalSerumBilirubinUmolL: 260, measurementMethod: 'serum' };
	d.riskFactors.previousSiblingJaundice = 'yes';
	d.note.clinicalNote = 'High-intermediate zone; closer surveillance and earlier re-measurement.';
	return d;
}

/** High zone above the exchange threshold — preterm emergency. */
function highExchangeCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'paediatrician',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'neonatal-unit'
	};
	d.identification = {
		infantIdentifier: 'NN-100628',
		sex: 'male',
		bornAt: '2026-06-22T22:20',
		gestationalAgeWeeks: 36
	};
	d.measurement = { ageHours: 96, totalSerumBilirubinUmolL: 420, measurementMethod: 'serum' };
	d.riskFactors.pretermUnder38 = 'yes';
	d.riskFactors.bloodGroupIncompatibility = 'yes';
	d.riskFactors.earlyOnsetUnder24h = 'yes';
	d.note.clinicalNote = 'Above exchange threshold for gestation and age; urgent neonatal review.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BBN-2026-0001', patientName: 'Owen, Baby', assessedDate: '2026-06-24', data: lowZoneCase() },
	{
		id: 'BBN-2026-0002',
		patientName: 'Mackenzie, Baby',
		assessedDate: '2026-06-25',
		data: lowIntermediateCase()
	},
	{
		id: 'BBN-2026-0003',
		patientName: 'Nowak, Baby',
		assessedDate: '2026-06-26',
		data: highIntermediateCase()
	},
	{
		id: 'BBN-2026-0004',
		patientName: 'Ahmed, Baby',
		assessedDate: '2026-06-26',
		data: highExchangeCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeBhutani(s.data);
	return {
		id: s.id,
		infantIdentifier: s.data.identification.infantIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		ageHours: g.ageHours,
		tsb: s.data.measurement.totalSerumBilirubinUmolL,
		riskZone: g.riskZone,
		aboveExchange: g.aboveExchange,
		abovePhototherapy: g.abovePhototherapy,
		flagCount: g.flaggedIssues.length
	};
});
