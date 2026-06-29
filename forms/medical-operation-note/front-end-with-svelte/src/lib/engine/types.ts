/**
 * Type contract for the Medical Operation Note (operating-team-recorded
 * surgical procedure note).
 *
 * All field names use camelCase. Conventions:
 *   - Empty string '' for unanswered text / enum fields
 *   - null for unanswered numeric / date / time fields
 *
 * The grading engine entry point is `calculateOperationGrade(data)` in
 * composite-grader.ts. The algorithm is **max-grade** — the worst
 * finding sets the composite grade; Routine is the default.
 */

export type YesNo = 'yes' | 'no' | '';

export type CompositeRisk = 'routine' | 'complicated' | 'high-risk' | 'critical';
export type ClavienDindoGrade = '0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V';
export type AsaPhysicalStatus = 1 | 2 | 3 | 4 | 5 | 6 | null;
export type BloodLossBand = 'minimal' | 'mild' | 'moderate' | 'severe' | 'massive';
export type FlagPriority = 'low' | 'medium' | 'high';

export interface OperationIdentification {
  hospital: string;
  theatreNumber: string;
  listType: 'elective' | 'cepod' | 'trauma' | 'obstetric' | 'day-case' | 'endoscopy' | '';
  caseStartAt: string;
  anaesthesiaStartAt: string;
  knifeToSkinAt: string;
  endOfSurgeryAt: string;
  caseEndAt: string;
}

export interface PatientIdentification {
  nhsNumber: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | 'other' | '';
  weightKg: number | null;
  heightCm: number | null;
  allergiesSummary: string;
  consentStatus: 'valid' | 'not-required' | 'emergency-best-interest' | 'mca-best-interest' | '';
  sideMarked: YesNo;
  whoSignInCompleted: YesNo;
}

export interface SurgicalTeamMember {
  role:
    | 'lead-surgeon'
    | 'first-assistant'
    | 'second-assistant'
    | 'anaesthetist'
    | 'odp'
    | 'scrub-nurse'
    | 'circulating-nurse'
    | 'student'
    | 'other'
    | '';
  name: string;
  registrationBody: 'GMC' | 'NMC' | 'HCPC' | 'other' | '';
  registrationNumber: string;
}

export interface DiagnosesAndProcedures {
  preOperativeDiagnosis: string;
  postOperativeDiagnosis: string;
  plannedProcedures: string;
  performedProcedures: string;
  opcs4Codes: string;
  urgency: 'elective' | 'scheduled' | 'urgent' | 'immediate' | '';
  laterality: 'left' | 'right' | 'bilateral' | 'midline' | 'na' | '';
  indication: string;
}

export interface Anaesthesia {
  type: 'ga' | 'regional' | 'neuraxial' | 'sedation' | 'mac' | 'local' | 'combined-ga-regional' | '';
  airway: 'face-mask' | 'supraglottic' | 'ett' | 'awake-fibreoptic' | 'surgical-airway' | '';
  inductionAgent: string;
  maintenanceAgent: string;
  neuromuscularBlockade: string;
  regionalBlockDetails: string;
  linesAndMonitoring: string;
  crystalloidMl: number | null;
  colloidMl: number | null;
  bloodMl: number | null;
  /** Comma-separated list of anaesthetic event tokens — see anaesthetic-event-rules.ts */
  events: string;
}

export interface PositionPrepApproach {
  patientPosition: 'supine' | 'prone' | 'lateral' | 'lithotomy' | 'beach-chair' | 'jack-knife' | '';
  pressureAreaProtection: string;
  prepSolution: 'chlorhexidine' | 'povidone-iodine' | 'alcohol' | 'other' | '';
  drapes: string;
  surgicalApproach: string;
  incisionType: string;
  incisionLengthCm: number | null;
  tableTilt: string;
  tourniquetSite: string;
  tourniquetPressureMmHg: number | null;
  tourniquetTimeOnAt: string;
  tourniquetTimeOffAt: string;
}

export interface OperativeFindings {
  techniqueSteps: string;
  pathologyFound: string;
  anatomicalAnomalies: string;
  intraOpPhotographsTaken: YesNo;
  frozenSectionRequested: YesNo;
}

export interface MaterialsImplants {
  sutures: string;
  staples: string;
  clips: string;
  mesh: string;
  screwsPlates: string;
  prostheticJoints: string;
  vascularGrafts: string;
  lotSerialBatchExpiry: string;
  manufacturer: string;
  registrySubmitted: YesNo;
}

export interface DrainsPacksSpecimens {
  drainsPlaced: string;
  packsLeftInSitu: string;
  packsRemovalByDate: string;
  urinaryCatheter: YesNo;
  ngTube: YesNo;
  specimensSent: string;
  specimensPathologyDestination: string;
  specimensUrgent: YesNo;
}

export interface SafetyCountsEbl {
  swabCountFirst: number | null;
  swabCountFinal: number | null;
  swabCountAgreed: YesNo;
  needleCountFirst: number | null;
  needleCountFinal: number | null;
  needleCountAgreed: YesNo;
  instrumentCountFirst: number | null;
  instrumentCountFinal: number | null;
  instrumentCountAgreed: YesNo;
  countDiscrepancyResolution: string;
  estimatedBloodLossMl: number | null;
  prbcUnits: number | null;
  ffpUnits: number | null;
  plateletsUnits: number | null;
  cryoUnits: number | null;
  massiveHaemorrhageProtocolActivated: YesNo;
  clavienDindoGrade: ClavienDindoGrade | '';
  complicationDescription: string;
  conversionToOpen: YesNo;
  retainedForeignBody: YesNo;
  /** Comma-separated never-event tokens — see never-event-rules.ts */
  neverEventFlags: string;
  intraOperativeArrest: YesNo;
  specimenLabellingIssue: YesNo;
  equipmentProblem: YesNo;
}

export interface PostOperativePlan {
  recoveryDestination: 'pacu' | 'ward' | 'enhanced-care' | 'hdu' | 'icu' | 'day-case-discharge' | '';
  /** True if the actual disposition is more intensive than the planned one (driver for unplanned-icu flag) */
  unplannedEscalation: YesNo;
  monitoringFrequency: string;
  ivFluidsPlan: string;
  analgesiaPlan: string;
  antibioticsPlan: string;
  vteProphylaxis: string;
  diet: string;
  mobilisation: string;
  woundCare: string;
  drainRemovalPlan: string;
  followUpPlan: string;
  specialInstructions: string;
  whoSignOutCompleted: YesNo;
  debriefCompleted: YesNo;
}

export interface SignOff {
  asaPhysicalStatus: AsaPhysicalStatus;
  /** Surgeon's documented override of the computed composite risk, if any. */
  surgeonOverrideRisk: CompositeRisk | '';
  surgeonOverrideReason: string;
  attestation: string;
  electronicSignatureName: string;
  dictationTimestamp: string;
  /** True if a required field was missing at sign-off — drives documentation-gap flag. */
  documentationGap: YesNo;
}

export interface OperationNote {
  operation: OperationIdentification;
  patient: PatientIdentification;
  team: SurgicalTeamMember[];
  diagnosesAndProcedures: DiagnosesAndProcedures;
  anaesthesia: Anaesthesia;
  positionPrepApproach: PositionPrepApproach;
  operativeFindings: OperativeFindings;
  materialsImplants: MaterialsImplants;
  drainsPacksSpecimens: DrainsPacksSpecimens;
  safetyCountsEbl: SafetyCountsEbl;
  postOperativePlan: PostOperativePlan;
  signOff: SignOff;
}

export interface FiredRule {
  ruleId: string;
  instrument:
    | 'composite'
    | 'clavien-dindo'
    | 'blood-loss'
    | 'counts'
    | 'never-event'
    | 'anaesthetic-event';
  grade: string;
  category: string;
  description: string;
}

export type AdditionalFlagCategory =
  | 'incorrect-count'
  | 'retained-foreign-body'
  | 'never-event'
  | 'unplanned-icu-admission'
  | 'massive-haemorrhage'
  | 'massive-transfusion'
  | 'conversion-to-open'
  | 'intra-operative-arrest'
  | 'anaesthetic-incident'
  | 'implant-registry-pending'
  | 'specimen-labelling-issue'
  | 'equipment-problem'
  | 'documentation-gap';

export interface AdditionalFlag {
  flagId: string;
  category: AdditionalFlagCategory;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  compositeRisk: CompositeRisk;
  /** Final risk after optional surgeon override (defaults to compositeRisk). */
  finalRisk: CompositeRisk;
  surgeonOverrideReason: string;
  clavienDindoGrade: ClavienDindoGrade;
  asaPhysicalStatus: AsaPhysicalStatus;
  bloodLossBand: BloodLossBand;
  countsAgreed: boolean;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
