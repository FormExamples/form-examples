// Generated from sql-migrations/03_create_table_clinician.sql.

import "@typespec/openapi3";

@service(#{ title: "Medical Information Form for Air Travel" })
namespace MedicalInformationFormForAirTravel;

model Clinician {
  id: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  deletedAt?: utcDateTime;
  name: string;
  specialty: string;
  role:
    | "general-practitioner"
    | "cardiologist"
    | "respirologist"
    | "obstetrician"
    | "oncologist"
    | "travel-medicine-physician"
    | "aeromedical-physician"
    | "discharge-coordinator"
    | "other"
    | "";
  registrationBody: "GMC" | "NMC" | "HCPC" | "GPhC" | "other" | "";
  registrationNumber: string;
  clinicName: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2?: string;
  postcode: string;
}
