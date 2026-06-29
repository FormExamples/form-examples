// ──────────────────────────────────────────────
// Core data model — Blood Cross-Match Test Request
// ──────────────────────────────────────────────
//
// A UK NHS–aligned blood cross-match / transfusion compatibility request
// completed by a clinician. The shape mirrors the HTML front-end's
// `emptyRequest()` source of truth: camelCase property names; empty string for
// unanswered text / enum fields; `null` for unanswered numeric / date-time
// fields; `false` for unanswered boolean history / red-flag fields.

export type RequestType =
	| 'group-and-save'
	| 'antibody-screen'
	| 'crossmatch'
	| 'emergency-o-negative'
	| 'other'
	| '';

export type Component =
	| 'red-cells'
	| 'platelets'
	| 'fresh-frozen-plasma'
	| 'cryoprecipitate'
	| 'none'
	| '';

export type Indication =
	| 'surgery'
	| 'acute-bleeding'
	| 'anaemia'
	| 'obstetric-haemorrhage'
	| 'chemotherapy-support'
	| 'transfusion-dependent'
	| 'other'
	| '';

export type BloodGroup =
	| 'a-pos'
	| 'a-neg'
	| 'b-pos'
	| 'b-neg'
	| 'o-pos'
	| 'o-neg'
	| 'ab-pos'
	| 'ab-neg'
	| 'unknown'
	| '';

export type Urgency = 'routine' | 'urgent' | 'emergency' | 'stat' | '';
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';
export type SampleCollected = 'yes' | 'no' | '';

export interface Clinician {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	positivePatientIdConfirmed: boolean;
}

export interface RequestDetails {
	requestType: RequestType;
	component: Component;
	unitsRequired: number | null;
	requestedByDate: string;
	requiredByDatetime: string;
}

export interface IndicationDetails {
	primaryIndication: Indication;
	clinicalDetails: string;
	currentHaemoglobin: number | null;
	currentPlatelets: number | null;
	acuteCoronarySyndrome: boolean;
}

export interface History {
	patientBloodGroup: BloodGroup;
	knownAntibodies: boolean;
	antibodyDetail: string;
	previousTransfusion: boolean;
	previousTransfusionReaction: boolean;
	pregnant: boolean;
}

export interface Sample {
	sampleCollected: SampleCollected;
	collectionDatetime: string;
	twoSampleRuleMet: boolean;
	labellingCheckComplete: boolean;
}

export interface Triage {
	urgency: Urgency;
	massiveHaemorrhage: boolean;
	activeUncontrolledBleeding: boolean;
	haemodynamicallyUnstable: boolean;
	setting: Setting;
	notes: string;
}

/** The full cross-match / transfusion request data model. */
export interface CrossMatchRequest {
	clinician: Clinician;
	patient: Patient;
	request: RequestDetails;
	indication: IndicationDetails;
	history: History;
	sample: Sample;
	triage: Triage;
}

// ──────────────────────────────────────────────
// Four-axis grading types
// ──────────────────────────────────────────────

export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate';
export type IdentitySafetyBand = 'ok' | 'caution' | 'reject-risk';
export type TriageTier = 'routine' | 'urgent' | 'emergency' | 'stat';
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';
export type FlagPriority = 'high' | 'medium' | 'low';

/** A rule that fired during grading, with its axis and human-readable reason. */
export interface FiredRule {
	ruleId: string;
	axis: string;
	category: string;
	description: string;
}

/** A safety flag raised independently of the four axes. */
export interface SafetyFlag {
	flagId: string;
	category: string;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** The full four-axis grading result. */
export interface GradingResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	identitySafetyBand: IdentitySafetyBand;
	completenessPercent: number;
	triageTier: TriageTier;
	targetTimeframe: string;
	recommendation: Recommendation;
	recommendationLabel: string;
	firedRules: FiredRule[];
	flags: SafetyFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof CrossMatchRequest;
}
