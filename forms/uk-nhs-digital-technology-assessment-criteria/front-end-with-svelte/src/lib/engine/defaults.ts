import { CRITERIA, SECTIONS } from "./criteria.js";
import type { DtacAssessment } from "./types.js";

/** A blank DTAC assessment: '' for unanswered text/enum, null for dates. */
export function createDefaultAssessment(): DtacAssessment {
  const criteria: DtacAssessment["criteria"] = {};
  for (const c of CRITERIA) criteria[c.id] = "";
  const notes: DtacAssessment["notes"] = {};
  for (const s of SECTIONS) notes[s.id] = "";
  return {
    supplier: {
      name: "",
      tradingName: "",
      companyRegistrationNumber: "",
      countryOfRegistration: "",
      icoRegistrationNumber: "",
      website: "",
      postalAddress: "",
      postcode: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
    product: {
      name: "",
      version: "",
      description: "",
      intendedPurpose: "",
      productType: "",
      medicalDeviceClass: "",
      handlesPatientData: "",
      isPatientFacing: "",
    },
    assessor: { name: "", email: "", phone: "", organisation: "", role: "" },
    assessment: {
      status: "draft",
      assessmentDate: null,
      reviewDueDate: null,
      dtacVersion: "",
      commissioningOrganisation: "",
      assessorNotes: "",
      finalOutcome: "",
      assessorOverrideReason: "",
    },
    criteria,
    notes,
  };
}
