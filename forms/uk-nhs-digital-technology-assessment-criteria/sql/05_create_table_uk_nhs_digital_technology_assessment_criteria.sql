CREATE TABLE uk_nhs_digital_technology_assessment_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    supplier_id UUID NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES assessor(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','reviewed','approved','rejected')),
    assessment_date DATE,
    review_due_date DATE,
    dtac_version VARCHAR(50) NOT NULL DEFAULT '',
    commissioning_organisation VARCHAR(255) NOT NULL DEFAULT '',
    a1_company_registered_in_uk VARCHAR(15) NOT NULL DEFAULT '' CHECK (a1_company_registered_in_uk IN ('met','partially-met','not-met','not-applicable','')),
    a2_ico_registration_current VARCHAR(15) NOT NULL DEFAULT '' CHECK (a2_ico_registration_current IN ('met','partially-met','not-met','not-applicable','')),
    a3_senior_responsible_owner_named VARCHAR(15) NOT NULL DEFAULT '' CHECK (a3_senior_responsible_owner_named IN ('met','partially-met','not-met','not-applicable','')),
    a4_incident_contact_published VARCHAR(15) NOT NULL DEFAULT '' CHECK (a4_incident_contact_published IN ('met','partially-met','not-met','not-applicable','')),
    section_a_notes TEXT NOT NULL DEFAULT '',
    b1_intended_use_and_users_defined VARCHAR(15) NOT NULL DEFAULT '' CHECK (b1_intended_use_and_users_defined IN ('met','partially-met','not-met','not-applicable','')),
    b2_evidence_of_benefit VARCHAR(15) NOT NULL DEFAULT '' CHECK (b2_evidence_of_benefit IN ('met','partially-met','not-met','not-applicable','')),
    b3_outcome_measures_defined VARCHAR(15) NOT NULL DEFAULT '' CHECK (b3_outcome_measures_defined IN ('met','partially-met','not-met','not-applicable','')),
    b4_cost_effectiveness_evidence VARCHAR(15) NOT NULL DEFAULT '' CHECK (b4_cost_effectiveness_evidence IN ('met','partially-met','not-met','not-applicable','')),
    section_b_notes TEXT NOT NULL DEFAULT '',
    c1_clinical_safety_officer_named VARCHAR(15) NOT NULL DEFAULT '' CHECK (c1_clinical_safety_officer_named IN ('met','partially-met','not-met','not-applicable','')),
    c2_clinical_risk_management_plan VARCHAR(15) NOT NULL DEFAULT '' CHECK (c2_clinical_risk_management_plan IN ('met','partially-met','not-met','not-applicable','')),
    c3_hazard_log_maintained VARCHAR(15) NOT NULL DEFAULT '' CHECK (c3_hazard_log_maintained IN ('met','partially-met','not-met','not-applicable','')),
    c4_clinical_safety_case_report VARCHAR(15) NOT NULL DEFAULT '' CHECK (c4_clinical_safety_case_report IN ('met','partially-met','not-met','not-applicable','')),
    c5_clinical_safety_officer_registration_verified VARCHAR(15) NOT NULL DEFAULT '' CHECK (c5_clinical_safety_officer_registration_verified IN ('met','partially-met','not-met','not-applicable','')),
    c6_medical_device_registration_if_applicable VARCHAR(15) NOT NULL DEFAULT '' CHECK (c6_medical_device_registration_if_applicable IN ('met','partially-met','not-met','not-applicable','')),
    c7_post_market_surveillance VARCHAR(15) NOT NULL DEFAULT '' CHECK (c7_post_market_surveillance IN ('met','partially-met','not-met','not-applicable','')),
    section_c_notes TEXT NOT NULL DEFAULT '',
    d1_data_protection_officer_or_lead VARCHAR(15) NOT NULL DEFAULT '' CHECK (d1_data_protection_officer_or_lead IN ('met','partially-met','not-met','not-applicable','')),
    d2_dpia_completed VARCHAR(15) NOT NULL DEFAULT '' CHECK (d2_dpia_completed IN ('met','partially-met','not-met','not-applicable','')),
    d3_dspt_standards_met VARCHAR(15) NOT NULL DEFAULT '' CHECK (d3_dspt_standards_met IN ('met','partially-met','not-met','not-applicable','')),
    d4_lawful_basis_documented VARCHAR(15) NOT NULL DEFAULT '' CHECK (d4_lawful_basis_documented IN ('met','partially-met','not-met','not-applicable','')),
    d5_controller_processor_roles_defined VARCHAR(15) NOT NULL DEFAULT '' CHECK (d5_controller_processor_roles_defined IN ('met','partially-met','not-met','not-applicable','')),
    d6_data_location_and_transfers VARCHAR(15) NOT NULL DEFAULT '' CHECK (d6_data_location_and_transfers IN ('met','partially-met','not-met','not-applicable','')),
    d7_retention_and_deletion_policy VARCHAR(15) NOT NULL DEFAULT '' CHECK (d7_retention_and_deletion_policy IN ('met','partially-met','not-met','not-applicable','')),
    d8_privacy_notice_published VARCHAR(15) NOT NULL DEFAULT '' CHECK (d8_privacy_notice_published IN ('met','partially-met','not-met','not-applicable','')),
    d9_data_subject_rights_supported VARCHAR(15) NOT NULL DEFAULT '' CHECK (d9_data_subject_rights_supported IN ('met','partially-met','not-met','not-applicable','')),
    section_d_notes TEXT NOT NULL DEFAULT '',
    e1_cyber_essentials_plus_or_iso27001 VARCHAR(15) NOT NULL DEFAULT '' CHECK (e1_cyber_essentials_plus_or_iso27001 IN ('met','partially-met','not-met','not-applicable','')),
    e2_penetration_test_within_12_months VARCHAR(15) NOT NULL DEFAULT '' CHECK (e2_penetration_test_within_12_months IN ('met','partially-met','not-met','not-applicable','')),
    e3_vulnerability_management VARCHAR(15) NOT NULL DEFAULT '' CHECK (e3_vulnerability_management IN ('met','partially-met','not-met','not-applicable','')),
    e4_encryption_in_transit_and_at_rest VARCHAR(15) NOT NULL DEFAULT '' CHECK (e4_encryption_in_transit_and_at_rest IN ('met','partially-met','not-met','not-applicable','')),
    e5_access_control_and_mfa VARCHAR(15) NOT NULL DEFAULT '' CHECK (e5_access_control_and_mfa IN ('met','partially-met','not-met','not-applicable','')),
    e6_audit_logging VARCHAR(15) NOT NULL DEFAULT '' CHECK (e6_audit_logging IN ('met','partially-met','not-met','not-applicable','')),
    e7_business_continuity_and_backup VARCHAR(15) NOT NULL DEFAULT '' CHECK (e7_business_continuity_and_backup IN ('met','partially-met','not-met','not-applicable','')),
    e8_secure_development_lifecycle VARCHAR(15) NOT NULL DEFAULT '' CHECK (e8_secure_development_lifecycle IN ('met','partially-met','not-met','not-applicable','')),
    e9_incident_response_and_breach_notification VARCHAR(15) NOT NULL DEFAULT '' CHECK (e9_incident_response_and_breach_notification IN ('met','partially-met','not-met','not-applicable','')),
    section_e_notes TEXT NOT NULL DEFAULT '',
    f1_open_standards_apis VARCHAR(15) NOT NULL DEFAULT '' CHECK (f1_open_standards_apis IN ('met','partially-met','not-met','not-applicable','')),
    f2_fhir_or_nhs_standard_apis VARCHAR(15) NOT NULL DEFAULT '' CHECK (f2_fhir_or_nhs_standard_apis IN ('met','partially-met','not-met','not-applicable','')),
    f3_nhs_number_supported VARCHAR(15) NOT NULL DEFAULT '' CHECK (f3_nhs_number_supported IN ('met','partially-met','not-met','not-applicable','')),
    f4_clinical_terminology_standards VARCHAR(15) NOT NULL DEFAULT '' CHECK (f4_clinical_terminology_standards IN ('met','partially-met','not-met','not-applicable','')),
    f5_nhs_login_integration VARCHAR(15) NOT NULL DEFAULT '' CHECK (f5_nhs_login_integration IN ('met','partially-met','not-met','not-applicable','')),
    f6_nhs_systems_integration_documented VARCHAR(15) NOT NULL DEFAULT '' CHECK (f6_nhs_systems_integration_documented IN ('met','partially-met','not-met','not-applicable','')),
    f7_data_portability_export VARCHAR(15) NOT NULL DEFAULT '' CHECK (f7_data_portability_export IN ('met','partially-met','not-met','not-applicable','')),
    section_f_notes TEXT NOT NULL DEFAULT '',
    g1_user_research_with_target_users VARCHAR(15) NOT NULL DEFAULT '' CHECK (g1_user_research_with_target_users IN ('met','partially-met','not-met','not-applicable','')),
    g2_wcag_aa_conformance VARCHAR(15) NOT NULL DEFAULT '' CHECK (g2_wcag_aa_conformance IN ('met','partially-met','not-met','not-applicable','')),
    g3_accessibility_statement_published VARCHAR(15) NOT NULL DEFAULT '' CHECK (g3_accessibility_statement_published IN ('met','partially-met','not-met','not-applicable','')),
    g4_nhs_service_manual_followed VARCHAR(15) NOT NULL DEFAULT '' CHECK (g4_nhs_service_manual_followed IN ('met','partially-met','not-met','not-applicable','')),
    g5_assistive_technology_tested VARCHAR(15) NOT NULL DEFAULT '' CHECK (g5_assistive_technology_tested IN ('met','partially-met','not-met','not-applicable','')),
    g6_digital_inclusion_considered VARCHAR(15) NOT NULL DEFAULT '' CHECK (g6_digital_inclusion_considered IN ('met','partially-met','not-met','not-applicable','')),
    g7_user_feedback_mechanism VARCHAR(15) NOT NULL DEFAULT '' CHECK (g7_user_feedback_mechanism IN ('met','partially-met','not-met','not-applicable','')),
    section_g_notes TEXT NOT NULL DEFAULT '',
    assessor_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_uk_nhs_digital_technology_assessment_criteria_product_id ON uk_nhs_digital_technology_assessment_criteria(product_id);

CREATE TRIGGER trigger_uk_nhs_digital_technology_assessment_criteria_updated_at
    BEFORE UPDATE ON uk_nhs_digital_technology_assessment_criteria
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE uk_nhs_digital_technology_assessment_criteria IS
    'A DTAC assessment of one digital health technology product by one assessor.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.supplier_id IS
    'Foreign key to the supplier table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.product_id IS
    'Foreign key to the product table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor_id IS
    'Foreign key to the assessor table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.status IS
    'Workflow status of the assessment.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessment_date IS
    'Date the assessment was carried out.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.review_due_date IS
    'Date the assessment must next be reviewed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.dtac_version IS
    'Version of the NHS England DTAC the assessment was made against.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.commissioning_organisation IS
    'Organisation commissioning or procuring the product.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.a1_company_registered_in_uk IS
    'Criterion A1 (mandatory): The supplier is a registered company or legal entity with a verifiable registration number.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.a2_ico_registration_current IS
    'Criterion A2 (mandatory): The supplier has a current ICO data protection fee registration (or a documented exemption).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.a3_senior_responsible_owner_named IS
    'Criterion A3 (mandatory): A named senior individual is accountable for the product''s compliance.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.a4_incident_contact_published IS
    'Criterion A4 (advisory): A contact point for incident and safety reports is published to commissioners and users.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_a_notes IS
    'Assessor notes and evidence references for section A (Company information).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.b1_intended_use_and_users_defined IS
    'Criterion B1 (mandatory): The intended purpose, target users and care setting are clearly defined.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.b2_evidence_of_benefit IS
    'Criterion B2 (mandatory): Evidence demonstrates the product''s benefit to patients, staff or the system.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.b3_outcome_measures_defined IS
    'Criterion B3 (advisory): Measurable outcomes and an evaluation plan are defined.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.b4_cost_effectiveness_evidence IS
    'Criterion B4 (advisory): Evidence of cost-effectiveness or economic value is available.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_b_notes IS
    'Assessor notes and evidence references for section B (Value proposition).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c1_clinical_safety_officer_named IS
    'Criterion C1 (mandatory): A named Clinical Safety Officer (a registered clinician with clinical risk management training) is appointed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c2_clinical_risk_management_plan IS
    'Criterion C2 (mandatory): A DCB0129 Clinical Risk Management Plan exists and is current.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c3_hazard_log_maintained IS
    'Criterion C3 (mandatory): A DCB0129 Hazard Log is maintained and hazards are mitigated to acceptable levels.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c4_clinical_safety_case_report IS
    'Criterion C4 (mandatory): A DCB0129 Clinical Safety Case Report is complete and signed off by the Clinical Safety Officer.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c5_clinical_safety_officer_registration_verified IS
    'Criterion C5 (mandatory): The Clinical Safety Officer''s professional registration has been verified.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c6_medical_device_registration_if_applicable IS
    'Criterion C6 (mandatory): If the product is a medical device, it is correctly classified and has UKCA/CE marking and MHRA registration.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.c7_post_market_surveillance IS
    'Criterion C7 (advisory): A process exists to monitor safety in live use and to report incidents.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_c_notes IS
    'Assessor notes and evidence references for section C (Clinical safety).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d1_data_protection_officer_or_lead IS
    'Criterion D1 (mandatory): A Data Protection Officer or named data protection lead is appointed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d2_dpia_completed IS
    'Criterion D2 (mandatory): A Data Protection Impact Assessment has been completed and is kept under review.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d3_dspt_standards_met IS
    'Criterion D3 (mandatory): The Data Security and Protection Toolkit assessment meets or exceeds standards.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d4_lawful_basis_documented IS
    'Criterion D4 (mandatory): The lawful basis for each processing purpose (UK GDPR Art. 6 and Art. 9) is documented.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d5_controller_processor_roles_defined IS
    'Criterion D5 (mandatory): Controller, joint controller and processor roles are defined in contracts.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d6_data_location_and_transfers IS
    'Criterion D6 (mandatory): Data is processed in the UK, or international transfers have lawful safeguards.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d7_retention_and_deletion_policy IS
    'Criterion D7 (mandatory): A retention and secure-deletion policy aligned with NHS records guidance is in place.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d8_privacy_notice_published IS
    'Criterion D8 (mandatory): A clear, accessible privacy notice is published to users.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.d9_data_subject_rights_supported IS
    'Criterion D9 (advisory): Processes support data subject rights (access, rectification, erasure, objection, portability).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_d_notes IS
    'Assessor notes and evidence references for section D (Data protection).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e1_cyber_essentials_plus_or_iso27001 IS
    'Criterion E1 (mandatory): The supplier holds Cyber Essentials Plus or ISO 27001 certification (or equivalent assured evidence).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e2_penetration_test_within_12_months IS
    'Criterion E2 (mandatory): An independent penetration test was completed within the last 12 months and findings addressed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e3_vulnerability_management IS
    'Criterion E3 (mandatory): A vulnerability management and patching process is operated with defined timescales.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e4_encryption_in_transit_and_at_rest IS
    'Criterion E4 (mandatory): Data is encrypted in transit and at rest using current standards.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e5_access_control_and_mfa IS
    'Criterion E5 (mandatory): Role-based access control with multi-factor authentication for privileged and remote access.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e6_audit_logging IS
    'Criterion E6 (mandatory): Security-relevant events and access to patient data are logged and monitored.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e7_business_continuity_and_backup IS
    'Criterion E7 (mandatory): Tested backup, disaster recovery and business continuity arrangements exist.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e8_secure_development_lifecycle IS
    'Criterion E8 (advisory): A secure software development lifecycle, including dependency and supply-chain controls, is followed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.e9_incident_response_and_breach_notification IS
    'Criterion E9 (mandatory): A security incident response plan with breach notification timescales exists.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_e_notes IS
    'Assessor notes and evidence references for section E (Technical security).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f1_open_standards_apis IS
    'Criterion F1 (mandatory): The product exposes documented APIs that use open standards.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f2_fhir_or_nhs_standard_apis IS
    'Criterion F2 (advisory): The product supports HL7 FHIR or other relevant NHS interoperability standards.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f3_nhs_number_supported IS
    'Criterion F3 (mandatory): The NHS Number is supported as the primary patient identifier where patient data is held.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f4_clinical_terminology_standards IS
    'Criterion F4 (advisory): SNOMED CT, dm+d or other mandated clinical terminologies are used where relevant.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f5_nhs_login_integration IS
    'Criterion F5 (advisory): NHS login is supported for patient-facing authentication where relevant.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f6_nhs_systems_integration_documented IS
    'Criterion F6 (advisory): Integration with NHS systems (for example NHS App, GP Connect, national services) is documented.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.f7_data_portability_export IS
    'Criterion F7 (mandatory): Patient and organisational data can be exported in a structured, machine-readable format.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_f_notes IS
    'Assessor notes and evidence references for section F (Interoperability).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g1_user_research_with_target_users IS
    'Criterion G1 (mandatory): User research with the intended users has informed the design.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g2_wcag_aa_conformance IS
    'Criterion G2 (mandatory): The product conforms to the WCAG level AA version specified by DTAC.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g3_accessibility_statement_published IS
    'Criterion G3 (mandatory): An accessibility statement meeting UK public-sector requirements is published.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g4_nhs_service_manual_followed IS
    'Criterion G4 (advisory): The NHS digital service manual design guidance is followed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g5_assistive_technology_tested IS
    'Criterion G5 (mandatory): The product has been tested with assistive technologies.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g6_digital_inclusion_considered IS
    'Criterion G6 (advisory): Digital inclusion and non-digital alternatives are considered.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.g7_user_feedback_mechanism IS
    'Criterion G7 (advisory): A mechanism exists for users to give feedback and report accessibility problems.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.section_g_notes IS
    'Assessor notes and evidence references for section G (Usability and accessibility).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor_notes IS
    'Overall assessor notes.';
