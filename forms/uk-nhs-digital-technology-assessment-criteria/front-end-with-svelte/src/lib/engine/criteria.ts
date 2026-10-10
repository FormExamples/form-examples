// DTAC criteria catalogue (TypeScript port of front-end-with-html/js/criteria.js).
// Criterion ids are a1..g7; `column` is the SQL column.
import type { Criterion, Section, CriterionStatus } from "./types.js";

export const SECTIONS: Section[] = [
  {
    "id": "a",
    "title": "Company information"
  },
  {
    "id": "b",
    "title": "Value proposition"
  },
  {
    "id": "c",
    "title": "Clinical safety"
  },
  {
    "id": "d",
    "title": "Data protection"
  },
  {
    "id": "e",
    "title": "Technical security"
  },
  {
    "id": "f",
    "title": "Interoperability"
  },
  {
    "id": "g",
    "title": "Usability and accessibility"
  }
];

export const CRITERIA: Criterion[] = [
  {
    "id": "a1",
    "key": "company_registered_in_uk",
    "column": "a1_company_registered_in_uk",
    "mandatory": true,
    "description": "The supplier is a registered company or legal entity with a verifiable registration number.",
    "section": "a"
  },
  {
    "id": "a2",
    "key": "ico_registration_current",
    "column": "a2_ico_registration_current",
    "mandatory": true,
    "description": "The supplier has a current ICO data protection fee registration (or a documented exemption).",
    "section": "a"
  },
  {
    "id": "a3",
    "key": "senior_responsible_owner_named",
    "column": "a3_senior_responsible_owner_named",
    "mandatory": true,
    "description": "A named senior individual is accountable for the product's compliance.",
    "section": "a"
  },
  {
    "id": "a4",
    "key": "incident_contact_published",
    "column": "a4_incident_contact_published",
    "mandatory": false,
    "description": "A contact point for incident and safety reports is published to commissioners and users.",
    "section": "a"
  },
  {
    "id": "b1",
    "key": "intended_use_and_users_defined",
    "column": "b1_intended_use_and_users_defined",
    "mandatory": true,
    "description": "The intended purpose, target users and care setting are clearly defined.",
    "section": "b"
  },
  {
    "id": "b2",
    "key": "evidence_of_benefit",
    "column": "b2_evidence_of_benefit",
    "mandatory": true,
    "description": "Evidence demonstrates the product's benefit to patients, staff or the system.",
    "section": "b"
  },
  {
    "id": "b3",
    "key": "outcome_measures_defined",
    "column": "b3_outcome_measures_defined",
    "mandatory": false,
    "description": "Measurable outcomes and an evaluation plan are defined.",
    "section": "b"
  },
  {
    "id": "b4",
    "key": "cost_effectiveness_evidence",
    "column": "b4_cost_effectiveness_evidence",
    "mandatory": false,
    "description": "Evidence of cost-effectiveness or economic value is available.",
    "section": "b"
  },
  {
    "id": "c1",
    "key": "clinical_safety_officer_named",
    "column": "c1_clinical_safety_officer_named",
    "mandatory": true,
    "description": "A named Clinical Safety Officer (a registered clinician with clinical risk management training) is appointed.",
    "section": "c"
  },
  {
    "id": "c2",
    "key": "clinical_risk_management_plan",
    "column": "c2_clinical_risk_management_plan",
    "mandatory": true,
    "description": "A DCB0129 Clinical Risk Management Plan exists and is current.",
    "section": "c"
  },
  {
    "id": "c3",
    "key": "hazard_log_maintained",
    "column": "c3_hazard_log_maintained",
    "mandatory": true,
    "description": "A DCB0129 Hazard Log is maintained and hazards are mitigated to acceptable levels.",
    "section": "c"
  },
  {
    "id": "c4",
    "key": "clinical_safety_case_report",
    "column": "c4_clinical_safety_case_report",
    "mandatory": true,
    "description": "A DCB0129 Clinical Safety Case Report is complete and signed off by the Clinical Safety Officer.",
    "section": "c"
  },
  {
    "id": "c5",
    "key": "clinical_safety_officer_registration_verified",
    "column": "c5_clinical_safety_officer_registration_verified",
    "mandatory": true,
    "description": "The Clinical Safety Officer's professional registration has been verified.",
    "section": "c"
  },
  {
    "id": "c6",
    "key": "medical_device_registration_if_applicable",
    "column": "c6_medical_device_registration_if_applicable",
    "mandatory": true,
    "description": "If the product is a medical device, it is correctly classified and has UKCA/CE marking and MHRA registration.",
    "section": "c"
  },
  {
    "id": "c7",
    "key": "post_market_surveillance",
    "column": "c7_post_market_surveillance",
    "mandatory": false,
    "description": "A process exists to monitor safety in live use and to report incidents.",
    "section": "c"
  },
  {
    "id": "d1",
    "key": "data_protection_officer_or_lead",
    "column": "d1_data_protection_officer_or_lead",
    "mandatory": true,
    "description": "A Data Protection Officer or named data protection lead is appointed.",
    "section": "d"
  },
  {
    "id": "d2",
    "key": "dpia_completed",
    "column": "d2_dpia_completed",
    "mandatory": true,
    "description": "A Data Protection Impact Assessment has been completed and is kept under review.",
    "section": "d"
  },
  {
    "id": "d3",
    "key": "dspt_standards_met",
    "column": "d3_dspt_standards_met",
    "mandatory": true,
    "description": "The Data Security and Protection Toolkit assessment meets or exceeds standards.",
    "section": "d"
  },
  {
    "id": "d4",
    "key": "lawful_basis_documented",
    "column": "d4_lawful_basis_documented",
    "mandatory": true,
    "description": "The lawful basis for each processing purpose (UK GDPR Art. 6 and Art. 9) is documented.",
    "section": "d"
  },
  {
    "id": "d5",
    "key": "controller_processor_roles_defined",
    "column": "d5_controller_processor_roles_defined",
    "mandatory": true,
    "description": "Controller, joint controller and processor roles are defined in contracts.",
    "section": "d"
  },
  {
    "id": "d6",
    "key": "data_location_and_transfers",
    "column": "d6_data_location_and_transfers",
    "mandatory": true,
    "description": "Data is processed in the UK, or international transfers have lawful safeguards.",
    "section": "d"
  },
  {
    "id": "d7",
    "key": "retention_and_deletion_policy",
    "column": "d7_retention_and_deletion_policy",
    "mandatory": true,
    "description": "A retention and secure-deletion policy aligned with NHS records guidance is in place.",
    "section": "d"
  },
  {
    "id": "d8",
    "key": "privacy_notice_published",
    "column": "d8_privacy_notice_published",
    "mandatory": true,
    "description": "A clear, accessible privacy notice is published to users.",
    "section": "d"
  },
  {
    "id": "d9",
    "key": "data_subject_rights_supported",
    "column": "d9_data_subject_rights_supported",
    "mandatory": false,
    "description": "Processes support data subject rights (access, rectification, erasure, objection, portability).",
    "section": "d"
  },
  {
    "id": "e1",
    "key": "cyber_essentials_plus_or_iso27001",
    "column": "e1_cyber_essentials_plus_or_iso27001",
    "mandatory": true,
    "description": "The supplier holds Cyber Essentials Plus or ISO 27001 certification (or equivalent assured evidence).",
    "section": "e"
  },
  {
    "id": "e2",
    "key": "penetration_test_within_12_months",
    "column": "e2_penetration_test_within_12_months",
    "mandatory": true,
    "description": "An independent penetration test was completed within the last 12 months and findings addressed.",
    "section": "e"
  },
  {
    "id": "e3",
    "key": "vulnerability_management",
    "column": "e3_vulnerability_management",
    "mandatory": true,
    "description": "A vulnerability management and patching process is operated with defined timescales.",
    "section": "e"
  },
  {
    "id": "e4",
    "key": "encryption_in_transit_and_at_rest",
    "column": "e4_encryption_in_transit_and_at_rest",
    "mandatory": true,
    "description": "Data is encrypted in transit and at rest using current standards.",
    "section": "e"
  },
  {
    "id": "e5",
    "key": "access_control_and_mfa",
    "column": "e5_access_control_and_mfa",
    "mandatory": true,
    "description": "Role-based access control with multi-factor authentication for privileged and remote access.",
    "section": "e"
  },
  {
    "id": "e6",
    "key": "audit_logging",
    "column": "e6_audit_logging",
    "mandatory": true,
    "description": "Security-relevant events and access to patient data are logged and monitored.",
    "section": "e"
  },
  {
    "id": "e7",
    "key": "business_continuity_and_backup",
    "column": "e7_business_continuity_and_backup",
    "mandatory": true,
    "description": "Tested backup, disaster recovery and business continuity arrangements exist.",
    "section": "e"
  },
  {
    "id": "e8",
    "key": "secure_development_lifecycle",
    "column": "e8_secure_development_lifecycle",
    "mandatory": false,
    "description": "A secure software development lifecycle, including dependency and supply-chain controls, is followed.",
    "section": "e"
  },
  {
    "id": "e9",
    "key": "incident_response_and_breach_notification",
    "column": "e9_incident_response_and_breach_notification",
    "mandatory": true,
    "description": "A security incident response plan with breach notification timescales exists.",
    "section": "e"
  },
  {
    "id": "f1",
    "key": "open_standards_apis",
    "column": "f1_open_standards_apis",
    "mandatory": true,
    "description": "The product exposes documented APIs that use open standards.",
    "section": "f"
  },
  {
    "id": "f2",
    "key": "fhir_or_nhs_standard_apis",
    "column": "f2_fhir_or_nhs_standard_apis",
    "mandatory": false,
    "description": "The product supports HL7 FHIR or other relevant NHS interoperability standards.",
    "section": "f"
  },
  {
    "id": "f3",
    "key": "nhs_number_supported",
    "column": "f3_nhs_number_supported",
    "mandatory": true,
    "description": "The NHS Number is supported as the primary patient identifier where patient data is held.",
    "section": "f"
  },
  {
    "id": "f4",
    "key": "clinical_terminology_standards",
    "column": "f4_clinical_terminology_standards",
    "mandatory": false,
    "description": "SNOMED CT, dm+d or other mandated clinical terminologies are used where relevant.",
    "section": "f"
  },
  {
    "id": "f5",
    "key": "nhs_login_integration",
    "column": "f5_nhs_login_integration",
    "mandatory": false,
    "description": "NHS login is supported for patient-facing authentication where relevant.",
    "section": "f"
  },
  {
    "id": "f6",
    "key": "nhs_systems_integration_documented",
    "column": "f6_nhs_systems_integration_documented",
    "mandatory": false,
    "description": "Integration with NHS systems (for example NHS App, GP Connect, national services) is documented.",
    "section": "f"
  },
  {
    "id": "f7",
    "key": "data_portability_export",
    "column": "f7_data_portability_export",
    "mandatory": true,
    "description": "Patient and organisational data can be exported in a structured, machine-readable format.",
    "section": "f"
  },
  {
    "id": "g1",
    "key": "user_research_with_target_users",
    "column": "g1_user_research_with_target_users",
    "mandatory": true,
    "description": "User research with the intended users has informed the design.",
    "section": "g"
  },
  {
    "id": "g2",
    "key": "wcag_aa_conformance",
    "column": "g2_wcag_aa_conformance",
    "mandatory": true,
    "description": "The product conforms to the WCAG level AA version specified by DTAC.",
    "section": "g"
  },
  {
    "id": "g3",
    "key": "accessibility_statement_published",
    "column": "g3_accessibility_statement_published",
    "mandatory": true,
    "description": "An accessibility statement meeting UK public-sector requirements is published.",
    "section": "g"
  },
  {
    "id": "g4",
    "key": "nhs_service_manual_followed",
    "column": "g4_nhs_service_manual_followed",
    "mandatory": false,
    "description": "The NHS digital service manual design guidance is followed.",
    "section": "g"
  },
  {
    "id": "g5",
    "key": "assistive_technology_tested",
    "column": "g5_assistive_technology_tested",
    "mandatory": true,
    "description": "The product has been tested with assistive technologies.",
    "section": "g"
  },
  {
    "id": "g6",
    "key": "digital_inclusion_considered",
    "column": "g6_digital_inclusion_considered",
    "mandatory": false,
    "description": "Digital inclusion and non-digital alternatives are considered.",
    "section": "g"
  },
  {
    "id": "g7",
    "key": "user_feedback_mechanism",
    "column": "g7_user_feedback_mechanism",
    "mandatory": false,
    "description": "A mechanism exists for users to give feedback and report accessibility problems.",
    "section": "g"
  }
];

export const STATUSES: CriterionStatus[] = ["met", "partially-met", "not-met", "not-applicable"];
