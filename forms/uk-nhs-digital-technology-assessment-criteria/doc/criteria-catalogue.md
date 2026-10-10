# DTAC criteria catalogue

Every criterion is rated `met`, `partially-met`, `not-met` or `not-applicable`. Mandatory criteria drive the outcome; advisory criteria are reported only.

## Section A — Company information

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| A1 | `a1_company_registered_in_uk` | mandatory | The supplier is a registered company or legal entity with a verifiable registration number. |
| A2 | `a2_ico_registration_current` | mandatory | The supplier has a current ICO data protection fee registration (or a documented exemption). |
| A3 | `a3_senior_responsible_owner_named` | mandatory | A named senior individual is accountable for the product's compliance. |
| A4 | `a4_incident_contact_published` | advisory | A contact point for incident and safety reports is published to commissioners and users. |

## Section B — Value proposition

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| B1 | `b1_intended_use_and_users_defined` | mandatory | The intended purpose, target users and care setting are clearly defined. |
| B2 | `b2_evidence_of_benefit` | mandatory | Evidence demonstrates the product's benefit to patients, staff or the system. |
| B3 | `b3_outcome_measures_defined` | advisory | Measurable outcomes and an evaluation plan are defined. |
| B4 | `b4_cost_effectiveness_evidence` | advisory | Evidence of cost-effectiveness or economic value is available. |

## Section C — Clinical safety

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| C1 | `c1_clinical_safety_officer_named` | mandatory | A named Clinical Safety Officer (a registered clinician with clinical risk management training) is appointed. |
| C2 | `c2_clinical_risk_management_plan` | mandatory | A DCB0129 Clinical Risk Management Plan exists and is current. |
| C3 | `c3_hazard_log_maintained` | mandatory | A DCB0129 Hazard Log is maintained and hazards are mitigated to acceptable levels. |
| C4 | `c4_clinical_safety_case_report` | mandatory | A DCB0129 Clinical Safety Case Report is complete and signed off by the Clinical Safety Officer. |
| C5 | `c5_clinical_safety_officer_registration_verified` | mandatory | The Clinical Safety Officer's professional registration has been verified. |
| C6 | `c6_medical_device_registration_if_applicable` | mandatory | If the product is a medical device, it is correctly classified and has UKCA/CE marking and MHRA registration. |
| C7 | `c7_post_market_surveillance` | advisory | A process exists to monitor safety in live use and to report incidents. |

## Section D — Data protection

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| D1 | `d1_data_protection_officer_or_lead` | mandatory | A Data Protection Officer or named data protection lead is appointed. |
| D2 | `d2_dpia_completed` | mandatory | A Data Protection Impact Assessment has been completed and is kept under review. |
| D3 | `d3_dspt_standards_met` | mandatory | The Data Security and Protection Toolkit assessment meets or exceeds standards. |
| D4 | `d4_lawful_basis_documented` | mandatory | The lawful basis for each processing purpose (UK GDPR Art. 6 and Art. 9) is documented. |
| D5 | `d5_controller_processor_roles_defined` | mandatory | Controller, joint controller and processor roles are defined in contracts. |
| D6 | `d6_data_location_and_transfers` | mandatory | Data is processed in the UK, or international transfers have lawful safeguards. |
| D7 | `d7_retention_and_deletion_policy` | mandatory | A retention and secure-deletion policy aligned with NHS records guidance is in place. |
| D8 | `d8_privacy_notice_published` | mandatory | A clear, accessible privacy notice is published to users. |
| D9 | `d9_data_subject_rights_supported` | advisory | Processes support data subject rights (access, rectification, erasure, objection, portability). |

## Section E — Technical security

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| E1 | `e1_cyber_essentials_plus_or_iso27001` | mandatory | The supplier holds Cyber Essentials Plus or ISO 27001 certification (or equivalent assured evidence). |
| E2 | `e2_penetration_test_within_12_months` | mandatory | An independent penetration test was completed within the last 12 months and findings addressed. |
| E3 | `e3_vulnerability_management` | mandatory | A vulnerability management and patching process is operated with defined timescales. |
| E4 | `e4_encryption_in_transit_and_at_rest` | mandatory | Data is encrypted in transit and at rest using current standards. |
| E5 | `e5_access_control_and_mfa` | mandatory | Role-based access control with multi-factor authentication for privileged and remote access. |
| E6 | `e6_audit_logging` | mandatory | Security-relevant events and access to patient data are logged and monitored. |
| E7 | `e7_business_continuity_and_backup` | mandatory | Tested backup, disaster recovery and business continuity arrangements exist. |
| E8 | `e8_secure_development_lifecycle` | advisory | A secure software development lifecycle, including dependency and supply-chain controls, is followed. |
| E9 | `e9_incident_response_and_breach_notification` | mandatory | A security incident response plan with breach notification timescales exists. |

## Section F — Interoperability

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| F1 | `f1_open_standards_apis` | mandatory | The product exposes documented APIs that use open standards. |
| F2 | `f2_fhir_or_nhs_standard_apis` | advisory | The product supports HL7 FHIR or other relevant NHS interoperability standards. |
| F3 | `f3_nhs_number_supported` | mandatory | The NHS Number is supported as the primary patient identifier where patient data is held. |
| F4 | `f4_clinical_terminology_standards` | advisory | SNOMED CT, dm+d or other mandated clinical terminologies are used where relevant. |
| F5 | `f5_nhs_login_integration` | advisory | NHS login is supported for patient-facing authentication where relevant. |
| F6 | `f6_nhs_systems_integration_documented` | advisory | Integration with NHS systems (for example NHS App, GP Connect, national services) is documented. |
| F7 | `f7_data_portability_export` | mandatory | Patient and organisational data can be exported in a structured, machine-readable format. |

## Section G — Usability and accessibility

| ID | Column | Type | Criterion |
| --- | --- | --- | --- |
| G1 | `g1_user_research_with_target_users` | mandatory | User research with the intended users has informed the design. |
| G2 | `g2_wcag_aa_conformance` | mandatory | The product conforms to the WCAG level AA version specified by DTAC. |
| G3 | `g3_accessibility_statement_published` | mandatory | An accessibility statement meeting UK public-sector requirements is published. |
| G4 | `g4_nhs_service_manual_followed` | advisory | The NHS digital service manual design guidance is followed. |
| G5 | `g5_assistive_technology_tested` | mandatory | The product has been tested with assistive technologies. |
| G6 | `g6_digital_inclusion_considered` | advisory | Digital inclusion and non-digital alternatives are considered. |
| G7 | `g7_user_feedback_mechanism` | advisory | A mechanism exists for users to give feedback and report accessibility problems. |

