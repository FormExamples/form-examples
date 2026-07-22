import type { AsaGrade, ClinicianAssessment, CompositeRisk } from '$lib/engine/types.js';
import { calculateASA } from '$lib/engine/composite-grader.js';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  assessedDate: string;
  data: ClinicianAssessment;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  assessedDate: string;
  procedure: string;
  asaGrade: AsaGrade;
  rcriScore: number;
  stopbangScore: number;
  frailtyScale: number | null;
  compositeRisk: CompositeRisk;
  flagCount: number;
}

/** A low-risk assessment: fit patient, minor surgery, no rules fire (ASA I). */
function lowRisk(): ClinicianAssessment {
  const d = createDefaultAssessment();
  d.clinician = {
    ...d.clinician,
    clinicianName: 'Dr E Khan',
    clinicianRole: 'anaesthetist',
    registrationBody: 'GMC',
    registrationNumber: '7654321',
    siteName: 'Day Surgery Unit',
    assessmentDate: '2026-06-10',
    assessmentTime: '09:15',
  };
  d.patient = {
    ...d.patient,
    firstName: 'David',
    lastName: 'Brown',
    dateOfBirth: '1985-03-14',
    nhsNumber: '456 789 0123',
    sex: 'male',
    weightKg: 76,
    heightCm: 180,
  };
  d.surgery = {
    ...d.surgery,
    plannedProcedure: 'Inguinal hernia repair',
    surgicalSpecialty: 'General surgery',
    urgency: 'elective',
    surgicalSeverity: 'minor',
    consultantSurgeon: 'Mr A Field',
  };
  d.vitals = { ...d.vitals, systolicBp: 124, diastolicBp: 78, heartRate: 68, spo2Percent: 99, onRoomAir: 'yes' };
  d.airway = { ...d.airway, mallampatiClass: 'I' };
  d.functionalCapacity = { ...d.functionalCapacity, metsEstimate: 8, clinicalFrailtyScale: 2 };
  d.anaesthesiaPlan = { ...d.anaesthesiaPlan, technique: 'ga', airwayPlan: 'supraglottic', postOpDisposition: 'day-case' };
  return d;
}

/** A moderate-risk assessment: ASA II — controlled diabetes, obesity, smoker. */
function moderateRisk(): ClinicianAssessment {
  const d = createDefaultAssessment();
  d.clinician = {
    ...d.clinician,
    clinicianName: 'Dr C Patel',
    clinicianRole: 'anaesthetist',
    registrationBody: 'GMC',
    registrationNumber: '6543210',
    siteName: 'Pre-operative Assessment Clinic',
    assessmentDate: '2026-06-12',
    assessmentTime: '11:40',
  };
  d.patient = {
    ...d.patient,
    firstName: 'Bob',
    lastName: 'Jones',
    dateOfBirth: '1963-07-22',
    nhsNumber: '234 567 8901',
    sex: 'male',
    weightKg: 102,
    heightCm: 176,
  };
  d.surgery = {
    ...d.surgery,
    plannedProcedure: 'Laparoscopic cholecystectomy',
    surgicalSpecialty: 'Upper GI surgery',
    urgency: 'elective',
    surgicalSeverity: 'intermediate',
    consultantSurgeon: 'Ms B Carr',
  };
  d.vitals = { ...d.vitals, systolicBp: 138, diastolicBp: 84, heartRate: 76, spo2Percent: 97, onRoomAir: 'yes' };
  d.airway = {
    ...d.airway,
    mallampatiClass: 'II',
    stopbangSnoring: 'yes',
    stopbangTired: 'yes',
    stopbangBmiGt35: 'no',
    stopbangAgeGt50: 'yes',
    stopbangMale: 'yes',
  };
  d.respiratory = { ...d.respiratory, asthma: 'controlled', smokingStatus: 'current', packYears: 20 };
  d.endocrine = { ...d.endocrine, diabetesType: 'type-2', diabetesControl: 'well-controlled', hba1cMmolMol: 48 };
  d.functionalCapacity = { ...d.functionalCapacity, metsEstimate: 5, clinicalFrailtyScale: 3 };
  d.anaesthesiaPlan = { ...d.anaesthesiaPlan, technique: 'ga', airwayPlan: 'ett', postOpDisposition: 'ward' };
  return d;
}

/** A high-risk assessment: ASA III — prior MI, moderate EF, CFS 5, RCRI ≥ 2. */
function highRisk(): ClinicianAssessment {
  const d = createDefaultAssessment();
  d.clinician = {
    ...d.clinician,
    clinicianName: 'Dr B Adams',
    clinicianRole: 'perioperative-physician',
    registrationBody: 'GMC',
    registrationNumber: '5432109',
    siteName: 'High-Risk Anaesthesia Clinic',
    assessmentDate: '2026-06-15',
    assessmentTime: '14:05',
  };
  d.patient = {
    ...d.patient,
    firstName: 'Alice',
    lastName: 'Smith',
    dateOfBirth: '1949-11-02',
    nhsNumber: '123 456 7890',
    sex: 'female',
    weightKg: 64,
    heightCm: 158,
  };
  d.surgery = {
    ...d.surgery,
    plannedProcedure: 'Right total hip arthroplasty',
    surgicalSpecialty: 'Orthopaedics',
    urgency: 'elective',
    laterality: 'right',
    surgicalSeverity: 'major',
    anticipatedBloodLossMl: 600,
    consultantSurgeon: 'Mr D Hart',
  };
  d.vitals = { ...d.vitals, systolicBp: 152, diastolicBp: 88, heartRate: 80, spo2Percent: 95, onRoomAir: 'yes' };
  d.airway = { ...d.airway, mallampatiClass: 'III' };
  d.cardiovascular = {
    ...d.cardiovascular,
    historyIhd: 'yes',
    historyChf: 'yes',
    echoPerformed: 'yes',
    echoEfPercent: 36,
    pacemakerOrIcd: 'yes',
  };
  d.renalHepatic = { ...d.renalHepatic, creatinineUmolL: 168, egfrMlMin173m2: 42 };
  d.endocrine = { ...d.endocrine, diabetesType: 'type-2', diabetesOnInsulin: 'yes', diabetesControl: 'suboptimal', hba1cMmolMol: 62 };
  d.haematology = { ...d.haematology, hbGL: 104, groupAndSave: 'ordered' };
  d.functionalCapacity = { ...d.functionalCapacity, metsEstimate: 3, clinicalFrailtyScale: 5 };
  d.anaesthesiaPlan = { ...d.anaesthesiaPlan, technique: 'combined-ga-regional', airwayPlan: 'ett', monitoringLevel: 'invasive-arterial', postOpDisposition: 'enhanced-care' };
  return d;
}

/** A critical assessment: ASA IV — recent MI, severe frailty, fasting violation. */
function critical(): ClinicianAssessment {
  const d = createDefaultAssessment();
  d.clinician = {
    ...d.clinician,
    clinicianName: 'Dr D Williams',
    clinicianRole: 'anaesthetist',
    registrationBody: 'GMC',
    registrationNumber: '4321098',
    siteName: 'Emergency Theatres',
    assessmentDate: '2026-06-18',
    assessmentTime: '02:30',
  };
  d.patient = {
    ...d.patient,
    firstName: 'Carol',
    lastName: 'Lee',
    dateOfBirth: '1940-05-19',
    nhsNumber: '345 678 9012',
    sex: 'female',
    weightKg: 52,
    heightCm: 156,
  };
  d.surgery = {
    ...d.surgery,
    plannedProcedure: 'Dynamic hip screw for fractured neck of femur',
    surgicalSpecialty: 'Orthopaedics',
    urgency: 'emergency',
    laterality: 'left',
    surgicalSeverity: 'major',
    anticipatedBloodLossMl: 700,
    consultantSurgeon: 'Mr G North',
  };
  d.vitals = { ...d.vitals, systolicBp: 168, diastolicBp: 96, heartRate: 104, spo2Percent: 90, onRoomAir: 'yes' };
  d.airway = { ...d.airway, mallampatiClass: 'III', priorDifficultIntubation: 'yes' };
  d.cardiovascular = {
    ...d.cardiovascular,
    historyIhd: 'yes',
    historyChf: 'yes',
    recentMiWithin3Months: 'yes',
    echoPerformed: 'yes',
    echoEfPercent: 28,
    activeAngina: 'yes',
  };
  d.renalHepatic = { ...d.renalHepatic, creatinineUmolL: 210, egfrMlMin173m2: 24 };
  d.endocrine = { ...d.endocrine, diabetesType: 'type-2', diabetesOnInsulin: 'yes', diabetesControl: 'poor', hba1cMmolMol: 82 };
  d.haematology = { ...d.haematology, hbGL: 76, groupAndSave: 'ordered' };
  d.gastrointestinal = { ...d.gastrointestinal, fastingConfirmed: 'no' };
  d.functionalCapacity = { ...d.functionalCapacity, metsEstimate: 1, clinicalFrailtyScale: 7, malnutritionRisk: 'high' };
  d.anaesthesiaPlan = { ...d.anaesthesiaPlan, technique: 'ga', airwayPlan: 'ett', rsiPlanned: 'yes', monitoringLevel: 'invasive-cvc', postOpDisposition: 'icu' };
  d.summary = { ...d.summary, recommendation: 'mdt-review' };
  return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
  { id: 'POA-2026-0001', patientName: 'Brown, David', assessedDate: '2026-06-10', data: lowRisk() },
  { id: 'POA-2026-0002', patientName: 'Jones, Bob', assessedDate: '2026-06-12', data: moderateRisk() },
  { id: 'POA-2026-0003', patientName: 'Smith, Alice', assessedDate: '2026-06-15', data: highRisk() },
  { id: 'POA-2026-0004', patientName: 'Lee, Carol', assessedDate: '2026-06-18', data: critical() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const g = calculateASA(s.data);
  return {
    id: s.id,
    patientName: s.patientName,
    assessedDate: s.assessedDate,
    procedure: s.data.surgery.plannedProcedure,
    asaGrade: g.finalAsaGrade || g.computedAsaGrade,
    rcriScore: g.rcriScore,
    stopbangScore: g.stopbangScore,
    frailtyScale: g.frailtyScale,
    compositeRisk: g.compositeRisk,
    flagCount: g.additionalFlags.length,
  };
});
