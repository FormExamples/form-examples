// Sample assessments and the dashboard rows derived from them.
//
// One sample per persona in examples/personas.json (the engine's own
// regression oracle), so the dashboard's offline sample data and the persona
// expectations cannot disagree. The dashboard rows are produced by running
// the shared engine over each sample, never typed by hand.

import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { gradeDevice } from '#lib/engine/device-grader.js';
import type { AssessmentData, DashboardRow } from '#lib/engine/types.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  data: AssessmentData;
}

/** Overlay a persona's partial answers on the blank defaults. */
function sample(overrides: Partial<AssessmentData>): AssessmentData {
  return { ...createDefaultAssessment(), ...overrides };
}

export const sampleAssessments: SampleAssessment[] = [
  {
    id: 'MDA-2026-0001',
    data: sample({
      intendedPurpose: 'Adhesive bandage: Rule 1, Class I, self-declaration.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceName: 'Bandage class i',
      deviceKind: 'non-invasive',
      bodySite: 'intact-skin',
      assessmentDate: '2026-09-01'
    })
  },
  {
    id: 'MDA-2026-0002',
    data: sample({
      intendedPurpose: 'Sterile wound dressing: Class Is, partial notified-body route.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'non-invasive',
      suppliedSterile: 'yes',
      deviceName: 'Sterile dressing is',
      assessmentDate: '2026-09-02'
    })
  },
  {
    id: 'MDA-2026-0003',
    data: sample({
      intendedPurpose: 'Reusable surgical scalpel: Class Ir.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'surgically-invasive',
      contactDuration: 'transient',
      reusableSurgicalInstrument: 'yes',
      deviceName: 'Reusable scalpel ir',
      assessmentDate: '2026-09-03'
    })
  },
  {
    id: 'MDA-2026-0004',
    data: sample({
      intendedPurpose: 'Short-term urinary catheter: Rule 5, Class IIa.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'invasive-body-orifice',
      contactDuration: 'short-term',
      bodySite: 'other-orifice',
      deviceName: 'Urinary catheter iia',
      assessmentDate: '2026-09-04'
    })
  },
  {
    id: 'MDA-2026-0005',
    data: sample({
      intendedPurpose: 'Hip joint implant: Rule 8, Class IIb.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'implantable',
      bodySite: 'tissue',
      deviceName: 'Hip implant iib',
      assessmentDate: '2026-09-05'
    })
  },
  {
    id: 'MDA-2026-0006',
    data: sample({
      intendedPurpose: 'Cardiac pacemaker: implant in heart, Class III.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'implantable',
      bodySite: 'heart',
      activeTherapeutic: 'yes',
      administersOrExchangesEnergy: 'yes',
      deviceName: 'Pacemaker iii',
      assessmentDate: '2026-09-06'
    })
  },
  {
    id: 'MDA-2026-0007',
    data: sample({
      intendedPurpose: 'Decision-support app, other harm: Rule 11, Class IIa.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'software',
      softwarePurpose: 'provides-information-for-decisions',
      softwareWorstCaseHarm: 'other',
      deviceName: 'Diagnostic app iia',
      assessmentDate: '2026-09-07'
    })
  },
  {
    id: 'MDA-2026-0008',
    data: sample({
      intendedPurpose: 'Closed-loop insulin pump: Rule 22, Class III.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'active',
      activeTherapeutic: 'yes',
      administersOrRemovesMedicinalSubstances: 'yes',
      closedLoopTherapy: 'yes',
      deviceName: 'Insulin loop iii',
      assessmentDate: '2026-09-08'
    })
  },
  {
    id: 'MDA-2026-0009',
    data: sample({
      intendedPurpose: 'In vitro diagnostic: blocked, IVDR applies.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      isInVitroDiagnostic: 'yes',
      deviceKind: 'non-invasive',
      deviceName: 'Ivd out of scope',
      assessmentDate: '2026-09-09'
    })
  },
  {
    id: 'MDA-2026-0010',
    data: sample({
      intendedPurpose: 'Class IIa device with no risk file, no QMS: readiness gaps.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'no',
      qualityManagementSystemIso13485: '',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'invasive-body-orifice',
      contactDuration: 'short-term',
      bodySite: 'other-orifice',
      deviceName: 'Gaps class iia',
      assessmentDate: '2026-09-10'
    })
  },
  {
    id: 'MDA-2026-0011',
    data: sample({
      intendedPurpose: 'Assessor overrides computed IIb to IIa with reason: class-override flag.',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceKind: 'implantable',
      bodySite: 'tissue',
      finalDeviceClass: 'IIa',
      overrideReason: 'Per notified body opinion',
      deviceName: 'Override down',
      assessmentDate: '2026-09-11'
    })
  },
  {
    id: 'MDA-2026-0012',
    data: sample({
      intendedPurpose: 'Software with no purpose recorded: fail-safe IIa.',
      deviceKind: 'software',
      clinicalEvidenceStatus: 'complete',
      riskManagementFileIso14971: 'yes',
      qualityManagementSystemIso13485: 'yes',
      cybersecurityAssessmentDone: 'yes',
      postMarketSurveillancePlan: 'yes',
      uniqueDeviceIdentifierAssigned: 'yes',
      deviceName: 'Software purpose blank failsafe',
      assessmentDate: '2026-09-12'
    })
  }
];

/** Dashboard rows: the shared engine run over every sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map(({ id, data }) => {
  const r = gradeDevice(data);
  return {
    id,
    date: data.assessmentDate ?? '',
    device: data.deviceName || 'Unnamed device',
    deviceKind: data.deviceKind,
    computedClass: r.computedDeviceClass,
    finalClass: r.finalDeviceClass,
    classSuffix: r.classSuffix,
    conformityRoute: r.conformityRoute,
    determiningRule: r.determiningRule,
    readiness: r.regulatoryReadiness,
    flags: r.additionalFlags.map((f) => f.flagId),
    summary: data.intendedPurpose
  };
});
