// Authored from sql-migrations/. Edit by hand if SQL diverges.
// SOURCE: forms/eye-prescription/sql-migrations/

import "@typespec/openapi3";

@doc("Eye Prescription — TypeSpec models for a UK GOC-aligned spectacle prescription.")
namespace EyePrescription;

@doc("Patient demographic record.")
model Patient {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Patient full name as presented for the sight test.")
  name: string;

  @doc("Patient date of birth.")
  birthDate: plainDate;

  @doc("Patient sex: male, female, other, unknown.")
  sex: "male" | "female" | "other" | "unknown" | "";

  @doc("Email address.")
  email?: string;

  @doc("Phone number.")
  phone?: string;

  @doc("Postal address as full text.")
  postalAddressAsFullText?: string;

  @doc("Country as ISO 3166-1 alpha-2 (e.g. GB).")
  countryAsIso31661Alpha2?: string;

  @doc("Postal code.")
  postcode?: string;

  @doc("United Kingdom NHS number (10 digits with check digit).")
  unitedKingdomNhsNumber?: string;
}

@doc("GOC-registered prescriber who issued the spectacle prescription.")
model Prescriber {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Prescriber full name.")
  name: string;

  @doc("General Optical Council registration number (mandatory).")
  gocRegistrationNumber: string;

  @doc("Prescriber role.")
  role: "optometrist" | "dispensing-optician" | "ophthalmologist" | "student" | "";

  @doc("Name of the practice where the prescription was issued.")
  practiceName: string;

  @doc("Practice address as full text.")
  practiceAddress: string;

  @doc("Practice postcode.")
  postcode?: string;

  @doc("Practice country as ISO 3166-1 alpha-2.")
  countryAsIso31661Alpha2?: string;

  @doc("Practice contact email.")
  email?: string;

  @doc("Practice contact phone.")
  phone?: string;
}

@doc("Spectacle prescription header.")
model EyePrescriptionHeader {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the patient table.")
  patientId: string;

  @doc("Foreign key to the prescriber table.")
  prescriberId: string;

  @doc("Prescription lifecycle status.")
  status: "draft" | "active" | "cancelled" | "superseded" | "expired" | "entered-in-error";

  @doc("Date the sight test was performed.")
  examinationDate: plainDate;

  @doc("Time of day the sight test was performed.")
  examinationTime?: plainTime;

  @doc("Date the prescription was issued.")
  issueDate: plainDate;

  @doc("Date the prescription expires.")
  expiryDate: plainDate;

  @doc("Reason for the sight test.")
  reasonForSightTest:
    | "routine"
    | "symptoms"
    | "follow-up"
    | "pre-employment"
    | "driving-licence"
    | "after-pathology"
    | "second-opinion"
    | "other"
    | "";

  @doc("Whether a prior prescription is on file for this patient.")
  priorPrescriptionOnFile: boolean;

  @doc("Date of the prior prescription, if any.")
  priorPrescriptionDate?: plainDate;

  @doc("Free-text prescriber notes.")
  notes: string;
}

@doc("Per-eye refractive prescription (one row per eye).")
model EyePrescriptionEye {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the eye_prescription table.")
  eyePrescriptionId: string;

  @doc("Which eye: right (OD) or left (OS).")
  eye: "right" | "left";

  @doc("Sphere power in dioptres. Negative for myopia, positive for hyperopia, -30.00 to +30.00 in 0.25 steps.")
  sphereDiopters?: float64;

  @doc("Cylinder power in dioptres (minus-cylinder convention). -10.00 to 0.00 in 0.25 steps.")
  cylinderDiopters?: float64;

  @doc("Cylinder axis in integer degrees, 1 to 180.")
  axisDegrees?: int32;

  @doc("Reading addition in dioptres (always positive). 0.00 to +4.00 in 0.25 steps.")
  additionDiopters?: float64;

  @doc("Intermediate addition for trifocal / occupational varifocal use, in dioptres.")
  intermediateAdditionDiopters?: float64;

  @doc("Horizontal prism magnitude in prism dioptres. 0.00 if none.")
  prismHorizontalDiopters: float64;

  @doc("Horizontal prism base direction.")
  baseHorizontal: "in" | "out" | "";

  @doc("Vertical prism magnitude in prism dioptres. 0.00 if none.")
  prismVerticalDiopters: float64;

  @doc("Vertical prism base direction.")
  baseVertical: "up" | "down" | "";
}

@doc("Visual acuity measurements per eye plus binocular.")
model EyePrescriptionVisualAcuity {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription (1:1).")
  eyePrescriptionId: string;

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

  @doc("Dominant eye: right, left, none.")
  dominantEye: "right" | "left" | "none" | "";
}

@doc("Pupillary distance measurements.")
model EyePrescriptionPupillaryDistance {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription (1:1).")
  eyePrescriptionId: string;

  @doc("Total interpupillary distance for distance vision, in mm.")
  distanceTotalMm?: float64;

  @doc("Monocular PD, right eye to nose bridge, distance, in mm.")
  distanceRightMm?: float64;

  @doc("Monocular PD, left eye to nose bridge, distance, in mm.")
  distanceLeftMm?: float64;

  @doc("Total interpupillary distance for near vision, in mm.")
  nearTotalMm?: float64;

  @doc("Monocular PD, right eye to nose bridge, near, in mm.")
  nearRightMm?: float64;

  @doc("Monocular PD, left eye to nose bridge, near, in mm.")
  nearLeftMm?: float64;

  @doc("Segment height for bifocal / varifocal lens, right eye, in mm.")
  segmentHeightRightMm?: float64;

  @doc("Segment height for bifocal / varifocal lens, left eye, in mm.")
  segmentHeightLeftMm?: float64;
}

@doc("Lens recommendation: design, material, coatings, tint.")
model EyePrescriptionLensRecommendation {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription (1:1).")
  eyePrescriptionId: string;

  @doc("Lens design.")
  lensType:
    | "single-vision-distance"
    | "single-vision-near"
    | "single-vision-intermediate"
    | "bifocal"
    | "trifocal"
    | "varifocal"
    | "occupational-varifocal"
    | "";

  @doc("Lens material.")
  material:
    | "cr-39"
    | "trivex"
    | "polycarbonate"
    | "mid-index-1.60"
    | "high-index-1.67"
    | "high-index-1.74"
    | "glass"
    | "";

  @doc("Refractive index of the lens material.")
  refractiveIndex?: float64;

  @doc("Whether an aspheric lens design is recommended.")
  aspheric: boolean;

  coatingAntiReflective: boolean;
  coatingScratchResistant: boolean;
  coatingHydrophobic: boolean;
  coatingBlueLight: boolean;
  coatingPhotochromic: boolean;
  coatingPolarised: boolean;
  coatingUv400: boolean;

  @doc("Tint description (e.g. brown, grey, G15).")
  tintDescription: string;

  @doc("Tint density as a percentage (0 to 100).")
  tintPercent?: int32;

  @doc("Free-text notes for the dispensing optician.")
  dispenserNotes: string;
}

@doc("Optional ocular health findings recorded during the sight test.")
model EyePrescriptionOcularHealthFinding {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription (1:1).")
  eyePrescriptionId: string;

  slitLampRight: string;
  slitLampLeft: string;
  fundusRight: string;
  fundusLeft: string;

  @doc("Intraocular pressure, right eye, in mmHg.")
  intraocularPressureRightMmhg?: float64;

  @doc("Intraocular pressure, left eye, in mmHg.")
  intraocularPressureLeftMmhg?: float64;

  @doc("Optic nerve head cup-to-disc ratio, right eye (0.00 to 1.00).")
  cupToDiscRatioRight?: float64;

  @doc("Optic nerve head cup-to-disc ratio, left eye (0.00 to 1.00).")
  cupToDiscRatioLeft?: float64;

  octPerformed: boolean;
  octFindings: string;
  fieldsPerformed: boolean;
  fieldsFindings: string;

  @doc("Whether any ocular pathology was identified.")
  pathologyFlag: boolean;

  @doc("Whether the prescriber recommends referral to ophthalmology.")
  referOphthalmology: boolean;

  @doc("Reason for ophthalmology referral, if any.")
  referralReason: string;
}

@doc("Computed grading result.")
model EyePrescriptionGrade {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription (1:1).")
  eyePrescriptionId: string;

  rightEyeSphereClass:
    | "emmetropia"
    | "low-myopia"
    | "moderate-myopia"
    | "high-myopia"
    | "low-hyperopia"
    | "moderate-hyperopia"
    | "high-hyperopia"
    | "";

  rightEyeCylinderClass:
    | "none"
    | "mild-astigmatism"
    | "moderate-astigmatism"
    | "high-astigmatism"
    | "";

  leftEyeSphereClass:
    | "emmetropia"
    | "low-myopia"
    | "moderate-myopia"
    | "high-myopia"
    | "low-hyperopia"
    | "moderate-hyperopia"
    | "high-hyperopia"
    | "";

  leftEyeCylinderClass:
    | "none"
    | "mild-astigmatism"
    | "moderate-astigmatism"
    | "high-astigmatism"
    | "";

  presbyopiaClass:
    | "none"
    | "early-presbyopia"
    | "established-presbyopia"
    | "advanced-presbyopia"
    | "";

  @doc("Absolute difference in sphere between right and left eye, in dioptres.")
  anisometropiaDiopters?: float64;

  anisometropiaSignificant: boolean;
  prismPresent: boolean;

  computedComplexity: "simple" | "moderate" | "complex" | "";
  finalComplexity: "simple" | "moderate" | "complex" | "";
  overrideReason: string;

  @doc("Recommended follow-up interval in months.")
  followUpIntervalMonths?: int32;

  prescriberNotes: string;
  signedAt?: utcDateTime;
  gradedAt: utcDateTime;
}

@doc("Audit trail of every classification rule that fired.")
model EyePrescriptionGradeRule {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription_grade.")
  eyePrescriptionGradeId: string;

  @doc("Stable rule identifier (e.g. R-SPH-MYO-HIGH-01).")
  ruleId: string;

  instrument:
    | "sphere"
    | "cylinder"
    | "addition"
    | "anisometropia"
    | "prism"
    | "change"
    | "";

  eye: "right" | "left" | "both" | "";
  class: string;
  category: string;
  description: string;
}

@doc("Safety-critical flags fired independently of the complexity grade.")
model EyePrescriptionGradeFlag {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent eye_prescription_grade.")
  eyePrescriptionGradeId: string;

  @doc("Stable flag identifier (e.g. F-HIGH-MYOPIA-RIGHT-001).")
  flagId: string;

  category:
    | "high-myopia"
    | "high-hyperopia"
    | "high-astigmatism"
    | "anisometropia"
    | "prism-present"
    | "presbyopia"
    | "paediatric"
    | "prescription-expired"
    | "significant-change-from-prior"
    | "ocular-pathology"
    | "refer-ophthalmology"
    | "other"
    | "";

  eye: "right" | "left" | "both" | "";
  priority: "low" | "medium" | "high" | "";
  description: string;
  suggestedAction: string;
}
