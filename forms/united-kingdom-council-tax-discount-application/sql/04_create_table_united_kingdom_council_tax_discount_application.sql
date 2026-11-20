-- Main United Kingdom Council Tax discount application: one application to an
-- English billing authority for a Council Tax discount, exemption, disregard
-- or reduction. It captures the claim type, the property, the evidence and the
-- declaration; the occupant roster lives in the occupant table. The
-- completeness and eligibility classification, the audit trail of fired rules
-- and the flagged issues live in dedicated child tables. Eligibility is
-- decided by the billing authority, not by this record.

CREATE TABLE united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID NOT NULL REFERENCES united_kingdom_council_tax_discount_application.applicant(id) ON DELETE RESTRICT,
    billing_authority_id UUID REFERENCES united_kingdom_council_tax_discount_application.billing_authority(id) ON DELETE RESTRICT,
    claim_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (claim_type IN ('single-person-discount', 'all-disregarded-discount', 'student-exemption', 'severe-mental-impairment', 'disabled-band-reduction', 'care-leaver-relief', 'council-tax-reduction', '')),
    account_reference VARCHAR(50) NOT NULL DEFAULT '',
    application_date DATE,
    effective_date DATE,
    applicant_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (applicant_status IN ('counted-adult', 'full-time-student', 'severely-mentally-impaired', 'under-18', 'apprentice', 'education-18-19', 'live-in-carer', 'care-leaver', 'other-disregarded', '')),
    property_address_as_full_text TEXT NOT NULL DEFAULT '',
    property_postcode VARCHAR(10) NOT NULL DEFAULT '',
    council_tax_band VARCHAR(1) NOT NULL DEFAULT '' CHECK (council_tax_band IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '')),
    main_residence VARCHAR(5) NOT NULL DEFAULT '' CHECK (main_residence IN ('yes', 'no', '')),
    liable_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (liable_role IN ('owner-occupier', 'tenant', 'landlord', 'other', '')),
    other_occupants VARCHAR(5) NOT NULL DEFAULT '' CHECK (other_occupants IN ('yes', 'no', '')),
    smi_certificate VARCHAR(5) NOT NULL DEFAULT '' CHECK (smi_certificate IN ('yes', 'no', '')),
    qualifying_benefit VARCHAR(5) NOT NULL DEFAULT '' CHECK (qualifying_benefit IN ('yes', 'no', '')),
    student_certificate VARCHAR(5) NOT NULL DEFAULT '' CHECK (student_certificate IN ('yes', 'no', '')),
    student_course_months INTEGER,
    student_hours_per_week INTEGER,
    disability_adaptation VARCHAR(20) NOT NULL DEFAULT '' CHECK (disability_adaptation IN ('extra-bathroom', 'extra-kitchen', 'extra-room', 'wheelchair-space', 'none', '')),
    disabled_person_main_home VARCHAR(5) NOT NULL DEFAULT '' CHECK (disabled_person_main_home IN ('yes', 'no', '')),
    apprentice_declaration VARCHAR(5) NOT NULL DEFAULT '' CHECK (apprentice_declaration IN ('yes', 'no', '')),
    care_leaver_proof VARCHAR(5) NOT NULL DEFAULT '' CHECK (care_leaver_proof IN ('yes', 'no', '')),
    care_leaver_age_years INTEGER,
    evidence_notes TEXT NOT NULL DEFAULT '',
    declared_true VARCHAR(5) NOT NULL DEFAULT '' CHECK (declared_true IN ('yes', 'no', '')),
    agrees_to_report_changes VARCHAR(5) NOT NULL DEFAULT '' CHECK (agrees_to_report_changes IN ('yes', 'no', '')),
    fraud_warning_acknowledged VARCHAR(5) NOT NULL DEFAULT '' CHECK (fraud_warning_acknowledged IN ('yes', 'no', '')),
    declarant_name TEXT NOT NULL DEFAULT '',
    declaration_date DATE
);

CREATE TRIGGER trigger_united_kingdom_council_tax_discount_application_updated_at
    BEFORE UPDATE ON united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_council_tax_discount_application.set_updated_at();

COMMENT ON TABLE united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application IS
    'Main United Kingdom Council Tax discount application: one application to an English billing authority for a Council Tax discount, exemption, disregard or reduction. It captures the claim type, the property, the evidence and the declaration; the occupant roster lives in the occupant table. The completeness and eligibility classification, the audit trail of fired rules and the flagged issues live in dedicated child tables. Eligibility is decided by the billing authority, not by this record.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.applicant_id IS
    'Foreign key to the applicant (liable person).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.billing_authority_id IS
    'Foreign key to the billing authority the application is made to.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.claim_type IS
    'Claim type: single-person-discount, all-disregarded-discount, student-exemption, severe-mental-impairment, disabled-band-reduction, care-leaver-relief or council-tax-reduction.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.account_reference IS
    'Council Tax account reference, if known.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.application_date IS
    'Date the application is made.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.effective_date IS
    'Date the discount should take effect from; earlier than the application date means backdating.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.applicant_status IS
    'The applicant''s own status on the occupant roster: counted-adult or a disregarded status.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.property_address_as_full_text IS
    'Address of the property the Council Tax bill is for.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.property_postcode IS
    'Postcode of the property.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.council_tax_band IS
    'Council Tax valuation band of the property, A to H.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.main_residence IS
    'Whether the property is the applicant''s main home (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.liable_role IS
    'Role of the applicant in paying the Council Tax: owner-occupier, tenant, landlord or other.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.other_occupants IS
    'Whether anyone other than the applicant lives in the property (yes/no); the occupant table holds them.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.smi_certificate IS
    'Whether a registered medical practitioner''s certificate of severe mental impairment is held (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.qualifying_benefit IS
    'Whether the severely mentally impaired person receives a qualifying benefit (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.student_certificate IS
    'Whether a course-provider student certificate is held (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.student_course_months IS
    'Length of the student course in months.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.student_hours_per_week IS
    'Weekly hours of study on the student course.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.disability_adaptation IS
    'Adaptation qualifying for the disabled band reduction: extra-bathroom, extra-kitchen, extra-room, wheelchair-space or none.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.disabled_person_main_home IS
    'Whether the property is the main home of a disabled person (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.apprentice_declaration IS
    'Whether the employer''s apprentice declaration is held (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.care_leaver_proof IS
    'Whether proof from the looking-after local authority is held (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.care_leaver_age_years IS
    'Age of the care leaver in years.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.evidence_notes IS
    'Free-text list of supporting documents.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.declared_true IS
    'Declaration that the information is true and complete (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.agrees_to_report_changes IS
    'Agreement to report a change in circumstances within 21 days (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.fraud_warning_acknowledged IS
    'Acknowledgement of the penalty and prosecution warning for false information (yes/no).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.declarant_name IS
    'Name of the person making the declaration.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application.declaration_date IS
    'Date of the declaration.';

CREATE INDEX ukctda_applicant_id_idx
    ON united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application (applicant_id);

CREATE INDEX ukctda_billing_authority_id_idx
    ON united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application (billing_authority_id);
