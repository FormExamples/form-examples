// Data model for the Inpatient Clinical Note form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_inpatient_clinical_note.sql` and its four child tables.
//
// Two engines run over this shape (spec §4 and §5):
//
//   completeness — grades the record Complete / Partial / Incomplete against the
//                  components required FOR ITS NOTE TYPE. Never overridable.
//   acuity       — assigns Stable / Watch / Escalate / Critical by max-band over
//                  NEWS2 and the deterioration markers. Overridable by the
//                  author with a recorded reason.
//
// Neither is a diagnostic output. A Complete grade means the record is well
// documented, not that the care was correct.

export type NoteType =
	| 'admission-clerking'
	| 'progress'
	| 'consult'
	| 'event'
	| 'procedure'
	| 'handover'
	| 'transfer'
	| 'discharge-planning'
	| '';

export type YesNo = 'yes' | 'no' | '';
export type CompletenessStatus = 'complete' | 'partial' | 'incomplete';
export type AcuityBand = 'stable' | 'watch' | 'escalate' | 'critical';
export type Priority = 'high' | 'medium' | 'low';
export type Acvpu = 'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive' | '';

/** The twelve note components the completeness engine grades. */
export type ComponentKey =
	| 'header'
	| 'interval-history'
	| 'observations'
	| 'examination'
	| 'investigations'
	| 'problems'
	| 'medications'
	| 'risk-assessments'
	| 'impression'
	| 'plan'
	| 'escalation'
	| 'communication';

/** Step 1 — note identification, plus the note-type-specific context fields. */
export interface Header {
	noteType: NoteType;
	hospitalName: string;
	wardName: string;
	bedNumber: string;
	noteAt: string;
	authorName: string;
	authorGrade: string;
	authorRegistrationNumber: string;
	parentSpecialty: string;
	responsibleConsultantName: string;
	consultQuestion: string;
	consultRequestingTeam: string;
	procedurePerformed: string;
	procedureDetail: string;
	procedureConsent: string;
	procedureComplications: string;
	transferFromWard: string;
	transferToWard: string;
	transferReason: string;
}

/** Step 2 — patient and admission context. */
export interface Admission {
	patientName: string;
	nhsNumber: string;
	hospitalMrn: string;
	birthDate: string;
	sex: string;
	admissionAt: string;
	admittingSpecialty: string;
	admissionMethod: string;
	admissionReason: string;
}

/** Step 3 — interval history. */
export interface Interval {
	intervalHistory: string;
	noIntervalEvents: YesNo;
	overnightEvents: string;
	patientReportedSymptoms: string;
	nursingConcerns: string;
	painScore: number | null;
	sleepQuality: string;
	oralIntake: string;
	bowelsLastOpened: string;
	mobilityStatus: string;
}

/** Step 4 — observations and NEWS2. */
export interface Observations {
	observedAt: string;
	respiratoryRate: number | null;
	oxygenSaturation: number | null;
	spo2Scale: string;
	oxygenDelivery: string;
	oxygenFlowLitresPerMinute: number | null;
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
	pulseRate: number | null;
	acvpu: Acvpu;
	temperatureCelsius: number | null;
	news2Total: number | null;
	news2Trend: string;
	news2Applicable: YesNo;
	news2NotApplicableReason: string;
}

/** Step 5 — examination findings by system. */
export interface Examination {
	general: string;
	cardiovascular: string;
	respiratory: string;
	abdominal: string;
	neurological: string;
	musculoskeletal: string;
	skinAndWounds: string;
	linesAndDrains: string;
	other: string;
}

/** One investigations-reviewed row (child table). */
export interface InvestigationRow {
	testName: string;
	category: string;
	requestedDate: string;
	resultDate: string;
	resultSummary: string;
	abnormal: YesNo;
	actioned: YesNo;
	actionTaken: string;
}

/** Step 6 — investigations reviewed. */
export interface Investigations {
	rows: InvestigationRow[];
	noInvestigationsReviewed: YesNo;
}

/** One problem-list row (child table). */
export interface ProblemRow {
	problem: string;
	category: string;
	status: string;
	priority: string;
	onsetDate: string;
	progressCommentary: string;
}

/** Step 7 — problem list. */
export interface Problems {
	rows: ProblemRow[];
}

/** One prescribing-change row (child table). */
export interface MedicationRow {
	drugName: string;
	action: string;
	dose: string;
	route: string;
	frequency: string;
	indication: string;
	isAntimicrobial: YesNo;
	reviewDate: string;
	notes: string;
}

/** Step 8 — medications and prescribing. */
export interface Medications {
	rows: MedicationRow[];
	noMedicationChanges: YesNo;
	allergyChecked: YesNo;
	medicinesReconciliationStatus: string;
	antimicrobialReviewStatus: string;
}

/** Step 9 — mandatory inpatient risk assessments. */
export interface Risks {
	vteStatus: string;
	vteProphylaxis: string;
	vteNotes: string;
	fallsRisk: string;
	fallsInterventions: string;
	pressureUlcerRisk: string;
	skinIntegrity: string;
	pressureUlcerGrade: string;
	pressureUlcerSites: string;
	deliriumScreen: string;
	delirium4atScore: number | null;
	deliriumNotes: string;
	nutritionScreen: string;
	mustScore: number | null;
	nutritionPlan: string;
	infectionStatus: string;
	isolationStatus: string;
	organism: string;
	safeguardingConcern: YesNo;
	safeguardingNotes: string;
	safeguardingReferralMade: YesNo;
}

/** Step 10 — assessment, impression, and deterioration markers. */
export interface Assessment {
	clinicalImpression: string;
	differentialDiagnosis: string;
	responseToTreatment: string;
	newOxygenRequirement: YesNo;
	newConfusion: YesNo;
	sepsisScreen: string;
	arrestCall: string;
	criticalCareReferral: YesNo;
	newOrganSupport: string;
}

/** One outstanding-job row (child table). */
export interface JobRow {
	job: string;
	category: string;
	owner: string;
	priority: string;
	dueAt: string;
	status: string;
}

/** Step 11 — plan, jobs, and escalation. */
export interface Planning {
	plan: string;
	jobs: JobRow[];
	escalationStatus: string;
	escalationAction: string;
	ceilingOfCare: string;
	respectStatus: string;
	dnacprStatus: string;
	seniorReviewNeeded: YesNo;
	seniorReviewBy: string;
	estimatedDischargeDate: string;
	dischargePlanningNotes: string;
}

/** Step 12 — communication and sign-off. */
export interface SignOff {
	familyCommunication: string;
	patientCommunication: string;
	teamHandover: string;
	consentStatus: string;
	capacityAssessed: YesNo;
	capacityNotes: string;
	authorOverrideAcuity: string;
	authorOverrideReason: string;
	attestationText: string;
	electronicSignature: string;
}

export interface AssessmentData {
	header: Header;
	admission: Admission;
	interval: Interval;
	observations: Observations;
	examination: Examination;
	investigations: Investigations;
	problems: Problems;
	medications: Medications;
	risks: Risks;
	assessment: Assessment;
	planning: Planning;
	signOff: SignOff;
}

/** Per-component presence row. */
export interface ComponentStatus {
	component: ComponentKey;
	label: string;
	/** Required for THIS note's type. */
	required: boolean;
	present: boolean;
}

export interface FiredRule {
	id: string;
	engine: 'completeness' | 'acuity';
	component: string;
	/** For an acuity rule, the band the rule proposed. */
	band: AcuityBand | '';
	category: string;
	description: string;
}

export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

export interface GradingResult {
	status: CompletenessStatus;
	completenessPercent: number;
	/** Final band, after any author override. */
	acuityBand: AcuityBand;
	/** What the acuity engine computed, retained for audit. */
	computedAcuityBand: AcuityBand;
	acuityOverridden: boolean;
	/** The total the band was computed from: entered wins over derived. */
	news2Total: number | null;
	news2DerivedTotal: number | null;
	componentStatuses: ComponentStatus[];
	documentedComponents: ComponentKey[];
	documentedRequired: number;
	totalRequired: number;
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
	timestamp: string;
}

/** Wizard step configuration. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}

/**
 * Build a fresh, fully-blank note. Text and enum fields default to `''`;
 * numeric, date, and time fields default to `null` or `''` per the repo
 * convention; child collections default to an empty array.
 */
export function emptyAssessment(): AssessmentData {
	return {
		header: {
			noteType: '',
			hospitalName: '',
			wardName: '',
			bedNumber: '',
			noteAt: '',
			authorName: '',
			authorGrade: '',
			authorRegistrationNumber: '',
			parentSpecialty: '',
			responsibleConsultantName: '',
			consultQuestion: '',
			consultRequestingTeam: '',
			procedurePerformed: '',
			procedureDetail: '',
			procedureConsent: '',
			procedureComplications: '',
			transferFromWard: '',
			transferToWard: '',
			transferReason: ''
		},
		admission: {
			patientName: '',
			nhsNumber: '',
			hospitalMrn: '',
			birthDate: '',
			sex: '',
			admissionAt: '',
			admittingSpecialty: '',
			admissionMethod: '',
			admissionReason: ''
		},
		interval: {
			intervalHistory: '',
			noIntervalEvents: '',
			overnightEvents: '',
			patientReportedSymptoms: '',
			nursingConcerns: '',
			painScore: null,
			sleepQuality: '',
			oralIntake: '',
			bowelsLastOpened: '',
			mobilityStatus: ''
		},
		observations: {
			observedAt: '',
			respiratoryRate: null,
			oxygenSaturation: null,
			spo2Scale: 'scale-1',
			oxygenDelivery: '',
			oxygenFlowLitresPerMinute: null,
			systolicBloodPressure: null,
			diastolicBloodPressure: null,
			pulseRate: null,
			acvpu: '',
			temperatureCelsius: null,
			news2Total: null,
			news2Trend: '',
			news2Applicable: '',
			news2NotApplicableReason: ''
		},
		examination: {
			general: '',
			cardiovascular: '',
			respiratory: '',
			abdominal: '',
			neurological: '',
			musculoskeletal: '',
			skinAndWounds: '',
			linesAndDrains: '',
			other: ''
		},
		investigations: {
			rows: [],
			noInvestigationsReviewed: ''
		},
		problems: {
			rows: []
		},
		medications: {
			rows: [],
			noMedicationChanges: '',
			allergyChecked: '',
			medicinesReconciliationStatus: '',
			antimicrobialReviewStatus: ''
		},
		risks: {
			vteStatus: '',
			vteProphylaxis: '',
			vteNotes: '',
			fallsRisk: '',
			fallsInterventions: '',
			pressureUlcerRisk: '',
			skinIntegrity: '',
			pressureUlcerGrade: '',
			pressureUlcerSites: '',
			deliriumScreen: '',
			delirium4atScore: null,
			deliriumNotes: '',
			nutritionScreen: '',
			mustScore: null,
			nutritionPlan: '',
			infectionStatus: '',
			isolationStatus: '',
			organism: '',
			safeguardingConcern: '',
			safeguardingNotes: '',
			safeguardingReferralMade: ''
		},
		assessment: {
			clinicalImpression: '',
			differentialDiagnosis: '',
			responseToTreatment: '',
			newOxygenRequirement: '',
			newConfusion: '',
			sepsisScreen: '',
			arrestCall: '',
			criticalCareReferral: '',
			newOrganSupport: ''
		},
		planning: {
			plan: '',
			jobs: [],
			escalationStatus: '',
			escalationAction: '',
			ceilingOfCare: '',
			respectStatus: '',
			dnacprStatus: '',
			seniorReviewNeeded: '',
			seniorReviewBy: '',
			estimatedDischargeDate: '',
			dischargePlanningNotes: ''
		},
		signOff: {
			familyCommunication: '',
			patientCommunication: '',
			teamHandover: '',
			consentStatus: '',
			capacityAssessed: '',
			capacityNotes: '',
			authorOverrideAcuity: '',
			authorOverrideReason: '',
			attestationText: '',
			electronicSignature: ''
		}
	};
}

export function emptyInvestigationRow(): InvestigationRow {
	return {
		testName: '',
		category: '',
		requestedDate: '',
		resultDate: '',
		resultSummary: '',
		abnormal: '',
		actioned: '',
		actionTaken: ''
	};
}

export function emptyProblemRow(): ProblemRow {
	return {
		problem: '',
		category: '',
		status: '',
		priority: '',
		onsetDate: '',
		progressCommentary: ''
	};
}

export function emptyMedicationRow(): MedicationRow {
	return {
		drugName: '',
		action: '',
		dose: '',
		route: '',
		frequency: '',
		indication: '',
		isAntimicrobial: '',
		reviewDate: '',
		notes: ''
	};
}

export function emptyJobRow(): JobRow {
	return {
		job: '',
		category: '',
		owner: '',
		priority: '',
		dueAt: '',
		status: ''
	};
}

/**
 * The twelve note components, in order, with their BASE required/recommended
 * class. The effective required set additionally depends on the note type —
 * see `NOTE_TYPE_EXTRA_REQUIRED` and `note-rules.ts`.
 */
export const COMPONENTS: { component: ComponentKey; label: string; baseRequired: boolean }[] = [
	{ component: 'header', label: 'Note header', baseRequired: true },
	{ component: 'interval-history', label: 'Interval history', baseRequired: true },
	{ component: 'observations', label: 'Observations and NEWS2', baseRequired: true },
	{ component: 'examination', label: 'Examination', baseRequired: false },
	{ component: 'investigations', label: 'Investigations reviewed', baseRequired: false },
	{ component: 'problems', label: 'Problem list', baseRequired: true },
	{ component: 'medications', label: 'Medications', baseRequired: true },
	{ component: 'risk-assessments', label: 'Risk assessments', baseRequired: true },
	{ component: 'impression', label: 'Clinical impression', baseRequired: true },
	{ component: 'plan', label: 'Plan and jobs', baseRequired: true },
	{ component: 'escalation', label: 'Escalation status', baseRequired: true },
	{ component: 'communication', label: 'Communication', baseRequired: false }
];

/**
 * Components each note type requires ON TOP of the base required set
 * (spec §4.2). A note type absent from this map requires only the base set.
 */
export const NOTE_TYPE_EXTRA_REQUIRED: Record<string, ComponentKey[]> = {
	'admission-clerking': ['examination', 'investigations'],
	progress: [],
	consult: ['examination', 'communication'],
	event: [],
	procedure: ['examination', 'communication'],
	handover: [],
	transfer: ['communication'],
	'discharge-planning': ['communication']
};

/** The three components whose absence forces an `incomplete` grade (spec §4.3). */
export const CRITICAL_COMPONENTS: ComponentKey[] = ['header', 'impression', 'plan'];

/** Acuity bands in ascending severity order, for max-band comparison. */
export const ACUITY_ORDER: AcuityBand[] = ['stable', 'watch', 'escalate', 'critical'];
