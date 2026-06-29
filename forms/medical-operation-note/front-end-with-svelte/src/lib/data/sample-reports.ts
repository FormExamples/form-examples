import type {
  OperationNote,
  CompositeRisk,
  ClavienDindoGrade,
  BloodLossBand,
} from '$lib/engine/types.js';
import { calculateOperationGrade } from '$lib/engine/composite-grader.js';
import { createDefaultOperationNote } from '$lib/state.svelte.js';

/** A sample operation note: an identifier plus the full data the engine grades. */
export interface SampleOperationNote {
  id: string;
  patientName: string;
  operationDate: string;
  data: OperationNote;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  hospital: string;
  surgeon: string;
  procedure: string;
  urgency: string;
  compositeRisk: CompositeRisk;
  clavienDindoGrade: ClavienDindoGrade;
  bloodLossBand: BloodLossBand;
  estimatedBloodLossMl: number | null;
  countsAgreed: boolean;
  neverEventFlagged: boolean;
  recoveryDestination: string;
  flagCount: number;
  signed: boolean;
}

/** Lead surgeon name from the team list, or em-dash. */
function leadSurgeon(d: OperationNote): string {
  const lead = d.team.find((m) => m.role === 'lead-surgeon') ?? d.team[0];
  return lead?.name || '—';
}

/** Routine: clean elective laparoscopic case, all counts agreed, low EBL. */
function routine(): OperationNote {
  const d = createDefaultOperationNote();
  d.operation = {
    ...d.operation,
    hospital: 'Royal United Hospital Bath',
    theatreNumber: 'OR-3',
    listType: 'elective',
    knifeToSkinAt: '2026-06-10T09:15',
    endOfSurgeryAt: '2026-06-10T10:05',
  };
  d.patient = { ...d.patient, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male', nhsNumber: '943 476 5919' };
  d.team = [{ role: 'lead-surgeon', name: 'Miss R Adeyemi', registrationBody: 'GMC', registrationNumber: '7012345' }];
  d.diagnosesAndProcedures = {
    ...d.diagnosesAndProcedures,
    preOperativeDiagnosis: 'Symptomatic cholelithiasis',
    postOperativeDiagnosis: 'Symptomatic cholelithiasis',
    plannedProcedures: 'Laparoscopic cholecystectomy',
    performedProcedures: 'Laparoscopic cholecystectomy',
    opcs4Codes: 'J18.3',
    urgency: 'elective',
    laterality: 'na',
  };
  d.anaesthesia = { ...d.anaesthesia, type: 'ga', airway: 'ett' };
  d.safetyCountsEbl = {
    ...d.safetyCountsEbl,
    swabCountFirst: 12, swabCountFinal: 12, swabCountAgreed: 'yes',
    needleCountFirst: 4, needleCountFinal: 4, needleCountAgreed: 'yes',
    instrumentCountFirst: 30, instrumentCountFinal: 30, instrumentCountAgreed: 'yes',
    estimatedBloodLossMl: 50,
    clavienDindoGrade: '0',
  };
  d.postOperativePlan = { ...d.postOperativePlan, recoveryDestination: 'ward', whoSignOutCompleted: 'yes' };
  d.signOff = { ...d.signOff, asaPhysicalStatus: 2, electronicSignatureName: 'R Adeyemi', dictationTimestamp: '2026-06-10T10:20' };
  return d;
}

/** Complicated: conversion to open, moderate EBL, Clavien–Dindo II. */
function complicated(): OperationNote {
  const d = createDefaultOperationNote();
  d.operation = {
    ...d.operation,
    hospital: 'Manchester Royal Infirmary',
    theatreNumber: 'OR-7',
    listType: 'cepod',
    knifeToSkinAt: '2026-06-12T14:00',
    endOfSurgeryAt: '2026-06-12T16:30',
  };
  d.patient = { ...d.patient, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', nhsNumber: '684 328 7411' };
  d.team = [{ role: 'lead-surgeon', name: 'Mr A Khan', registrationBody: 'GMC', registrationNumber: '6534210' }];
  d.diagnosesAndProcedures = {
    ...d.diagnosesAndProcedures,
    preOperativeDiagnosis: 'Acute appendicitis',
    postOperativeDiagnosis: 'Perforated appendicitis with localised peritonitis',
    plannedProcedures: 'Laparoscopic appendicectomy',
    performedProcedures: 'Appendicectomy, converted to open',
    opcs4Codes: 'H01.1',
    urgency: 'urgent',
    laterality: 'right',
  };
  d.anaesthesia = { ...d.anaesthesia, type: 'ga', airway: 'ett' };
  d.safetyCountsEbl = {
    ...d.safetyCountsEbl,
    swabCountFirst: 18, swabCountFinal: 18, swabCountAgreed: 'yes',
    needleCountFirst: 6, needleCountFinal: 6, needleCountAgreed: 'yes',
    instrumentCountFirst: 35, instrumentCountFinal: 35, instrumentCountAgreed: 'yes',
    estimatedBloodLossMl: 400,
    clavienDindoGrade: 'II',
    complicationDescription: 'Post-op ileus requiring nasogastric decompression',
    conversionToOpen: 'yes',
  };
  d.postOperativePlan = { ...d.postOperativePlan, recoveryDestination: 'ward', whoSignOutCompleted: 'yes' };
  d.signOff = { ...d.signOff, asaPhysicalStatus: 3, electronicSignatureName: 'A Khan', dictationTimestamp: '2026-06-12T16:45' };
  return d;
}

/** High-risk: massive haemorrhage, ≥ 4 PRBC, ASA IV, unplanned ICU. */
function highRisk(): OperationNote {
  const d = createDefaultOperationNote();
  d.operation = {
    ...d.operation,
    hospital: "St George's Hospital London",
    theatreNumber: 'OR-1',
    listType: 'trauma',
    knifeToSkinAt: '2026-06-15T02:10',
    endOfSurgeryAt: '2026-06-15T06:40',
  };
  d.patient = { ...d.patient, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female', nhsNumber: '500 264 7813' };
  d.team = [{ role: 'lead-surgeon', name: 'Miss L Okonkwo', registrationBody: 'GMC', registrationNumber: '7188902' }];
  d.diagnosesAndProcedures = {
    ...d.diagnosesAndProcedures,
    preOperativeDiagnosis: 'Ruptured abdominal aortic aneurysm',
    postOperativeDiagnosis: 'Ruptured abdominal aortic aneurysm',
    plannedProcedures: 'Open AAA repair',
    performedProcedures: 'Open repair of ruptured abdominal aortic aneurysm with tube graft',
    opcs4Codes: 'L19.4',
    urgency: 'immediate',
    laterality: 'midline',
  };
  d.anaesthesia = { ...d.anaesthesia, type: 'ga', airway: 'ett', bloodMl: 2000 };
  d.materialsImplants = { ...d.materialsImplants, vascularGrafts: 'Dacron tube graft 20 mm', registrySubmitted: 'no' };
  d.safetyCountsEbl = {
    ...d.safetyCountsEbl,
    swabCountFirst: 40, swabCountFinal: 40, swabCountAgreed: 'yes',
    needleCountFirst: 12, needleCountFinal: 12, needleCountAgreed: 'yes',
    instrumentCountFirst: 60, instrumentCountFinal: 60, instrumentCountAgreed: 'yes',
    estimatedBloodLossMl: 2800,
    prbcUnits: 6, ffpUnits: 4, plateletsUnits: 1,
    massiveHaemorrhageProtocolActivated: 'yes',
    clavienDindoGrade: 'II',
  };
  d.postOperativePlan = { ...d.postOperativePlan, recoveryDestination: 'icu', unplannedEscalation: 'yes', whoSignOutCompleted: 'yes' };
  d.signOff = { ...d.signOff, asaPhysicalStatus: 4, electronicSignatureName: 'L Okonkwo', dictationTimestamp: '2026-06-15T07:00' };
  return d;
}

/** Critical: retained foreign body never-event, count discrepancy, arrest. */
function critical(): OperationNote {
  const d = createDefaultOperationNote();
  d.operation = {
    ...d.operation,
    hospital: 'Leeds General Infirmary',
    theatreNumber: 'OR-5',
    listType: 'cepod',
    knifeToSkinAt: '2026-06-18T20:30',
    endOfSurgeryAt: '2026-06-19T00:15',
  };
  d.patient = { ...d.patient, firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', nhsNumber: '485 777 3456' };
  d.team = [{ role: 'lead-surgeon', name: 'Mr P Sharma', registrationBody: 'GMC', registrationNumber: '6901233' }];
  d.diagnosesAndProcedures = {
    ...d.diagnosesAndProcedures,
    preOperativeDiagnosis: 'Generalised faecal peritonitis',
    postOperativeDiagnosis: 'Perforated sigmoid diverticulitis',
    plannedProcedures: 'Hartmann procedure',
    performedProcedures: 'Hartmann procedure with end colostomy',
    opcs4Codes: 'H33.5',
    urgency: 'immediate',
    laterality: 'na',
  };
  d.anaesthesia = { ...d.anaesthesia, type: 'ga', airway: 'ett', events: 'failed-intubation' };
  d.safetyCountsEbl = {
    ...d.safetyCountsEbl,
    swabCountFirst: 25, swabCountFinal: 24, swabCountAgreed: 'no',
    needleCountFirst: 8, needleCountFinal: 8, needleCountAgreed: 'yes',
    instrumentCountFirst: 45, instrumentCountFinal: 45, instrumentCountAgreed: 'yes',
    countDiscrepancyResolution: 'X-ray pending',
    estimatedBloodLossMl: 1200,
    prbcUnits: 2,
    clavienDindoGrade: 'IVa',
    complicationDescription: 'Intra-operative cardiac arrest, ROSC after 4 minutes',
    retainedForeignBody: 'yes',
    intraOperativeArrest: 'yes',
  };
  d.postOperativePlan = { ...d.postOperativePlan, recoveryDestination: 'icu', unplannedEscalation: 'yes', whoSignOutCompleted: 'no' };
  d.signOff = { ...d.signOff, asaPhysicalStatus: 5, documentationGap: 'yes', electronicSignatureName: '' };
  return d;
}

/** The sample operation notes, keyed by stable id (used to seed the wizard). */
export const sampleOperationNotes: SampleOperationNote[] = [
  { id: 'ON-2026-0001', patientName: 'Smith, John', operationDate: '2026-06-10', data: routine() },
  { id: 'ON-2026-0002', patientName: 'Patel, Priya', operationDate: '2026-06-12', data: complicated() },
  { id: 'ON-2026-0003', patientName: 'Jones, Margaret', operationDate: '2026-06-15', data: highRisk() },
  { id: 'ON-2026-0004', patientName: 'Williams, David', operationDate: '2026-06-18', data: critical() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleOperationNoteRows: DashboardRow[] = sampleOperationNotes.map((s) => {
  const g = calculateOperationGrade(s.data);
  const d = s.data;
  return {
    id: s.id,
    patientName: s.patientName,
    hospital: d.operation.hospital,
    surgeon: leadSurgeon(d),
    procedure: `${d.diagnosesAndProcedures.performedProcedures}${d.diagnosesAndProcedures.opcs4Codes ? ` (${d.diagnosesAndProcedures.opcs4Codes})` : ''}`,
    urgency: d.diagnosesAndProcedures.urgency,
    compositeRisk: g.finalRisk,
    clavienDindoGrade: g.clavienDindoGrade,
    bloodLossBand: g.bloodLossBand,
    estimatedBloodLossMl: d.safetyCountsEbl.estimatedBloodLossMl,
    countsAgreed: g.countsAgreed,
    neverEventFlagged: g.additionalFlags.some(
      (f) => f.category === 'never-event' || f.category === 'retained-foreign-body',
    ),
    recoveryDestination: d.postOperativePlan.recoveryDestination,
    flagCount: g.additionalFlags.length,
    signed: d.signOff.electronicSignatureName.trim() !== '',
  };
});
