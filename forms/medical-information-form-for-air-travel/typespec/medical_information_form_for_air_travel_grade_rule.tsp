// Generated from sql-migrations/06_create_table_medical_information_form_for_air_travel_grade_rule.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

model MedicalInformationFormForAirTravelGradeRule {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;
  medicalInformationFormForAirTravelGradeId: string;
  ruleId: string;
  instrument:
    | "cardiovascular"
    | "respiratory"
    | "recent-event"
    | "pregnancy"
    | "communicable"
    | "equipment"
    | "haematology"
    | "gas-expansion"
    | "composite"
    | "";
  fitnessBand: "fit" | "fit-with-conditions" | "requires-review" | "unfit-to-fly" | "";
  category: string;
  description: string;
}
