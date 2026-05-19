// Generated from sql-migrations/02_create_table_patient.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

model Patient {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;
  name: string;
  birthDate?: plainDate;
  sexAtBirth: "female" | "male" | "intersex" | "unknown" | "";
  nationalityAsIso31661Alpha2?: string;
  passportNumber: string;
  unitedKingdomNhsNumber?: string;
  nationalHealthId: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2?: string;
  postcode: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  weightAsKg?: float64;
  heightAsCm?: float64;
}
