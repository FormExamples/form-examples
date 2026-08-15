import type { AssessmentData, CompletenessStatus, Urgency } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/anaesthetic-record-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	operationDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	theatre: string;
	anaesthetistName: string;
	urgency: Urgency;
	operationDate: string;
	completenessPercent: number;
	status: CompletenessStatus;
	flagCount: number;
}

/** Sample 1 — an elective GA, fully documented: Complete, no flags. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'NHS-448 201 7743',
		patientName: 'Okafor, Beatrice',
		dateOfBirth: '1971-04-12',
		sex: 'female',
		weightKg: 78,
		heightCm: 165,
		theatre: 'Theatre 3',
		operationDate: '2026-06-22',
		anaesthetistName: 'Dr A. Rahman',
		assistantName: 'ODP J. Okonkwo',
		surgeonName: 'Mr T. Brand',
		plannedProcedure: 'Laparoscopic cholecystectomy',
		urgency: 'elective',
		anaestheticTechnique: 'general'
	};
	d.preInduction = {
		machineChecked: 'yes',
		whoSignIn: 'yes',
		whoTimeOut: 'yes',
		consentConfirmed: 'yes',
		fastingConfirmed: 'yes',
		ivAccess: '18G right hand',
		allergyBandChecked: 'yes',
		documentedAllergies: ''
	};
	d.asaAirway = {
		asaStatus: 'II',
		asaEmergencyModifier: 'no',
		mallampatiClass: 1,
		mouthOpeningCm: 4.5,
		thyromentalDistanceCm: 7,
		dentition: 'Intact',
		anticipatedDifficultAirway: 'no',
		priorDifficultIntubation: 'no'
	};
	d.drugs = [
		{
			drugName: 'Propofol',
			dose: 200,
			doseUnit: 'mg',
			route: 'iv',
			category: 'induction',
			administeredAt: '2026-06-22T08:32'
		},
		{
			drugName: 'Rocuronium',
			dose: 40,
			doseUnit: 'mg',
			route: 'iv',
			category: 'neuromuscular-blocker',
			administeredAt: '2026-06-22T08:33'
		},
		{
			drugName: 'Fentanyl',
			dose: 100,
			doseUnit: 'mcg',
			route: 'iv',
			category: 'analgesia',
			administeredAt: '2026-06-22T08:31'
		}
	];
	d.airway = {
		airwayTechnique: 'tracheal-tube',
		deviceSize: '7.5 ETT',
		tubeDepthCm: 21,
		cuffed: 'yes',
		cormackLehaneGrade: 1,
		intubationAttempts: 1,
		capnographyConfirmed: 'yes'
	};
	d.monitoring = {
		monitoringModalities: ['ecg', 'nibp', 'spo2', 'capnography', 'temperature']
	};
	d.observations = [
		{
			observedAt: '2026-06-22T08:45',
			systolicBloodPressure: 118,
			diastolicBloodPressure: 72,
			heartRate: 68,
			spo2: 99,
			endTidalCo2: 4.8,
			temperature: 36.5,
			agentPercent: 2,
			freshGasFlowL: 1
		},
		{
			observedAt: '2026-06-22T09:15',
			systolicBloodPressure: 112,
			diastolicBloodPressure: 70,
			heartRate: 64,
			spo2: 99,
			endTidalCo2: 4.6,
			temperature: 36.6,
			agentPercent: 1.8,
			freshGasFlowL: 1
		}
	];
	d.fluids = {
		crystalloidMl: 1000,
		colloidMl: null,
		bloodProductsMl: null,
		estimatedBloodLossMl: 50,
		urineOutputMl: 200,
		cellSalvageMl: null
	};
	d.handover = {
		recoveryDestination: 'recovery',
		handoverAirwayStatus: 'Extubated, self-ventilating',
		analgesiaPlan: 'Paracetamol regular, oxycodone PRN',
		antiemeticPlan: 'Ondansetron PRN',
		oxygenPlan: '2 L/min via nasal cannulae',
		outstandingTasks: 'None',
		handoverAt: '2026-06-22T09:40',
		receivingPractitioner: 'Recovery nurse S. Patel'
	};
	d.signoff = { anaesthetistSignature: 'A. Rahman', signedAt: '2026-06-22T09:42' };
	return d;
}

/** Sample 2 — urgent case missing only the fluids summary: Partial, 1 flag. */
function partial(): AssessmentData {
	const d = complete();
	d.identification = {
		...d.identification,
		patientIdentifier: 'NHS-551 903 2210',
		patientName: 'Whitfield, Harold',
		dateOfBirth: '1958-11-03',
		sex: 'male',
		weightKg: 84,
		theatre: 'Theatre 1',
		operationDate: '2026-06-23',
		anaesthetistName: 'Dr S. Okoye',
		surgeonName: 'Miss R. Cole',
		plannedProcedure: 'Open reduction internal fixation, ankle',
		urgency: 'urgent'
	};
	// Drop the fluids summary → one non-critical mandatory item missing.
	d.fluids = {
		crystalloidMl: null,
		colloidMl: null,
		bloodProductsMl: null,
		estimatedBloodLossMl: null,
		urineOutputMl: null,
		cellSalvageMl: null
	};
	d.signoff = { anaesthetistSignature: 'S. Okoye', signedAt: '2026-06-23T14:10' };
	return d;
}

/** Sample 3 — emergency case, part-filled: Incomplete, multiple high flags. */
function incomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'NHS-100 442 8890',
		patientName: 'Nowak, Irena',
		dateOfBirth: '1990-02-19',
		sex: 'female',
		weightKg: 66,
		heightCm: 168,
		theatre: 'Obstetric Theatre',
		operationDate: '2026-06-24',
		anaesthetistName: 'Dr L. Fernandes',
		assistantName: '',
		surgeonName: 'Mr D. Hale',
		plannedProcedure: 'Category-1 caesarean section',
		urgency: 'emergency',
		anaestheticTechnique: 'general'
	};
	d.preInduction = {
		machineChecked: 'yes',
		whoSignIn: 'yes',
		whoTimeOut: '', // WHO checklist incomplete → critical rule unsatisfied + high flag
		consentConfirmed: '', // → unlogged-consent high flag
		fastingConfirmed: 'no',
		ivAccess: '16G left forearm',
		allergyBandChecked: 'yes',
		documentedAllergies: ''
	};
	d.asaAirway = {
		asaStatus: 'III',
		asaEmergencyModifier: 'yes',
		mallampatiClass: 2,
		mouthOpeningCm: null,
		thyromentalDistanceCm: null,
		dentition: '',
		anticipatedDifficultAirway: 'no',
		priorDifficultIntubation: 'no'
	};
	d.drugs = [
		{
			drugName: 'Thiopental',
			dose: 350,
			doseUnit: 'mg',
			route: 'iv',
			category: 'induction',
			administeredAt: '2026-06-24T02:11'
		},
		{
			drugName: 'Suxamethonium',
			dose: 100,
			doseUnit: 'mg',
			route: 'iv',
			category: 'neuromuscular-blocker',
			administeredAt: '2026-06-24T02:11'
		}
	];
	// airwayTechnique left blank → critical rule unsatisfied.
	d.monitoring = { monitoringModalities: ['ecg', 'nibp', 'spo2', 'capnography'] };
	d.observations = [
		{
			observedAt: '2026-06-24T02:14',
			systolicBloodPressure: 86, // < 90 → physiological-derangement medium flag
			diastolicBloodPressure: 52,
			heartRate: 118,
			spo2: 96,
			endTidalCo2: 4.2,
			temperature: 36,
			agentPercent: 1.5,
			freshGasFlowL: 2
		}
	];
	d.fluids = {
		crystalloidMl: 1500,
		colloidMl: null,
		bloodProductsMl: null,
		estimatedBloodLossMl: 700,
		urineOutputMl: null,
		cellSalvageMl: null
	};
	d.events = [
		{
			eventType: 'hypotension',
			occurredAt: '2026-06-24T02:14',
			management: 'Phenylephrine boluses; fluids'
		}
	];
	d.handover = {
		recoveryDestination: 'icu',
		handoverAirwayStatus: 'Intubated and ventilated',
		analgesiaPlan: 'Morphine PCA',
		antiemeticPlan: '',
		oxygenPlan: 'Ventilator',
		outstandingTasks: 'Chase haemoglobin',
		handoverAt: '',
		receivingPractitioner: ''
	};
	// signature left blank → critical rule unsatisfied.
	return d;
}

/** Sample 4 — elective case, fully documented but with a difficult airway: Complete, 1 flag. */
function completeWithFlag(): AssessmentData {
	const d = complete();
	d.identification = {
		...d.identification,
		patientIdentifier: 'NHS-204 981 5567',
		patientName: 'Ahmed, Yusuf',
		dateOfBirth: '1965-07-30',
		sex: 'male',
		weightKg: 92,
		theatre: 'Day Surgery 2',
		operationDate: '2026-06-25',
		anaesthetistName: 'Dr A. Rahman',
		surgeonName: 'Mr P. Vane',
		plannedProcedure: 'Panendoscopy',
		urgency: 'elective'
	};
	d.asaAirway = {
		...d.asaAirway,
		asaStatus: 'III',
		mallampatiClass: 3,
		anticipatedDifficultAirway: 'yes' // → difficult-airway high flag
	};
	d.airway = {
		...d.airway,
		airwayTechnique: 'awake-foi',
		deviceSize: '7.0 ETT',
		cormackLehaneGrade: 2,
		intubationAttempts: 1
	};
	d.events = [
		{
			eventType: 'difficult-airway',
			occurredAt: '2026-06-25T09:05',
			management: 'Awake fibreoptic intubation; DAS plan followed'
		}
	];
	d.signoff = { anaesthetistSignature: 'A. Rahman', signedAt: '2026-06-25T10:20' };
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'AR-2026-0001',
		patientName: 'Okafor, Beatrice',
		operationDate: '2026-06-22',
		data: complete()
	},
	{
		id: 'AR-2026-0002',
		patientName: 'Whitfield, Harold',
		operationDate: '2026-06-23',
		data: partial()
	},
	{ id: 'AR-2026-0003', patientName: 'Nowak, Irena', operationDate: '2026-06-24', data: incomplete() },
	{
		id: 'AR-2026-0004',
		patientName: 'Ahmed, Yusuf',
		operationDate: '2026-06-25',
		data: completeWithFlag()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		theatre: s.data.identification.theatre,
		anaesthetistName: s.data.identification.anaesthetistName,
		urgency: s.data.identification.urgency,
		operationDate: s.operationDate,
		completenessPercent: g.completenessPercent,
		status: g.status,
		flagCount: g.flaggedIssues.length
	};
});
