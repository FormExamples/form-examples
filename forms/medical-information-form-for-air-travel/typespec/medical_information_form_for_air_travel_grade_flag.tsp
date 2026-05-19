// Generated from sql-migrations/07_create_table_medical_information_form_for_air_travel_grade_flag.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

model MedicalInformationFormForAirTravelGradeFlag {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;
  medicalInformationFormForAirTravelGradeId: string;
  flagId: string;
  category:
    | "cardiac-acute"
    | "pulmonary-acute"
    | "gas-expansion"
    | "severe-anaemia"
    | "severe-hypoxia"
    | "late-pregnancy"
    | "communicable"
    | "high-flow-oxygen"
    | "stretcher-required"
    | "incubator-required"
    | "battery-device"
    | "psychiatric"
    | "cognitive"
    | "pediatric"
    | "mobility"
    | "other"
    | "";
  priority: "low" | "medium" | "high" | "";
  description: string;
  suggestedAction: string;
}
