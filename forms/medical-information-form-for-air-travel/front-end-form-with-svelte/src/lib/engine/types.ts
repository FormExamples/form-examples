// Type definitions for the Medical Information Form for Air Travel (MEDIF) engine.

export type YesNo = 'yes' | 'no' | '';
export type FitnessBand = 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
export type FlagPriority = 'low' | 'medium' | 'high';

// Step 1 — Submitting agent
export interface Submitter {
  submitterName: string;
  submitterRole: 'passenger' | 'agent' | 'clinician' | 'family-member' | '';
  submitterEmail: string;
  submitterPhone: string;
  submitterOrganisation: string;
  airlineBookingReference: string;
}

// Step 2 — Passenger
export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'male' | 'female' | 'other' | '';
  nationality: string;
  passportNumber: string;
  nationalHealthId: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Step 3 — Trip details
export interface Trip {
  airlineIataCode: string;
  airlineName: string;
  outboundFlightNumber: string;
  outboundDate: string;
  outboundOriginIata: string;
  outboundDestinationIata: string;
  returnFlightNumber: string;
  returnDate: string;
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first' | '';
  sectorDurationMinutes: number | null;
  transitAirportsIata: string;
  specialAssistanceCodes: string;
}

// Step 4 — Reason MEDIF is required
export interface ReasonFlags {
  reasonEquipment: YesNo;
  reasonRecentAcuteEvent: YesNo;
  reasonUnstableCondition: YesNo;
  reasonCommunicableDisease: YesNo;
  reasonPregnancy: YesNo;
  reasonMobilityEscort: YesNo;
  reasonPsychiatric: YesNo;
}

// Step 5 — Attending physician
export interface Physician {
  physicianName: string;
  specialty: string;
  registrationBody: 'GMC' | 'NMC' | 'HCPC' | 'other' | '';
  registrationNumber: string;
  clinic: string;
  email: string;
  phone: string;
  address: string;
  signatureDate: string;
}

// Step 6 — Diagnosis
export interface Diagnosis {
  primaryDiagnosis: string;
  icd10Codes: string;
  diagnosisDate: string;
  currentTreatment: string;
  lastAdmissionDate: string;
  lastDischargeDate: string;
  lastSpecialistReviewDate: string;
}

// Step 7 — Cardiovascular
export interface Cardiovascular {
  restingSystolicBp: number | null;
  restingDiastolicBp: number | null;
  restingHeartRate: number | null;
  nyhaClass: 'I' | 'II' | 'III' | 'IV' | '';
  recentMiDate: string;
  recentStentDate: string;
  onAnticoagulant: YesNo;
  pacemakerOrIcd: YesNo;
  exerciseToleranceMetres: number | null;
  unstableAngina: YesNo;
}

// Step 8 — Respiratory
export interface Respiratory {
  restingSpo2Percent: number | null;
  predictedInflightSpo2Percent: number | null;
  hypoxicChallengeResult: 'pass' | 'borderline' | 'fail' | 'not-performed' | '';
  recentPneumothoraxDate: string;
  asthmaSeverity: 'none' | 'mild-controlled' | 'moderate' | 'severe-uncontrolled' | '';
  copdSeverity: 'none' | 'mild' | 'moderate' | 'severe' | '';
  cpapOrBipapUse: 'none' | 'cpap' | 'bipap' | 'both' | '';
  recentPulmonaryEmbolismDate: string;
}

// Step 9 — Recent events / surgery
export interface RecentEvents {
  lastSurgeryDate: string;
  lastSurgerySite: string;
  cabinGasRisk:
    | 'none'
    | 'intra-ocular-gas'
    | 'intra-cranial-gas'
    | 'intra-abdominal-gas'
    | 'plaster-cast'
    | 'pneumothorax'
    | 'other'
    | '';
  recentFractureCast: YesNo;
  recentDvtDate: string;
  scubaDivingWithin24h: YesNo;
  recentStrokeDate: string;
}

// Step 10 — Pregnancy
export interface Pregnancy {
  isPregnant: YesNo;
  gestationWeeks: number | null;
  pregnancyType: 'singleton' | 'twins' | 'multiple' | '';
  pregnancyComplications: string;
  expectedDeliveryDate: string;
  obstetricianContact: string;
}

// Step 11 — Communicable disease
export interface Communicable {
  communicableDiseaseStatus: 'none' | 'infectious' | 'convalescent' | 'cleared' | '';
  lastSymptomDate: string;
  isolationRequired: YesNo;
  vaccinationStatus: string;
  currentAntimicrobials: string;
}

// Step 12 — In-flight requirements
export interface InflightNeeds {
  requiresSupplementalOxygen: YesNo;
  oxygenFlowRateLpm: number | null;
  oxygenDuration: 'continuous' | 'as-required' | 'on-exertion' | 'sleep-only' | '';
  requiresPoc: YesNo;
  pocMakeModel: string;
  pocBatteryHours: number | null;
  requiresStretcher: YesNo;
  requiresIncubator: YesNo;
  requiresIvPump: YesNo;
  requiresMedicalEscort: YesNo;
  requiresExtraSeat: YesNo;
  requiresAccessibleLavatory: YesNo;
  wheelchairType: 'none' | 'WCHR' | 'WCHS' | 'WCHC' | '';
  accompanyingCarer: YesNo;
}

// Step 13 — Cabin medications & equipment
export interface CabinMeds {
  regularMedications: string;
  controlledDrugs: string;
  dangerousGoodsBatteryDeclaration: YesNo;
  sharpsInCabin: YesNo;
  refrigeratedMedication: YesNo;
  customsDocumentationAvailable: YesNo;
  haemoglobinGPerL: number | null;
}

// Step 14 — Sign-off
export interface Signoff {
  physicianDeclaration: 'fit' | 'fit-with-conditions' | 'unfit' | 'unable-to-determine' | '';
  physicianSignatureName: string;
  physicianSignatureDate: string;
  validUntilDate: string;
  additionalNotes: string;
}

export interface MedifAssessment {
  submitter: Submitter;
  passenger: Passenger;
  trip: Trip;
  reasons: ReasonFlags;
  physician: Physician;
  diagnosis: Diagnosis;
  cardiovascular: Cardiovascular;
  respiratory: Respiratory;
  recentEvents: RecentEvents;
  pregnancy: Pregnancy;
  communicable: Communicable;
  inflightNeeds: InflightNeeds;
  cabinMeds: CabinMeds;
  signoff: Signoff;
}

export interface FiredRule {
  ruleId: string;
  category:
    | 'equipment'
    | 'recent-event'
    | 'cardiorespiratory'
    | 'pregnancy'
    | 'communicable'
    | 'other';
  band: FitnessBand;
  description: string;
}

export interface SafetyFlag {
  flagId: string;
  category:
    | 'cardiac'
    | 'pulmonary'
    | 'gas-expansion'
    | 'neurological'
    | 'communicable'
    | 'haematology'
    | 'obstetric'
    | 'oxygen'
    | 'equipment'
    | 'mobility'
    | 'mental-health'
    | 'other';
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  fitnessBand: FitnessBand;
  firedRules: FiredRule[];
  safetyFlags: SafetyFlag[];
  deskRecommendation: string;
  validUntil: string;
}
