// Eye Prescription — TypeScript types.
//
// Mirrors forms/eye-prescription/sql/. camelCase per the
// monorepo convention. Cylinder is stored in minus-cylinder convention
// (≤ 0); addition is always positive; axis is 1..180.

export type SphereClass =
  | ''
  | 'emmetropia'
  | 'low-myopia' | 'moderate-myopia' | 'high-myopia'
  | 'low-hyperopia' | 'moderate-hyperopia' | 'high-hyperopia';

export type CylinderClass =
  | ''
  | 'none'
  | 'mild-astigmatism' | 'moderate-astigmatism' | 'high-astigmatism';

export type PresbyopiaClass =
  | ''
  | 'none'
  | 'early-presbyopia' | 'established-presbyopia' | 'advanced-presbyopia';

export type Complexity = '' | 'simple' | 'moderate' | 'complex';
export type Priority = '' | 'low' | 'medium' | 'high';

export type FlagCategory =
  | 'high-myopia' | 'high-hyperopia' | 'high-astigmatism'
  | 'anisometropia' | 'prism-present' | 'presbyopia'
  | 'paediatric' | 'prescription-expired' | 'significant-change-from-prior'
  | 'ocular-pathology' | 'refer-ophthalmology' | 'other';

export type EyeSide = 'right' | 'left' | 'both' | '';
export type BaseHorizontal = '' | 'in' | 'out';
export type BaseVertical = '' | 'up' | 'down';

export interface Prescriber {
  name: string;
  gocRegistrationNumber: string;
  role: '' | 'optometrist' | 'dispensing-optician' | 'ophthalmologist' | 'student';
  practiceName: string;
  practiceAddress: string;
  postcode: string;
  countryAsIso31661Alpha2: string;
  email: string;
  phone: string;
}

export interface Patient {
  name: string;
  birthDate: string;
  sex: '' | 'male' | 'female' | 'other' | 'unknown';
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2: string;
  postcode: string;
  unitedKingdomNhsNumber: string;
}

export interface Examination {
  examinationDate: string;
  examinationTime: string;
  issueDate: string;
  expiryDate: string;
  reasonForSightTest:
    | ''
    | 'routine' | 'symptoms' | 'follow-up' | 'pre-employment'
    | 'driving-licence' | 'after-pathology' | 'second-opinion' | 'other';
  priorPrescriptionDate: string;
  priorSphereRight: number | null;
  priorSphereLeft: number | null;
  notes: string;
}

export interface VisualAcuity {
  distanceRightUnaided: string;
  distanceLeftUnaided: string;
  distanceBinocularUnaided: string;
  distanceRightCorrected: string;
  distanceLeftCorrected: string;
  distanceBinocularCorrected: string;
  nearRightUnaided: string;
  nearLeftUnaided: string;
  nearBinocularUnaided: string;
  nearRightCorrected: string;
  nearLeftCorrected: string;
  nearBinocularCorrected: string;
  pinholeRight: string;
  pinholeLeft: string;
  dominantEye: '' | 'right' | 'left' | 'none';
}

export interface EyeRefraction {
  sphereDiopters: number | null;
  cylinderDiopters: number | null;
  axisDegrees: number | null;
  additionDiopters: number | null;
  intermediateAdditionDiopters: number | null;
  prismHorizontalDiopters: number;
  baseHorizontal: BaseHorizontal;
  prismVerticalDiopters: number;
  baseVertical: BaseVertical;
}

export interface PupillaryDistance {
  distanceTotalMm: number | null;
  distanceRightMm: number | null;
  distanceLeftMm: number | null;
  nearTotalMm: number | null;
  nearRightMm: number | null;
  nearLeftMm: number | null;
  segmentHeightRightMm: number | null;
  segmentHeightLeftMm: number | null;
}

export interface LensRecommendation {
  lensType:
    | ''
    | 'single-vision-distance' | 'single-vision-near' | 'single-vision-intermediate'
    | 'bifocal' | 'trifocal' | 'varifocal' | 'occupational-varifocal';
  material:
    | ''
    | 'cr-39' | 'trivex' | 'polycarbonate'
    | 'mid-index-1.60' | 'high-index-1.67' | 'high-index-1.74' | 'glass';
  refractiveIndex: number | null;
  aspheric: boolean;
  coatingAntiReflective: boolean;
  coatingScratchResistant: boolean;
  coatingHydrophobic: boolean;
  coatingBlueLight: boolean;
  coatingPhotochromic: boolean;
  coatingPolarised: boolean;
  coatingUv400: boolean;
  tintDescription: string;
  tintPercent: number | null;
  dispenserNotes: string;
}

export interface OcularHealth {
  slitLampRight: string;
  slitLampLeft: string;
  fundusRight: string;
  fundusLeft: string;
  intraocularPressureRightMmhg: number | null;
  intraocularPressureLeftMmhg: number | null;
  cupToDiscRatioRight: number | null;
  cupToDiscRatioLeft: number | null;
  octPerformed: boolean;
  octFindings: string;
  fieldsPerformed: boolean;
  fieldsFindings: string;
  pathologyFlag: boolean;
  referOphthalmology: boolean;
  referralReason: string;
}

export interface GradeOverride {
  overrideComplexity: Complexity;
  overrideReason: string;
  followUpIntervalMonths: number | null;
  prescriberNotes: string;
  signedAt: boolean;
}

export interface EyePrescription {
  prescriber: Prescriber;
  patient: Patient;
  examination: Examination;
  visualAcuity: VisualAcuity;
  rightEye: EyeRefraction;
  leftEye: EyeRefraction;
  pupillaryDistance: PupillaryDistance;
  lensRecommendation: LensRecommendation;
  ocularHealth: OcularHealth;
  grade: GradeOverride;
}

export interface FiredRule {
  ruleId: string;
  instrument: 'sphere' | 'cylinder' | 'addition' | 'anisometropia' | 'prism' | 'change' | '';
  eye: EyeSide;
  class: string;
  category: string;
  description: string;
}

export interface AdditionalFlag {
  flagId: string;
  category: FlagCategory;
  eye: EyeSide;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

export interface ClassificationResult {
  rightEyeSphereClass: SphereClass;
  leftEyeSphereClass: SphereClass;
  rightEyeCylinderClass: CylinderClass;
  leftEyeCylinderClass: CylinderClass;
  presbyopiaClass: PresbyopiaClass;
  anisometropia: number | null;
  prismPresent: boolean;
  complexity: Exclude<Complexity, ''>;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
