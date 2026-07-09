// Generated from sql/04_create_table_medical_information_form_for_air_travel.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

alias YesNo = "yes" | "no" | "";

model MedicalInformationFormForAirTravel {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;

  patientId: string;
  clinicianId?: string;

  status: "draft" | "submitted" | "reviewed" | "cleared" | "declined" | "urgent";

  // 1. Submitting agent
  submitterName: string;
  submitterRole: "passenger" | "agent" | "clinician" | "family-member" | "";
  submitterEmail: string;
  submitterPhone: string;
  submitterOrganisation: string;
  airlineBookingReference: string;

  // 3. Trip details
  airlineIataCode: string;
  airlineName: string;
  outboundFlightNumber: string;
  outboundDate?: plainDate;
  outboundOriginIata: string;
  outboundDestinationIata: string;
  returnFlightNumber: string;
  returnDate?: plainDate;
  cabinClass: "economy" | "premium-economy" | "business" | "first" | "";
  sectorDurationMinutes?: int32;
  transitAirportsIata: string;
  specialAssistanceCodes: string;

  // 4. Reason for MEDIF
  reasonEquipment: YesNo;
  reasonRecentAcuteEvent: YesNo;
  reasonUnstableCondition: YesNo;
  reasonCommunicableDisease: YesNo;
  reasonPregnancy: YesNo;
  reasonMobilityEscort: YesNo;
  reasonPsychiatric: YesNo;

  // 6. Diagnosis
  primaryDiagnosis: string;
  icd10Codes: string;
  diagnosisDate?: plainDate;
  currentTreatment: string;
  lastAdmissionDate?: plainDate;
  lastDischargeDate?: plainDate;
  lastSpecialistReviewDate?: plainDate;

  // 7. Cardiovascular
  restingSystolicBp?: int32;
  restingDiastolicBp?: int32;
  restingHeartRate?: int32;
  nyhaClass: "I" | "II" | "III" | "IV" | "";
  recentMiDate?: plainDate;
  recentStentDate?: plainDate;
  onAnticoagulant: YesNo;
  pacemakerOrIcd: YesNo;
  exerciseToleranceMetres?: int32;
  unstableAngina: YesNo;

  // 8. Respiratory
  restingSpo2Percent?: float64;
  predictedInflightSpo2Percent?: float64;
  hypoxicChallengeResult: "pass" | "borderline" | "fail" | "not-performed" | "";
  recentPneumothoraxDate?: plainDate;
  asthmaSeverity: "none" | "mild-controlled" | "moderate" | "severe-uncontrolled" | "";
  copdSeverity: "none" | "mild" | "moderate" | "severe" | "";
  cpapOrBipapUse: "none" | "cpap" | "bipap" | "both" | "";
  recentPulmonaryEmbolismDate?: plainDate;

  // 9. Recent events and surgery
  lastSurgeryDate?: plainDate;
  lastSurgerySite: string;
  cabinGasRisk:
    | "none"
    | "intra-ocular-gas"
    | "intra-cranial-gas"
    | "intra-abdominal-gas"
    | "plaster-cast"
    | "pneumothorax"
    | "other"
    | "";
  recentFractureCast: YesNo;
  recentDvtDate?: plainDate;
  scubaDivingWithin24h: YesNo;
  recentStrokeDate?: plainDate;

  // 10. Pregnancy
  isPregnant: YesNo;
  gestationWeeks?: int32;
  pregnancyType: "singleton" | "twins" | "multiple" | "";
  pregnancyComplications: string;
  expectedDeliveryDate?: plainDate;
  obstetricianContact: string;

  // 11. Communicable disease
  communicableDiseaseStatus: "none" | "infectious" | "convalescent" | "cleared" | "";
  lastSymptomDate?: plainDate;
  isolationRequired: YesNo;
  vaccinationStatus: string;
  currentAntimicrobials: string;

  // 12. In-flight requirements
  requiresSupplementalOxygen: YesNo;
  oxygenFlowRateLpm?: float64;
  oxygenDuration: "continuous" | "as-required" | "on-exertion" | "sleep-only" | "";
  requiresPoc: YesNo;
  pocMakeModel: string;
  pocBatteryHours?: float64;
  requiresStretcher: YesNo;
  requiresIncubator: YesNo;
  requiresIvPump: YesNo;
  requiresMedicalEscort: YesNo;
  requiresExtraSeat: YesNo;
  requiresAccessibleLavatory: YesNo;
  wheelchairType: "none" | "WCHR" | "WCHS" | "WCHC" | "";
  accompanyingCarer: YesNo;

  // 13. Cabin medications and equipment
  regularMedications: string;
  controlledDrugs: string;
  dangerousGoodsBatteryDeclaration: YesNo;
  sharpsInCabin: YesNo;
  refrigeratedMedication: YesNo;
  customsDocumentationAvailable: YesNo;
  haemoglobinGPerL?: int32;

  // 14. Sign-off
  physicianDeclaration: "fit" | "fit-with-conditions" | "unfit" | "unable-to-determine" | "";
  physicianSignatureName: string;
  physicianSignatureDate?: plainDate;
  validUntilDate?: plainDate;
  additionalNotes: string;
}
