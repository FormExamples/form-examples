// ──────────────────────────────────────────────
// Core post-operative report data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';

export type AnaesthesiaType =
	| 'general'
	| 'regional'
	| 'spinal'
	| 'epidural'
	| 'combined-spinal-epidural'
	| 'monitored-anaesthesia-care'
	| 'local'
	| 'sedation'
	| 'none'
	| '';

export type ProcedurePriority = 'elective' | 'urgent' | 'emergency' | '';

export type AsaGrade = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'E' | '';

export type ConsciousLevel =
	| 'awake'
	| 'drowsy'
	| 'unresponsive'
	| 'sedated'
	| 'intubated'
	| '';

export type DispositionLocation =
	| 'recovery'
	| 'ward'
	| 'hdu'
	| 'icu'
	| 'home'
	| 'theatre'
	| '';

// Clavien-Dindo classification of surgical complications (Grade 0 → Grade V).
export type ClavienDindoGradeKey =
	| 'grade-0'
	| 'grade-i'
	| 'grade-ii'
	| 'grade-iiia'
	| 'grade-iiib'
	| 'grade-iva'
	| 'grade-ivb'
	| 'grade-v'
	| '';

export interface PatientDetails {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	mrn: string;
	sex: Sex;
	weight: number | null;
	height: number | null;
	asaGrade: AsaGrade;
	allergies: string;
}

export interface ProcedureDetails {
	procedureName: string;
	procedureCode: string;
	indication: string;
	priority: ProcedurePriority;
	surgicalApproach: string;
	laterality: string;
	dateOfSurgery: string;
	startTime: string;
	endTime: string;
	durationMinutes: number | null;
	operatingRoom: string;
}

export interface TeamMember {
	name: string;
	role: string;
	grade: string;
}

export interface SurgicalTeam {
	primarySurgeon: string;
	primarySurgeonGrade: string;
	primaryAnaesthetist: string;
	primaryAnaesthetistGrade: string;
	additionalMembers: TeamMember[];
	scrubNurse: string;
	circulator: string;
}

export interface IntraoperativeFindings {
	findings: string;
	procedurePerformed: string;
	unexpectedFindings: string;
	conversionToOpen: YesNo;
	conversionReason: string;
}

export interface AnaesthesiaSummary {
	anaesthesiaType: AnaesthesiaType;
	airwayManagement: string;
	difficultIntubation: YesNo;
	airwayNotes: string;
	medicationsAdministered: string;
	reversalAgents: string;
	anaesthesiaNotes: string;
}

export interface BloodLossFluidBalance {
	estimatedBloodLossMl: number | null;
	crystalloidsMl: number | null;
	colloidsMl: number | null;
	bloodProductsMl: number | null;
	bloodProductDetails: string;
	urineOutputMl: number | null;
	otherDrainsMl: number | null;
	fluidNotes: string;
}

export interface Specimen {
	description: string;
	site: string;
	disposition: string;
}

export interface Implant {
	description: string;
	manufacturer: string;
	lotNumber: string;
	site: string;
}

export interface SpecimensImplants {
	specimens: Specimen[];
	implants: Implant[];
	prosthesisUsed: YesNo;
	drainsPlaced: string;
	cathetersPlaced: string;
}

export interface ImmediatePostopStatus {
	consciousLevel: ConsciousLevel;
	systolicBp: number | null;
	diastolicBp: number | null;
	heartRate: number | null;
	respiratoryRate: number | null;
	oxygenSaturation: number | null;
	temperature: number | null;
	painScore: number | null;
	painNotes: string;
	disposition: DispositionLocation;
}

export interface Complication {
	description: string;
	grade: ClavienDindoGradeKey;
	interventionRequired: string;
	timing: string;
}

export interface ComplicationsAssessment {
	complicationsOccurred: YesNo;
	complications: Complication[];
	narrative: string;
}

export interface PostopPlanInstructions {
	medicationsPrescribed: string;
	antibioticPlan: string;
	thromboprophylaxis: string;
	analgesiaPlan: string;
	dietPlan: string;
	mobilisationPlan: string;
	woundCareInstructions: string;
	followUpPlan: string;
	dischargeCriteria: string;
	alertsAndEscalation: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientDetails: PatientDetails;
	procedureDetails: ProcedureDetails;
	surgicalTeam: SurgicalTeam;
	intraoperativeFindings: IntraoperativeFindings;
	anaesthesiaSummary: AnaesthesiaSummary;
	bloodLossFluidBalance: BloodLossFluidBalance;
	specimensImplants: SpecimensImplants;
	immediatePostopStatus: ImmediatePostopStatus;
	complicationsAssessment: ComplicationsAssessment;
	postopPlanInstructions: PostopPlanInstructions;
}

// ──────────────────────────────────────────────
// Clavien-Dindo grading types
// ──────────────────────────────────────────────

export interface ClavienDindoRule {
	grade: Exclude<ClavienDindoGradeKey, ''>;
	label: string;
	shortLabel: string;
	description: string;
	order: number;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	grade: ClavienDindoGradeKey;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	overallGrade: ClavienDindoGradeKey;
	complicationCount: number;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
