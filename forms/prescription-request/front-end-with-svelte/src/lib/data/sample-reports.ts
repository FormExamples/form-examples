import type { AssessmentData, PriorityLevel } from '#lib/engine/types.js';
import { calculatePriorityLevel } from '#lib/engine/prescription-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample prescription request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  requestDate: string;
  data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  clinicianName: string;
  medicationName: string;
  dosage: string;
  requestType: string;
  priorityLevel: PriorityLevel;
  requestDate: string;
  flagCount: number;
}

/** A routine request: complete, substitutions permitted, refill. */
function routine(): AssessmentData {
  const d = createDefaultAssessment();
  d.patientInformation = { firstName: 'Jane', lastName: 'Doe', phone: '07700 900000', email: 'jane@example.com', nhsNumber: '943 476 5919' };
  d.clinicianInformation = { firstName: 'Anita', lastName: 'Smith', phone: '020 7946 0958', email: 'a.smith@nhs.net', nhsEmployeeNumber: 'C1234567' };
  d.prescriptionDetails = { requestDate: '2026-04-15', medicationName: 'Amoxicillin', dosage: '500mg', frequency: 'TDS', routeOfAdministration: 'oral', treatmentInstructions: 'Take with food, complete full course.' };
  d.substitutionOptions = { allowBrandSubstitution: 'yes', allowGenericSubstitution: 'yes', allowDosageAdjustment: 'yes', substitutionNotes: '' };
  d.requestType = { isNewPrescription: 'yes', isEmergency: 'no', additionalNotes: '' };
  return d;
}

/** An urgent request: no substitutions permitted. */
function urgentNoSubstitution(): AssessmentData {
  const d = createDefaultAssessment();
  d.patientInformation = { firstName: 'Sarah', lastName: 'Brown', phone: '07700 900111', email: 'sarah@example.com', nhsNumber: '167 293 8451' };
  d.clinicianInformation = { firstName: 'Tom', lastName: 'Taylor', phone: '020 7946 0102', email: 't.taylor@nhs.net', nhsEmployeeNumber: 'C7654321' };
  d.prescriptionDetails = { requestDate: '2026-04-15', medicationName: 'Insulin Glargine', dosage: '20 units', frequency: 'OD', routeOfAdministration: 'subcutaneous', treatmentInstructions: 'Administer at the same time each evening.' };
  d.substitutionOptions = { allowBrandSubstitution: 'no', allowGenericSubstitution: 'no', allowDosageAdjustment: 'no', substitutionNotes: 'Patient stabilised on this exact product.' };
  d.requestType = { isNewPrescription: 'no', isEmergency: 'no', additionalNotes: '' };
  return d;
}

/** An urgent request: incomplete clinician/medication detail (refill). */
function urgentIncomplete(): AssessmentData {
  const d = createDefaultAssessment();
  d.patientInformation = { firstName: 'Helen', lastName: 'Davies', phone: '07700 900222', email: 'helen@example.com', nhsNumber: '294 708 5316' };
  d.clinicianInformation = { firstName: 'Raj', lastName: 'Jones', phone: '020 7946 0303', email: '', nhsEmployeeNumber: '' };
  d.prescriptionDetails = { requestDate: '2026-04-14', medicationName: 'Sertraline', dosage: '', frequency: 'OD', routeOfAdministration: 'oral', treatmentInstructions: '' };
  d.substitutionOptions = { allowBrandSubstitution: 'yes', allowGenericSubstitution: 'yes', allowDosageAdjustment: 'yes', substitutionNotes: '' };
  d.requestType = { isNewPrescription: 'yes', isEmergency: 'no', additionalNotes: '' };
  return d;
}

/** An emergency request: immediate action required. */
function emergency(): AssessmentData {
  const d = createDefaultAssessment();
  d.patientInformation = { firstName: 'Margaret', lastName: 'Jones', phone: '07700 900333', email: 'margaret@example.com', nhsNumber: '384 615 7230' };
  d.clinicianInformation = { firstName: 'Owen', lastName: 'Williams', phone: '020 7946 0404', email: 'o.williams@nhs.net', nhsEmployeeNumber: 'C2468135' };
  d.prescriptionDetails = { requestDate: '2026-04-15', medicationName: 'EpiPen', dosage: '0.3mg', frequency: 'PRN', routeOfAdministration: 'intramuscular', treatmentInstructions: 'Use in the event of anaphylaxis; call emergency services.' };
  d.substitutionOptions = { allowBrandSubstitution: 'no', allowGenericSubstitution: 'no', allowDosageAdjustment: 'no', substitutionNotes: 'Exact auto-injector required.' };
  d.requestType = { isNewPrescription: 'yes', isEmergency: 'yes', additionalNotes: 'Known severe nut allergy.' };
  return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
  { id: 'RX-2026-0001', patientName: 'Doe, Jane', requestDate: '2026-04-15', data: routine() },
  { id: 'RX-2026-0002', patientName: 'Brown, Sarah', requestDate: '2026-04-15', data: urgentNoSubstitution() },
  { id: 'RX-2026-0003', patientName: 'Davies, Helen', requestDate: '2026-04-14', data: urgentIncomplete() },
  { id: 'RX-2026-0004', patientName: 'Jones, Margaret', requestDate: '2026-04-15', data: emergency() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const { priorityLevel } = calculatePriorityLevel(s.data);
  const flags = detectAdditionalFlags(s.data);
  return {
    id: s.id,
    patientName: s.patientName,
    clinicianName: `${s.data.clinicianInformation.firstName} ${s.data.clinicianInformation.lastName}`.trim(),
    medicationName: s.data.prescriptionDetails.medicationName,
    dosage: `${s.data.prescriptionDetails.dosage} ${s.data.prescriptionDetails.frequency}`.trim(),
    requestType: s.data.requestType.isNewPrescription === 'yes' ? 'New' : 'Refill',
    priorityLevel,
    requestDate: s.requestDate,
    flagCount: flags.length
  };
});
