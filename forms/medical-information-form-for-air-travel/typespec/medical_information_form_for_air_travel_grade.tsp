// Generated from sql/05_create_table_medical_information_form_for_air_travel_grade.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

alias FitnessBand = "fit" | "fit-with-conditions" | "requires-review" | "unfit-to-fly" | "";

model MedicalInformationFormForAirTravelGrade {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;
  medicalInformationFormForAirTravelId: string;
  computedFitnessBand: FitnessBand;
  finalFitnessBand: FitnessBand;
  overrideReason: string;
  deskRecommendation: string;
  physicianNotes: string;
  validUntil?: plainDate;
  signedAt?: utcDateTime;
  gradedAt: utcDateTime;
}
